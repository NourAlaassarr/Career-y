import React, { useState } from 'react';
import { httpPut } from "../../axios/axiosUtils";

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
            const response = await httpPut(`Course/UpdateCourse?CourseId=${courseId}`,
            {
                Courselink: courseLink,
                 CourseName: courseName,
                 CourseDescription: courseDescription,
                 Duration: duration,
                 prerequisites: prerequisites,
                 language: language
                },{
                headers: { 'token': session.token }
              });

            
                setStatusMessage('Course updated successfully.');
            
        } catch (error) {
            setStatusMessage(`Error: ${error.response?.data?.message || error.message}`);
        }
    };

    return (
        <div>
            <h2>Update Course</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="courseId">Course ID:</label>
                    <input
                        type="text"
                        id="courseId"
                        value={courseId}
                        onChange={(e) => setCourseId(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="courseLink">Course Link:</label>
                    <input
                        type="text"
                        id="courseLink"
                        value={courseLink}
                        onChange={(e) => setCourseLink(e.target.value)}
                    />
                </div>
                <div>
                    <label htmlFor="courseName">Course Name:</label>
                    <input
                        type="text"
                        id="courseName"
                        value={courseName}
                        onChange={(e) => setCourseName(e.target.value)}
                    />
                </div>
                <div>
                    <label htmlFor="courseDescription">Course Description:</label>
                    <textarea
                        id="courseDescription"
                        value={courseDescription}
                        onChange={(e) => setCourseDescription(e.target.value)}
                    ></textarea>
                </div>
                <div>
                    <label htmlFor="duration">Duration:</label>
                    <input
                        type="text"
                        id="duration"
                        value={duration}
                        onChange={(e) => setDuration(e.target.value)}
                    />
                </div>
                <div>
                    <label htmlFor="prerequisites">Prerequisites:</label>
                    <input
                        type="text"
                        id="prerequisites"
                        value={prerequisites}
                        onChange={(e) => setPrerequisites(e.target.value)}
                    />
                </div>
                <div>
                    <label htmlFor="language">Language:</label>
                    <input
                        type="text"
                        id="language"
                        value={language}
                        onChange={(e) => setLanguage(e.target.value)}
                    />
                </div>
                <button type="submit">Update Course</button>
            </form>
            {statusMessage && <p>{statusMessage}</p>}
        </div>
    );
};

export default UpdateCourse;
