// Home.js
import React from 'react';
import background from '../background.jpg';

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
  height: '25vh', // Adjust the height as needed
  background: 'url(' + background + ') center no-repeat',
  backgroundSize: 'cover',
  backgroundPosition: '100% 40%',
  color: '#fff',
};

export default Home;
