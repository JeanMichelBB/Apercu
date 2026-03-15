import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import api from '../../services/api';
import LazyImage from '../../components/LazyImage/LazyImage';
import './BlogDetailPage.css';

function BlogDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [speakers, setSpeakers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api.getPost(id)
      .then((res) => {
        setPost(res.data);
        return api.getPostSpeakers(id);
      })
      .then((res) => setSpeakers(res.data))
      .catch((err) => { if (!post) setError('Post not found.'); })
      .finally(() => setLoading(false));
  }, [id]);

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
                  <img src={s.photo_url} alt={s.name} className="blog-detail-author-photo" />
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
      </div>
      <Footer />
    </div>
  );
}

export default BlogDetailPage;
