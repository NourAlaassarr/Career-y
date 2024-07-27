// src/LoginForm.jsx
import "./../Styles/LoginForm.css";

// src/LoginForm.jsx
import { useState } from "react";
import { httpPost } from "../axios/axiosUtils";
import Logo from "../../images/Logo4.png";
import { useNavigate } from "react-router-dom";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      const response = await httpPost("Auth/SignIn", {
        Email: email,
        Password: password,
      });
      sessionStorage.setItem(
        "session",
        JSON.stringify({
          id: response.updatedUserNode._id,
          token: response.updatedUserNode.token,
          role: response.updatedUserNode.role
        })
      );
      setEmail("");
      setPassword("");
      response.updatedUserNode.role == 'admin' ? navigate("/admin") : navigate("/");
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div className="signin-container">
      <form className="signin-form" onSubmit={handleSubmit}>
        <div className="logo-container">
          <div className="logo">
            <img src={Logo} alt="Logo" className="logo-image" />
          </div>
        </div>
        <input
          className="signin-input"
          type="text"
          value={email}
          onChange={handleEmailChange}
          placeholder="Email"
        />
        <input
          className="signin-input"
          type="password"
          value={password}
          onChange={handlePasswordChange}
          placeholder="Password"
        />
        <p className="forgot-password">
          Forgot your password? <a href="/forget-password">Reset Password</a>
        </p>
        <button type="submit" className="signin-button">
          Sign In
        </button>
        <p className="signup-link">
          Do not have an account? <a href="/sign-up">Sign up</a>
        </p>
      </form>
    </div>
  );
};

export default LoginForm;
