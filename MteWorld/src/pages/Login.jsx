import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';


export default function Login({ setUser }) {
    const [loginID, setLoginID] = useState("");
    const [loginPW, setLoginPW] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const Login = async () => {
        setError("");

        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ studentId: loginID, password: loginPW }),
            });
            const responseText = await response.text();
            let result = {};

            try {
                result = responseText ? JSON.parse(responseText) : {};
            } catch {
                result = {};
            }

            if (!response.ok) {
                setError(result.message || '로그인 서버에 연결할 수 없습니다.');
                return;
            }

            if (!result.token) {
                setError('로그인 응답이 올바르지 않습니다.');
                return;
            }

            localStorage.setItem('mteworld_token', result.token);
            setUser({
                studentId: result.studentId,
                name: result.name || result.studentId,
                profileImage: result.profileImage || null,
                isAdmin: result.isAdmin === true,
            });
            navigate('/');
        } catch {
            setError('로그인 서버에 연결할 수 없습니다.');
        }
    };

    return (
        <div id='Login-container'>
            <div id='Login-box'>
                <h1 className='Login-title'>로그인을 해주세요</h1>

                <div id='Login-IDBox' className='Login-content'>
                    <label htmlFor='Login-ID'>학번</label>
                    <input id='Login-ID' value={loginID} onChange={(e) => setLoginID(e.target.value)}></input>
                </div>

                <div id='Login-PWBox' className='Login-content'>
                    <label htmlFor='Login-PW'>비밀번호</label>
                    <input id='Login-PW' type='password' value={loginPW} onChange={(e) => setLoginPW(e.target.value)}></input>
                </div>

                <button id='Login-button' onClick={Login}>로그인</button>
                {error && <p>{error}</p>}

                <div id='Login-boxBottom'>
                    <Link to='/sign'>회원가입</Link>
                    <span><a href="https://youtu.be/92volEdYcCQ?si=95MMQ_LFpQbIEC5_">뭉탱이</a></span>
                </div>
            </div>
        </div>
    );  
}