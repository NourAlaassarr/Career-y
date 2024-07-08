import React, { useState } from "react";
import { httpPost } from "../../axios/axiosUtils";
import "./../../Styles/AdminAddQuiz.css"; // Import the CSS file

const AdminAddQuiz = () => {
  const [jobId, setJobId] = useState("");
  const [quizName, setQuizName] = useState("");
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);

  const handleQuizSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setSuccess(false);

    try {
      const response = await httpPost(`/Quiz/AddQuiz?JobId=${jobId}`, {
        QuizName: quizName,
      });
      const { success, message, Quiz } = response;
      setMessage(message);
      setSuccess(success);
      console.log("Created Quiz:", Quiz);
    } catch (error) {
      handleError(error);
    }
  };

  const handleError = (error) => {
    if (error.response) {
      setMessage("Error: " + (error.response.data.message || error.message));
    } else if (error.request) {
      setMessage("Error: No response from server.");
    } else {
      setMessage("Error: " + error.message);
    }
  };

  return (
    <div className="add-quiz-page">
      <h1 className="add-quiz-title">Add Quiz</h1>
      <form className="add-quiz-form" onSubmit={handleQuizSubmit}>
        <div className="form-group">
          <label className="form-label">Job ID:</label>
          <input
            className="form-input"
            type="text"
            value={jobId}
            onChange={(e) => setJobId(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label className="form-label">Quiz Name:</label>
          <input
            className="form-input"
            type="text"
            value={quizName}
            onChange={(e) => setQuizName(e.target.value)}
            required
          />
        </div>
        <button className="submit-button" type="submit">
          Add Quiz
        </button>
      </form>
      {message && (
        <div className={`message ${success ? "success" : "error"}`}>
          {message}
        </div>
      )}
    </div>
  );
};

export default AdminAddQuiz;
