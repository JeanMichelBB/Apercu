// Home.js
import React from 'react';
import './Home.css'; // Import the CSS file

const Home = () => {
  return (
    <div className="home"> {/* Use className instead of inline styles */}
      <h1>Bérubé et Associés Avocats</h1>
      <p>Avocat généraliste à Saint-Jean-sur-Richelieu, Québec.</p>
    </div>
  );
};

export default Home;
