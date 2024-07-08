import React, { useState } from "react";
import { httpPut } from "../../axios/axiosUtils";
import "./../../Styles/UpdateResource.css"; // Import the CSS file

const UpdateResource = () => {
  const [skillId, setSkillId] = useState("");
  const [readingResource, setReadingResource] = useState([]);
  const [videoResource, setVideoResource] = useState([]);
  const [statusMessage, setStatusMessage] = useState("");

  const handleReadingResourceChange = (e) => {
    setReadingResource(e.target.value.split("\n"));
  };

  const handleVideoResourceChange = (e) => {
    setVideoResource(e.target.value.split("\n"));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await httpPut(
        "/Roadmap/Update",
        {
          reading_resource: readingResource,
          video_resource: videoResource,
        },
        {
          params: { Skillid: skillId },
        }
      );

      setStatusMessage("Resource updated successfully.");
    } catch (error) {
      setStatusMessage(
        `Error: ${error.response?.data?.message || error.message}`
      );
    }
  };

  return (
    <div className="update-resource-page">
      <h2 className="update-resource-title">Update Resource</h2>
      <form className="update-resource-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="skillId">Skill ID:</label>
          <input
            type="text"
            id="skillId"
            value={skillId}
            onChange={(e) => setSkillId(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="readingResource">
            Reading Resources (separate by new lines):
          </label>
          <textarea
            id="readingResource"
            value={readingResource.join("\n")}
            onChange={handleReadingResourceChange}
            rows="5"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="videoResource">
            Video Resources (separate by new lines):
          </label>
          <textarea
            id="videoResource"
            value={videoResource.join("\n")}
            onChange={handleVideoResourceChange}
            rows="5"
            required
          />
        </div>
        <button className="submit-button" type="submit">
          Update Resource
        </button>
      </form>
      {statusMessage && <p className="status-message">{statusMessage}</p>}
    </div>
  );
};

export default UpdateResource;
