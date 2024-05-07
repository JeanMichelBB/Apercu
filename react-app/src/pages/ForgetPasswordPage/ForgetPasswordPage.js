import React, { useState } from 'react';
import axios from 'axios';
import './ForgetPasswordPage.css'; 
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';

const ForgetPasswordPage = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [honeypot, setHoneypot] = useState(''); 
    const [error, setError] = useState('');

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
    };

    const handleHoneypotChange = (e) => { // Add handler for honeypot field
        setHoneypot(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (honeypot) { // Check if honeypot value is filled
            return;
        }
        try {
            const response = await axios.post('http://localhost:8000/forget-password', null, {
                params: {
                    username: email,
                },
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            });
            setMessage(response.data.message);
            setError('');
        } catch (error) {
            setMessage('');
            setError('Admin user not found');
        }
    };

    return (
        <div>
            <Header />
            <div className="login">
                <div className="container">
                    <h1 className="heading">Mot de passe oublié</h1>
                    <p className="text">Entrez votre adresse e-mail pour réinitialiser votre mot de passe</p>
                    <input type="email" placeholder="Adresse e-mail" value={email} onChange={handleEmailChange} className="input" />
                    {/* Honeypot field */}
                    <input type="text" name="honeypot" style={{ display: 'none' }} />
                    <button onClick={handleSubmit} className="button">Envoyer</button>
                    {message && <p className="success">{message}</p>}
                    {error && <p className="error">{error}</p>}
                </div>
            </div>
            <Footer />
        </div>
    );
}

export default ForgetPasswordPage;
