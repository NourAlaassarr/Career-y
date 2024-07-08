import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { httpGet } from "../axios/axiosUtils"; // Ensure the correct import path
import "../Styles/CareerGuidancePage.css";


// // Import track images
import Android from "../../images/logo/Android.png";
import Backend from "../../images/logo/backend.png";
import DataAnalyst from "../../images/logo/Data Analyst.png";
import FullStack from "../../images/logo/FullStack.png";
import Frontend from "../../images/logo/frontend.png";
import Security from "../../images/logo/security.png";
import DataArchitect from "../../images/logo/database-management.png";
import DataEngineer from "../../images/logo/Data Engineering .png";
import DataScientist from "../../images/logo/Data Science.png";
import DatabaseAdministrator from "../../images/logo/Database Administration.png";
import EmbeddedSystems from "../../images/logo/Embedded Systems.png";
import Flutter from "../../images/logo/Flutter.png";
import SoftwareTesting from "../../images/logo/Software Testing.png";
import GameDevelopment from "../../images/logo/Game Development.png";
import ReactNative from "../../images/logo/React Native.png";
import RoboticsAutomationTechnician from "../../images/logo/robotic-process-automation.png";
import BusinessIntelligenceDeveloper from "../../images/logo/business.png";

const CareerGuidancePage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [tracks, setTracks] = useState([]);

  useEffect(() => {
    const fetchTracks = async () => {
      try {
        const response = await httpGet("Roadmap/GetAllTracks");
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

  const filteredTracks = tracks.filter((track) =>
    track.name && track.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const getTrackImage = (track) => {
  //Function to get track image based on track name
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
      case "software testing ":
        return SoftwareTesting;
      case "game development":
        return GameDevelopment;
      case "react native":
        return ReactNative;
      case "robotics automation technician":
        return RoboticsAutomationTechnician;
      case "business intelligence developer":
        return BusinessIntelligenceDeveloper;
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
        CHOOSE THE CAREER PATH YOU WANT TO TRACK YOUR PROGRESS IN
      </div>
      <div className="tracks-container">
        {filteredTracks.filter((track) => track.name != undefined).map((track) => (
          <Link
            to={
              track.name && (track.name.toLowerCase() === "frontend" || track.name.toLowerCase() === "backend")
                ? `/track/${track.Nodeid}/framework`
                : `/track/${track.Nodeid}/assessment`
            }
            key={track.Nodeid}
            className="track-link"
          >
            <div className="track-item">
              <div className="track-image">
                <img
                  src={getTrackImage(track)}
                  alt={`${track.name} Image`}
                  className="track-img"
                />
              </div>
              <div className="track-text">
                <div className="track-name">{track.name}</div>
                <div className="track-description">{track.description}</div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default CareerGuidancePage;
