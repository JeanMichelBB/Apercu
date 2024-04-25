import React, { useState, useEffect } from "react";
import axios from "axios";

const EditPassword = () => {
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [username, setUsername] = useState("");
    const [message, setMessage] = useState("");

    const handleOldPasswordChange = (e) => {
        setOldPassword(e.target.value);
    };

    const handleNewPasswordChange = (e) => {
        setNewPassword(e.target.value);
    };

    const handleConfirmPasswordChange = (e) => {
        setConfirmPassword(e.target.value);
    };

    const handleUsernameChange = (e) => {
        setUsername(e.target.value);
    };

    const validateInputs = () => {
        if (!oldPassword || !newPassword || !confirmPassword || !username) {
            setMessage("All fields are required");
            return false;
        }

        if (newPassword.length < 8) {
            setMessage("New password must be at least 8 characters long");
            return false;
        }

        if (newPassword !== confirmPassword) {
            setMessage("New password and confirmed password do not match");
            return false;
        }

        return true;
    };

    useEffect(() => {
        const fetchAdmin = async () => {
            try {
                const response = await axios.get("http://localhost:8000/admin-users");
                setUsername(response.data[0].username);
            } catch (error) {
                console.error("Error fetching admin user:", error);
            }
        };

        fetchAdmin();
    }, []);

    const handleSubmit = async () => {
        if (!validateInputs()) {
            return;
        }

        try {
            const response = await axios.put(`http://localhost:8000/update-admin-user?username=${username}&old_password=${oldPassword}&new_password=${newPassword}`);
            setMessage(response.data.message);
            console.log("Admin user updated successfully");
        } catch (error) {
            setMessage("Failed to update admin user");
            console.error("Error updating admin user:", error);
        }
    };

    return (
        <div>
            <h1>Modifier le mot de passe</h1>
            <input type="password" placeholder="Ancien mot de passe" value={oldPassword} onChange={handleOldPasswordChange} />
            <input type="password" placeholder="Nouveau mot de passe" value={newPassword} onChange={handleNewPasswordChange} />
            <input type="password" placeholder="Confirmer le nouveau mot de passe" value={confirmPassword} onChange={handleConfirmPasswordChange} />
            <button onClick={handleSubmit}>Enregistrer</button>
            {message && <p>{message}</p>}
        </div>
    );
};

export default EditPassword;
