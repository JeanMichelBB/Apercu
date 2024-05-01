// DB.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import EmailService from '../../components/EmailService/EmailService';
import EditPassword from '../../components/EditPassword/EditPassword';
import { useNavigate } from 'react-router-dom';
import './DB.css'; // Import the CSS file

function DB() {
  const [contacts, setContacts] = useState([]);
  const [editedContact, setEditedContact] = useState(null);
  const [activeContact, setActiveContact] = useState(null); // Define activeContact state
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }
      try {
        await axios.get('http://localhost:8000/protected-page', {
          headers: { token: token },
        });
        setLoading(false);
      } catch (error) {
        console.error('Error validating token:', error.response.data);
        navigate('/login');
      }
    };

    checkAuth();
    fetchContacts();
  }, [navigate]);

  const fetchContacts = async () => {
    try {
      // Make a GET request to fetch contacts from the backend
      const response = await axios.get('http://localhost:8000/contacts');
      // Update the state with the fetched contacts
      setContacts(response.data);
    } catch (error) {
      console.error('Error fetching contacts:', error);
    }
  };

  const deleteContact = async (contactId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this contact?");
    if (confirmDelete) {
      try {
        // Make a DELETE request to delete a contact
        await axios.delete(`http://localhost:8000/delete-contact/${contactId}`);
        // Refetch contacts after deletion
        fetchContacts();
      } catch (error) {
        console.error('Error deleting contact:', error);
      }
    }
  };

  const deleteAllContacts = async () => {
    const confirmDeleteAll = window.confirm("Are you sure you want to delete all contacts?");
    if (confirmDeleteAll) {
      try {
        // Make a DELETE request to delete all contacts
        await axios.delete('http://localhost:8000/delete-all-contacts');
        // Refetch contacts after deletion
        fetchContacts();
      } catch (error) {
        console.error('Error deleting all contacts:', error);
      }
    }
  };

  const editContact = (contact) => {
    // Set the edited contact
    setEditedContact(contact);
  };

  const cancelEdit = () => {
    // Cancel editing by resetting the editedContact state
    setEditedContact(null);
  };

  const updateContact = async () => {
    try {
      // Make a PUT request to update the edited contact
      await axios.put(`http://localhost:8000/update-contact/${editedContact.id}`, editedContact);
      // Refetch contacts after update
      fetchContacts();
      // Reset editedContact state
      setEditedContact(null);
    } catch (error) {
      console.error('Error updating contact:', error);
    }
  };

  const handleInputChange = (e) => {
    // Update the edited contact when input fields change
    const { name, value } = e.target;
    setEditedContact({ ...editedContact, [name]: value });
  };

  const handleContactClick = (id) => {
    setActiveContact(prevId => prevId === id ? null : id);
  };

  if (loading) {
    return <div>Loading...</div>;
  }
  
  return (
    <div className="container"> {/* Use className instead of inline styles */}
      <EditPassword />
      <EmailService />
      {/* Display the fetched contacts */}
      <h2>Contacts</h2>
      <div className="contact-list">
        {contacts.map((contact) => (
          <div className="contact" key={contact.id} onClick={() => handleContactClick(contact.id)}>
            {/* Display contact details or edit form */}
            {editedContact && editedContact.id === contact.id ? (
              <div>
                <input type="text" name="subject" value={editedContact.subject} onChange={handleInputChange} />
                <input type="text" name="first_name" value={editedContact.first_name} onChange={handleInputChange} />
                <input type="text" name="last_name" value={editedContact.last_name} onChange={handleInputChange} />
                <input type="text" name="email" value={editedContact.email} onChange={handleInputChange} />
                <input type="text" name="phone_number" value={editedContact.phone_number} onChange={handleInputChange} />
                <input type="text" name="additional_info" value={editedContact.additional_info} onChange={handleInputChange} />
                <input type="text" name="created_at" value={editedContact.created_at} onChange={handleInputChange} />
                <button onClick={updateContact}>Save</button>
                <button onClick={cancelEdit}>Cancel</button>
              </div>
            ) : (
              <div>
                <p>{contact.subject} - {contact.first_name} {contact.last_name}</p>
                {activeContact === contact.id && (
                  <div className="contact-details">
                    <p>Email: {contact.email}</p>
                    <p>Phone Number: {contact.phone_number}</p>
                    <p>Additional Info: {contact.additional_info}</p>
                    <p>Created At: {contact.created_at}</p>
                  </div>
                )}
                {/* Add buttons to delete and edit contacts */}
                <button onClick={() => deleteContact(contact.id)}>Delete</button>
                <button onClick={() => editContact(contact)}>Edit</button>
              </div>
            )}
          </div>
        ))}
      </div>
      {/* Button to delete all contacts */}
      <button onClick={deleteAllContacts}>Delete All Contacts</button>
    </div>
  );
}

export default DB;
