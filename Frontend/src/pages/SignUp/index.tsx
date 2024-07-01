import React from "react";
import { useState } from "react";
import { httpPost } from "../../axios/axiosUtils";

const SignupForm = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [password, setPassword] = useState("");

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

  const handleSubmit = (e) => {
    e.preventDefault();
    // Perform signup logic here
    httpPost("Auth/SignUp", {
      UserName: username,
      Email: email,
      password,
      ConfirmPassword: confirmPassword,
    });
    // Reset form fields
    setUsername("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
  };

  return (
    <div className="signup-container">
      <form className="signup-form" onSubmit={handleSubmit}>
        <div className="signup-header">
          <h2>Sign Up</h2>
          <p>Fill in the fields below to sign up for an account</p>
        </div>
        <input
          type="text"
          value={username}
          onChange={handleUsernameChange}
          placeholder="Username"
        />
        <input
          type="text"
          value={email}
          onChange={handleEmailChange}
          placeholder="Email"
        />
        <input
          type="password"
          value={password}
          onChange={handlePasswordChange}
          placeholder="Password"
        />
        <input
          type="password"
          value={confirmPassword}
          onChange={handleConfirmPasswordChange}
          placeholder="Confirm Password"
        />
        <button type="submit">Sign Up</button>
        <p>
          Already have an account?{" "}
          <a
            href="/login"
            style={{ color: "rgba(241, 193, 17, 1)", textDecoration: "none" }}
          >
            Sign in
          </a>
        </p>
      </form>
    </div>
  );
};

export default SignupForm;
