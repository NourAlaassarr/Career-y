import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../Styles/SkillQuizPage.css'; // Ensure you have the appropriate styles
import { httpGet, httpPost } from '../axios/axiosUtils'; // Assuming your service file is named httpService.js
import Countdown from 'react-countdown';

const SkillQuizPage = () => {
  const { skill } = useParams(); // Use from URL parameters
  const session = JSON.parse(sessionStorage.getItem("session"));
  const navigate = useNavigate();
  
  const [quizName, setQuizName] = useState('');
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [grade, setGrade] = useState(null);
  const [time, setTime] = useState(null); // 5 minutes timer (300 seconds)

  const handleSubmit = useCallback(async () => {
    try {
      const answerArray = Object.keys(answers).map(questionId => ({
        questionId,
        answerId: answers[questionId]
      }));

      const response = await httpPost(`Quiz/SubmitTopicQuiz?SkillId=${skill}`, {
        answer: answerArray
      }, { headers: { 'token': session.token } });

      const { Grade, TotalQuestions } = response;
      setGrade(Grade);
      navigate(`/quiz/${skill}/grade`, { state: { grade: Grade, totalQuestions: TotalQuestions } });
    } catch (error) {
      console.error('Error submitting quiz:', error);
    }
  }, [answers, navigate, session.token, skill]);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const data = await httpGet(`Quiz/Quiz?SkillId=${skill}`, {
          headers: { 'token': session.token }
        });
        if (data && data.Questions) {
          setQuizName(data.QuizName || 'Quiz');
          setQuestions(data.Questions);
          setTime(data.Questions.length * 60000 + 5000);
        } else {
          console.error('Unexpected response structure:', data);
        }
      } catch (error) {
        console.error('Error fetching questions:', error);
      }
    };

    fetchQuestions();
  }, [handleSubmit, session.token, skill]);

  const handleOptionChange = (questionId, optionId) => {
    setAnswers({
      ...answers,
      [questionId]: optionId
    });
  };

  const handleNextQuestion = () => {
    setCurrentQuestionIndex(currentQuestionIndex + 1);
  };

  const handlePreviousQuestion = () => {
    setCurrentQuestionIndex(currentQuestionIndex - 1);
  };

  const currentQuestion = questions[currentQuestionIndex];
  const formatTime = (time) =>
    `${Math.floor(time / 60)}:${("0" + (time % 60)).slice(-2)}`;

  return (
    <div className="skill-quiz-page">
      <h1>{quizName}</h1>
      <div className="quiz-info">
        {time && <Countdown date={Date.now() + time} />}
        <p>Question {currentQuestionIndex + 1} of {questions.length}</p>
      </div>
      {currentQuestion ? (
        <div className="question-container">
          <h2>{currentQuestion.questionText}</h2>
          <div className="options">
            {currentQuestion.options.map(option => (
              <label key={option.id}>
                <input
                  type="radio"
                  name={`question-${currentQuestion.id}`}
                  value={option.id}
                  checked={answers[currentQuestion.id] === option.id}
                  onChange={() => handleOptionChange(currentQuestion.id, option.id)}
                />
                {option.optionText}
              </label>
            ))}
          </div>
        </div>
      ) : (
        <p>Loading questions...</p>
      )}
      {currentQuestionIndex === questions.length - 1 && (
        <button className="submit-button" onClick={handleSubmit}>
          Submit
        </button>
      )}
      <div className="navigation-buttons">
        {currentQuestionIndex > 0 && (
          <button onClick={handlePreviousQuestion}>Previous</button>
        )}
        {currentQuestionIndex < questions.length - 1 && (
          <button onClick={handleNextQuestion}>Next</button>
        )}
        {currentQuestionIndex === questions.length - 1 && (
          <button className="submit-button" onClick={handleSubmit}>
            Submit
          </button>
        )}
      </div>
      {grade !== null && (
        <div className="grade-container">
          <p>Your Grade: {grade}%</p>
        </div>
      )}
    </div>
  );
};

export default SkillQuizPage;
