import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';


export default function Sign() {

    const [signID, setSignID] = useState(""); //학번
    const [signName, setSignName] = useState(""); //이름
    const [profileImage, setProfileImage] = useState("");
    const [signPW, setSignPW] = useState(""); //비번
    const [signPWA, setSignPWA] = useState(""); //비번 재입력
    const navigate = useNavigate();
    const SignIn = async () => {
        if (signPW !== signPWA) {
            alert("재입력한 비밀번호가 다릅니다");
            return;
        }
        if (signName.trim() === "") {
            alert("이름을 입력해주세요");
            return;
        }
        if (signPW === "") {
            alert("비밀번호를 입력해주세요");
            return;
        }

        if (signID.length !== 4) {
            alert("학번을 제대로 입력해주세요");
            return;
        }

        try {
            const response = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ studentId: signID, name: signName, password: signPW, profileImage }),
            });
            const responseText = await response.text();
            let result = {};

            try {
                result = responseText ? JSON.parse(responseText) : {};
            } catch {
                result = {};
            }

            if (!response.ok) {
                alert(result.message || '회원가입 서버에 연결할 수 없습니다.');
                return;
            }
            if (result.verificationRequired === false) {
                alert('회원가입이 완료되었습니다.');
                navigate('/login');
                return;
            }
            navigate(`/email-confirm?studentId=${signID}`);
        } catch {
            alert('회원가입 서버에 연결할 수 없습니다.');
        }

        
    }

    return (
        <div id='Sign-container'>
            <div id='Sign-box'>
                <h1 className='Login-title'>회원가입</h1>

                <div id='Sign-IDBox' className='Login-content'>
                    <label for='Sign-ID'>학번</label>
                    <input id='Sign-ID' onChange={(e) => {
                        setSignID(e.target.value)
                    }} value={signID}></input>
                </div>

                <div id='Sign-nameBox' className='Login-content'>
                    <label for='Sign-name'>이름</label>
                    <input id='Sign-name' onChange={(e) => setSignName(e.target.value)} value={signName}></input>
                </div>

                <div id='Sign-profileImageBox' className='Login-content'>
                    <label htmlFor='Sign-profileImage'>프로필 이미지</label>
                    <input id='Sign-profileImage' type='file' accept='image/*' onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        if (file.size > 3 * 1024 * 1024) {
                            alert('프로필 이미지는 3MB 이하로 선택해주세요');
                            e.target.value = '';
                            return;
                        }
                        const reader = new FileReader();
                        reader.onload = () => setProfileImage(reader.result);
                        reader.readAsDataURL(file);
                    }}></input>
                </div>

                <div id='Sign-PWBox' className='Login-content'>
                    <label htmlFor='Sign-PW'>비밀번호</label>
                    <input id='Sign-PW' type='password'onChange={(e) => {
                        setSignPW(e.target.value)
                    }} value={signPW}></input>
                </div>

                <div id='Sign-PWAgainBox' className='Login-content'>
                    <label htmlFor='Sign-PWAgain'>비밀번호 재입력</label>
                    <input id='Sign-PWAgain' type='password' onChange={(e) => {
                        setSignPWA(e.target.value)
                    }} value={signPWA}></input>
                </div>

                <button id='Sign-button' onClick={SignIn}>이메일 인증</button>

                <div id='Sign-boxBottom'>
                    <Link to='/login'>로그인</Link>
                    <span><a href="https://youtu.be/92volEdYcCQ?si=95MMQ_LFpQbIEC5_">뭉탱이</a></span>
                </div>
            </div>
        </div>
    )
}