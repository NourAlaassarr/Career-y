// src/SignupForm.jsx
import React, { useState } from "react";
import { httpPost } from "../../axios/axiosUtils";
import "./SignupForm.css";

const SignupForm = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleSubmit = async (e) => {
    setErrorMessage(null);
    setSuccessMessage(null);
    try {
      e.preventDefault();
      const response = await httpPost("Auth/SignUp", {
        UserName: username,
        Email: email,
        password,
        ConfirmPassword: confirmPassword,
      });
      setSuccessMessage(response.Message);
      setUsername("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
    } catch (error) {
      setErrorMessage(
        error.response.data.message || "Failed to sign up"
      );
    }
  };

  return (
    <div className="signup-container">
      <form className="signup-form" onSubmit={handleSubmit}>
        <div className="signup-header">
          <h2>Sign Up</h2>
          <p>Fill in the fields below to sign up for an account</p>
        </div>
        <input
          className="signup-input"
          type="text"
          value={username}
          onChange={handleUsernameChange}
          placeholder="Username"
        />
        <input
          className="signup-input"
          type="text"
          value={email}
          onChange={handleEmailChange}
          placeholder="Email"
        />
        <input
          className="signup-input"
          type="password"
          value={password}
          onChange={handlePasswordChange}
          placeholder="Password"
        />
        <input
          className="signup-input"
          type="password"
          value={confirmPassword}
          onChange={handleConfirmPasswordChange}
          placeholder="Confirm Password"
        />
        {errorMessage && <div className="message error">{errorMessage}</div>}
        {successMessage && <div className="message success">{successMessage}</div>}
        <button type="submit" className="signup-button">
          Sign Up
        </button>
        <p className="signin-link">
          Already have an account? <a href="/login">Sign in</a>
        </p>
      </form>
    </div>
  );
};

export default SignupForm;
