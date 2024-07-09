//bel GetALLMarksAndGrades
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { httpGet } from "../axios/axiosUtils";
import "../Styles/ProfilePage.css";

const UserProfile = () => {
  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quizzes, setQuizzes] = useState([]);
  const [trackQuizzes, setTrackQuizzes] = useState([]);
  const session = JSON.parse(sessionStorage.getItem("session"));

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
    <div className="profile-container">
      <h1 className="profile-title">User Profile</h1>
      {userDetails && (
        <div className="profile-content">
          <div className="personal-info">
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
          </div>

          <div className="skills-section">
            <h2>Skills</h2>
            {userDetails.skills.length > 0 ? (
              <ul className="skills-list">
                {userDetails.skills.map((skill) => (
                  <li key={skill.Nodeid} className="profile-page-skill-item">
                    <p>{skill.name}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No skills found.</p>
            )}
          </div>

          <div className="skills-section">
            <h2>Feedbacks</h2>
            {userDetails.feedbacks.length > 0 ? (
              <ul className="skills-list">
                {userDetails.feedbacks.map((feedback) => (
                  <li
                    key={feedback.FeedbackId}
                    className="profile-page-skill-item"
                  >
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
                      <button className="update-feedback-btn">
                        Update Feedback
                      </button>
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No feedbacks found.</p>
            )}
          </div>

          {userDetails.feedbacks.length === 0 && (
            <Link to={addFeedbackPath}>
              <button className="update-feedback-btn">Add Feedback</button>
            </Link>
          )}

          <div className="skills-section">
            <h2>Quizzes and Grades</h2>
            {quizzes.length > 0 || trackQuizzes.length > 0 ? (
              <div>
                <h3>Skill Quizzes</h3>
                {quizzes.length > 0 ? (
                  <ul className="skills-list">
                    {quizzes.map((quiz, index) => (
                      <li key={index} className="profile-page-skill-item">
                        <p>
                          <strong>Quiz Name:</strong> {quiz.QuizName}
                        </p>
                        <p>
                          <strong>Total Questions:</strong>{" "}
                          {quiz.TotalQuestions}
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
                  <ul className="skills-list">
                    {trackQuizzes.map((trackQuiz, index) => (
                      <li key={index} className="profile-page-skill-item">
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
        </div>
      )}
    </div>
  );
};

export default UserProfile;
