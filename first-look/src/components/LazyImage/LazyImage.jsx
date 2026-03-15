import React, { useState } from 'react';
import './LazyImage.css';

const LazyImage = ({ src, alt, className }) => {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className={`lazy-image-wrapper ${className || ''}`}>
      {!loaded && <div className="lazy-image-shimmer" />}
      <img
        src={src}
        alt={alt}
        loading="lazy"
        onLoad={() => setLoaded(true)}
        className={`lazy-image-img ${loaded ? 'lazy-image-visible' : 'lazy-image-hidden'}`}
      />
    </div>
  );
};

export default LazyImage;
