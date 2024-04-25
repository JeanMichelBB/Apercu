// TeamSection.js
import React from 'react';
import profileIcon from '../profile-icon.jpg';

const TeamSection = () => {
  // You can replace the dummy data with actual employee information
  const teamMembers = [
    //profileIcon used for the image
    { name: 'Employée 1', imageUrl:  profileIcon, role: 'Roles', description: 'Description' },
    { name: 'Employée 2', imageUrl: profileIcon, role: 'Roles', description: 'Description' },
    { name: 'Employée 3', imageUrl: profileIcon, role: 'Roles', description: 'Description' },
    { name: 'Employée 4', imageUrl: profileIcon, role: 'Roles', description: 'Description' },
    { name: 'Employée 5', imageUrl: profileIcon, role: 'Roles', description: 'Description' },
  ];

  return (
    <section style={teamSectionStyle}>
      <h2>Notre équipe</h2>
      <div style={teamMembersContainerStyle}>
        {teamMembers.map((member, index) => (
          <div key={index} style={teamMemberStyle}>
            <img src={member.imageUrl} alt={member.name} style={teamMemberImageStyle} />
            <p>{member.name}</p>
            {/* role */}
            <p>{member.role}</p>
            <p>{member.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

// Styles
const teamSectionStyle = {
  padding: '0 100px',
  textAlign: 'center',
  fontSize: '1.2rem',
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
