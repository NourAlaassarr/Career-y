import "./../styles/OtpInput.css";
import PropTypes from "prop-types";

const OtpInput = ({ value, valueLength, onChange }) => {
  const handleInputChange = (e, index) => {
    const { value } = e.target;
    console.log(e.target);
    if (/^\d*$/.test(value)) {
      const newOtp = value.split("").map(Number);
      while (newOtp.length < valueLength) {
        newOtp.push(null);
      }
      newOtp[index] = value ? Number(value) : null;
      onChange(newOtp);
    }
  };

  const handleKeyUp = (e, index) => {
    if (e.key === "Backspace" && !e.target.value) {
      if (index > 0) {
        document.getElementById(`otp-input-${index - 1}`).focus();
      }
    } else if (e.target.value) {
      if (index < valueLength - 1) {
        document.getElementById(`otp-input-${index + 1}`).focus();
      }
    }
  };

  return (
    <div className="otp-input-container">
      {Array.from({ length: valueLength }).map((_, index) => (
        <input
          key={index}
          id={`otp-input-${index}`}
          type="text"
          inputMode="numeric"
          maxLength="1"
          value={value[index] ?? ""}
          onChange={(e) => handleInputChange(e, index)}
          onKeyUp={(e) => handleKeyUp(e, index)}
          className="otp-input"
        />
      ))}
    </div>
  );
};

OtpInput.propTypes = {
  value: PropTypes.arrayOf(
    PropTypes.oneOfType([PropTypes.number, PropTypes.oneOf([null])])
  ),
  valueLength: PropTypes.number.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default OtpInput;
