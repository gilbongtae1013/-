import './App.css'
import { Routes, Route, Outlet } from 'react-router-dom';
import { useState } from 'react';

import Home from './pages/home'
import Head from './components/Header'
import Today from './pages/Today'
import Community from './pages/community'
import Post from './pages/Post'
import Upload from './pages/Upload'
import Login from './pages/Login'
import Sign from './pages/Sign'


function MainLayout({ userPost, setUserPost }) {
  return (
    <>
      <Head />
      <Home userPost={userPost} setUserPost={setUserPost} />
    </>
  );
}

function App() {
  const [userPost, setUserPost] = useState([
    { id: 1, title: "뭉탱이", content: "월드에 오신걸 환영합니다", popular: 0 },
    { id: 2, title: "자케인", content: "죽을만큼 시작", popular: 0 },
    { id: 3, title: "오때론난", content: "망가져갈지도모르지허나젊음엔그건중요한게아니야", popular: 420 }
  ]);

  return (
    <Routes>
      {/* 1. 헤더 보이는 메인 페이지들*/}
      <Route path='/' element={<MainLayout userPost={userPost} setUserPost={setUserPost} />}>
        <Route index element={<Community />} />
        <Route path='today' element={<Today />} />
        <Route path='post' element={<Post />} />
        <Route path='upload' element={<Upload />} />
      </Route>

      {/* 2. 헤더 안보이는 로그인 페이지*/}
      <Route path='/login' element={<Login />} />
      <Route path='/sign' element={<Sign/>}/>
    </Routes>
  );
}

export default App;