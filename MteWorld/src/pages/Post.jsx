import { useLocation, useOutletContext } from 'react-router-dom';
import { useState } from 'react';


export default function Post() {
    const { state } = useLocation();
    const post = state?.post;
    const [currentPost, setCurrentPost] = useState(post);

    const { userPost, setUserPost } = useOutletContext();

    const [isLiked, setIsLiked] = useState(post?.liked || false);
    const [likeError, setLikeError] = useState('');
    const [isLikePending, setIsLikePending] = useState(false);

    const handlePopularClick = async () => {
        if (!currentPost) return;
        if (isLikePending) return;
        setLikeError('');
        const previousLiked = isLiked;
        const nextLiked = !previousLiked;
        setIsLiked(nextLiked);
        setIsLikePending(true);
        const response = await fetch(`/api/posts/${currentPost.id}/like`, {
            method: 'POST',
            headers: { Authorization: `Bearer ${localStorage.getItem('mteworld_token') || ''}` },
        });
        if (!response.ok) {
            const result = await response.json().catch(() => ({}));
            setLikeError(result.message || '추천 처리에 실패했습니다.');
            setIsLiked(previousLiked);
            setIsLikePending(false);
            return;
        }
        const { post: updatedPost } = await response.json();
        setUserPost(userPost.map((item) => item.id === updatedPost.id ? updatedPost : item));
        setCurrentPost(updatedPost);
        setIsLiked(updatedPost.liked);
        setIsLikePending(false);
    };

    return (
        <div id='Post-container'>
            <div id='Post-title'>
                <h1>{currentPost?.title}</h1>
            </div>

            <div id='Post-contentBox'>
                <pre>
                    {currentPost?.content}
                </pre>
            </div>

            <div id='Post-bottom'>
                <div id='Post-agreeBox'>
                    <div id='Post-agreeButton' className={isLiked ? 'active' : ''} onClick={handlePopularClick}>ㄹㅇ코코</div>
                    <span>{currentPost?.popular}</span>
                    {likeError && <small>{likeError}</small>}
                </div>
            </div>
        </div>
    )
}