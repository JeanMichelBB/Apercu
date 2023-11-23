// TeamSection.js
import React from 'react';

const TeamSection = () => {
  // You can replace the dummy data with actual employee information
  const teamMembers = [
    { name: 'Employée 1', imageUrl: '/path-to-image1.jpg' },
    { name: 'Employée 2', imageUrl: '/path-to-image2.jpg' },
    { name: 'Employée 3', imageUrl: '/path-to-image3.jpg' },
    { name: 'Employée 4', imageUrl: '/path-to-image4.jpg' },
    { name: 'Employée 5', imageUrl: '/path-to-image5.jpg' },
  ];

  return (
    <section style={teamSectionStyle}>
      <h2>Note équipe</h2>
      <div style={teamMembersContainerStyle}>
        {teamMembers.map((member, index) => (
          <div key={index} style={teamMemberStyle}>
            <img src={member.imageUrl} alt={member.name} style={teamMemberImageStyle} />
            <p>{member.name}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

// Styles
const teamSectionStyle = {
  padding: '20px',
  textAlign: 'center',
};

const teamMembersContainerStyle = {
  display: 'flex',
  justifyContent: 'space-around',
  marginTop: '20px',
};

const teamMemberStyle = {
  maxWidth: '150px',
};

const teamMemberImageStyle = {
  width: '100%',
  borderRadius: '50%', // Make the image circular
};

export default TeamSection;
