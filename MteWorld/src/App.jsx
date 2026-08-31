import './App.css'
import { Routes, Route } from 'react-router-dom';
import { useState } from 'react';

import Home from './pages/home'
import Head from './components/Header'
import Today from './pages/Today'
import Community from './pages/community'
import Post from './pages/Post'
import Upload from './pages/Upload'


function App() {

  const [userPost, setUserPost] = useState([
        { title: "뭉탱이", content: "월드에 오신걸 환영합니다", popular: 0 },
        { title: "자케인", content: "죽을만큼 시작", popular: 0 },
        { title: "오때론난", content: "망가져갈지도모르지허나젊음엔그건중요한게아니야", popular: 420 }
    ]);

  return (
    <>
      <Head/>
      <Routes>
        <Route path='/' element={<Home userPost={userPost} setUserPost={setUserPost}/>}>
          <Route index element={<Community/>}/>
          <Route path='today' element={<Today/>}/>
          <Route path='post' element={<Post/>}/>
          <Route path='upload' element={<Upload/>}/>
        </Route>
      </Routes>
    </>
  )
}

export default App