import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { httpGet, httpPost } from "../../axios/axiosUtils";
import "../../Styles/AddSkillsPage.css";
import { Chip, styled } from "@mui/material";
import * as S from "./styled";

interface Skill {
  Nodeid: number;
  name: string;
}

interface SkillChipProps {
  skill: Skill;
  selectedSkills: number[];
  handleSkillChange: (nodeId: number) => void;
}

const CustomChip = styled(Chip)(({ theme, selected }: {theme: any, selected?: boolean}) => ({
  backgroundColor: selected ? '#0c8195' : 'primary',
  minHeight: '32px',
  marginRight: theme.spacing(1),
  marginBottom: theme.spacing(1),
  color: selected ? '#f1c111' : '',

  '&:hover': {
    backgroundColor: selected ? '#0c8195' : 'primary',
  },
}));

const AddSkillsPage = () => {
  const session = JSON.parse(sessionStorage.getItem("session"));
  const [searchTerm, setSearchTerm] = useState("");
  const [skills, setSkills] = useState([]);
  const [existingSkills, setExistingSkills] = useState([]);
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newSkills, setNewSkills] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState(""); // State for success message
  const navigate = useNavigate(); // Initialize the useNavigate hook

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        // Fetch all skills available
        const allSkillsResponse = await httpGet("Roadmap/AllSkills", {
          headers: { token: session.token },
        });
        if (allSkillsResponse && allSkillsResponse.Skills) {
          setSkills(allSkillsResponse.Skills);
        } else {
          console.error("Unexpected response structure:", allSkillsResponse);
          setError("Failed to fetch skills. Please try again later.");
        }

        // Fetch user's already added skills
        const userSkillsResponse = await httpGet("User/GetAllSkills", {
          headers: { token: session.token },
        });
        if (userSkillsResponse && userSkillsResponse.skills) {
          const userSkillIds = userSkillsResponse.skills.map(
            (skill) => skill.Nodeid
          );
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

  const filteredSkills = skills.filter(
    (skill) =>
      skill.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !existingSkills.includes(skill.Nodeid)
  );

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSkillChange = (id) => {
    if (selectedSkills.includes(id)) {
      setSelectedSkills(selectedSkills.filter((skill) => skill !== id));
    } else {
      setSelectedSkills([...selectedSkills, id]);
    }
    setNewSkills(true);
  };

  const handleSubmit = async () => {
    setLoading(true);
    setSuccessMessage(""); // Clear success message before new submission
    try {
      const response = await httpPost(
        "User/AddSkills",
        {
          Skills: selectedSkills,
        },
        { headers: { token: session.token } }
      );

      console.log("Submit response:", response);

      setSuccessMessage("Skills submitted successfully!");

      // Clear selected skills
      setSelectedSkills([]);
      setNewSkills(false);
      setExistingSkills([...existingSkills,...selectedSkills]);
      // Navigate to CareerGoalPage after a short delay
      setTimeout(() => {
        navigate("/career-goal"); // Adjust the path as per your route setup
      }, 3000); // 3 seconds delay
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
      <div className="header-sentence">CHOOSE THE SKILLS YOU WANT TO ADD</div>
      {successMessage && (
        <div className="success-message">{successMessage}</div>
      )}
      <div className="skills-container">
        <div className="skills-list">
          {filteredSkills.map((skill, index) => (
            <CustomChip
              key={index}
              label={skill.name}
              onClick={() => handleSkillChange(skill.Nodeid)}
              selected={selectedSkills.includes(skill.Nodeid)}
            />
          ))}
        </div>
        <div className="selected-skills-list">
          {selectedSkills.length > 0 && (
            <div>
              <h3>SELECTED SKILLS:</h3>
              <ul>
                {selectedSkills.map((skillId, index) => (
                  <CustomChip key={index} label={skills.find((skill) => skill.Nodeid === skillId)?.name}/>
                ))}
              </ul>
            </div>
          )}
        </div>
        <div className="existing-skills-list">
          <h3>YOUR SKILLS:</h3>
          <ul>
            {existingSkills.map((skillId, index) => (
              <CustomChip key={index} label={skills.find((skill) => skill.Nodeid === skillId)?.name}/>
            ))}
          </ul>
        </div>
      </div>
      {newSkills && (
        <button
          className="submit-button"
          disabled={selectedSkills.length === 0}
          onClick={handleSubmit}
        >
          Submit
        </button>
      )}
    </div>
  );
};

export default AddSkillsPage;
