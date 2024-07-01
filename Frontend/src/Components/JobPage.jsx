import React from "react";
import { useLocation } from "react-router-dom";
import "../Styles/JobPage.css";

const JobPage = () => {
  const location = useLocation();
  const track = location.state?.track || "Job Opportunities";

  const dummyJobs = [
    {
      id: 1,
      title: "Frontend Developer at Company A",
      link: "https://companyA.com/jobs/frontend",
    },
    {
      id: 2,
      title: "Backend Developer at Company B",
      link: "https://companyB.com/jobs/backend",
    },
    {
      id: 3,
      title: "Full Stack Developer at Company C",
      link: "https://companyC.com/jobs/fullstack",
    },
    {
      id: 4,
      title: "Data Scientist at Company D",
      link: "https://companyD.com/jobs/datascientist",
    },
    {
      id: 5,
      title: "Cybersecurity Analyst at Company E",
      link: "https://companyE.com/jobs/cybersecurity",
    },
  ];

  return (
    <div className="job-page">
      <h1>Job Opportunities for {track}</h1>
      <ul>
        {dummyJobs.map((job) => (
          <li key={job.id}>
            <a href={job.link} target="_blank" rel="noopener noreferrer">
              {job.title}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default JobPage;
