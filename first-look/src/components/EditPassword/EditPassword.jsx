import React, { useState } from "react";
import axios from "axios";
import "./EditPassword.css";
import { apiKey, apiUrl } from '../../api';

const EditPassword = ({ email }) => {
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmNewPassword, setConfirmNewPassword] = useState("");
    const [message, setMessage] = useState("");

    const handleOldPasswordChange = (e) => setOldPassword(e.target.value);
    const handleNewPasswordChange = (e) => setNewPassword(e.target.value);
    const handleConfirmNewPasswordChange = (e) => setConfirmNewPassword(e.target.value);

    const validateInputs = () => {
        if (!oldPassword || !newPassword || !confirmNewPassword) {
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

        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("Form submitted"); // Log form submission
        console.log(email); // Log email
        if (!validateInputs()) return;

        try {
            const response = await axios.get(`${apiUrl}/update-admin-user`, {
                params: {
                    email: email,
                    oldPassword: oldPassword,
                    newPassword: newPassword,
                },
                headers: {
                    'Accept': 'application/json',
                    'access-token': apiKey,
                },
            });

            setMessage(response.data.message);
            console.log("Admin user updated successfully:", response.data);
        } catch (error) {
            setMessage("Failed to update admin user");
            console.error("Error updating admin user:", error);
            console.log("Request Data:", error.request); // Log request data
            if (error.response) {
                console.error("Response Data:", error.response.data); // Log response data if available
            }
        }
    };

    return (
        <div>
            <h1>Modifier le mot de passe</h1>
            <p>Modifier le mot de passe pour: {email}</p>
            <input type="password" placeholder="Ancien mot de passe" value={oldPassword} onChange={handleOldPasswordChange} />
            <input type="password" placeholder="Nouveau mot de passe" value={newPassword} onChange={handleNewPasswordChange} />
            <input type="password" placeholder="Confirmer le nouveau mot de passe" value={confirmNewPassword} onChange={handleConfirmNewPasswordChange} />
            <button onClick={handleSubmit}>Enregistrer</button>
            {message && <p>{message}</p>}
        </div>
    );
};

export default EditPassword;