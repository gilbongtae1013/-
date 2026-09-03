import { useState } from 'react';
import { Link } from 'react-router-dom';


export default function Login() {

    return (
        <div id='Login-container'>
            <div id='Login-box'>
                <h1 className='Login-title'>로그인을 해주세요</h1>

                <div id='Login-IDBox' className='Login-content'>
                    <label for='Login-ID'>학번</label>
                    <input id='Login-ID'></input>
                </div>

                <div id='Login-PWBox' className='Login-content'>
                    <label for='Login-PW'>비밀번호</label>
                    <input id='Login-PW' type='password'></input>
                </div>

                <button id='Login-button'>로그인</button>

                <div id='Login-boxBottom'>
                    <Link to='/sign'>회원가입</Link>
                    <span><a href="https://youtu.be/92volEdYcCQ?si=95MMQ_LFpQbIEC5_">뭉탱이</a></span>
                </div>
            </div>
        </div>
    );  
}