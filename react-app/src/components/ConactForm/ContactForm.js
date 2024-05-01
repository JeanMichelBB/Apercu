import React, { useState } from 'react';
import axios from 'axios';
import './ContactForm.css'; // Import the CSS file

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
    <div className="contact-container"> {/* Update inline style to className */}
      <div className="left-info">
        <h2>Heures d'ouverture</h2>
        <p>Lundi - Vendredi: 9h - 17h</p>
        <p>Samedi: 10h - 14h</p>
        <p>Dimanche: Fermé</p>
      </div>

      <div className="contact-box">
        <h2>Contact Us</h2>
        <form className="form-style" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>
              <input placeholder='Subject' type="text" value={subject} onChange={(e) => setSubject(e.target.value)} className="input-text-style" />
            </label>
          </div>

          <div className="form-group">
            <label>
              <input placeholder='Prénom' type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} className="input-text-style" />
            </label>
          </div>

          <div className="form-group">
            <label>
              <input placeholder='Nom' type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} className="input-text-style" />
            </label>
          </div>

          <div className="form-group">
            <label>
              <input placeholder='Email' type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="input-text-style" />
            </label>
          </div>

          <div className="form-group">
            <label>
              <input placeholder='Numéro de téléphone' type="tel" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} className="input-text-style" />
            </label>
          </div>

          <div className="form-group">
            <label>
              <textarea placeholder='Notes' value={additionalInfo} onChange={(e) => setAdditionalInfo(e.target.value)} className="input-text-style" />
            </label>
          </div>

          <div className="form-button">
            <button type="submit" className="submit-button-style">Submit</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ContactForm;
