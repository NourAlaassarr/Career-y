import React, { useState } from "react";
import { httpDelete } from "../../axios/axiosUtils";
import "./../../Styles/DeleteSkillFromRoadmap.css"; // Import the CSS file

const DeleteSkillFromRoadmap = () => {
  const [nodeid, setNodeid] = useState("");
  const [statusMessage, setStatusMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await httpDelete("/Roadmap/deleteNode", {
        params: { Nodeid: nodeid },
      });

      setStatusMessage("Skill deleted successfully.");
    } catch (error) {
      setStatusMessage(
        `Error: ${error.response?.data?.message || error.message}`
      );
    }
  };

  return (
    <div className="delete-skill-page">
      <h2 className="delete-skill-title">Delete Skill from Roadmap</h2>
      <form className="delete-skill-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="nodeid">Skill Node ID:</label>
          <input
            type="text"
            id="nodeid"
            value={nodeid}
            onChange={(e) => setNodeid(e.target.value)}
            required
          />
        </div>
        <button className="delete-button" type="submit">
          Delete Skill
        </button>
      </form>
      {statusMessage && <p className="status-message">{statusMessage}</p>}
    </div>
  );
};

export default DeleteSkillFromRoadmap;
