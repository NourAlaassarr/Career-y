import React, { useState } from "react";
import { httpPatch } from "../axios/axiosUtils";
// import '../Styles/ForgetPassword.css';  // Import the CSS file

const ForgetPassword = () => {
  const [email, setEmail] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleForgetPassword = async () => {
    try {
      const response = await httpPatch("Auth/ForgetPassword", { Email: email });
      localStorage.setItem('pass-token', response.ForgetPassToken);
      setSuccessMessage(response.data.Message);
    } catch (error) {
      setErrorMessage(
        error.response.data.message || "Failed to initiate password reset."
      );
    }
  };

  return (
    <div className="forget-password-container">
      <h2>Forget Password</h2>
      {errorMessage && <div className="message error">{errorMessage}</div>}
      {successMessage && <div className="message success">{successMessage}</div>}

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
  );
};

export default ForgetPassword;
