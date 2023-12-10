// ContactForm.js
import React, { useState } from 'react';

const ContactForm = () => {
  // State variables for form fields
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [additionalInfo, setAdditionalInfo] = useState('');

  // Function to handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    // You can handle form submission logic here
    console.log('Form submitted:', { firstName, lastName, email, phoneNumber, additionalInfo });
  };

  return (
    <div style={contactContainerStyle}>
      <div style={leftInfoStyle}>
        <h2>Heures d'ouverture</h2>
        <p>
          Lundi - Vendredi: 9h - 17h
        </p>
        <p>
          Samedi: 10h - 14h
        </p>
        <p>
          Dimanche: Fermé
        </p>

        
        

      </div>

      <div style={contactBoxStyle}>
        <h2>Contact Us</h2>
        <form style={formStyle} onSubmit={handleSubmit}>
          <div style={formGroupStyle}>
            <label>
              
              <input placeholder='Prénom' type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} style={inputTextStyle} />
            </label>
          </div>

          <div style={formGroupStyle}>
            <label>
              
              <input placeholder='Nom' type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} style={inputTextStyle} />
            </label>
          </div>

          <div style={formGroupStyle}>
            <label>
              
              
              <input placeholder='Email' type="email" value={email} onChange={(e) => setEmail(e.target.value)} style={inputTextStyle} />
            </label>
          </div>

          <div style={formGroupStyle}>
            <label>
             
              
              <input placeholder='Numéro de téléphone' type="tel" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} style={inputTextStyle} />
            </label>
          </div>

          <div style={formGroupStyle}>
            <label>
              <textarea placeholder='Notes' value={additionalInfo} onChange={(e) => setAdditionalInfo(e.target.value)} style={inputTextStyle} />
            </label>
          </div>

          <div style={formButtonStyle}>
            <button type="submit" style={submitButtonStyle}>Submit</button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Styles
const contactContainerStyle = {
  display: 'flex',
  maxWidth: '800px',
  margin: '0 auto',
  padding: '20px 0 40px 0',
};

const leftInfoStyle = {
  flex: '1', // Take up 1/3 of the available space
  padding: '20px',
  borderRight: '1px solid #ddd',
};

const contactBoxStyle = {
  flex: '2', // Take up 2/3 of the available space
  border: '1px solid #ddd', // Add a border around the box
  borderRadius: '8px', // Optional: Add rounded corners
  padding: '20px',
};

const formStyle = {
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
};

const formGroupStyle = {
  margin: '10px 0',
};

const inputTextStyle = {
  textAlign: 'justify', // Justify the text inside the input
  border: 'none', // Remove the default border
  borderBottom: '1px solid #ddd', // Add a bottom border
  borderRadius: '0', // Remove the default rounded corners
  background: 'transparent', // Remove the default background
  width: '100%', // Set the width of the input
  fontSize: '1.2rem', // Set your desired font size
  fontStyle: 'italic', // Set font style to italic
};

const formButtonStyle = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  padding: '10px ',
};
const submitButtonStyle = {
  //blakc background
  backgroundColor: '#000',
  color: '#fff',
  padding: '10px',
  cursor: 'pointer',
  border: 'none',
  borderRadius: '5px',
  fontSize: '1.2rem',
  fontWeight: 'bold',
  width: '100%',
  
};

// textarea styles
// const textareaStyle = {
//   textAlign: 'justify', // Justify the text inside the input
//   border: 'none', // Remove the default border
//   borderBottom: '1px solid #ddd', // Add a bottom border
//   borderRadius: '0', // Remove the default rounded corners
//   background: 'transparent', // Remove the default background
//   width: '100%', // Set the width of the input
//   fontSize: '1.2rem', // Set your desired font size
//   fontStyle: 'italic', // Set font style to italic
// };

export default ContactForm;



