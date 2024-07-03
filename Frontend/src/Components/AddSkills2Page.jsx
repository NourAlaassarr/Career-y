import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { httpGet, httpPost } from "../axios/axiosUtils";
import "../Styles/AddSkills2Page.css";

const AddSkills2Page = () => {
  const session = JSON.parse(localStorage.getItem("session"));
  const [searchTerm, setSearchTerm] = useState("");
  const [skills, setSkills] = useState([]);
  const [existingSkills, setExistingSkills] = useState([]);
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newSkills, setNewSkills] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate(); // Initialize the useNavigate hook

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        // Fetch all skills available
        const allSkillsResponse = await httpGet("/Roadmap/AllSkills", {
          headers: { 'token': session.token }
        });
        if (allSkillsResponse && allSkillsResponse.Skills) {
          setSkills(allSkillsResponse.Skills);
        } else {
          console.error("Unexpected response structure:", allSkillsResponse);
          setError("Failed to fetch skills. Please try again later.");
        }

        // Fetch user's already added skills
        const userSkillsResponse = await httpGet("/User/GetAllSklls", {
          headers: { 'token': session.token }
        });
        if (userSkillsResponse && userSkillsResponse.skills) {
          const userSkillIds = userSkillsResponse.skills.map(skill => skill.Nodeid);
          setExistingSkills(userSkillIds);
        } else {
          console.error("Unexpected response structure:", userSkillsResponse);
          setError("Failed to fetch user skills. Please try again later.");
        }
      } catch (error) {
        console.error("Error fetching skills:", error);
        setError("Failed to fetch skills. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    setLoading(true);
    fetchSkills();
  }, []);

  const filteredSkills = skills.filter((skill) =>
    skill.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    !existingSkills.includes(skill.Nodeid)
  );

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSkillChange = (e) => {
    const skillNodeid = e.target.value;
    if (selectedSkills.includes(skillNodeid)) {
      setSelectedSkills(selectedSkills.filter((skill) => skill !== skillNodeid));
    } else {
      setSelectedSkills([...selectedSkills, skillNodeid]);
    }
    setNewSkills(true);
  };

  const handleSubmit = async () => {
    if (selectedSkills.length === 0) {
      alert("Please select at least one skill.");
      return;
    }
    setLoading(true);
    try {
      const response = await httpPost("/User/AddSkills", {
        Skills: selectedSkills,
      }, { headers: { 'token': session.token } });

      console.log("Submit response:", response);

      alert("Skills submitted successfully!");

      // Clear selected skills
      setSelectedSkills([]);
      setNewSkills(false);
      // Navigate to CareerGoalPage
      navigate('/career-goal'); // Adjust the path as per your route setup
    } catch (error) {
      console.error("Error submitting skills:", error.message);
      setError(`Failed to submit skills: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="add-skills2-page">
      <input
        type="text"
        placeholder="Search for skills..."
        value={searchTerm}
        onChange={handleSearchChange}
        className="search-bar"
      />
      <div className="header-sentence">Choose the skills you want to add</div>
      <div className="skills-container">
        <div className="skills-list">
          {filteredSkills.map((skill, index) => (
            <label key={index} className="skill-item">
              <input
                type="checkbox"
                value={skill.Nodeid}
                checked={selectedSkills.includes(skill.Nodeid)}
                onChange={handleSkillChange}
              />
              {skill.name}
            </label>
          ))}
        </div>
        <div className="existing-skills-list">
          <h3>Existing Skills:</h3>
          <ul>
            {existingSkills.map((skillId, index) => (
              <li key={index}>{skills.find(skill => skill.Nodeid === skillId)?.name}</li>
            ))}
          </ul>
        </div>
        <div className="selected-skills-list">
          {selectedSkills.length > 0 && (
            <div>
              <h3>Selected Skills:</h3>
              <ul>
                {selectedSkills.map((skillId, index) => (
                  <li key={index}>{skills.find(skill => skill.Nodeid === skillId)?.name}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
      {newSkills && <button
        className="submit-button"
        disabled={selectedSkills.length === 0}
        onClick={handleSubmit}
      >
        Submit
      </button>}
    </div>
  );
};

export default AddSkills2Page;
