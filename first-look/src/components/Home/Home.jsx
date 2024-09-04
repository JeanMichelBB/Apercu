// Home.js
import React from 'react';
import './Home.css'; // Import the CSS file

const Home = () => {
  return (
    <div className="home"> {/* Use className instead of inline styles */}
      <h1>Aperçu</h1>
      <p>Bienvenue sur notre site Web! Nous sommes heureux de vous accueillir.</p>
    </div>
  );
};

export default Home;
