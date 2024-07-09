import React, { useState } from "react";
import { httpPost } from "../../axios/axiosUtils";
import "./../../Styles/AddJobOffer.css"; // Import the CSS file

const AddJobOffer = () => {
    const [jobId, setJobId] = useState('');
    const [companyName, setCompanyName] = useState('');
    const [jobDescription, setJobDescription] = useState('');
    const [jobRequirements, setJobRequirements] = useState('');
    const [salaryRange, setSalaryRange] = useState('');
    const [datePosted, setDatePosted] = useState('');
    const [employmentType, setEmploymentType] = useState('');
    const [title, setTitle] = useState('');
    const [statusMessage, setStatusMessage] = useState('');
    const session = JSON.parse(sessionStorage.getItem("session"));

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await httpPost(
        `Job/AddJob?JobId=${jobId}`,
        {
          CompanyName: companyName,
          JobDescription: jobDescription,
          JobRequirements: jobRequirements,
          salary_range: salaryRange,
          date_posted: datePosted,
          employment_type: employmentType,
          title: title,
        },
        {
          headers: { token: session.token },
        }
      );

      setStatusMessage("Job offer created successfully.");
    } catch (error) {
      setStatusMessage(
        `Error: ${error.response?.data?.message || error.message}`
      );
    }
  };

  return (
    <div className="add-job-offer-page">
      <h2 className="add-job-offer-title">Add Job Offer</h2>
      <form className="add-job-offer-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="jobId">Job ID:</label>
          <input
            type="text"
            id="jobId"
            value={jobId}
            onChange={(e) => setJobId(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="title">Title:</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="companyName">Company Name:</label>
          <input
            type="text"
            id="companyName"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="jobDescription">Job Description:</label>
          <textarea
            id="jobDescription"
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            rows="5"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="jobRequirements">Job Requirements:</label>
          <textarea
            id="jobRequirements"
            value={jobRequirements}
            onChange={(e) => setJobRequirements(e.target.value)}
            rows="5"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="salaryRange">Salary Range:</label>
          <input
            type="text"
            id="salaryRange"
            value={salaryRange}
            onChange={(e) => setSalaryRange(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="datePosted">Date Posted:</label>
          <input
            type="date"
            id="datePosted"
            value={datePosted}
            onChange={(e) => setDatePosted(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="employmentType">Employment Type:</label>
          <input
            type="text"
            id="employmentType"
            value={employmentType}
            onChange={(e) => setEmploymentType(e.target.value)}
            required
          />
        </div>
        <button className="submit-button" type="submit">
          Add Job Offer
        </button>
      </form>
      {statusMessage && <p className="status-message">{statusMessage}</p>}
    </div>
  );
};

export default AddJobOffer;
