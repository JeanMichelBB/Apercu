// LoginPage.js
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './LoginPage.css'; // Import the CSS file
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';

function LoginPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleUsernameChange = (e) => {
        setUsername(e.target.value);
    };

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
    };

    const handleLogin = async () => {
        try {
            const response = await axios.post('http://localhost:8000/login', { username, password });
            const token = response.data.token;
            const userId = response.data.id;
            localStorage.setItem('token', token);
            navigate('/db');
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
                    <button onClick={handleLogin} className="button">Se connecter</button>
                    {error && <p className="error">{error}</p>}
                </div>
            </div>
            <Footer />
        </div>
    );
}

export default LoginPage;
