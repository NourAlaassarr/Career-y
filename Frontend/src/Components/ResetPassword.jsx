import "./../styles/resetPassword.css";
import { useState } from "react";
import OtpInput from "./OtpInput";
import Footer from "./Footer";
import { httpPatch } from "../axios/axiosUtils";

const ResetPasswordForm = () => {
  const [email, setEmail] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState(new Array(4).fill(null));
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handleNewPasswordChange = (e) => {
    setNewPassword(e.target.value);
  };

  const handleOtpChange = (newOtp) => {
    setOtp(newOtp);
  };

  const sendOtp = () => {
    // Simulate sending OTP
    httpPatch("Auth/ForgetPassword", { Email: email });
    setOtpSent(true);
  };

  const verifyOtp = () => {
    const enteredOtp = otp.join("");
    if (enteredOtp.length !== 4 || otp.includes(null)) {
      alert("Please enter a valid 4-digit OTP.");
      return false;
    }

    // Simulate OTP verification
    if (enteredOtp === "1234") {
      setOtpVerified(true);
      return true;
    } else {
      alert("Invalid OTP. Please try again.");
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!otpSent) {
      sendOtp();
    } else if (!otpVerified) {
      const verified = verifyOtp();
      if (!verified) {
        setLoading(false);
        return;
      }
    } else {
      // Simulate resetting password
      console.log("New Password:", newPassword);
      setTimeout(() => {
        // Reset form fields
        setEmail("");
        setOtp(new Array(4).fill(null));
        setNewPassword("");
        setOtpSent(false);
        setOtpVerified(false);
      }, 1000);
    }

    setLoading(false);
  };

  return (
    <div className="reset-password-container">
      <form className="reset-password-form" onSubmit={handleSubmit}>
        <div className="reset-password-header">
          <h2>Reset Password</h2>
          <p>
            {otpSent && !otpVerified
              ? "Enter the OTP sent to your email"
              : otpVerified
              ? "Enter your new password"
              : "Enter your email to receive an OTP"}
          </p>
        </div>
        {!otpSent ? (
          <>
            <input
              type="email"
              value={email}
              onChange={handleEmailChange}
              placeholder="Email"
              required
            />
            <button type="submit" disabled={loading}>
              {loading ? "Sending..." : "Send OTP"}
            </button>
          </>
        ) : !otpVerified ? (
          <>
            <OtpInput value={otp} valueLength={4} onChange={handleOtpChange} />
            <button type="submit" disabled={loading}>
              {loading ? "Verifying..." : "Verify OTP"}
            </button>
          </>
        ) : (
          <>
            <input
              type="password"
              value={newPassword}
              onChange={handleNewPasswordChange}
              placeholder="New Password"
              required
            />
            <button type="submit" disabled={loading}>
              {loading ? "Resetting..." : "Reset Password"}
            </button>
          </>
        )}
      </form>
      <Footer />
    </div>
  );
};
export default ResetPasswordForm;
