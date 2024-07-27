import React, { useEffect, useState } from 'react';
import { httpGet } from '../axios/axiosUtils';
import '../Styles/WhatWeOffer.css'; // Make sure to create and import this CSS file

const WhatWeOffer = () => {
  const [courses, setCourses] = useState([]);
  const [error, setError] = useState(null);
  const session = JSON.parse(sessionStorage.getItem("session"));

  useEffect(() => {
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

    fetchCourses();
  }, []);

  return (
    <div className="what-we-offer">
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
                  <p className="course-description">{course.CourseDescription}</p>
                  <p className="course-prerequisites"><strong>Prerequisites:</strong> {course.prerequisites}</p>
                  <p className="course-duration"><strong>Duration:</strong> {course.Duration}</p>
                  <a href={course.Courselink} target="_blank" rel="noopener noreferrer" className="course-link">Enroll In Course</a>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};

export default WhatWeOffer;
