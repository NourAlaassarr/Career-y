import "./../../Styles/AddQuestion.css";
import React, { useState } from "react";
import { httpPost } from "../../axios/axiosUtils";

const AddQuestions = () => {
    const [skillId, setSkillId] = useState('');
    const [questionText, setQuestionText] = useState('');
    const [level, setLevel] = useState('');
    const [answer, setAnswer] = useState('');
    const [options, setOptions] = useState(['', '', '', '']);
    const [order, setOrder] = useState(1);
    const [message, setMessage] = useState('');
    const [success, setSuccess] = useState(false);
    const session = JSON.parse(sessionStorage.getItem("session"));

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
        `Quiz/AddQuestionsToQuiz?SkillId=${skillId}`,
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
    <div className="container">
      <h1>Add Questions</h1>
      <form onSubmit={handleQuestionSubmit}>
        <div>
          <label>Skill ID:</label>
          <input
            type="text"
            value={skillId}
            onChange={(e) => setSkillId(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Question Text:</label>
          <input
            type="text"
            value={questionText}
            onChange={(e) => setQuestionText(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Level:</label>
          <input
            type="text"
            value={level}
            onChange={(e) => setLevel(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Answer:</label>
          <input
            type="text"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            required
          />
        </div>
        {options.map((option, index) => (
          <div key={index}>
            <label>Option {index + 1}:</label>
            <input
              type="text"
              value={option}
              onChange={(e) => handleOptionChange(index, e.target.value)}
              required
            />
          </div>
        ))}
        <div>
          <label>Order:</label>
          <input
            type="number"
            value={order}
            onChange={(e) => setOrder(e.target.value)}
            required
          />
        </div>
        <button type="submit">Add Question</button>
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
