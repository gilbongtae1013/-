import { Routes, Route } from 'react-router-dom';
import { useState } from 'react';

export default function Upload() {

    return (
        <div id='Upload-container'>
            <div id='Upload-header'>
                <button id='Upload-upload'>업로드</button>
            </div>

            <input id='Upload-title' placeholder='제목을 입력하세요'/>

            <textarea id='Upload-content' placeholder='본문 입력'/>
        </div>
    )
}