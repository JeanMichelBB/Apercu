import React, { useState } from "react";
import api from "../../services/api";
import "./EditPassword.css";

const EditPassword = () => {
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmNewPassword, setConfirmNewPassword] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage("");
        setError("");

        if (newPassword.length < 8) {
            setError("New password must be at least 8 characters long.");
            return;
        }
        if (newPassword !== confirmNewPassword) {
            setError("New password and confirmed password do not match.");
            return;
        }

        try {
            await api.changePassword({ current_password: currentPassword, new_password: newPassword });
            setMessage("Password updated successfully.");
            setCurrentPassword("");
            setNewPassword("");
            setConfirmNewPassword("");
        } catch (err) {
            setError(err.response?.data?.detail || "Failed to update password.");
        }
    };

    return (
        <div>
            <h1>Change Password</h1>
            <form onSubmit={handleSubmit}>
                <input type="password" placeholder="Current password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} required />
                <input type="password" placeholder="New password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required />
                <input type="password" placeholder="Confirm new password" value={confirmNewPassword} onChange={(e) => setConfirmNewPassword(e.target.value)} required />
                <button type="submit">Save</button>
            </form>
            {message && <p style={{ color: "green" }}>{message}</p>}
            {error && <p style={{ color: "red" }}>{error}</p>}
        </div>
    );
};

export default EditPassword;
