import React, { useState } from "react";
import { httpPost } from "../../axios/axiosUtils";
import "../../Styles/AdminAddQuiz.css";

const AdminAddQuiz = () => {
  const [jobId, setJobId] = useState("");
  const [quizName, setQuizName] = useState("");
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);
  const session = JSON.parse(sessionStorage.getItem('session'));

  const handleQuizSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setSuccess(false);

    try {
      const response = await httpPost(`Quiz/AddQuiz?JobId=${jobId}`, {
        QuizName: quizName,
      }, {headers: {token: session.token}});
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
      <div className="add-quiz-modal">
        <h1 className="add-quiz-title">Add Quiz</h1>
        <form onSubmit={handleQuizSubmit} className="add-quiz-form">
          <div className="form-group">
            <label className="form-label">Job ID:</label>
            <input
              type="text"
              value={jobId}
              onChange={(e) => setJobId(e.target.value)}
              required
              className="form-input"
            />
          </div>
          <div>
            <label className="form-label">Quiz Name:</label>
            <input
              type="text"
              value={quizName}
              onChange={(e) => setQuizName(e.target.value)}
              required
              className="form-input"
            />
          </div>
          <button type="submit" className="add-quiz-submit-button">Add Quiz</button>
        </form>
        {message && (
          <div style={{ color: success ? "green" : "red" }} className="add-quiz-message">{message}</div>
        )}
      </div>
    </div>
  );
};

export default AdminAddQuiz;
