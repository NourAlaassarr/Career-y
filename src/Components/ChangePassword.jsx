import React, { useState } from "react";
import { httpPatch } from "../axios/axiosUtils";  // Assuming you have a POST utility similar to httpGet
import '../Styles/ChangePassword.css';  // Import the CSS file

const ChangePassword = () => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const session = JSON.parse(sessionStorage.getItem("session"));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const response = await httpPatch(
        "Auth/ChangePassword",
        {
          OldPassword: oldPassword,
          NewPassword: newPassword,
          ConfirmNewPassword: confirmNewPassword,
        },
        {
          headers: { token: session.token },
        }
      );

      setSuccessMessage(response.message);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="change-password-container">
      <h1>Change Password</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Old Password:</label>
          <input
            type="password"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            required
          />
        </div>
        <div>
          <label>New Password:</label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Confirm New Password:</label>
          <input
            type="password"
            value={confirmNewPassword}
            onChange={(e) => setConfirmNewPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" disabled={loading}>
          Change Password
        </button>
        {loading && <p className="loading">Loading...</p>}
        {error && <p className="error">Error: {error}</p>}
        {successMessage && <p className="success">{successMessage}</p>}
      </form>
    </div>
  );
};

export default ChangePassword;
