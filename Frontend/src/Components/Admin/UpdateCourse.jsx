import React, { useState } from "react";
import { httpPut } from "../../axios/axiosUtils";
import "./../../Styles/UpdateCourse.css";

const UpdateCourse = () => {
    const [courseId, setCourseId] = useState('');
    const [courseLink, setCourseLink] = useState('');
    const [courseName, setCourseName] = useState('');
    const [courseDescription, setCourseDescription] = useState('');
    const [duration, setDuration] = useState('');
    const [prerequisites, setPrerequisites] = useState('');
    const [language, setLanguage] = useState('');
    const [statusMessage, setStatusMessage] = useState('');
    const session = JSON.parse(sessionStorage.getItem("session"));

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await httpPut(
        `Course/UpdateCourse?CourseId=${courseId}`,
        {
          Courselink: courseLink,
          CourseName: courseName,
          CourseDescription: courseDescription,
          Duration: duration,
          Prerequisites: prerequisites,
          Language: language,
        },
        {
          headers: { token: session.token },
        }
      );

      setStatusMessage("Course updated successfully.");
    } catch (error) {
      setStatusMessage(
        `Error: ${error.response?.data?.message || error.message}`
      );
    }
  };

  return (
    <div className="update-course-page">
      <h2 className="update-course-title">Update Course</h2>
      <form className="update-course-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="courseId">Course ID:</label>
          <input
            type="text"
            id="courseId"
            value={courseId}
            onChange={(e) => setCourseId(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="courseLink">Course Link:</label>
          <input
            type="text"
            id="courseLink"
            value={courseLink}
            onChange={(e) => setCourseLink(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="courseName">Course Name:</label>
          <input
            type="text"
            id="courseName"
            value={courseName}
            onChange={(e) => setCourseName(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="courseDescription">Course Description:</label>
          <textarea
            id="courseDescription"
            value={courseDescription}
            onChange={(e) => setCourseDescription(e.target.value)}
            rows="5"
          ></textarea>
        </div>
        <div className="form-group">
          <label htmlFor="duration">Duration:</label>
          <input
            type="text"
            id="duration"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="prerequisites">Prerequisites:</label>
          <input
            type="text"
            id="prerequisites"
            value={prerequisites}
            onChange={(e) => setPrerequisites(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="language">Language:</label>
          <input
            type="text"
            id="language"
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
          />
        </div>
        <button className="update-button" type="submit">
          Update Course
        </button>
      </form>
      {statusMessage && <p className="status-message">{statusMessage}</p>}
    </div>
  );
};

export default UpdateCourse;
