
import React, { useState, useEffect } from "react";
import { useParams, Link,useNavigate } from "react-router-dom";
import { httpGet } from "../axios/axiosUtils"; // Ensure the correct import path

const FrameworkSelectionPage = () => {
  const { jobId } = useParams(); // Ensure jobId is correctly retrieved from URL params
  const [frameworks, setFrameworks] = useState([]);
  const navigate = useNavigate();
  
  useEffect(() => {
    const fetchFrameworks = async () => {
      try {
        const session = JSON.parse(sessionStorage.getItem("session")); // Retrieve session from localStorage
        const response = await httpGet(`Quiz/SpecificFramework?jobId=${jobId}`, {
          headers: { 'token': session?.token } // Pass token in headers, ensure session is valid
        });
        console.log("Frameworks fetched:", response); // Debug log

        if (response && response.Skills) {
          setFrameworks(response.Skills);
        } else {
          console.error("Unexpected response structure:", response);
        }
      } catch (error) {
        console.error("Error fetching frameworks:", error);
      }
    };

    fetchFrameworks();
  }, [jobId]); // Ensure useEffect dependency includes jobId


  return (
    <div className="framework-selection-page">
      <h1>Select Framework</h1>
      <div className="frameworks-container">
        {frameworks.map((framework) => (
          <div key={framework.SkillId} className="framework-link">
            {/* Use onClick to fetch quiz for backend frameworks */}
            {framework.name.toLowerCase() === "frontend" || framework.name.toLowerCase() === "backend" ? (
              <Link
                to={`/track/${framework.Nodeid}/framework`}
                className="framework-link"
              >
                <div className="framework-name">{framework.name}</div>
                <div className="framework-description">{framework.description}</div>
              </Link>
            ) : (
              <button
                onClick={() => navigate(`/track/${jobId}/skill/${framework.Nodeid}/assessment`)}
                className="framework-link"
              >
                <div className="framework-name">{framework.name}</div>
                <div className="framework-description">{framework.description}</div>
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default FrameworkSelectionPage;
