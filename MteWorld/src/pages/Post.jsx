import { useLocation, useOutletContext } from 'react-router-dom';
import { useEffect, useState } from 'react';


export default function Post() {
    const { state } = useLocation();
    const post = state?.post;
    const [currentPost, setCurrentPost] = useState(post);

    const { userPost, setUserPost } = useOutletContext();

    const [isLiked, setIsLiked] = useState(post?.liked || false);
    const [likeError, setLikeError] = useState('');
    const [isLikePending, setIsLikePending] = useState(false);
    const [commentText, setCommentText] = useState('');
    const [comments, setComments] = useState([]);
    const [commentError, setCommentError] = useState('');

    useEffect(() => {
        if (!currentPost) return;
        fetch(`/api/posts/${currentPost.id}/comments`)
            .then((response) => response.ok ? response.json() : Promise.reject())
            .then((items) => setComments(items))
            .catch(() => setCommentError('댓글을 불러오지 못했습니다.'));
    }, [currentPost?.id]);

    const submitComment = async () => {
        if (!currentPost || !commentText.trim()) return;
        setCommentError('');
        const response = await fetch(`/api/posts/${currentPost.id}/comments`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('mteworld_token') || ''}`,
            },
            body: JSON.stringify({ text: commentText }),
        });
        const result = await response.json().catch(() => ({}));
        if (!response.ok) {
            setCommentError(result.message || '댓글 등록에 실패했습니다.');
            return;
        }
        setComments((previousComments) => [...previousComments, result]);
        setCommentText('');
    };

    const handleCommentKeyDown = (event) => {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            submitComment();
        }
    };

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
            <div id='Post-authorBox'>
                <div
                    id='Post-authorImage'
                    style={currentPost?.authorProfileImage ? { backgroundImage: `url(${currentPost.authorProfileImage})` } : undefined}
                ></div>
                <div id='Post-authorInfo'>
                    <span>{currentPost?.authorName || currentPost?.author}</span>
                    <span>{currentPost?.author}</span>
                </div>
            </div>

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

            <div id='Post-commentBox'>
                <div id='Post-commentWriteBox'>
                    <textarea
                        placeholder='댓글로 개입하기'
                        value={commentText}
                        onChange={(event) => setCommentText(event.target.value)}
                        onKeyDown={handleCommentKeyDown}
                    ></textarea>
                    <button type='button' onClick={submitComment}>개입조이고</button>
                </div>

                <div id='Post-commentListBox'>
                    {comments.map((comment) => (
                        <div className='Post-comment' key={comment.id}>
                            <div
                                className='Post-commentProfileImage'
                                style={comment.profileImage ? { backgroundImage: `url(${comment.profileImage})` } : undefined}
                            ></div>
                            <div className='Post-commentBody'>
                                <div className='Post-commentAuthor'>
                                    <span>{comment.name}</span>
                                    <span>{comment.studentId}</span>
                                </div>
                                <p>{comment.text}</p>
                            </div>
                        </div>
                    ))}
                    {commentError && <p className='Post-commentError'>{commentError}</p>}
                </div>
            </div>
        </div>
    )
}