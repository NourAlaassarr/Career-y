import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { httpGet, httpPost } from "../axios/axiosUtils"; // Ensure the correct import path
import "../Styles/CareerGuidancePage.css";

// Import track images
import Android from "../../images/logo/Android.png";
import Backend from "../../images/logo/backend.png";
import DataAnalyst from "../../images/logo/Data Analyst.png";
import FullStack from "../../images/logo/FullStack.png";
import Frontend from "../../images/logo/frontend.png";
import Security from "../../images/logo/security.png";
import DataArchitect from "../../images/logo/Android.png"; // Example, replace with correct image
import DataEngineer from "../../images/logo/Data Engineering .png"; // Example, replace with correct image
import DataScientist from "../../images/logo/Data Science.png";
import DatabaseAdministrator from "../../images/logo/Database Administration.png";
import EmbeddedSystems from "../../images/logo/Embedded Systems.png";
import Flutter from "../../images/logo/Flutter.png";
import SoftwareTesting from "../../images/logo/Software Testing.png";
import GameDevelopment from "../../images/logo/Game Development.png";
import ReactNative from "../../images/logo/React Native.png";

const CareerGoalPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [tracks, setTracks] = useState([]);
  const session = JSON.parse(localStorage.getItem("session"));
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTracks = async () => {
      try {
        const response = await httpGet("/Roadmap/GetAllTracks");
        console.log("Tracks fetched:", response); // Debug log
        if (response && response.Jobs) {
          setTracks(response.Jobs);
        } else {
          console.error("Unexpected response structure:", response);
        }
      } catch (error) {
        console.error("Error fetching tracks:", error);
      }
    };

    fetchTracks();
  }, []);

  const handleTrackClick = async (careerGoalId) => {
    try {
      await httpPost(
        `/User/AddCareerGoal?CareerGoalId=${careerGoalId}`,
        { CareerGoalId: careerGoalId },
        { headers: { 'token': session.token } }
      );
      navigate(`/track/${careerGoalId}/missingSkills`);
    } catch (error) {
      console.error("Error posting career goal:", error);
    }
  };

  const filteredTracks = tracks.filter((track) =>
    track.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getTrackImage = (track) => {
    switch (track.name.toLowerCase()) {
      case "android developer":
        return Android;
      case "backend":
        return Backend;
      case "data analyst":
        return DataAnalyst;
      case "full_stack":
        return FullStack;
      case "frontend":
        return Frontend;
      case "cybersecurity":
        return Security;
      case "data architect":
        return DataArchitect;
      case "data engineer":
        return DataEngineer;
      case "data scientist":
        return DataScientist;
      case "database administrator":
        return DatabaseAdministrator;
      case "embedded systems":
        return EmbeddedSystems;
      case "flutter development":
        return Flutter;
      case "software testing":
        return SoftwareTesting;
      case "game development":
        return GameDevelopment;
      case "react native":
        return ReactNative;
      default:
        return null; // Default image or no image
    }
  };

  return (
    <div className="career-guidance-page">
      <input
        type="text"
        placeholder="Search for tracks..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="search-input"
      />
      <div className="instruction-text">
        CHOOSE YOUR CAREER GOAL
      </div>
      <div className="tracks-container">
        {filteredTracks.map((track) => (
          <div
            key={track.Nodeid}
            className="track-link"
            onClick={() => handleTrackClick(track.Nodeid)}
          >
            <div className="track-image">
              <img
                src={getTrackImage(track)}
                alt={`${track.name} Image`}
                className="track-img"
              />
            </div>
            <div className="track-name">{track.name}</div>
            {/* <div className="track-description">{track.description}</div> */}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CareerGoalPage;
