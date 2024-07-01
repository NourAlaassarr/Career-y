// import React, { useEffect, useState } from 'react';
// import { useParams } from 'react-router-dom';
// import '../style/TrackCoursePage.css';

// const TrackCoursePage = () => {
//   const { id } = useParams();
//   const [courseData, setCourseData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     // Replace this URL with your actual API endpoint
//     const fetchCourseData = async () => {
//       try {
//         const response = await fetch(`/api/tracks/${id}/courses`);
//         if (!response.ok) {
//           throw new Error('Network response was not ok');
//         }
//         const data = await response.json();
//         setCourseData(data);
//         setLoading(false);
//       } catch (error) {
//         setError(error.message);
//         setLoading(false);
//       }
//     };

//     fetchCourseData();
//   }, [id]);

//   if (loading) return <div>Loading...</div>;
//   if (error) return <div>Error: {error}</div>;

//   return (
//     <div className="track-course-page">
//       <h1>Courses for Track {courseData.trackName}</h1>
//       <div className="courses-container">
//         {courseData.courses.map((course) => (
//           <div key={course.id} className="course-card">
//             <h2>{course.title}</h2>
//             <p>{course.description}</p>
//             <a href={course.link} target="_blank" rel="noopener noreferrer">
//               Go to Course
//             </a>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default TrackCoursePage;

//////////////////////////////////////////////////////////////////////////////////
// import React, { useEffect, useState } from 'react';
// import { useParams } from 'react-router-dom';
// import '../style/TrackCoursePage.css';

// const TrackCoursePage = () => {
//   const { id } = useParams();
//   const [courseData, setCourseData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const fetchCourseData = async () => {
//       try {
//         const response = await fetch(`/api/tracks/${id}/courses`, {
//           headers: {
//             'Content-Type': 'application/json',
//           },
//         });

//         if (!response.ok) {
//           throw new Error(`HTTP error! status: ${response.status}`);
//         }

//         const contentType = response.headers.get('content-type');
//         if (!contentType || !contentType.includes('application/json')) {
//           throw new Error('Response is not JSON');
//         }

//         const data = await response.json();
//         setCourseData(data);
//         setLoading(false);
//       } catch (error) {
//         setError(error.message);
//         setLoading(false);
//       }
//     };

//     fetchCourseData();
//   }, [id]);

//   if (loading) return <div>Loading...</div>;
//   if (error) return <div>Error: {error}</div>;

//   return (
//     <div className="track-course-page">
//       <h1>Courses for Track {courseData.trackName}</h1>
//       <div className="courses-container">
//         {courseData.courses.map((course) => (
//           <div key={course.id} className="course-card">
//             <h2>{course.title}</h2>
//             <p>{course.description}</p>
//             <a href={course.link} target="_blank" rel="noopener noreferrer">
//               Go to Course
//             </a>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default TrackCoursePage;


// TrackCoursePage.jsx

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

