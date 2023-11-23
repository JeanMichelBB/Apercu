import React from 'react';
import backgroundphone from '../backgroundphone.jpg';

const Home = () => {
  return (
    <div style={homeStyle}>
      {/* Add your home page content here */}
      <h1>Contactez-nous</h1>
      
    </div>
  );
};

const homeStyle = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  height: '25vh', // Adjust the height as needed
  background: 'url(' + backgroundphone + ') center no-repeat',
  backgroundSize: 'cover',
  backgroundPosition: '100% 55%',
  color: '#fff',
};

export default Home;
