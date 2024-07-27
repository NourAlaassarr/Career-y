import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { httpGet, httpPost } from '../axios/axiosUtils';
import '../Styles/TrackAssessmentPage.css';
import Countdown from 'react-countdown';

const TrackAssessmentPage = () => {
  const { id, skillId } = useParams();
  const session = JSON.parse(sessionStorage.getItem('session'));
  const navigate = useNavigate();

  const [quiz, setQuiz] = useState([]);
  const [answers, setAnswers] = useState({});
  const [time, setTime] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [message, setMessage] = useState();
  const [endTime, setEndTime] = useState(0);
  const [timerEnded, setTimerEnded] = useState(false);
  const frontFrameworks = JSON.parse(localStorage.getItem("front-frameworks"));

  useEffect(() => {
    const fetchQuizAndStartTimer = async () => {
      try {
        let response;
        if (skillId) {
          const frameworkIds = frontFrameworks.map(
            (framework) => framework.Nodeid
          );
          if (frameworkIds.length > 3) {
            response = await httpGet(
              `Quiz/GetBackendTrackQuiz?jobId=${id}&SkillId=${skillId}`,
              {
                headers: { token: session?.token },
              }
            );
          } else {
            response = await httpGet(
              `Quiz/GetTrackQuiz?jobId=${id}&SkillId=${skillId}`,
              {
                headers: { token: session.token },
              }
            );
          }
        } else {
          response = await httpGet(`Quiz/GetTrackQuiz?jobId=${id}`, {
            headers: { token: session.token },
          });
        }

        if (response && response.Questions) {
          setQuiz(response);
          const endTime = Date.now() + (response.Questions.length * 60000 + 5000);
          setEndTime(endTime);
        } else {
          console.error('Unexpected response structure:', response);
        }
      } catch (error) {
        setMessage(error.response.data.Message);
        console.error('Error fetching quiz:', error);
      }
    };

    fetchQuizAndStartTimer();
  }, [id, session.token, skillId]);

  // Countdown renderer
  const renderer = ({ minutes, seconds, completed }) => {
    if (completed) {
      setTimerEnded(true);
      handleSubmit();
      return <span>Time&apos;s up!</span>;
    } else {
      return <span>{minutes}:{seconds}</span>;
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);

    const answerArray = Object.keys(answers).map((questionId) => ({
      questionId: questionId,
      answerId: answers[questionId],
    }));

    try {
      const response = await httpPost('Quiz/SubmitQuiz', {
        answer: answerArray,
        quizId: quiz.QuizId,
        jobId: id,
      }, {
        headers: { token: session.token }
      });

      navigate(`/track/${id}/grade`, { state: { result: response } });
    } catch (error) {
      console.error('Error submitting quiz:', error);
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
      {endTime > 0 && !timerEnded && (
        <Countdown date={endTime} renderer={renderer} />
      )}
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
      {message && <div style={{ color: "red" }}>{message}</div>}
    </div>
  );
};

export default TrackAssessmentPage;
