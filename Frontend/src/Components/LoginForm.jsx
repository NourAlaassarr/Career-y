import { useState } from "react";
import { httpPost } from "../axios/axiosUtils";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Perform login logic here
    const response = await httpPost("http://localhost:8000/Auth/SignIn", {
      Email: email,
      Password: password,
    });
    localStorage.setItem(
      "session",
      JSON.stringify({
        id: response.updatedUserNode._id,
        token: response.updatedUserNode.token,
      })
    );
    // Reset form fields
    setEmail("");
    setPassword("");
  };

  return (
    <div className="signin-container">
      <form className="signin-form" onSubmit={handleSubmit}>
        <div className="logo-container">
          <div className="logo">
            <img src="./Logo1.png" alt="Logo" className="logo-image" />
          </div>
          <p
            style={{
              color: "rgba(5, 122, 141, 1)",
              fontWeight: "bold",
              fontSize: "20px",
            }}
          >
            CAREER<span style={{ color: "rgba(241, 193, 17, 1)" }}>-</span>Y
          </p>
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
        <p>
          {"Forgot your password? "}
          <a
            href="/reset-password"
            style={{ color: "rgba(241, 193, 17, 1)", textDecoration: "none" }}
          >
            Reset Password
          </a>
        </p>
        <button type="submit">Sign In</button>
        <p>
          {"Don't have an account? "}
          <a
            href="/sign-up"
            style={{ color: "rgba(241, 193, 17, 1)", textDecoration: "none" }}
          >
            Sign up
          </a>
        </p>
      </form>
    </div>
  );
};

export default LoginForm;
