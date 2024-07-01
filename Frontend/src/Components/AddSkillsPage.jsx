import React, { useState } from "react";
import "../Styles/AddSkillsPage.css"; // Import CSS for AddSkillsPage

const AddSkillsPage = () => {
  const [numSkills, setNumSkills] = useState(0);
  const [userSkills, setUserSkills] = useState([]);
  const [error, setError] = useState("");

  const handleInputChange = (event) => {
    const num = parseInt(event.target.value);

    if (isNaN(num) || num < 0) {
      setError(
        "Please enter a valid number of skills greater than or equal to 0."
      );
      setNumSkills(0);
      setUserSkills([]);
    } else if (num > 5) {
      setError("You can add a maximum of 5 skills.");
      setNumSkills(9);
      setUserSkills(Array(5).fill(""));
    } else {
      setError("");
      setNumSkills(num);
      setUserSkills(Array(num).fill("")); // Initialize an array of empty strings based on num
    }
  };

  const handleSkillInputChange = (index, event) => {
    const updatedSkills = [...userSkills];
    updatedSkills[index] = event.target.value;
    setUserSkills(updatedSkills);
  };

  return (
    <div className="add-skills-page">
      <h2>Add Skillsssss</h2>
      <p>How many skills do you have?</p>
      <input
        type="number"
        value={numSkills}
        onChange={handleInputChange}
        placeholder="Enter number of skills"
        min="0"
        max="9"
      />
      {error && <p className="error-message">{error}</p>}
      <div className="skills-container">
        {numSkills > 0 && (
          <div>
            {[...Array(numSkills)].map((_, index) => (
              <input
                key={index}
                type="text"
                className="skill-input"
                value={userSkills[index]}
                onChange={(e) => handleSkillInputChange(index, e)}
                placeholder={`Enter skill ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>
      <button>Submit Skills</button>
    </div>
  );
};

export default AddSkillsPage;
