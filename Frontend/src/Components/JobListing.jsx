import React from "react";
import PropTypes from "prop-types";
import "./../styles/JobListing.css";
import { Link } from "react-router-dom";

const JobListing = ({ job }) => {
  return (
    <div className="job-listing">
      <h2 className="job-title">
        <Link to={`/job/${job.id}`}>{job.title}</Link>
      </h2>
      <p>{job.company}</p>
      <p>{job.location}</p>
      <p>{job.description}</p>
      <button className="apply-button">Apply</button>
    </div>
  );
};

JobListing.propTypes = {
  job: PropTypes.shape({
    id: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    company: PropTypes.string.isRequired,
    location: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
  }).isRequired,
};

export default JobListing;
