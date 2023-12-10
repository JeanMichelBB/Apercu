// Home.js
import React from 'react';
import background from '../back-unsplash.jpg';

const Home = () => {
  return (
    <div style={homeStyle}>
      {/* Add your home page content here */}
      <h1>Bérubé et Associés Avocats</h1>
      <p>Avocat généraliste à Saint-Jean-sur-Richelieu, Québec.</p>
    </div>
  );
};

const homeStyle = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  height: '40vh', // Adjust the height as needed
  background: 'url(' + background + ') ',
  backgroundSize: 'cover',
  backgroundPosition: '50% 50%',
  color: '#fff',
  fontSize: '2rem', // Set your desired font size
};

export default Home;
