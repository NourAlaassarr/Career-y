import React, { useState } from "react";
import { httpDelete } from "../../axios/axiosUtils";
import "./../../Styles/DeleteJobOffer.css"; // Import the CSS file

const DeleteJobOffer = () => {
    const [jobOfferId, setJobOfferId] = useState('');
    const [statusMessage, setStatusMessage] = useState('');
    const session = JSON.parse(sessionStorage.getItem("session"));

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await httpDelete(
        `Job/DeleteJobOffer?JobOfferId=${jobOfferId}`,
        {
          headers: { token: session.token },
        }
      );

      setStatusMessage("Job offer deleted successfully.");
    } catch (error) {
      setStatusMessage(
        `Error: ${error.response?.data?.message || error.message}`
      );
    }
  };

  return (
    <div className="delete-job-offer-page">
      <h2 className="delete-job-offer-title">Delete Job Offer</h2>
      <form className="delete-job-offer-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="jobOfferId">Job Offer ID:</label>
          <input
            type="text"
            id="jobOfferId"
            value={jobOfferId}
            onChange={(e) => setJobOfferId(e.target.value)}
            required
          />
        </div>
        <button className="delete-button" type="submit">
          Delete Job Offer
        </button>
      </form>
      {statusMessage && <p className="status-message">{statusMessage}</p>}
    </div>
  );
};

export default DeleteJobOffer;
