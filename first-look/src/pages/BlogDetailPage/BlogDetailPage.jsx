import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import api, { proxyImage } from '../../services/api';
import LazyImage from '../../components/LazyImage/LazyImage';
import { getTokenPayload } from '../../services/auth';
import './BlogDetailPage.css';

function BlogDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [speakers, setSpeakers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [likes, setLikes] = useState({ count: 0, liked: false });
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState('');
  const [commentLoading, setCommentLoading] = useState(false);

  const tokenPayload = getTokenPayload();
  const currentUserId = tokenPayload?.user_id;
  const isLoggedIn = !!tokenPayload;

  const loadComments = () => api.getComments(id).then((r) => setComments(r.data)).catch(() => {});
  const loadLikes   = () => api.getLikes(id).then((r) => setLikes(r.data)).catch(() => {});

  useEffect(() => {
    api.getPost(id)
      .then((res) => {
        setPost(res.data);
        return api.getPostSpeakers(id);
      })
      .then((res) => setSpeakers(res.data))
      .catch(() => { setError('Post not found.'); })
      .finally(() => setLoading(false));
    loadComments();
    loadLikes();
  }, [id]);

  const handleLike = async () => {
    if (!isLoggedIn) { window.dispatchEvent(new Event('openLoginDropdown')); return; }
    const res = await api.toggleLike(id);
    setLikes(res.data);
  };

  const handleComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    setCommentLoading(true);
    try {
      await api.addComment(id, commentText.trim());
      setCommentText('');
      loadComments();
    } finally {
      setCommentLoading(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    await api.deleteComment(id, commentId);
    setComments((prev) => prev.filter((c) => c.id !== commentId));
  };

  if (loading) return <div className="blog-detail-page"><Header /><p className="blog-detail-status">Loading...</p><Footer /></div>;
  if (error) return <div className="blog-detail-page"><Header /><p className="blog-detail-status blog-detail-error">{error}</p><Footer /></div>;

  return (
    <div className="blog-detail-page">
      <Header />
      <LazyImage
        className="blog-detail-banner"
        src={post.image_url || `https://picsum.photos/seed/${post.id}/1200/400`}
        alt={post.title}
      />
      <div className="blog-detail-container">
        <button className="blog-detail-back" onClick={() => navigate('/blog')}>← Back to Blog</button>
        <div className="blog-detail-date">
          {new Date(post.created_at).toLocaleDateString('en-CA', { year: 'numeric', month: 'long', day: 'numeric' })}
        </div>
        <h1 className="blog-detail-title">{post.title}</h1>

        {speakers.length > 0 && (
          <div className="blog-detail-authors">
            {speakers.map((s) => (
              <Link to={`/speakers/${s.id}`} key={s.id} className="blog-detail-author">
                {s.photo_url ? (
                  <img src={proxyImage(s.photo_url)} alt={s.name} className="blog-detail-author-photo" />
                ) : (
                  <div className="blog-detail-author-avatar">{s.name.charAt(0)}</div>
                )}
                <div>
                  <div className="blog-detail-author-label">Author</div>
                  <div className="blog-detail-author-name">{s.name}</div>
                </div>
              </Link>
            ))}
          </div>
        )}

        <div className="blog-detail-content">
          {post.content.split('\n').map((para, i) =>
            para.trim() ? <p key={i}>{para}</p> : <br key={i} />
          )}
        </div>

        {/* Likes */}
        <div className="blog-detail-likes">
          <button
            className={`blog-like-btn${likes.liked ? ' blog-like-btn--active' : ''}`}
            onClick={handleLike}
            aria-label="Like this post"
          >
            {likes.liked ? '♥' : '♡'} {likes.count} {likes.count === 1 ? 'Like' : 'Likes'}
          </button>
        </div>

        {/* Comments */}
        <div className="blog-detail-comments">
          <h3 className="blog-comments-title">Comments ({comments.length})</h3>

          {comments.length === 0 && (
            <p className="blog-comments-empty">No comments yet. Be the first!</p>
          )}

          {comments.map((c) => (
            <div key={c.id} className="blog-comment">
              <div className="blog-comment-header">
                <strong className="blog-comment-author">{c.user_name}</strong>
                <span className="blog-comment-date">{new Date(c.created_at).toLocaleDateString()}</span>
                {(c.user_id === currentUserId || tokenPayload?.role === 'admin') && (
                  <button className="blog-comment-delete" onClick={() => handleDeleteComment(c.id)} title="Delete">✕</button>
                )}
              </div>
              <p className="blog-comment-content">{c.content}</p>
            </div>
          ))}

          {isLoggedIn ? (
            <form className="blog-comment-form" onSubmit={handleComment}>
              <textarea
                placeholder="Write a comment…"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                rows={3}
                required
              />
              <button type="submit" className="btn btn-primary" disabled={commentLoading || !commentText.trim()}>
                {commentLoading ? 'Posting…' : 'Post Comment'}
              </button>
            </form>
          ) : (
            <p className="blog-comments-login">
              <button
                onClick={() => { window.scrollTo({ top: 0, behavior: 'smooth' }); setTimeout(() => window.dispatchEvent(new Event('openLoginDropdown')), 400); }}
                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, color: '#000', fontWeight: 600, textDecoration: 'underline', fontSize: 'inherit' }}
              >Sign in</button> to leave a comment.
            </p>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default BlogDetailPage;
