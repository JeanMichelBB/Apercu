import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './LoginPage.css'; // Import the CSS file
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import { apiKey, apiUrl } from '../api';


const LoginPage = ({ setToken }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [honeypot, setHoneypot] = useState(''); // Add honeypot state

    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleUsernameChange = (e) => {
        setUsername(e.target.value);
    };

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
    };

    const handleHoneypotChange = (e) => { // Add handler for honeypot field
        setHoneypot(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        // Check if honeypot field is filled
        if (honeypot) {
            // If honeypot field is filled, assume it's a bot submission and return without further processing
            return;
        }
        try {
            const response = await axios.post(`${apiUrl}/login`, null, {
                params: {
                    username: username,
                    password: password
                },
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'access-token': apiKey,
                }
            });
            const token = response.data.token;
            setToken(token); // Set the token in parent component's state
            navigate('/admin');
        } catch (error) {
            setError('Invalid username or password');
        }
    };
    

    return (
        <div>
            <Header />
            <div className="login">
                <div className="container">
                    <h1 className="heading">Page de connexion</h1>
                    <p className="text">Connectez-vous pour accéder à votre compte</p>
                    <input type="text" placeholder="Nom d'utilisateur" value={username} onChange={handleUsernameChange} className="input" />
                    <input type="password" placeholder="Mot de passe" value={password} onChange={handlePasswordChange} className="input" />
                    <input type="text" placeholder="Honeypot" value={honeypot} onChange={handleHoneypotChange} className="honeypot" /> {/* Add honeypot field */}
                    <a href="/forget-password" className="link">Mot de passe oublié ?</a>
                    <button onClick={handleSubmit} className="button">Se connecter</button>
                    {error && <p className="error">{error}</p>}
                </div>
            </div>
            <Footer />
        </div>
    );
}

export default LoginPage;
