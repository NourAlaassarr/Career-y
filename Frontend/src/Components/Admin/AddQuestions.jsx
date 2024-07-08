import React, { useState } from "react";
import { httpPost } from "../../axios/axiosUtils";
import "./../../Styles/AddQuestions.css"; // Import the CSS file

const AddQuestions = () => {
  const [skillId, setSkillId] = useState("");
  const [questionText, setQuestionText] = useState("");
  const [level, setLevel] = useState("");
  const [answer, setAnswer] = useState("");
  const [options, setOptions] = useState(["", "", "", ""]);
  const [order, setOrder] = useState(1);
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);
  const session = JSON.parse(localStorage.getItem("session"));

  const handleQuestionSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setSuccess(false);

    try {
      const questionData = {
        questionText: questionText,
        Level: level,
        answer: answer,
        options: options,
        order: order,
      };

      const response = await httpPost(
        `/Quiz/AddQuestionsToQuiz?SkillId=${skillId}`,
        { Questions: [questionData] },

        { headers: { token: session.token } }
      );
      const { message, success } = response;
      setMessage(message);
      setSuccess(success);
    } catch (error) {
      handleError(error);
    }
  };

  const handleOptionChange = (index, value) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
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
    <div className="add-questions-page">
      <h1 className="add-questions-title">Add Questions</h1>
      <form className="add-questions-form" onSubmit={handleQuestionSubmit}>
        <div className="form-group">
          <label className="form-label">Skill ID:</label>
          <input
            className="form-input"
            type="text"
            value={skillId}
            onChange={(e) => setSkillId(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label className="form-label">Question Text:</label>
          <input
            className="form-input"
            type="text"
            value={questionText}
            onChange={(e) => setQuestionText(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label className="form-label">Level:</label>
          <input
            className="form-input"
            type="text"
            value={level}
            onChange={(e) => setLevel(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label className="form-label">Answer:</label>
          <input
            className="form-input"
            type="text"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            required
          />
        </div>
        {options.map((option, index) => (
          <div className="form-group" key={index}>
            <label className="form-label">Option {index + 1}:</label>
            <input
              className="form-input"
              type="text"
              value={option}
              onChange={(e) => handleOptionChange(index, e.target.value)}
              required
            />
          </div>
        ))}
        <div className="form-group">
          <label className="form-label">Order:</label>
          <input
            className="form-input"
            type="number"
            value={order}
            onChange={(e) => setOrder(e.target.value)}
            required
          />
        </div>
        <button className="submit-button" type="submit">
          Add Question
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

export default AddQuestions;
