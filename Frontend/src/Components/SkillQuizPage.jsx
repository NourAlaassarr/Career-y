import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../Styles/SkillQuizPage.css";
import { httpGet, httpPost } from "../axios/axiosUtils"; // Assuming your service file is named httpService.js

const SkillQuizPage = () => {
  const { skillId } = useParams(); // Use skillId from URL parameters
  const session = JSON.parse(localStorage.getItem("session"));
  const navigate = useNavigate();

  const [quizName, setQuizName] = useState("");
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [grade, setGrade] = useState(null);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes timer (300 seconds)

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const data = await httpGet(
          `http://localhost:8000/Quiz/Quiz?SkillId=${skillId}`,
          {
            headers: { token: session.token },
          }
        );
        if (data && data.Questions) {
          setQuizName(data.QuizName || "Quiz");
          setQuestions(data.Questions);
        } else {
          console.error("Unexpected response structure:", data);
        }
      } catch (error) {
        console.error("Error fetching questions:", error);
      }
    };

    fetchQuestions();

    // Timer
    const timerId = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timerId);
          handleSubmit();
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timerId);
  }, [skillId]);

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

  const handleSubmit = async () => {
    try {
      const answerArray = Object.keys(answers).map((questionId) => ({
        questionId,
        answerId: answers[questionId],
      }));

      const response = await httpPost(
        `http://localhost:8000/Quiz/SubmitTopicQuiz?SkillId=${skillId}`,
        {
          answer: answerArray,
        },
        { headers: { token: session.token } }
      );

      const { Grade, TotalQuestions } = response;
      setGrade(Grade);
      navigate(`/quiz/${skillId}/grade`, {
        state: { grade: Grade, totalQuestions: TotalQuestions },
      });
    } catch (error) {
      console.error("Error submitting quiz:", error);
    }
  };

  const currentQuestion = questions[currentQuestionIndex];
  const formatTime = (time) =>
    `${Math.floor(time / 60)}:${("0" + (time % 60)).slice(-2)}`;

  return (
    <div className="skill-quiz-page">
      <h1>{quizName}</h1>
      <div className="quiz-info">
        <p>Time Left: {formatTime(timeLeft)}</p>
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
