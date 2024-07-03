import React from "react";
import { useLocation } from "react-router-dom";
import "../Styles/TrackQuizGradePage.css";

const TrackQuizGradePage = () => {
  const location = useLocation();
  const { result } = location.state;

  return (
    <div className="track-quiz-grade-page">
      <h1>Quiz Results</h1>
      <p>Grade: {result.grade}</p>
      <p>Status: {result.pass ? "Passed" : "Failed"}</p>
      {result.mandatorySkills && (
        <div>
          <h2>Mandatory Skills:</h2>
          <ul>
            {result.mandatorySkills.map((skill) => (
              <li key={skill.Nodeid}>{skill.name}</li>
            ))}
          </ul>
        </div>
      )}
      {result.specificSkill && (
        <div>
          <h2>Specific Skill:</h2>
          <p>{result.specificSkill.name}</p>
        </div>
      )}
      {result.jobs && (
        <div>
          <h2>Job Offers:</h2>
          <ul>
            {result.jobs.map((job) => (
              <li key={job.Nodeid}>{job.title}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default TrackQuizGradePage;
