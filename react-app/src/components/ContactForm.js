import React, { useState } from 'react';
import axios from 'axios';

const ContactForm = () => {
  // State variables for form fields
  const [subject, setSubject] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [additionalInfo, setAdditionalInfo] = useState('');

  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Format the form data object
      const formData = {
        subject: subject,
        first_name: firstName,
        last_name: lastName,
        email: email,
        phone_number: phoneNumber,
        additional_info: additionalInfo,

      };

      // Make a POST request with the formatted form data
      const response = await axios.post('http://localhost:8000/submit-form', formData);
      console.log('Form submission successful:', response.data);
      // Optionally, reset the form fields after successful submission
      setSubject('');
      setFirstName('');
      setLastName('');
      setEmail('');
      setPhoneNumber('');
      setAdditionalInfo('');
    } catch (error) {
      console.error('Form submission error:', error);
      if (error.response) {
        const { data } = error.response;
        const errorDetails = data.detail;
        console.log("Error details:", errorDetails);
      } else {
        console.log("Network error:", error.message);
      }
    }
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
              <input placeholder='Subject' type="text" value={subject} onChange={(e) => setSubject(e.target.value)} style={inputTextStyle} />
            </label>
          </div>

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

// Styles (remaining styles are omitted for brevity)
const contactContainerStyle = {
  display: 'flex',
  maxWidth: '800px',
  margin: '0 auto',
  padding: '20px 0 40px 0',
};
const leftInfoStyle = {
  flex: '1',
  padding: '20px',
  borderRight: '1px solid #ddd',
};
const contactBoxStyle = {
  flex: '2',
  border: '1px solid #ddd',
  borderRadius: '8px',
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
  textAlign: 'justify',
  border: 'none',
  borderBottom: '1px solid #ddd',
  borderRadius: '0',
  background: 'transparent',
  width: '100%',
  fontSize: '1.2rem',
  fontStyle: 'italic',
};
const formButtonStyle = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  padding: '10px ',
};
const submitButtonStyle = {
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
export default ContactForm;
