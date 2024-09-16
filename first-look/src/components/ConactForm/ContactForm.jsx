import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import './ContactForm.css'; // Import the CSS file
import { apiKey, apiUrl } from '../../api';

const useCharacterLimit = (initialValue, limit) => {
  const [value, setValue] = useState(initialValue);

  const handleChange = (newValue) => {
    // Limit the input to the specified character limit
    if (newValue.length <= limit) {
      setValue(newValue);
    }
  };

  const getValue = () => value;

  return [getValue, handleChange, setValue]; // Return setValue to manually update
};

const ContactForm = () => {
  const location = useLocation();
  const [planName, setPlanName] = useState('');

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const plan = params.get('plan');
    if (plan) {
      setPlanName(plan); // Set planName if it's found in the URL
    }
  }, [location.search]);

  // State variables for form fields
  const [getSubject, setSubject, resetSubject] = useCharacterLimit('', 50);
  const [getFirstName, setFirstName] = useCharacterLimit('', 50);
  const [getLastName, setLastName] = useCharacterLimit('', 50);
  const [getEmail, setEmail] = useCharacterLimit('', 50);
  const [getPhoneNumber, setPhoneNumber] = useCharacterLimit('', 20);
  const [getAdditionalInfo, setAdditionalInfo] = useCharacterLimit('', 250);
  const [honeypot, setHoneypot] = useState(''); // State for the honeypot field
  const [loading, setLoading] = useState(false); // State for loading effect
  const [submissionMessage, setSubmissionMessage] = useState(null); // State for submission message

  // Set initial subject value with plan name if available
  useEffect(() => {
    if (planName) {
      setSubject(`Inquiry about ${planName}`);
    }
  }, [planName, setSubject]);

  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    // Check if the honeypot field is empty (indicating a human user)
    if (honeypot) {
      console.log('Bot detected. Ignoring form submission.');
      return;
    }
    setLoading(true); // Set loading to true when submitting
    try {
      // Format the form data object
      const formData = {
        subject: getSubject(),
        first_name: getFirstName(),
        last_name: getLastName(),
        email: getEmail(),
        phone_number: getPhoneNumber(),
        additional_info: getAdditionalInfo(),
      };

      // Make a POST request with the formatted form data
      const response = await axios.post(`${apiUrl}/submit-form`, formData, {
        headers: {
          'access-token': apiKey,
        },
      });
      console.log('Form submission successful:', response.data);
      // Optionally, reset the form fields after successful submission
      resetSubject(''); // Reset the subject field
      setFirstName('');
      setLastName('');
      setEmail('');
      setPhoneNumber('');
      setAdditionalInfo('');
      setSubmissionMessage('Formulaire soumis avec succès');
    } catch (error) {
      console.error('Form submission error:', error);
      setSubmissionMessage("Échec de l'envoi du formulaire");
    } finally {
      setLoading(false); // Reset loading to false after submission
    }
  };

  return (
    <div className="contact-container">
  <div className="left-info">
    <h2>Contact</h2>
    <p>
      You can also connect with me through my social media profiles:
    </p>
    <p>
      <a href="https://github.com/jeanmichelbb" target="_blank" rel="noopener noreferrer">GitHub</a> | 
      <a href="https://www.linkedin.com/in/jeanmichelbb" target="_blank" rel="noopener noreferrer">LinkedIn</a> | 
      <a href="https://jeanmichelbb.github.io/" target="_blank" rel="noopener noreferrer">Portfolio</a>
    </p>
    <p>Location: Montréal, Quebec</p>
  </div>

      <div className="contact-box">
        <h2>Contactez-nous</h2>
        <form className="form-style" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>
              <input placeholder='Subject' type="text" value={getSubject()} onChange={(e) => setSubject(e.target.value)} required className="input-text-style" />
            </label>
          </div>

          <div className="form-group">
            <label>
              <input placeholder='Prénom' type="text" value={getFirstName()} onChange={(e) => setFirstName(e.target.value)} required className="input-text-style" />
            </label>
          </div>

          <div className="form-group">
            <label>
              <input placeholder='Nom' type="text" value={getLastName()} onChange={(e) => setLastName(e.target.value)} required className="input-text-style" />
            </label>
          </div>

          <div className="form-group">
            <label>
              <input placeholder='Email' type="email" value={getEmail()} onChange={(e) => setEmail(e.target.value)} required className="input-text-style" />
            </label>
          </div>

          <div className="form-group">
            <label>
              <input placeholder='Numéro de téléphone' type="tel" value={getPhoneNumber()} onChange={(e) => setPhoneNumber(e.target.value)} required className="input-text-style" />
            </label>
          </div>

          <div className="form-group">
            <label>
              <textarea placeholder='Notes' value={getAdditionalInfo()} onChange={(e) => setAdditionalInfo(e.target.value)} required className="input-text-style" />
            </label>
          </div>
          {/* Add the honeypot field */}
          <div className="form-group" style={{ display: 'none' }}>
            <label>
              <input type="text" value={honeypot} onChange={(e) => setHoneypot(e.target.value)} />
            </label>
          </div>

          <div className="form-button">
            <button type="submit" className="submit-button-style" disabled={loading}>
              {loading ? 'Envoyer...' : submissionMessage ? submissionMessage : 'Envoyer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ContactForm;