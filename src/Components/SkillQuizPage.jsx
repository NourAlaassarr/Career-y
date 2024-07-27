import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../Styles/SkillQuizPage.css"; // Ensure you have the appropriate styles
import { httpGet, httpPost } from "../axios/axiosUtils"; // Assuming your service file is named httpService.js
import Countdown from "react-countdown";

const SkillQuizPage = () => {
  const { skill } = useParams(); // Use from URL parameters
  const session = JSON.parse(sessionStorage.getItem("session"));
  const navigate = useNavigate();

  const [quizName, setQuizName] = useState("");
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [grade, setGrade] = useState(null);
  const [endTime, setEndTime] = useState(0); // Timer end time in milliseconds
  const [timerEnded, setTimerEnded] = useState(false);
  const [message, setMessage] = useState();

  // Countdown renderer
  const renderer = ({ minutes, seconds, completed }) => {
    if (completed) {
      // Timer has ended
      setTimerEnded(true);
      handleSubmit();
      return <span>Time&apos;s up!</span>;
    } else {
      // Render a countdown timer
      return (
        <span>
          {minutes}:{seconds}
        </span>
      );
    }
  };

  // Effect to fetch questions and start the timer
  useEffect(() => {
    const fetchQuestionsAndStartTimer = async () => {
      try {
        const data = await httpGet(`Quiz/Quiz?SkillId=${skill}`, {
          headers: { token: session.token },
        });
        if (data && data.Questions) {
          setQuizName(data.QuizName || "Quiz");
          setQuestions(data.Questions);
          const endTime = Date.now() + (data.Questions.length * 60000 + 1000);
          setEndTime(endTime);
        } else {
          console.error("Unexpected response structure:", data);
        }
      } catch (error) {
        console.error("Error fetching questions:", error);
      }
    };

    fetchQuestionsAndStartTimer();
  }, [session.token, skill]);

  // Function to handle submission of answers
  const handleSubmit = useCallback(async () => {
    try {
      const answerArray = Object.keys(answers).map((questionId) => ({
        questionId,
        answerId: answers[questionId],
      }));

      const response = await httpPost(
        `Quiz/SubmitTopicQuiz?SkillId=${skill}`,
        {
          answer: answerArray,
        },
        { headers: { token: session.token } }
      );

      const { Grade, TotalQuestions } = response;
      setGrade(Grade);
      navigate(`/quiz/${skill}/grade`, {
        state: { grade: Grade, totalQuestions: TotalQuestions },
      });
    } catch (error) {
      setMessage(error.response.data.Message);
      setTimeout(() => navigate('/quiz'), 5000);
      console.error("Error submitting quiz:", error);
    }
  }, [answers, navigate, session.token, skill]);

  // Function to handle option change
  const handleOptionChange = (questionId, optionId) => {
    setAnswers({
      ...answers,
      [questionId]: optionId,
    });
  };

  const handleNextQuestion = () => {
    setCurrentQuestionIndex(currentQuestionIndex + 1);
  };

  const handlePreviousQuestion = () => {
    setCurrentQuestionIndex(currentQuestionIndex - 1);
  };

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className="skill-quiz-container">
      <div className="skill-quiz-page">
        <h1>{quizName}</h1>
        <div className="quiz-info">
          {endTime > 0 && !timerEnded && (
            <Countdown date={endTime} renderer={renderer} />
          )}
          <p>
            Question {currentQuestionIndex + 1} of {questions.length}
          </p>
        </div>
        {currentQuestion ? (
          <div className="question-container">
            <h2>{currentQuestion.questionText}</h2>
            <div className="options">
              {currentQuestion.options.map((option) => (
                <label key={option.id}>
                  <input
                    type="radio"
                    name={`question-${currentQuestion.id}`}
                    value={option.id}
                    checked={answers[currentQuestion.id] === option.id}
                    onChange={() =>
                      handleOptionChange(currentQuestion.id, option.id)
                    }
                  />
                  {option.optionText}
                </label>
              ))}
            </div>
          </div>
        ) : (
          <p>Loading questions...</p>
        )}
        <div className="navigation-buttons">
          {currentQuestionIndex > 0 && (
            <button onClick={handlePreviousQuestion}>Previous</button>
          )}
          {currentQuestionIndex < questions.length - 1 && (
            <button onClick={handleNextQuestion} className="next-button">
              Next
            </button>
          )}
          <button className="skill-quiz-submit-button" onClick={handleSubmit}>
            Submit
          </button>
        </div>
        {grade !== null && (
          <div className="grade-container">
            <p>Your Grade: {grade}%</p>
          </div>
        )}
        {message && <div style={{ color: "red" }}>{message}</div>}
      </div>
    </div>
  );
};

export default SkillQuizPage;
