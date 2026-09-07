import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';

export default function EmailConfirm() {
	const [code, setCode] = useState('');
	const [message, setMessage] = useState('');
	const [searchParams] = useSearchParams();
	const navigate = useNavigate();
	const studentId = searchParams.get('studentId') || '';
	const email = `2026${studentId}@dsm.hs.kr`;

	const verifyEmail = async () => {
		try {
			const response = await fetch('/api/auth/verify-email', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ studentId, code }),
			});
			const responseText = await response.text();
			let result = {};

			try {
				result = responseText ? JSON.parse(responseText) : {};
			} catch {
				result = {};
			}

			if (!response.ok) {
				setMessage(result.message || '이메일 인증 서버에 연결할 수 없습니다.');
				return;
			}
			alert('회원가입이 완료되었습니다.');
			navigate('/login');
		} catch {
			setMessage('이메일 인증 서버에 연결할 수 없습니다.');
		}
	};

	return (
		<div id='EmailConfirm-container'>
			<div id='EmailConfirm-box'>
				<h1 className='Login-title'>이메일 인증</h1>
				<p>{email}로 보낸 인증코드를 입력해주세요.</p>
				<input id='EmailConfirm-code' value={code} onChange={(e) => setCode(e.target.value)} inputMode='numeric' maxLength='6' />
				<button id='EmailConfirm-button' onClick={verifyEmail}>인증하기</button>
				{message && <p>{message}</p>}
				<Link to='/sign'>회원가입으로 돌아가기</Link>
			</div>
		</div>
	);
}
