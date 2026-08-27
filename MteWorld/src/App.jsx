import './App.css'
import { Routes, Route } from 'react-router-dom';

import Home from './pages/home'
import Head from './components/Header'
import Today from './pages/Today'
import Community from './pages/community'
import Post from './pages/Post'
import Upload from './pages/Upload'

function App() {
  return (
    <>
      <Head/>
      <Routes>
        <Route path='/' element={<Home/>}>
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