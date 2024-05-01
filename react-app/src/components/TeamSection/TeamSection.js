// TeamSection.js
import React from 'react';
import profileIcon from '../../profile-icon.jpg';
import './TeamSection.css'; // Import the CSS file

const TeamSection = () => {
  // You can replace the dummy data with actual employee information
  const teamMembers = [
    { name: 'Employée 1', imageUrl:  profileIcon, role: 'Roles', description: 'Description' },
    { name: 'Employée 2', imageUrl: profileIcon, role: 'Roles', description: 'Description' },
    { name: 'Employée 3', imageUrl: profileIcon, role: 'Roles', description: 'Description' },
    { name: 'Employée 4', imageUrl: profileIcon, role: 'Roles', description: 'Description' },
    { name: 'Employée 5', imageUrl: profileIcon, role: 'Roles', description: 'Description' },
  ];

  return (
    <section className="team-section"> {/* Use className instead of inline styles */}
      <h2>Notre équipe</h2>
      <div className="team-members-container">
        {teamMembers.map((member, index) => (
          <div key={index} className="team-member">
            <img src={member.imageUrl} alt={member.name} className="team-member-image" />
            <p>{member.name}</p>
            <p>{member.role}</p>
            <p>{member.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default TeamSection;
