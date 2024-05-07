import React, { useState, useEffect } from "react";
import axios from "axios";
import "./EditPassword.css";

const EditPassword = () => {
    const [oldEmail, setOldEmail] = useState("");
    const [oldPassword, setOldPassword] = useState("");
    const [newEmail, setNewEmail] = useState("");
    const [confirmNewEmail, setConfirmNewEmail] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmNewPassword, setConfirmNewPassword] = useState("");
    const [message, setMessage] = useState("");
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        const fetchAdmin = async () => {
            try {
                const response = await axios.get("http://localhost:8000/admin-users");
                const adminUser = response.data.find(user => user.email === 'admin');
                setIsAdmin(adminUser ? true : false);
            } catch (error) {
                console.error("Error fetching admin user:", error);
            }
        };

        fetchAdmin();
    }, []);

    const handleOldEmailChange = (e) => {
        setOldEmail(e.target.value);
    };

    const handleOldPasswordChange = (e) => {
        setOldPassword(e.target.value);
    };

    const handleNewEmailChange = (e) => {
        setNewEmail(e.target.value);
    };

    const handleConfirmNewEmailChange = (e) => {
        setConfirmNewEmail(e.target.value);
    };

    const handleNewPasswordChange = (e) => {
        setNewPassword(e.target.value);
    };

    const handleConfirmNewPasswordChange = (e) => {
        setConfirmNewPassword(e.target.value);
    };

    const validateInputs = () => {
        if (!oldEmail || !oldPassword || !newEmail || !confirmNewEmail || !newPassword || !confirmNewPassword) {
            setMessage("All fields are required");
            return false;
        }

        if (newPassword.length < 8) {
            setMessage("New password must be at least 8 characters long");
            return false;
        }

        if (newPassword !== confirmNewPassword) {
            setMessage("New password and confirmed password do not match");
            return false;
        }

        if (newEmail !== confirmNewEmail) {
            setMessage("New email and confirmed email do not match");
            return false;
        }

        return true;
    };

    const handleSubmit = async () => {
        if (!validateInputs()) {
            return;
        }

        try {
            const response = await axios.put("http://localhost:8000/update-admin-user", {
                old_email: oldEmail,
                old_password: oldPassword,
                new_email: newEmail,
                new_password: newPassword
            });
            setMessage(response.data.message);
        } catch (error) {
            setMessage("Failed to update admin user");
            console.error("Error updating admin user:", error);
        }
    };

    if (!isAdmin) {
        return <div>Welcome!</div>;
    }

    return (
        <div>
            <h1>Modifier le mot de passe</h1>
            <input type="text" placeholder="Ancienne adresse e-mail" value={oldEmail} onChange={handleOldEmailChange} />
            <input type="password" placeholder="Ancien mot de passe" value={oldPassword} onChange={handleOldPasswordChange} />
            <input type="text" placeholder="Nouvelle adresse e-mail" value={newEmail} onChange={handleNewEmailChange} />
            <input type="text" placeholder="Confirmer la nouvelle adresse e-mail" value={confirmNewEmail} onChange={handleConfirmNewEmailChange} />
            <input type="password" placeholder="Nouveau mot de passe" value={newPassword} onChange={handleNewPasswordChange} />
            <input type="password" placeholder="Confirmer le nouveau mot de passe" value={confirmNewPassword} onChange={handleConfirmNewPasswordChange} />
            <button onClick={handleSubmit}>Enregistrer</button>
            {message && <p>{message}</p>}
        </div>
    );
};

export default EditPassword;
