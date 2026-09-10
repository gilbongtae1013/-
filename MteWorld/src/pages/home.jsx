import { Outlet } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

import add from '../assets/add.png';
import add2 from '../assets/add2.png';
import add3 from '../assets/add3.png';

export default function Home({userPost, setUserPost, user, setUser}) {
    const navigate = useNavigate();
    const logout = async () => {
        await fetch('/api/auth/logout', { method: 'POST', headers: { Authorization: `Bearer ${localStorage.getItem('mteworld_token') || ''}` } });
        localStorage.removeItem('mteworld_token');
        setUser(null);
        navigate('/login', { replace: true });
    };

    return (
        <div id='Home-container'>
            <div id='Home-leftside'>
                <div id='Home-profileBox'>
                    <div id='Home-profileImage' style={user?.profileImage ? { backgroundImage: `url(${user.profileImage})` } : undefined}></div>
                    <span id='Home-userName'>{user?.name || user?.studentId} • {user?.studentId}</span>
                    <span id='Home-logOut' onClick={logout}>로그아웃</span>
                </div>

                <div id='Home-addBox3' onClick={()=>{window.location.href="https://namu.wiki/w/Granny"}}>
                    <img src={add3} id='Home-add3'/>
                    <div className='mr-X'>X</div>
                </div>
            </div>
            
            <div id='Home-box'>
                <Outlet context={{userPost, setUserPost}}/>
            </div>

            <div id='Home-rightside'>
                <div id='Home-addBox' >
                    <img src={add} id='Home-add' />
                    <div className='mr-X'>X</div>
                    <Link className='Home-kobutton' to='/coup'>코</Link>
                </div>
                <div id='Home-addBox2' onClick={()=>{window.location.href="https://namu.wiki/w/Granny"}}>
                    <img src={add2} id='Home-add2'/>
                    <div className='mr-X'>X</div>
                </div>
            </div>
        </div>
    );
}



// {user?.isAdmin && (
//     <button id='admin-button' onClick={() => navigate('/admin')}>
//         관리자 메뉴
//     </button>
// )}

//어드민 계정에만 보이는 요소