import React, { useState, useEffect } from "react";
import JobListing from "./JobListing";
import "./../styles/JobList.css";

const JobList = () => {
  const [jobs, setJobs] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    // Replace with your API endpoint or mock data file
    fetch("/Jobs.json")
      .then((response) => response.json())
      .then((data) => setJobs(data))
      .catch((error) => console.error("Error fetching job data:", error));
  }, []);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredJobs = jobs.filter((job) =>
    job.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="job-list-container">
      <input
        type="text"
        placeholder="Search for jobs..."
        value={searchTerm}
        onChange={handleSearch}
        className="search-bar"
      />
      <div className="job-list">
        {filteredJobs.map((job, index) => (
          <JobListing key={index} job={job} />
        ))}
      </div>
    </div>
  );
};

export default JobList;
