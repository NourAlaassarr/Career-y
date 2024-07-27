import React, { useState, useEffect } from "react";
import { httpGet } from "../axios/axiosUtils"; // Ensure the correct import path
import "../Styles/MissingSkillsPage.css"; // Create and style your CSS file

const MissingSkillsPage = () => {
  const [gapSkills, setGapSkills] = useState([]);
  const [recommendedTracks, setRecommendedTracks] = useState([]);
  const session = JSON.parse(sessionStorage.getItem("session"));

  useEffect(() => {
    const fetchGapSkills = async () => {
      try {
        const response = await httpGet("User/GapSkills", {
          headers: { token: session.token },
        });
        console.log("Gap skills fetched:", response); // Debug log
        if (response && response.gapSkills) {
          setGapSkills(response.gapSkills);
        } else {
          console.error("Unexpected response structure:", response);
        }
      } catch (error) {
        console.error("Error fetching gap skills:", error);
      }
    };

    const fetchRecommendedTracks = async () => {
      try {
        const response = await httpGet("User/RecommendTracks", {
          headers: { token: session.token },
        });
        console.log("Recommended tracks fetched:", response); // Debug log
        if (response && response.jobs) {
          setRecommendedTracks(response.jobs);
        } else {
          console.error("Unexpected response structure:", response);
        }
      } catch (error) {
        console.error("Error fetching recommended tracks:", error);
      }
    };

    fetchGapSkills();
    fetchRecommendedTracks();
  }, [session.token]);

  return (
    <div className="missing-skills-page">
      <h2>Your Missing Skills</h2>
      <div className="gap-skills-container">
        {gapSkills.length > 0 ? (
          gapSkills.map((skill, index) => (
            <div
              key={index}
              className={`gap-skill ${
                skill.mandatory ? "mandatory" : "optional"
              }`}
            >
              <span className="skill-name">{skill.Skill}</span>
              {skill.mandatory ? (
                <span className="mandatory-label">Mandatory</span>
              ) : (
                <span className="optional-label">Optional</span>
              )}
            </div>
          ))
        ) : (
          <p>No missing skills found.</p>
        )}
      </div>

      <h2>Recommended Tracks</h2>
      <div className="recommended-tracks-container">
        {recommendedTracks.length > 0 ? (
          recommendedTracks.map((track, index) => (
            <div key={index} className="recommended-track">
              <span className="track-name">{track.name}</span>
              <span className="track-description">{track.description}</span>
            </div>
          ))
        ) : (
          <p>No recommended tracks found.</p>
        )}
      </div>
    </div>
  );
};

export default MissingSkillsPage;
