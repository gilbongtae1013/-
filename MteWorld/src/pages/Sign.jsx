import { useState } from 'react';
import { Link } from 'react-router-dom';


export default function Sign() {

    const [signID, setSignID] = useState(""); //학번
    const [signPW, setSignPW] = useState(""); //비번
    const [signPWA, setSignPWA] = useState(""); //비번 재입력

    const SignIn = () => {
        if (signPW !== signPWA) {
            alert("재입력한 비밀번호가 다릅니다");
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

                <div id='Sign-PWBox' className='Login-content'>
                    <label for='Sign-PW'>비밀번호</label>
                    <input id='Sign-PW' type='password'onChange={(e) => {
                        setSignPW(e.target.value)
                    }} value={signPW}></input>
                </div>

                <div id='Sign-PWAgainBox' className='Login-content'>
                    <label for='Sign-PWAgain'>비밀번호 재입력</label>
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