import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { httpGet, httpPost } from "../axios/axiosUtils"; // Ensure the correct import path
import "../Styles/TrackAssessmentPage.css";
import Countdown from "react-countdown";

const TrackAssessmentPage = () => {
  const { id } = useParams();

  const session = JSON.parse(localStorage.getItem("session"));
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [time, setTime] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const response = await httpGet(`Quiz/GetTrackQuiz?jobId=${id}`, {
          headers: { token: session.token },
        });
        console.log("Quiz fetched:", response);

        if (response) {
          setQuiz(response);
          setTime(response.Questions.length * 60000 + 5000);
        } else {
          console.error("Unexpected response structure:", response);
        }
      } catch (error) {
        console.error("Error fetching quiz:", error);
      }
    };

    fetchQuiz();
  }, [id, session.token]);

  const handleSubmit = async () => {
    setIsSubmitting(true);

    const answerArray = Object.keys(answers).map((questionId) => ({
      questionId: questionId,
      answerId: answers[questionId],
    }));
    const quizSession = {
      quiz: quiz,
      correctAnswers: answers,
      randomQuestions: quiz.Questions,
      SkillId: null,
      jobId: id,
    };
    console.log(quizSession);

    try {
      console.log(answerArray);
      const response = await httpPost(
        "Quiz/SubmitQuiz",
        { answer: answerArray, session: quizSession },
        { headers: { token: session.token } }
      );
      console.log("Quiz submitted:", response);
      navigate("/track/${id}/grade", { state: { result: response } });
    } catch (error) {
      console.error("Error submitting quiz:", error);
      setIsSubmitting(false);
    }
  };

  const handleAnswerChange = (questionId, optionId) => {
    setAnswers((prevAnswers) => ({
      ...prevAnswers,
      [questionId]: optionId,
    }));
  };

  const handleNext = () => {
    setCurrentQuestionIndex((prevIndex) =>
      Math.min(prevIndex + 1, quiz.Questions?.length - 1)
    );
  };

  const handlePrevious = () => {
    setCurrentQuestionIndex((prevIndex) => Math.max(prevIndex - 1, 0));
  };

  return (
    <div className="track-assessment-page">
      <h1>Track Assessment</h1>
      {time && <Countdown date={Date.now() + time} />}
      <div className="quiz-container">
        {quiz.Questions?.length && (
          <div className="question-block">
            <h2>Question {currentQuestionIndex + 1}</h2>
            <p>{quiz.Questions[currentQuestionIndex].questionText}</p>
            <ul>
              {quiz.Questions[currentQuestionIndex].options.map((option) => (
                <li key={option.id}>
                  <label>
                    <input
                      type="radio"
                      name={`question-${quiz.Questions[currentQuestionIndex].id}`}
                      value={option.id}
                      checked={
                        answers[quiz.Questions[currentQuestionIndex].id] ===
                        option.id
                      }
                      onChange={() =>
                        handleAnswerChange(
                          quiz.Questions[currentQuestionIndex].id,
                          option.id
                        )
                      }
                    />
                    {option.optionText}
                  </label>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
      <div className="navigation-buttons">
        <button
          className="nav-btn"
          onClick={handlePrevious}
          disabled={currentQuestionIndex === 0}
        >
          Previous
        </button>
        <button
          className="nav-btn"
          onClick={handleNext}
          disabled={currentQuestionIndex === quiz.Questions?.length - 1}
        >
          Next
        </button>
      </div>
      {!isSubmitting && (
        <button className="submit-btn" onClick={handleSubmit}>
          Submit Quiz
        </button>
      )}
      {isSubmitting && <p>Submitting quiz...</p>}
    </div>
  );
};

export default TrackAssessmentPage;
