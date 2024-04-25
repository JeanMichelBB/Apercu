import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; 

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
        <div style={styles.container}>
            <h1 style={styles.heading}>Page de connexion</h1>
            <p style={styles.text}>Connectez-vous pour accéder à votre compte</p>
            <input type="text" placeholder="Nom d'utilisateur" value={username} onChange={handleUsernameChange} style={styles.input} />
            <input type="password" placeholder="Mot de passe" value={password} onChange={handlePasswordChange} style={styles.input} />
            <button onClick={handleLogin} style={styles.button}>Se connecter</button>
            {error && <p style={styles.error}>{error}</p>}
        </div>
    );
}

export default LoginPage;

const styles = {
    container: {
        maxWidth: '400px',
        margin: '0 auto',
        padding: '20px',
        border: '1px solid #ccc',
        borderRadius: '5px',
        textAlign: 'center',
    },
    heading: {
        fontSize: '24px',
        marginBottom: '20px',
    },
    text: {
        marginBottom: '20px',
    },
    input: {
        width: '100%',
        padding: '10px',
        marginBottom: '10px',
        borderRadius: '5px',
        border: '1px solid #ccc',
    },
    button: {
        width: '100%',
        padding: '10px',
        borderRadius: '5px',
        border: 'none',
        background: '#007bff',
        color: '#fff',
        cursor: 'pointer',
    },
    error: {
        color: 'red',
        marginTop: '10px',
    },
};
