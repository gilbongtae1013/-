import { Link } from 'react-router-dom';

export default function Community() {
    const userPost = [
        { title: "뭉탱이", content: "월드에 오신걸 환영합니다", popular: 0 },
        { title: "자케인", content: "죽을만큼 시작", popular: 0 },
        { title: "오때론난", content: "망가져갈지도모르지허나젊음엔그건중요한게아니야", popular: 420 }
    ];

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