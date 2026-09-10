import './App.css'
import { Routes, Route, Outlet, Navigate, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { useEffect } from 'react';

import Home from './pages/home'
import Head from './components/Header'
import Today from './pages/Today'
import Community from './pages/community'
import Post from './pages/Post'
import Upload from './pages/Upload'
import Login from './pages/Login'
import Sign from './pages/Sign'
import EmailConfirm from './pages/EmailConfirm'
import Sagam from './pages/Sagam'
import Admin from './pages/Admin'
import Mypage from './pages/Mypage'
import Coup from './pages/Coup'
import CoupWrite from './pages/CoupWrite'


function MainLayout({ userPost, setUserPost, user, setUser }) {
  return (
    <>
      <Head user={user} />
      <Home userPost={userPost} setUserPost={setUserPost} user={user} setUser={setUser} />
    </>
  );
}

function App() {
  const [userPost, setUserPost] = useState([]);
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const token = localStorage.getItem('mteworld_token');

  useEffect(() => {
    if (!token) {
      setAuthLoading(false);
      return;
    }
    fetch('/api/auth/me', { headers: { Authorization: `Bearer ${token}` } })
      .then((response) => response.ok ? response.json() : Promise.reject())
      .then((currentUser) => setUser(currentUser))
      .catch(() => localStorage.removeItem('mteworld_token'))
      .finally(() => setAuthLoading(false));
  }, []);

  useEffect(() => {
    if (!user) return;
    fetch('/api/posts', { headers: { Authorization: `Bearer ${token}` } })
      .then((response) => response.ok ? response.json() : Promise.reject())
      .then((posts) => setUserPost(posts))
      .catch(() => setUserPost([]));
  }, [user, token]);

  if (authLoading) return null;

  return (
    <Routes>
      {/* 1. 헤더 보이는 메인 페이지들*/}
      <Route path='/' element={user ? <MainLayout userPost={userPost} setUserPost={setUserPost} user={user} setUser={setUser} /> : <Navigate to='/login' replace />}>
        <Route index element={<Community />} />
        <Route path='today' element={<Today user={user} />} />
        <Route path='post' element={<Post />} />
        <Route path='upload' element={<Upload />} />
        <Route path='sagam' element={<Sagam/>}/>
        <Route path='coup' element={<Coup/>}/>
        <Route path='coupwrite' element={<CoupWrite/>}/>

        <Route path='mypage' element={<Mypage user={user} setUser={setUser}/>}/>

        <Route path='admin' element={user?.isAdmin ? <Admin /> : <Navigate to='/' replace />} />
      </Route>

      {/* 2. 헤더 안보이는 로그인 페이지*/}
      <Route path='/login' element={user ? <Navigate to='/' replace /> : <Login setUser={setUser} />} />
      <Route path='/sign' element={<Sign/>}/>
      <Route path='/email-confirm' element={<EmailConfirm/>}/>
    </Routes>
  );
}

export default App;


// cd c:\WelcomeToThe\MteWorld
// npm.cmd run server