import 'dotenv/config';
import http from 'node:http';
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import nodemailer from 'nodemailer';

const port = 3001;
const dataPath = path.join(path.dirname(fileURLToPath(import.meta.url)), 'data.json');

const readData = () => {
  if (!fs.existsSync(dataPath)) return { users: [], posts: [], todaySagam: null };
  return JSON.parse(fs.readFileSync(dataPath, 'utf8'));
};

const writeData = (data) => fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
const sessions = new Map();
const pendingVerifications = new Map();
const mailer = process.env.SMTP_HOST ? nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT || 587),
  secure: process.env.SMTP_SECURE === 'true',
  auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
}) : null;
const emailVerificationBypass = process.env.EMAIL_VERIFICATION_BYPASS === 'true' || !mailer;
const send = (response, status, body) => {
  response.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8' });
  response.end(JSON.stringify(body));
};
const readBody = (request) => new Promise((resolve, reject) => {
  let body = '';
  request.on('data', (chunk) => { body += chunk; });
  request.on('end', () => {
    try { resolve(body ? JSON.parse(body) : {}); } catch { reject(new Error('잘못된 요청입니다.')); }
  });
  request.on('error', reject);
});
const hashPassword = (password, salt = crypto.randomBytes(16).toString('hex')) => ({
  salt,
  hash: crypto.scryptSync(password, salt, 64).toString('hex'),
});
const getUser = (request) => sessions.get(request.headers.authorization?.replace('Bearer ', ''));
const getToken = (request) => request.headers.authorization?.replace('Bearer ', '');
const isAdmin = (studentId) => studentId === '1013';
const getSagamDateKey = () => {
  const now = new Date();
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Seoul',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    hourCycle: 'h23',
    hour12: false,
  }).formatToParts(now).reduce((result, part) => ({ ...result, [part.type]: part.value }), {});
  const date = new Date(Date.UTC(Number(parts.year), Number(parts.month) - 1, Number(parts.day)));
  if (Number(parts.hour) < 3) date.setUTCDate(date.getUTCDate() - 1);
  return date.toISOString().slice(0, 10);
};
const resetSagamIfNeeded = (data) => {
  const dateKey = getSagamDateKey();
  if (data.todaySagam?.dateKey !== dateKey) {
    data.todaySagam = { name: '아직 모름', dateKey };
    writeData(data);
  }
  return data.todaySagam;
};

const server = http.createServer(async (request, response) => {
  if (request.method === 'OPTIONS') {
    response.writeHead(204, { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': 'Content-Type, Authorization' });
    response.end();
    return;
  }

  try {
    const data = readData();
    const url = new URL(request.url, `http://${request.headers.host}`);

    if (request.method === 'POST' && url.pathname === '/api/auth/register') {
      const { studentId, password, name, profileImage } = await readBody(request);
      if (!/^\d{4}$/.test(studentId) || typeof password !== 'string' || password.length < 4) {
        return send(response, 400, { message: '학번은 4자리 숫자, 비밀번호는 4자 이상이어야 합니다.' });
      }
      if (typeof name !== 'string' || !name.trim()) return send(response, 400, { message: '이름을 입력해주세요.' });
      if (profileImage && (typeof profileImage !== 'string' || profileImage.length > 4 * 1024 * 1024)) {
        return send(response, 400, { message: '프로필 이미지는 3MB 이하로 선택해주세요.' });
      }
      if (data.users.some((user) => user.studentId === studentId)) return send(response, 409, { message: '이미 가입된 학번입니다.' });
      const credentials = hashPassword(password);
      const email = `2026${studentId}@dsm.hs.kr`;
      if (emailVerificationBypass) {
        data.users.push({ studentId, name: name.trim(), profileImage: profileImage || null, ...credentials });
        writeData(data);
        return send(response, 201, { message: '개발 모드에서 이메일 인증을 완료했습니다.', email, verificationRequired: false });
      }
      const code = String(crypto.randomInt(100000, 1000000));
      await mailer.sendMail({
        from: process.env.SMTP_FROM || process.env.SMTP_USER,
        to: email,
        subject: '[MteWorld] 이메일 인증코드',
        text: `MteWorld 인증코드는 ${code} 입니다. 10분 안에 입력해주세요.`,
      });
      pendingVerifications.set(studentId, { ...credentials, name: name.trim(), profileImage: profileImage || null, code, expiresAt: Date.now() + 10 * 60 * 1000 });
      return send(response, 201, { message: '인증코드를 이메일로 보냈습니다.', email });
    }

    if (request.method === 'POST' && url.pathname === '/api/auth/verify-email') {
      const { studentId, code } = await readBody(request);
      const pending = pendingVerifications.get(studentId);
      if (!pending || pending.expiresAt < Date.now() || pending.code !== String(code)) {
        return send(response, 400, { message: '인증코드가 올바르지 않거나 만료되었습니다.' });
      }
      data.users.push({ studentId, name: pending.name, profileImage: pending.profileImage, salt: pending.salt, hash: pending.hash });
      writeData(data);
      pendingVerifications.delete(studentId);
      return send(response, 201, { message: '이메일 인증이 완료되었습니다.' });
    }

    if (request.method === 'POST' && url.pathname === '/api/auth/login') {
      const { studentId, password } = await readBody(request);
      const user = data.users.find((item) => item.studentId === studentId);
      const supplied = user && hashPassword(password, user.salt).hash;
      if (!user || supplied !== user.hash) return send(response, 401, { message: '학번 또는 비밀번호가 올바르지 않습니다.' });
      const token = crypto.randomBytes(32).toString('hex');
      sessions.set(token, studentId);
      return send(response, 200, { token, studentId, name: user.name || user.studentId, profileImage: user.profileImage || null, isAdmin: isAdmin(user.studentId) });
    }

    if (request.method === 'GET' && url.pathname === '/api/auth/me') {
      const studentId = getUser(request);
      const user = data.users.find((item) => item.studentId === studentId);
      if (!user) return send(response, 401, { message: '로그인이 필요합니다.' });
      return send(response, 200, { studentId: user.studentId, name: user.name || user.studentId, profileImage: user.profileImage || null, isAdmin: isAdmin(user.studentId) });
    }

    if (request.method === 'POST' && url.pathname === '/api/auth/logout') {
      sessions.delete(getToken(request));
      return send(response, 200, { message: '로그아웃되었습니다.' });
    }

    if (request.method === 'GET' && url.pathname === '/api/sagam') {
      return send(response, 200, resetSagamIfNeeded(data));
    }

    if (request.method === 'PUT' && url.pathname === '/api/sagam') {
      const studentId = getUser(request);
      if (!studentId) return send(response, 401, { message: '로그인이 필요합니다.' });
      if (!isAdmin(studentId)) return send(response, 403, { message: '관리자만 변경할 수 있습니다.' });
      const { name } = await readBody(request);
      if (!['창수쌤', '건웅쌤', '아직 모름'].includes(name)) {
        return send(response, 400, { message: '올바르지 않은 사감 정보입니다.' });
      }
      const sagam = { name, dateKey: getSagamDateKey() };
      data.todaySagam = sagam;
      writeData(data);
      return send(response, 200, sagam);
    }

    if (request.method === 'GET' && url.pathname === '/api/posts') {
      const studentId = getUser(request);
      return send(response, 200, data.posts.map((post) => ({
        ...post,
        liked: Boolean(studentId && post.likedBy?.includes(studentId)),
      })));
    }

    const likeMatch = url.pathname.match(/^\/api\/posts\/(\d+)\/like$/);
    if (request.method === 'POST' && likeMatch) {
      const studentId = getUser(request);
      if (!studentId) return send(response, 401, { message: '로그인이 필요합니다.' });
      const post = data.posts.find((item) => item.id === Number(likeMatch[1]));
      if (!post) return send(response, 404, { message: '게시글을 찾을 수 없습니다.' });
      post.likedBy ??= [];
      const likedIndex = post.likedBy.indexOf(studentId);
      if (likedIndex === -1) post.likedBy.push(studentId);
      else post.likedBy.splice(likedIndex, 1);
      post.popular = post.likedBy.length;
      writeData(data);
      return send(response, 200, { post: { ...post, liked: likedIndex === -1 } });
    }

    if (request.method === 'POST' && url.pathname === '/api/posts') {
      const studentId = getUser(request);
      if (!studentId) return send(response, 401, { message: '로그인이 필요합니다.' });
      const { title, content } = await readBody(request);
      if (!title?.trim() || !content?.trim()) return send(response, 400, { message: '제목과 본문을 입력해주세요.' });
      const post = { id: Date.now(), title: title.trim(), content: content.trim(), popular: 0, likedBy: [], author: studentId };
      data.posts.unshift(post);
      writeData(data);
      return send(response, 201, post);
    }

    send(response, 404, { message: '요청한 경로를 찾을 수 없습니다.' });
  } catch (error) {
    send(response, 400, { message: error.message });
  }
});

server.listen(port, () => console.log(`API server listening on http://localhost:${port}`));