import React, { useState, useEffect } from 'react';
import { getAllCourses } from '../services/CourseService'; // Update with correct path

const TrackCoursePage = () => {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const fetchedCourses = await getAllCourses();
      setCourses(fetchedCourses);
    } catch (error) {
      console.error('Failed to fetch courses:', error);
      // Handle error state if necessary
    }
  };

  return (
    <div className="track-course-page">
      <h1>Available Courses</h1>
      <ul>
        {courses.map(course => (
          <li key={course.CourseId}>
            <h2>{course.CourseName}</h2>
            <p>{course.CourseDescription}</p>
            <p>Duration: {course.Duration}</p>
            <p>Prerequisites: {course.prerequisites}</p>
            <p>Language: {course.language}</p>
            <a href={course.Courselink} target="_blank" rel="noopener noreferrer">Course Link</a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TrackCoursePage;

