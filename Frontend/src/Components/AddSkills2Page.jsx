// import React, { useState, useEffect } from 'react';
// import { httpGet, httpPost } from '../axios/axiosUtils'; // Ensure the correct import path
// import '../style/AddSkills2Page.css';

// const AddSkills2Page = () => {
//   const [searchTerm, setSearchTerm] = useState('');
//   const [skills, setSkills] = useState([]);
//   const [selectedSkills, setSelectedSkills] = useState([]);

//   useEffect(() => {
//     const fetchSkills = async () => {
//       try {
//         const response = await httpGet('/Roadmap/AllSkills');
//         console.log('Skills fetched:', response); // Debug log
//         if (response && response.Skills) {
//           setSkills(response.Skills.map(skill => skill.name)); // Assuming 'name' is the skill property to display
//         } else {
//           console.error('Unexpected response structure:', response);
//         }
//       } catch (error) {
//         console.error('Error fetching skills:', error);
//       }
//     };

//     fetchSkills();
//   }, []);

//   const filteredSkills = skills.filter(skill =>
//     skill.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   const handleSearchChange = (e) => {
//     setSearchTerm(e.target.value);
//   };

//   const handleSkillChange = (e) => {
//     const skillName = e.target.value;
//     if (selectedSkills.includes(skillName)) {
//       setSelectedSkills(selectedSkills.filter(skill => skill !== skillName));
//     } else {
//       setSelectedSkills([...selectedSkills, skillName]);
//     }
//   };

//   const handleSubmit = async () => {
//     try {
//       const response = await httpPost('/User/AddSkills', { skills: selectedSkills });
//       console.log('Submit response:', response); // Debug log
//       alert('Skills submitted successfully!');
//       // Clear selected skills after submission
//       setSelectedSkills([]);
//     } catch (error) {
//       console.error('Error submitting skills:', error);
//       alert('Failed to submit skills.');
//     }
//   };

//   return (
//     <div className="add-skills2-page">
//       <input
//         type="text"
//         placeholder="Search for skills..."
//         value={searchTerm}
//         onChange={handleSearchChange}
//         className="search-bar"
//       />
//       <div className="header-sentence">Choose the skills you want to add</div>
//       <div className="skills-list">
//         {filteredSkills.map((skill, index) => (
//           <label key={index} className="skill-item">
//             <input
//               type="checkbox"
//               value={skill}
//               checked={selectedSkills.includes(skill)}
//               onChange={handleSkillChange}
//             />
//             {skill}
//           </label>
//         ))}
//       </div>
//       <button
//         className="submit-button"
//         disabled={selectedSkills.length === 0}
//         onClick={handleSubmit}
//       >
//         Submit
//       </button>
//     </div>
//   );
// };

// export default AddSkills2Page;
import React, { useState, useEffect } from "react";
import { httpGet, httpPost } from "../axios/axiosUtils"; // Ensure the correct import path
import "../Styles/AddSkills2Page.css";

const AddSkills2Page = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [skills, setSkills] = useState([]);
  const [selectedSkills, setSelectedSkills] = useState([]);

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const response = await httpGet("Roadmap/AllSkills");
        console.log("Skills fetched:", response); // Debug log
        if (response && response.Skills) {
          setSkills(response.Skills.map((skill) => skill.name)); // Assuming 'name' is the skill property to display
        } else {
          console.error("Unexpected response structure:", response);
        }
      } catch (error) {
        console.error("Error fetching skills:", error);
      }
    };

    fetchSkills();
  }, []);

  const filteredSkills = skills.filter((skill) =>
    skill.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSkillChange = (e) => {
    const skillName = e.target.value;
    if (selectedSkills.includes(skillName)) {
      setSelectedSkills(selectedSkills.filter((skill) => skill !== skillName));
    } else {
      setSelectedSkills([...selectedSkills, skillName]);
    }
  };

  const handleSubmit = async () => {
    try {
      const response = await httpPost("User/AddSkills", {
        skills: selectedSkills,
      });
      console.log("Submit response:", response); // Debug log
      alert("Skills submitted successfully!");
      // Clear selected skills after submission
      setSelectedSkills([]);
    } catch (error) {
      console.error("Error submitting skills:", error);
      alert("Failed to submit skills.");
    }
  };

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
      <div className="skills-list">
        {filteredSkills.map((skill, index) => (
          <label key={index} className="skill-item">
            <input
              type="checkbox"
              value={skill}
              checked={selectedSkills.includes(skill)}
              onChange={handleSkillChange}
            />
            {skill}
          </label>
        ))}
      </div>
      <button
        className="submit-button"
        disabled={selectedSkills.length === 0}
        onClick={handleSubmit}
      >
        Submit
      </button>
    </div>
  );
};

export default AddSkills2Page;
