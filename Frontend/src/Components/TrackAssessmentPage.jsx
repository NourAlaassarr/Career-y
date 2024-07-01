import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "../Styles/TrackAssessmentPage.css";

// eslint-disable-next-line react/prop-types
const TrackAssessmentPage = ({ option }) => {
  const { id } = useParams();
  const [assessment, setAssessment] = useState(null);

  useEffect(() => {
    // Fetch assessment data from backend
    fetch(`/api/tracks/${id}/assessment${option ? `/${option}` : ""}`)
      .then((response) => response.json())
      .then((data) => setAssessment(data))
      .catch((error) => console.error("Error fetching assessment:", error));
  }, [id, option]);

  if (!assessment) {
    return <div>Loading...</div>;
  }

  return (
    <div className="track-assessment-page">
      <h1>Track Assessment</h1>
      {assessment.questions.map((question, index) => (
        <div key={index} className="question">
          <h3>{question.text}</h3>
          <ul>
            {question.options.map((option, idx) => (
              <li key={idx}>{option}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default TrackAssessmentPage;
