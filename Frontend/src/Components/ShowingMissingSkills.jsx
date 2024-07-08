import React from "react";
import PropTypes from "prop-types";
import { useNavigate, useParams } from "react-router-dom";
import "../Styles/ShowingMissingSkills.css";

const ShowingMissingSkills = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const handleButtonClick = () => {
    navigate(`/track/${id}/missingSkills`);
  };

  return (
    <div className="showing-missing-skills">
      <h1>Your Career Goal</h1>
      <p>
        Click the button below to see the skills you are missing for your career
        goal and some recommended tracks according to your skills.
      </p>
      <button
        className="show-missing-skills-button"
        onClick={handleButtonClick}
      >
        Show Missing Skills
      </button>
    </div>
  );
};

ShowingMissingSkills.propTypes = {
  careerGoalId: PropTypes.string.isRequired,
};

export default ShowingMissingSkills;
