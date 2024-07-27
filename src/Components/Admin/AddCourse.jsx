import React, { useState } from "react";
import { httpPost } from "../../axios/axiosUtils";
import "./../../Styles/AddCourse.css"; // Import the CSS file

const AddCourse = () => {
    const [jobId, setJobId] = useState('');
    const [message, setMessage] = useState('');
    const [success, setSuccess] = useState(false);
    const [courseName, setCourseName] = useState('');
    const [courseDescription, setCourseDescription] = useState('');
    const [duration, setDuration] = useState('');
    const [prerequisites, setPrerequisites] = useState('');
    const [language, setLanguage] = useState('');
    const [courseLink, setCourseLink] = useState('');
    const session = JSON.parse(sessionStorage.getItem("session"));

    

  const handleError = (error) => {
    if (error.response) {
      setMessage("Error: " + (error.response.data.message || error.message));
    } else if (error.request) {
      setMessage("Error: No response from server.");
    } else {
      setMessage("Error: " + error.message);
    }
  };

  const handleAddCourse = async (e) => {
    e.preventDefault();
    setMessage("");
    setSuccess(false);

    try {
      const response = await httpPost(
        `Course/AddCourse?JobId=${jobId}`,
        {
          CourseName: courseName,
          CourseDescription: courseDescription,
          Duration: duration,
          prerequisites: prerequisites,
          language: language,
          Courselink: courseLink,
        },
        { headers: { token: session.token } }
      );
      const { message } = response;
      setMessage(message);
      setSuccess(true);
      // Optionally, reset form fields after successful submission
      setCourseName("");
      setCourseDescription("");
      setDuration("");
      setPrerequisites("");
      setLanguage("");
      setCourseLink("");
    } catch (error) {
      handleError(error);
    }
  };

  return (
    <div className="add-course-page">
      <h1 className="add-course-title">Add Course</h1>
      <form className="add-course-form" onSubmit={handleAddCourse}>
        <div className="form-group">
          <label>Job ID:</label>
          <input
            type="text"
            value={jobId}
            onChange={(e) => setJobId(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Course Name:</label>
          <input
            type="text"
            value={courseName}
            onChange={(e) => setCourseName(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Course Description:</label>
          <input
            type="text"
            value={courseDescription}
            onChange={(e) => setCourseDescription(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Duration:</label>
          <input
            type="text"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Prerequisites:</label>
          <input
            type="text"
            value={prerequisites}
            onChange={(e) => setPrerequisites(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Language:</label>
          <input
            type="text"
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Course Link:</label>
          <input
            type="text"
            value={courseLink}
            onChange={(e) => setCourseLink(e.target.value)}
            required
          />
        </div>
        <button className="submit-button" type="submit">
          Add Course
        </button>
      </form>
      {message && (
        <div className={`message ${success ? "success" : "error"}`}>
          {message}
        </div>
      )}
    </div>
  );
};

export default AddCourse;
