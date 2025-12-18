import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Heart, MessageCircle, Send } from 'lucide-react';
import '../styles/PostFeed.css';

function PostFeed() {
    const [posts, setPosts] = useState([]);
    const [newPost, setNewPost] = useState('');
    const [commentInputs, setCommentInputs] = useState({});
    const token = localStorage.getItem('token');

    const fetchPosts = async () => {
        try {
            const response = await axios.get('http://localhost:8080/api/posts', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setPosts(response.data);
        } catch (error) {
            console.error('Error fetching posts:', error);
        }
    };

    const handleCreatePost = async () => {
        if (!newPost.trim()) return;
        try {
            await axios.post('http://localhost:8080/api/posts',
                { caption: newPost },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setNewPost('');
            fetchPosts();
        } catch (error) {
            console.error('Error creating post:', error);
        }
    };

    const handleLike = async (postId) => {
        try {
            await axios.post(`http://localhost:8080/api/posts/${postId}/like`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            // Optimistic update or refetch
            setPosts(posts.map(p => {
                if (p.postId === postId) {
                    return {
                        ...p,
                        likedByCurrentUser: !p.likedByCurrentUser,
                        likeCount: p.likedByCurrentUser ? p.likeCount - 1 : p.likeCount + 1
                    };
                }
                return p;
            }));
        } catch (error) {
            console.error('Error liking post:', error);
        }
    };

    const handleComment = async (postId) => {
        const text = commentInputs[postId];
        if (!text?.trim()) return;

        try {
            const response = await axios.post(`http://localhost:8080/api/posts/${postId}/comments`,
                { text },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            // Refetch to specific post or update locally
            const updatedPosts = posts.map(p => {
                if (p.postId === postId) {
                    return { ...p, comments: [...p.comments, response.data] };
                }
                return p;
            });
            setPosts(updatedPosts);
            setCommentInputs({ ...commentInputs, [postId]: '' });
        } catch (error) {
            console.error('Error commenting:', error);
        }
    };

    useEffect(() => {
        if (token) fetchPosts();
    }, [token]);

    return (
        <div className="feed-container">
            <div className="create-post-card">
                <textarea
                    className="create-post-input"
                    placeholder="What's on your mind?"
                    rows="3"
                    value={newPost}
                    onChange={(e) => setNewPost(e.target.value)}
                />
                <div className="post-actions">
                    <button className="post-btn" onClick={handleCreatePost}>Post</button>
                </div>
            </div>

            {posts.map(post => (
                <div key={post.postId} className="post-card">
                    <div className="post-header">
                        <img src={post.userImage || 'https://via.placeholder.com/40'} alt="Avatar" className="user-avatar" />
                        <div>
                            <div className="username">{post.userName}</div>
                            <div style={{ fontSize: '0.8rem', color: '#888' }}>{new Date(post.createdAt).toLocaleDateString()}</div>
                        </div>
                    </div>
                    <div className="post-content">
                        {post.caption}
                    </div>
                    <div className="post-footer">
                        <button
                            className={`action-item ${post.likedByCurrentUser ? 'liked' : ''}`}
                            onClick={() => handleLike(post.postId)}
                        >
                            <Heart size={20} fill={post.likedByCurrentUser ? "currentColor" : "none"} />
                            <span>{post.likeCount}</span>
                        </button>
                        <button className="action-item">
                            <MessageCircle size={20} />
                            <span>{post.comments.length}</span>
                        </button>
                    </div>

                    {/* Comments Section */}
                    <div className="comments-section">
                        {post.comments.map(comment => (
                            <div key={comment.id} className="comment">
                                <strong>{comment.userName}: </strong> {comment.text}
                            </div>
                        ))}
                        <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                            <input
                                className="comment-input"
                                placeholder="Write a comment..."
                                value={commentInputs[post.postId] || ''}
                                onChange={(e) => setCommentInputs({ ...commentInputs, [post.postId]: e.target.value })}
                                onKeyPress={(e) => e.key === 'Enter' && handleComment(post.postId)}
                            />
                            <button onClick={() => handleComment(post.postId)} style={{ border: 'none', background: 'none', cursor: 'pointer' }}>
                                <Send size={16} />
                            </button>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default PostFeed;
