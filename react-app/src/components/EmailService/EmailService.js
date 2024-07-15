// src/components/EmailService.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './EmailService.css';
import { apiKey, apiUrl } from '../../api';


const EmailService = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [emails, setEmails] = useState([]);

  useEffect(() => {
    fetchEmails();
  }, []);

  const fetchEmails = async () => {
    try {
      const response = await axios.get(`${apiUrl}/emails`, {
        headers: { 
          'access-token': apiKey 
        }
      });
      setEmails(response.data);
    } catch (error) {
      console.error('Error fetching emails:', error);
    }
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const sendEmail = async () => {
    try {
      await axios.post(`${apiUrl}/send-email`, 
        {
          email 
        },
        {
          headers: {
            'accept': 'application/json',
            'Content-Type': 'application/json',
            'access-token': apiKey,
          }
        }
      );
      setSuccessMessage('Email sent successfully!');
      setEmail('');
      fetchEmails(); // Refresh the list of emails after sending
    } catch (error) {
      setError('Failed to send email. Please try again.');
    }
  };

  const deleteEmail = async (emailId) => {
    // Ask for confirmation before deleting the email
    const confirmDelete = window.confirm("Are you sure you want to delete this email?");
    if (!confirmDelete) {
      return; // Exit the function if the user cancels deletion
    }
  
    try {
      await axios.delete(`${apiUrl}/delete-email/${emailId}`, {
        headers: {
          'access-token': apiKey,
        },
      });
      setSuccessMessage('Email deleted successfully!');
      fetchEmails(); // Refresh the list of emails after deletion
    } catch (error) {
      setError('Failed to delete email. Please try again.');
    }
  };
  

  return (
    <div>
      <input
        type="email"
        placeholder="Enter your email address"
        value={email}
        onChange={handleEmailChange}
      />
      <button onClick={sendEmail}>Send Email</button>
      {error && <p className="error-message">{error}</p>}
      {successMessage && <p className="success-message">{successMessage}</p>}
      <h2>Emails</h2>
      <ul>
        {emails.map((email) => (
          <li key={email.id}>
            {email.email}
            <button onClick={() => deleteEmail(email.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default EmailService;
