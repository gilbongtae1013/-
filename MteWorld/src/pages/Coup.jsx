import { Link, useOutletContext } from 'react-router-dom';
import { useState } from 'react';


export default function Coup() {

    const [Posts, setPosts] = useState([
        {
            location:"사감실",
            title:"안녕",
            content: "메롱",
            date: "2077-10-13"
        },
        {
            location:"교무실",
            title:"메롱",
            content: "안녕",
            date: "2053-10-13"
        },
        {
            location:"교무실",
            title:"ㅍㅍㅍㅍㅍㅍㅍㅍ",
            content: "안녕",
            date: "2053-10-13"
        },
        {
            location:"교무실",
            title:"ㅍㅍㅍㅍㅍㅍㅍㅍ",
            content: "안녕",
            date: "2053-10-13"
        },
    ])

    return (
        <div className="Coup-container">
            <nav id='Coup-boxContainer'>
                {Posts.map((post, index) => (
                    <Link
                        key={index} 
                        to='/CoupPost'
                        state={{ post }}
                        className="Coup-postCard" 
                    >
                        <div className='Coup-titleBox'>
                            <span className='Coup-location'>{post.location}</span>
                            <span className='Coup-title'>{post.title}</span>
                        </div>

                        <div className='Coup-bottom'>
                            <span>{post.date}</span>
                            <span className='Coup-remainDate'>D-13</span>
                        </div>

                    </Link>
                ))}
            </nav>

            <Link to='/coupwrite' className='Coup-write'>글 쓰기</Link>
        </div>
    )
}