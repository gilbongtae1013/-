import { Link } from 'react-router-dom';

export default function Community() {

    const { userPost, setUserPost } = useOutletContext();

    return (
        <>
        <div id='Home-sortBox'>
            <span>정렬방식: </span>
            <select>
                <option value="date">날짜순</option>
                <option value="popular">인기도</option>
            </select>
        </div>
        <nav id='Home-boxContainer'>
            {userPost.map((post, index) => (
                <Link
                    key={index} 
                    to='/post'
                    state={{ post }}
                    className="Home-postCard" 
                >
                    <span>{post.title}</span>
                    <span id='postCard-popular'>추천:{post.popular}</span>
                </Link>
            ))}
        </nav>
        </>
    );
}