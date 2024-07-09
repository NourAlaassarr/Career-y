import React, { useState } from "react";
import { httpPatch } from "../axios/axiosUtils";
import "../Styles/ForgetPassword.css";

const ForgetPassword = () => {
  const [email, setEmail] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleForgetPassword = async () => {
    setErrorMessage(null);
    setSuccessMessage(null);
    try {
      const response = await httpPatch("Auth/ForgetPassword", { Email: email });
      localStorage.setItem("pass-token", response.ForgetPassToken);
      setSuccessMessage(response.Message);
    } catch (error) {
      setErrorMessage(
        error.response.data.message || "Failed to initiate password reset."
      );
    }
  };

  return (
    <div className="forget-password-container">
      <div className="forget-password-modal">
        <h2>Forget Password</h2>
        {errorMessage && <div className="message error">{errorMessage}</div>}
        {successMessage && (
          <div className="message success">{successMessage}</div>
        )}

        <div className="forget-password-form">
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button onClick={handleForgetPassword}>Send Email</button>
        </div>
      </div>
    </div>
  );
};

export default ForgetPassword;
