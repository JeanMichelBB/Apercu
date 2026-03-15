import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import api from '../../services/api';
import LazyImage from '../../components/LazyImage/LazyImage';
import './BlogPage.css';

function BlogPage() {
  const [posts, setPosts] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const limit = 10;

  useEffect(() => {
    setLoading(true);
    setError('');
    api.getPosts({ page, limit })
      .then((res) => {
        setPosts(res.data.items);
        setTotal(res.data.total);
      })
      .catch(() => setError('Failed to load posts.'))
      .finally(() => setLoading(false));
  }, [page]);

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="blog-page">
      <Header />
      <div className="blog-container">
        <h1 className="blog-title">Blog</h1>

        {loading && <p className="blog-status">Loading...</p>}
        {error && <p className="blog-status blog-error">{error}</p>}
        {!loading && !error && posts.length === 0 && (
          <p className="blog-status">No posts yet.</p>
        )}

        <div className="blog-list">
          {posts.map((post) => (
            <Link to={`/blog/${post.id}`} key={post.id} className="blog-card">
              <LazyImage
                className="blog-card-img"
                src={post.image_url || `https://picsum.photos/seed/${post.id}/800/300`}
                alt={post.title}
              />
              <div className="blog-card-body">
                <div className="blog-card-date">
                  {new Date(post.created_at).toLocaleDateString('en-CA', {
                    year: 'numeric', month: 'long', day: 'numeric',
                  })}
                </div>
                <h2 className="blog-card-title">{post.title}</h2>
                <p className="blog-card-excerpt">
                  {post.content?.slice(0, 200)}{post.content?.length > 200 ? '...' : ''}
                </p>
                <span className="blog-card-link">Read more →</span>
              </div>
            </Link>
          ))}
        </div>

        {totalPages > 1 && (
          <div className="blog-pagination">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="pagination-btn"
            >
              ← Prev
            </button>
            <span className="pagination-info">{page} / {totalPages}</span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="pagination-btn"
            >
              Next →
            </button>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}

export default BlogPage;
