import { Routes, Route, useOutletContext, useNavigate } from 'react-router-dom';
import { useState } from 'react';

export default function Upload() {

    const { userPost, setUserPost } = useOutletContext();

    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");

    const navigate = useNavigate();

    const Upload = async () => {
        if(title === "" || content === "") {
            alert("제목 또는 본문을 입력해주세요.");
            return;
        }
        const response = await fetch('/api/posts', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('mteworld_token') || ''}`,
            },
            body: JSON.stringify({ title, content }),
        });

        if (!response.ok) {
            alert((await response.json()).message || '로그인이 필요합니다.');
            return;
        }

        const post = await response.json();
        setUserPost([post, ...userPost]);

        alert("업로드 성공");
        navigate('/');
    }

    return (
        <div id='Upload-container'>
            <div id='Upload-header'>
                <button id='Upload-upload' onClick={Upload}>업로드</button>
            </div>

            <input id='Upload-title' placeholder='제목을 입력하세요'
            onChange={(e) => {setTitle(e.target.value)}} value={title} autoComplete='off'/>

            <textarea id='Upload-content' placeholder='본문 입력'
            onChange={(e)=> {setContent(e.target.value)}} value={content}/>
        </div>
    )
}