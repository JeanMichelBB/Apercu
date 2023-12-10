import React from 'react';
import backgroundabout from '../backgroundabout.jpg';

const Home = () => {
  return (
    <div style={homeStyle}>
      {/* Add your home page content here */}
      <h1>À propos de nous</h1>
    </div>
  );
};

const homeStyle = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  height: '10vh', // Adjust the height as needed
  backgroundSize: 'cover',
  color: '#000',
};

export default Home;
