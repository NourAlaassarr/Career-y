import React, { useState } from "react";
import { httpPost } from "../../axios/axiosUtils";
import "./../../Styles/AddSkillToRoadmap.css"; // Import the CSS file

const AddSkillToRoadmap = () => {
  const [trackId, setTrackId] = useState("");
  const [name, setName] = useState("");
  const [videoResource, setVideoResource] = useState("");
  const [type, setType] = useState("");
  const [readingResource, setReadingResource] = useState("");
  const [level, setLevel] = useState("");
  const [mandatory, setMandatory] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await httpPost(
        "/Roadmap/AddSkillToRoadmap",
        {
          name: name,
          video_resource: videoResource,
          type: type,
          reading_resource: readingResource,
          level: level,
          mandatory: mandatory,
        },
        {
          params: { TrackId: trackId },
        }
      );

      setStatusMessage("Skill added to roadmap successfully.");
    } catch (error) {
      setStatusMessage(
        `Error: ${error.response?.data?.message || error.message}`
      );
    }
  };

  return (
    <div className="add-skill-page">
      <h2 className="add-skill-title">Add Skill to Roadmap</h2>
      <form className="add-skill-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="trackId">Track ID:</label>
          <input
            type="text"
            id="trackId"
            value={trackId}
            onChange={(e) => setTrackId(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="videoResource">Video Resource:</label>
          <textarea
            id="videoResource"
            value={videoResource}
            onChange={(e) => setVideoResource(e.target.value)}
            rows="3"
          />
        </div>
        <div className="form-group">
          <label htmlFor="type">Type:</label>
          <input
            type="text"
            id="type"
            value={type}
            onChange={(e) => setType(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="readingResource">Reading Resource:</label>
          <textarea
            id="readingResource"
            value={readingResource}
            onChange={(e) => setReadingResource(e.target.value)}
            rows="3"
          />
        </div>
        <div className="form-group">
          <label htmlFor="level">Level:</label>
          <input
            type="text"
            id="level"
            value={level}
            onChange={(e) => setLevel(e.target.value)}
            required
          />
        </div>
        <div className="form-group mandatory-group">
          <label htmlFor="mandatory">Mandatory:</label>
          <input
            type="checkbox"
            id="mandatory"
            checked={mandatory}
            onChange={(e) => setMandatory(e.target.checked)}
          />
        </div>
        <button className="submit-button" type="submit">
          Add Skill
        </button>
      </form>
      {statusMessage && <p className="status-message">{statusMessage}</p>}
    </div>
  );
};

export default AddSkillToRoadmap;
