import { Link, useOutletContext } from 'react-router-dom';
import { useState } from 'react';

export default function Community() {

    const { userPost } = useOutletContext();
    const [sort, setSort] = useState('date');
    const sortedPosts = [...userPost].sort((first, second) => sort === 'popular'
        ? second.popular - first.popular
        : second.id - first.id);

    return (
        <>
        <div id='Home-sortBox'>
            <span>정렬방식: </span>
            <select value={sort} onChange={(e) => setSort(e.target.value)}>
                <option value="date">날짜순</option>
                <option value="popular">인기도</option>
            </select>
        </div>
        <nav id='Home-boxContainer'>
            {sortedPosts.map((post, index) => (
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