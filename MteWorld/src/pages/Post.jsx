import { useLocation } from 'react-router-dom';

export default function Post() {
    const { state } = useLocation();
    const post = state?.post;

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
        </div>
    )
}