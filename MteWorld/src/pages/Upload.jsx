import { Routes, Route, useOutletContext, useNavigate } from 'react-router-dom';
import { useState } from 'react';

export default function Upload() {

    const { userPost, setUserPost } = useOutletContext();

    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");

    const navigate = useNavigate();

    const Upload = () => {
        if(title === "" || content === "") {
            alert("제목 또는 본문을 입력해주세요.");
            return;
        }
        setUserPost([{ id: Date.now(), title: title, content: content, popular: 0 }, ...userPost])

        alert("업로드 성공");
        navigate('/');
    }

    return (
        <div id='Upload-container'>
            <div id='Upload-header'>
                <button id='Upload-upload' onClick={Upload}>업로드</button>
            </div>

            <input id='Upload-title' placeholder='제목을 입력하세요'
            onChange={(e) => {setTitle(e.target.value)}} value={title}/>

            <textarea id='Upload-content' placeholder='본문 입력'
            onChange={(e)=> {setContent(e.target.value)}} value={content}/>
        </div>
    )
}