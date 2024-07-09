//bel GetALLMarksAndGrades
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { httpGet } from "../axios/axiosUtils";

const UserProfile = () => {
  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quizzes, setQuizzes] = useState([]);
  const [trackQuizzes, setTrackQuizzes] = useState([]);
  const session = JSON.parse(localStorage.getItem("session"));

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const userResponse = await httpGet("User/GetUserDetails", {
          headers: { token: session.token },
        });
        setUserDetails(userResponse);

        const quizzesResponse = await httpGet("User/GetAllMarks", {
          headers: { token: session.token },
        });
        setQuizzes(quizzesResponse.takenQuizzes);
        setTrackQuizzes(quizzesResponse.trackQuizzes);
      } catch (err) {
        setError(err.response?.data?.message || err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserDetails();
  }, [session.token]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  const addFeedbackPath = "/feedback";
  const updateFeedbackPath = "/update-feedback";

  return (
    <div>
      <h1>User Profile</h1>
      {userDetails && (
        <div>
          <h2>Personal Information</h2>
          <p>
            <strong>Name:</strong> {userDetails.UserName}
          </p>
          <p>
            <strong>Email:</strong> {userDetails.Email}
          </p>
          <p>
            <strong>Career Goal:</strong> {userDetails.CareerGoal[0]}
          </p>
          <p>
            <strong>Role:</strong> {userDetails.role}
          </p>

          <h2>Skills</h2>
          {userDetails.skills.length > 0 ? (
            <ul>
              {userDetails.skills.map((skill) => (
                <li key={skill.Nodeid}>
                  <p>{skill.name}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p>No skills found.</p>
          )}

          <h2>Feedbacks</h2>
          {userDetails.feedbacks.length > 0 ? (
            <ul>
              {userDetails.feedbacks.map((feedback) => (
                <li key={feedback.FeedbackId}>
                  <p>
                    <strong>Feedback:</strong> {feedback.feedback}
                  </p>
                  <p>
                    <strong>Date Created:</strong> {feedback.createdAt}
                  </p>
                  {feedback.updatedAt && (
                    <p>
                      <strong>Date Updated:</strong> {feedback.updatedAt}
                    </p>
                  )}
                  <Link
                    to={{
                      pathname: updateFeedbackPath,
                      state: { initialFeedback: feedback.feedback },
                    }}
                  >
                    <button>Update Feedback</button>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p>No feedbacks found.</p>
          )}

          {userDetails.feedbacks.length === 0 && (
            <Link to={addFeedbackPath}>
              <button>Add Feedback</button>
            </Link>
          )}

          <h2>Quizzes and Grades</h2>
          {quizzes.length > 0 || trackQuizzes.length > 0 ? (
            <div>
              <h3>Skill Quizzes</h3>
              {quizzes.length > 0 ? (
                <ul>
                  {quizzes.map((quiz, index) => (
                    <li key={index}>
                      <p>
                        <strong>Quiz Name:</strong> {quiz.QuizName}
                      </p>
                      <p>
                        <strong>Total Questions:</strong> {quiz.TotalQuestions}
                      </p>
                      <p>
                        <strong>Grade:</strong> {quiz.Grade || 0}
                      </p>
                      <p>
                        <strong>Pass:</strong> {quiz.Pass ? "Yes" : "No"}
                      </p>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No skill quizzes taken.</p>
              )}

              <h3>Track Quizzes</h3>
              {trackQuizzes.length > 0 ? (
                <ul>
                  {trackQuizzes.map((trackQuiz, index) => (
                    <li key={index}>
                      <p>
                        <strong>Track Name:</strong> {trackQuiz.TrackName}
                      </p>
                      <p>
                        <strong>Total Questions:</strong>{" "}
                        {trackQuiz.TotalQuestions}
                      </p>
                      <p>
                        <strong>Grade:</strong> {trackQuiz.Grade || 0}
                      </p>
                      <p>
                        <strong>Pass:</strong> {trackQuiz.Pass ? "Yes" : "No"}
                      </p>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No track quizzes taken.</p>
              )}
            </div>
          ) : (
            <p>No quizzes or grades found.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default UserProfile;
