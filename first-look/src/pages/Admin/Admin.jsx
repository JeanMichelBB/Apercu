// Admin.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import EmailService from '../../components/EmailService/EmailService';
import EditPassword from '../../components/EditPassword/EditPassword';
import { useNavigate } from 'react-router-dom';
import './Admin.css'; // Import the CSS file
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import { apiKey, apiUrl } from '../../api';


const Admin = ({ token }) => {
  const [message, setMessage] = useState('');
  const [contacts, setContacts] = useState([]);
  const [editedContact, setEditedContact] = useState(null);
  const [activeContact, setActiveContact] = useState(null); // Define activeContact state
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${apiUrl}/protected-page`, {
          headers: { token: token,
            "access-token": apiKey,
           }
        });
        setMessage(response.data.message);
      } catch (error) {
        setMessage('Unauthorized');
      }
    };
    fetchData();
    fetchContacts();
  }, [token]);

  const fetchContacts = async () => {
    try {
      // Make a GET request to fetch contacts from the backend
      const response = await axios.get(`${apiUrl}/contacts`, {
        headers: { token: token,
          "access-token": apiKey,
         }
      });
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
        await axios.delete(`${apiUrl}/delete-contact/${contactId}`, {
          headers: {
            "access-token": apiKey,
           }
        });
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
        await axios.delete(`${apiUrl}/delete-all-contacts`, {
          headers: {
            "access-token": apiKey,
           }
        });
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
      await axios.put(`${apiUrl}/update-contact/${editedContact.id}`, editedContact, {
        headers: {
          "access-token": apiKey,
          }
      });
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
    setActiveContact(prevId => (prevId === id ? null : id));
  };

  return (
    <div className="container">
      <Header />
      <EditPassword email={message} />
      <EmailService />
      <h2>Contacts</h2>
      <div className="contact-list">
        {contacts.map((contact) => (
          <div className={`contact ${activeContact === contact.id ? 'active' : ''}`} key={contact.id} onClick={() => handleContactClick(contact.id)}>
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
                <p>{contact.subject} - {contact.first_name} {contact.last_name} </p>
                {activeContact === contact.id && (
                  <div className="contact-details">
                    <p>Email: {contact.email}</p>
                    <p>Phone Number: {contact.phone_number}</p>
                    <p>Additional Info: {contact.additional_info}</p>
                    <p>Created At: {contact.created_at}</p>
                  </div>
                )}
                <div className="button-container">
                  {activeContact === contact.id && (
                    <>
                      <button onClick={() => deleteContact(contact.id)}>Delete</button>
                      <button onClick={() => editContact(contact)}>Edit</button>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
      <button onClick={deleteAllContacts}>Delete All Contacts</button>
      <Footer />
    </div>
  );
}

export default Admin;
