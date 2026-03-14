import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import api from '../../services/api';
import './BlogDetailPage.css';

function BlogDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api.getPost(id)
      .then((res) => setPost(res.data))
      .catch(() => setError('Post not found.'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="blog-detail-page"><Header /><p className="blog-detail-status">Loading...</p><Footer /></div>;
  if (error) return <div className="blog-detail-page"><Header /><p className="blog-detail-status blog-detail-error">{error}</p><Footer /></div>;

  return (
    <div className="blog-detail-page">
      <Header />
      <div className="blog-detail-container">
        <button className="blog-detail-back" onClick={() => navigate('/blog')}>← Back to Blog</button>
        <div className="blog-detail-date">
          {new Date(post.created_at).toLocaleDateString('en-CA', { year: 'numeric', month: 'long', day: 'numeric' })}
        </div>
        <h1 className="blog-detail-title">{post.title}</h1>
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
