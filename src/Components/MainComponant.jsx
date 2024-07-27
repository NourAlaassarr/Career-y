///this is a mock to the roadmap page

// import React, { useState } from "react";
// import Modal from "./Modal";
// import "./../styles/Modal.css"; // Assuming you have a CSS file for styles

// const MainComponent = () => {
//   const [showModal, setShowModal] = useState(false);
//   const [modalLinks, setModalLinks] = useState([]);
//   const [modalTitle, setModalTitle] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");

//   const fetchCourseLinks = async (type) => {
//     setLoading(true);
//     setError("");
//     setShowModal(true);
//     try {
//       const response = await fetch(`http://localhost:3001/api/courses/${type}`);
//       if (!response.ok) {
//         throw new Error("Failed to fetch data");
//       }
//       const data = await response.json();
//       setModalLinks(data);
//       setModalTitle(`${type.toUpperCase()} Courses`);
//     } catch (error) {
//       setError("Error fetching course links");
//       console.error("Error fetching course links:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleButtonClick = (type) => {
//     console.log(`Button clicked: ${type}`);
//     fetchCourseLinks(type);
//   };

//   return (
//     <div className="main-component">
//       <button onClick={() => handleButtonClick("html")}>HTML</button>
//       <button onClick={() => handleButtonClick("css")}>CSS</button>
//       {/* Add more buttons as needed */}
//       <Modal
//         show={showModal}
//         onClose={() => setShowModal(false)}
//         links={modalLinks}
//         title={modalTitle}
//         loading={loading}
//         error={error}
//       />
//     </div>
//   );
// };

// export default MainComponent;

import React, { useState } from "react";
import Modal from "./Modal";
import "./../styles/Modal.css"; // Ensure this is imported

const MainComponent = () => {
  const [showModal, setShowModal] = useState(false);
  const [modalLinks, setModalLinks] = useState([]);
  const [modalTitle, setModalTitle] = useState("");

  const courses = {
    html: [
      { text: "HTML Course 1", url: "https://example.com/html1" },
      { text: "HTML Course 2", url: "https://example.com/html2" },
      { text: "HTML Course 3", url: "https://example.com/html3" },
    ],
    css: [
      { text: "CSS Course 1", url: "https://example.com/css1" },
      { text: "CSS Course 2", url: "https://example.com/css2" },
      { text: "CSS Course 3", url: "https://example.com/css3" },
    ],
    // Add more courses here
  };

  const handleButtonClick = (courseType) => {
    setModalLinks(courses[courseType]);
    setModalTitle(`${courseType.toUpperCase()} Courses`);
    setShowModal(true);
  };

  return (
    <div>
      <button onClick={() => handleButtonClick("html")}>HTML</button>
      <button onClick={() => handleButtonClick("css")}>CSS</button>
      {/* Add more buttons for other courses */}

      <Modal
        show={showModal}
        onClose={() => setShowModal(false)}
        links={modalLinks}
        title={modalTitle}
      />
    </div>
  );
};

export default MainComponent;
