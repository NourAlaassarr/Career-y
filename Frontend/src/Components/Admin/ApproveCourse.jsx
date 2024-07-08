// import React, { useState } from 'react';
// import { httpPatch } from "../../axios/axiosUtils";

// const ApproveCourse = () => {
//     const [courseId, setCourseId] = useState('');
//     const [statusMessage, setStatusMessage] = useState('');
//     const session = JSON.parse(localStorage.getItem("session"));

//     const handleSubmit = async (e) => {
//         e.preventDefault();

//         try { 
//             const response = await httpPatch(`/Course/ApproveCourse?CourseId=${courseId}`,
//             {
//                 headers: { 'token': session.token }
//               });

//              setStatusMessage('Course approved successfully.');
            
//         } catch (error) {
//             setStatusMessage(`Error: ${error.response?.data?.message || error.message}`);
//         }
//     };

//     return (
//         <div>
//             <h2>Approve Course</h2>
//             <form onSubmit={handleSubmit}>
//                 <div>
//                     <label htmlFor="courseId">Course ID:</label>
//                     <input
//                         type="text"
//                         id="courseId"
//                         value={courseId}
//                         onChange={(e) => setCourseId(e.target.value)}
//                         required
//                     />
//                 </div>
//                 <button type="submit">Approve Course</button>
//             </form>
//             {statusMessage && <p>{statusMessage}</p>}
//         </div>
//     );
// };

// export default ApproveCourse;


// import React, { useState, useEffect } from 'react';
// import { httpGet, httpPatch } from "../../axios/axiosUtils";

// const ApproveCourse = () => {
//     const [unapprovedCourses, setUnapprovedCourses] = useState([]);
//     const [selectedCourseId, setSelectedCourseId] = useState('');
//     const [statusMessage, setStatusMessage] = useState('');
//     const session = JSON.parse(localStorage.getItem("session"));

//     useEffect(() => {
//         const fetchUnapprovedCourses = async () => {
//             try {
//                 const response = await httpGet('/Course/GetALLUnapprovedCourses', {
//                     headers: { 'token': session.token }
//                 });
//                 setUnapprovedCourses(response.data.courses);
//             } catch (error) {
//                 setStatusMessage(`Error fetching unapproved courses: ${error.response?.data?.message || error.message}`);
//             }
//         };

//         fetchUnapprovedCourses();
//     }, [session.token]);

//     const handleApproveCourse = async (e) => {
//         e.preventDefault();

//         try { 
//             const response = await httpPatch(`/Course/ApproveCourse?CourseId=${selectedCourseId}`, {
//                 headers: { 'token': session.token }
//             });
//             setStatusMessage('Course approved successfully.');

//             // Remove approved course from the list
//             setUnapprovedCourses(unapprovedCourses.filter(course => course.CourseId !== selectedCourseId));
//             setSelectedCourseId('');
//         } catch (error) {
//             setStatusMessage(`Error: ${error.response?.data?.message || error.message}`);
//         }
//     };

//     return (
//         <div>
//             <h2>Approve Course</h2>
//             {statusMessage && <p>{statusMessage}</p>}
//             <form onSubmit={handleApproveCourse}>
//                 <div>
//                     <label htmlFor="courseId">Course ID:</label>
//                     <select
//                         id="courseId"
//                         value={selectedCourseId}
//                         onChange={(e) => setSelectedCourseId(e.target.value)}
//                         required
//                     >
//                         <option value="">Select a course</option>
//                         {unapprovedCourses.map(course => (
//                             <option key={course.CourseId} value={course.CourseId}>
//                                 {course.CourseId}: {course.name}
//                             </option>
//                         ))}
//                     </select>
//                 </div>
//                 <button type="submit">Approve Course</button>
//             </form>
//         </div>
//     );
// };

// export default ApproveCourse;



import React, { useState, useEffect } from 'react';
import { httpGet, httpPatch } from "../../axios/axiosUtils";

const ApproveCourse = () => {
    const [unapprovedCourses, setUnapprovedCourses] = useState([]);
    const [statusMessage, setStatusMessage] = useState('');
    const session = JSON.parse(localStorage.getItem("session"));
    console.log(session)

    useEffect(() => {
        const fetchUnapprovedCourses = async () => {
            try {
                const response = await httpGet('/Course/GetALLUnapprovedCourses', {
                    headers: { 'token': session.token }
                });
                console.log(response)
                if (response.courses) {
                    setUnapprovedCourses(response.courses);
                } else {
                    setStatusMessage('Unexpected response format.');
                }
            } catch (error) {
                setStatusMessage(`Error fetching unapproved courses: ${error.response?.data?.message || error.message}`);
            }
        };

        fetchUnapprovedCourses();
    }, [session.token]);

    const handleApproveCourse = async (courseId) => {
        try { 
            const response = await httpPatch(`/Course/ApproveCourse?CourseId=${courseId}`,
            null, {
                headers: { 'token': session.token }
            });
            setStatusMessage(`Course ${courseId} approved successfully.`);
            setUnapprovedCourses(unapprovedCourses.filter(course => course.CourseId !== courseId));
        } catch (error) {
            setStatusMessage(`Error: ${error.response?.data?.message || error.message}`);
        }
    };

    return (
        <div>
            <h2>Approve Course</h2>
            {statusMessage && <p>{statusMessage}</p>}
            {unapprovedCourses.length === 0 ? (
                <p>No unapproved courses available.</p>
            ) : (
                <ul>
                    {unapprovedCourses.map(course => (
                        <li key={course.CourseId}>
                            <h3>{course.CourseName}</h3>
                            <p><strong>Course ID:</strong> {course.CourseId}</p>
                            <p><strong>Description:</strong> {course.CourseDescription}</p>
                            <p><strong>Prerequisites:</strong> {course.prerequisites}</p>
                            <p><strong>Course Link:</strong> <a href={course.Courselink} target="_blank" rel="noopener noreferrer">{course.Courselink}</a></p>
                            <p><strong>Language:</strong> {course.language}</p>
                            <p><strong>Duration:</strong> {course.Duration}</p>
                            <button onClick={() => handleApproveCourse(course.CourseId)}>Approve Course</button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default ApproveCourse;
