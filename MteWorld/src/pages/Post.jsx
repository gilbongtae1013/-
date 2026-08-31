import { useLocation, Routes, Route, useOutletContext, useNavigate } from 'react-router-dom';
import { useState } from 'react';


export default function Post() {
    const { state } = useLocation();
    const post = state?.post;

    const { userPost, setUserPost } = useOutletContext();

    const [isLiked, setIsLiked] = useState(false);

    const handlePopularClick = (e) => {
        if (!post) return;

        if(isLiked) {
            const updatedPosts = userPost.map((p) => {
            if (p.id === post.id) {
                return { ...p, popular: p.popular - 1 };
            }
            return p;
            });

            setUserPost(updatedPosts);

            post.popular -= 1;
            e.target.classList.remove("active");
            setIsLiked(false);
        }
        else {
            const updatedPosts = userPost.map((p) => {
            if (p.id === post.id) {
                return { ...p, popular: p.popular + 1 };
            }
            return p;
            });

            setUserPost(updatedPosts);

            post.popular += 1;
            e.target.classList.add("active");
            setIsLiked(true);
        }
    };

    return (
        <div id='Post-container'>
            <div id='Post-title'>
                <h1>{post?.title}</h1>
            </div>

            <div id='Post-contentBox'>
                <pre>
                    {post?.content}
                </pre>
            </div>

            <div id='Post-bottom'>
                <div id='Post-agreeBox'>
                    <div id='Post-agreeButton' onClick={handlePopularClick}>ㄹㅇ코코</div>
                    <span>{post?.popular}</span>
                </div>
            </div>
        </div>
    )
}