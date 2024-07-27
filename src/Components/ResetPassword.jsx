import React, { useState } from "react";
import { httpPatch } from "../axios/axiosUtils";
import '../Styles/ResetPassword.css';
import { useNavigate } from "react-router-dom";
const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState("");
  const [code, setCode] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const passToken = localStorage.getItem('pass-token');
  console.log(passToken);

  const handleResetPassword = async () => {
    try {
      const response = await httpPatch(
        `Auth/reset?token=${passToken}`,
        { NewPassword: newPassword },
        { headers: { token: passToken } }
      );
      setSuccessMessage(response.Message);
    } catch (error) {
      setErrorMessage(
        error.response.data.message || "Failed to reset password."
      );
    }
  };

  return (
    <div className="reset-password-container">
    <div className="reset-password-modal">
      <h2>Reset Password</h2>
      {errorMessage && <div className="message error">{errorMessage}</div>}
      {successMessage && <div className="message success">{successMessage}</div>}

      <div className="reset-password-form">
        <input
          type="password"
          placeholder="Enter new password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
        <button onClick={handleResetPassword}>Reset Password</button>
      </div>
    </div>
    </div>
  );
};

export default ResetPassword;
