import { Link } from 'react-router-dom';


export default function Head({ user }) {
    return (
        <header id='Head-container'>
            <nav>
                <Link to="/">홈</Link>
                <Link to="/upload">글쓰기</Link>
                <Link to="/today">오늘의 정보</Link>
                <Link to="/sagam">오늘의 사감쌤</Link>
                <Link to='/mypage'>마이페이지</Link>
                {user?.isAdmin && (
                    <Link to="/admin">어드민</Link>
                )}
            </nav>
        </header>
    )
}