import React, { useState, useEffect } from "react";
import { httpGet, httpPatch } from "../../axios/axiosUtils";
import "./../../Styles/ApprovedCourses.css";

const ApproveCourse = () => {
    const [unapprovedCourses, setUnapprovedCourses] = useState([]);
    const [statusMessage, setStatusMessage] = useState('');
    const session = JSON.parse(sessionStorage.getItem("session"));
    console.log(session)

  useEffect(() => {
    const fetchUnapprovedCourses = async () => {
      try {
        const response = await httpGet("Course/GetALLUnapprovedCourses", {
          headers: { token: session.token },
        });
        if (response.courses) {
          setUnapprovedCourses(response.courses);
        } else {
          setStatusMessage("Unexpected response format.");
        }
      } catch (error) {
        setStatusMessage(
          `Error fetching unapproved courses: ${
            error.response?.data?.message || error.message
          }`
        );
      }
    };

    fetchUnapprovedCourses();
  }, [session.token]);

  const handleApproveCourse = async (courseId) => {
    try {
      const response = await httpPatch(
        `/Course/ApproveCourse?CourseId=${courseId}`,
        null,
        {
          headers: { token: session.token },
        }
      );
      setStatusMessage(`Course ${courseId} approved successfully.`);
      setUnapprovedCourses(
        unapprovedCourses.filter((course) => course.CourseId !== courseId)
      );
    } catch (error) {
      setStatusMessage(
        `Error: ${error.response?.data?.message || error.message}`
      );
    }
  };

  return (
    <div className="container">
      <h2>Approve Course</h2>
      {statusMessage && <p className="statusMessage"></p>}
      {unapprovedCourses.length === 0 ? (
        <p>No unapproved courses available.</p>
      ) : (
        <ul>
          {unapprovedCourses.map((course) => (
            <li key={course.CourseId}>
              <h3>{course.CourseName}</h3>
              <p>
                <strong>Course ID:</strong> {course.CourseId}
              </p>
              <p>
                <strong>Description:</strong> {course.CourseDescription}
              </p>
              <p>
                <strong>Prerequisites:</strong> {course.prerequisites}
              </p>
              <p>
                <strong>Course Link:</strong>{" "}
                <a
                  href={course.Courselink}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {course.Courselink}
                </a>
              </p>
              <p>
                <strong>Language:</strong> {course.language}
              </p>
              <p>
                <strong>Duration:</strong> {course.Duration}
              </p>
              <button onClick={() => handleApproveCourse(course.CourseId)}>
                Approve Course
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ApproveCourse;
