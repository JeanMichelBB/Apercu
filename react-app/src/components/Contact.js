import React from 'react';

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
  height: '10vh', // Adjust the height as needed
  backgroundSize: 'cover',
  backgroundPosition: '100% 55%',
  color: '#000',
};

export default Home;
