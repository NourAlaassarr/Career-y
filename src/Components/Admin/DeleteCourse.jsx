import React, { useState, useEffect } from 'react';
import { httpGet, httpDelete } from "../../axios/axiosUtils";
//import '../Styles/DeleteCourse.css';

const DeleteCourse = () => {
  const [message, setMessage] = useState('');
  const [success, setSuccess] = useState(false);
  const [courses, setCourses] = useState([]);
  const [error, setError] = useState(null);
  const session = JSON.parse(sessionStorage.getItem("session"));

  const fetchCourses = async () => {
    try {
      const response = await httpGet('Course/GetAllCourses', {
        headers: { 'token': session.token }
      });

      setCourses(response.courses);
    } catch (error) {
      setError(error.message);
      console.error('Error fetching courses:', error);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleError = (error) => {
    if (error.response) {
      setMessage('Error: ' + (error.response.data.message || error.message));
    } else if (error.request) {
      setMessage('Error: No response from server.');
    } else {
      setMessage('Error: ' + error.message);
    }
  };

  const handleDeleteCourse = async (courseId) => {
    try {
      const response = await httpDelete(`Course/DeleteCourse?CourseId=${courseId}`, { headers: { 'token': session.token } });
      console.log('Delete Course Response:', response); // Debugging line to check the delete course response
      const { message, success } = response;
      setMessage(message);
      setSuccess(success);
      
      fetchCourses(); // Refetch courses after successful deletion
    } catch (error) {
      handleError(error);
    }
  };

  return (
    <div>
      <h1 className="title">Our Courses</h1>
      {error ? (
        <p className="error-message">Error fetching courses: {error}</p>
      ) : (
        <div className="courses-list">
          {courses.length > 0 && (
            <ul>
              {courses.map(course => (
                <li key={course.CourseId} className="course-item">
                  <h2 className="course-name">{course.CourseName}</h2>
                  <p className="course-duration"><strong>Duration:</strong> {course.Duration}</p>
                  {/* <p className="course-description">{course.CourseDescription}</p>
                  <p className="course-prerequisites"><strong>Prerequisites:</strong> {course.prerequisites}</p>
                  <p className="course-duration"><strong>Duration:</strong> {course.Duration}</p>
                  <a href={course.Courselink} target="_blank" rel="noopener noreferrer" className="course-link">Enroll In Course</a> */}
                  <button onClick={() => handleDeleteCourse(course.CourseId)}>Delete</button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
      {message && (
        <p className={success ? "success-message" : "error-message"}>{message}</p>
      )}
    </div>
  );
};

export default DeleteCourse;
