import { Link } from 'react-router-dom';


export default function Head() {
    return (
        <header id='Head-container'>
            <nav>
                <Link to="/">홈</Link>
                <Link to="/upload">글쓰기</Link>
                <Link to="/today">오늘의 정보</Link>
                <Link to="/login">로그인</Link>
            </nav>
        </header>
    )
}