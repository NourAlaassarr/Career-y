import React from "react";
import { useLocation } from "react-router-dom";
import "../Styles/QuizGradePage.css";

const QuizGradePage = () => {
  const location = useLocation();
  const { grade } = location.state;

  return (
    <div className="quiz-grade-page">
      <h1>Your Quiz Grade</h1>
      <p>Your grade is: {grade}%</p>
      {grade >= 50 ? (
        <p>Congratulations! You passed!</p>
      ) : (
        <p>Sorry, you did not pass. Better luck next time!</p>
      )}
    </div>
  );
};

export default QuizGradePage;
