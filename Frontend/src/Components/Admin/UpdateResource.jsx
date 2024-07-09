// import React, { useState } from 'react';
// import { httpPut } from '../../axios/axiosUtils';

// const UpdateResource = () => {
//     const [skillId, setSkillId] = useState('');
//     const [jobId, setJobId] = useState('');
//     const [readingResource, setReadingResource] = useState([]);
//     const [videoResource, setVideoResource] = useState([]);
//     const [statusMessage, setStatusMessage] = useState('');
//     const session = JSON.parse(localStorage.getItem("session"));

//     const handleReadingResourceChange = (e) => {
//         setReadingResource(e.target.value.split('\n'));
//     };

//     const handleVideoResourceChange = (e) => {
//         setVideoResource(e.target.value.split('\n'));
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         try {
//             // const response = await httpPut('Roadmap/Update', {
//             //     reading_resource: readingResource,
//             //     video_resource: videoResource,
//             // }, {
//             //     params: { Skillid: skillId }
//             // });

//             const response = await httpPut(`Roadmap/Update?Skillid=${skillId}&JobId=${jobId}`,
//             {
//                     reading_resource: readingResource[0],
//                     video_resource: videoResource[0],
//                 }, {
//                 headers: { token: session.token },
//               });

//             setStatusMessage('Resource updated successfully.');
            
//         } catch (error) {
//             setStatusMessage(`Error: ${error.response?.data?.message || error.message}`);
//         }
//     };

//     return (
//         <div>
//             <h2>Update Resource</h2>
//             <form onSubmit={handleSubmit}>
//                 <div>
//                     <label htmlFor="skillId">Skill ID:</label>
//                     <input
//                         type="text"
//                         id="skillId"
//                         value={skillId}
//                         onChange={(e) => setSkillId(e.target.value)}
//                         required
//                     />
//                 </div>
//                 <div>
//                     <label htmlFor="readingResource">Reading Resources (separate by new lines):</label>
//                     <textarea
//                         id="readingResource"
//                         value={readingResource.join('\n')}
//                         onChange={handleReadingResourceChange}
//                         rows="5"
//                         required
//                     />
//                 </div>
//                 <div>
//                     <label htmlFor="videoResource">Video Resources (separate by new lines):</label>
//                     <textarea
//                         id="videoResource"
//                         value={videoResource.join('\n')}
//                         onChange={handleVideoResourceChange}
//                         rows="5"
//                         required
//                     />
//                 </div>
//                 <button type="submit">Update Resource</button>
//             </form>
//             {statusMessage && <p>{statusMessage}</p>}
//         </div>
//     );
// };

// export default UpdateResource;


// import React, { useState } from 'react';
// import { httpPut } from '../../axios/axiosUtils';

// const UpdateResource = () => {
//     const [skillId, setSkillId] = useState('');
//     const [jobId, setJobId] = useState('');  // New state for JobId
//     const [readingResource, setReadingResource] = useState([]);
//     const [videoResource, setVideoResource] = useState([]);
//     const [statusMessage, setStatusMessage] = useState('');
//     const session = JSON.parse(localStorage.getItem("session"));

//     const handleReadingResourceChange = (e) => {
//         setReadingResource(e.target.value.split('\n'));
//     };

//     const handleVideoResourceChange = (e) => {
//         setVideoResource(e.target.value.split('\n'));
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         try {
//             const response = await httpPut(
//                 `Roadmap/Update?Skillid=${skillId}&JobId=${jobId}`,  // Include JobId in the query parameters
//                 {
//                     reading_resource: readingResource[0],
//                     video_resource: videoResource[0],
//                 }, 
//                 {
//                     headers: { token: session.token },
//                 }
//             );

//             setStatusMessage('Resource updated successfully.');
//         } catch (error) {
//             setStatusMessage(`Error: ${error.response?.data?.message || error.message}`);
//         }
//     };

//     return (
//         <div>
//             <h2>Update Resource</h2>
//             <form onSubmit={handleSubmit}>
//                 <div>
//                     <label htmlFor="skillId">Skill ID:</label>
//                     <input
//                         type="text"
//                         id="skillId"
//                         value={skillId}
//                         onChange={(e) => setSkillId(e.target.value)}
//                         required
//                     />
//                 </div>
//                 <div>
//                     <label htmlFor="jobId">Job ID:</label> {/* New input field for Job ID */}
//                     <input
//                         type="text"
//                         id="jobId"
//                         value={jobId}
//                         onChange={(e) => setJobId(e.target.value)}
//                         required
//                     />
//                 </div>
//                 <div>
//                     <label htmlFor="readingResource">Reading Resources (separate by new lines):</label>
//                     <textarea
//                         id="readingResource"
//                         value={readingResource.join('\n')}
//                         onChange={handleReadingResourceChange}
//                         rows="5"
//                         required
//                     />
//                 </div>
//                 <div>
//                     <label htmlFor="videoResource">Video Resources (separate by new lines):</label>
//                     <textarea
//                         id="videoResource"
//                         value={videoResource.join('\n')}
//                         onChange={handleVideoResourceChange}
//                         rows="5"
//                         required
//                     />
//                 </div>
//                 <button type="submit">Update Resource</button>
//             </form>
//             {statusMessage && <p>{statusMessage}</p>}
//         </div>
//     );
// };

// export default UpdateResource;



import React, { useState } from 'react';
import { httpPut } from '../../axios/axiosUtils';
import "../../Styles/UpdateResource.css";

const UpdateResource = () => {
    const [skillId, setSkillId] = useState('');
    const [jobIds, setJobIds] = useState('');  // Updated to jobIds
    const [readingResource, setReadingResource] = useState([]);
    const [videoResource, setVideoResource] = useState([]);
    const [statusMessage, setStatusMessage] = useState('');
    const session = JSON.parse(sessionStorage.getItem("session"));

    const handleReadingResourceChange = (e) => {
        setReadingResource(e.target.value.split('\n'));
    };

    const handleVideoResourceChange = (e) => {
        setVideoResource(e.target.value.split('\n'));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await httpPut(
                `Roadmap/Update?Skillid=${skillId}&JobIds=${jobIds}`,  // Updated to JobIds
                {
                    reading_resource: readingResource[0],
                    video_resource: videoResource[0],
                }, 
                {
                    headers: { token: session.token },
                }
            );

            setStatusMessage('Resource updated successfully.');
        } catch (error) {
            setStatusMessage(`Error: ${error.response?.data?.message || error.message}`);
        }
    };

    return (
        <div className='update-resource-page'>
            <h2 className='update-resource-title'>Update Resource</h2>
            <form className='update-resource-form' onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="skillId">Skill ID:</label>
                    <input
                        type="text"
                        id="skillId"
                        value={skillId}
                        onChange={(e) => setSkillId(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="jobIds">Job IDs:</label> {/* Updated to Job IDs */}
                    <input
                        type="text"
                        id="jobIds"
                        value={jobIds}
                        onChange={(e) => setJobIds(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="readingResource">Reading Resources (separate by new lines):</label>
                    <textarea
                        id="readingResource"
                        value={readingResource.join('\n')}
                        onChange={handleReadingResourceChange}
                        rows="5"
                        required
                    />
                </div>
                <div>
                    <label htmlFor="videoResource">Video Resources (separate by new lines):</label>
                    <textarea
                        id="videoResource"
                        value={videoResource.join('\n')}
                        onChange={handleVideoResourceChange}
                        rows="5"
                        required
                    />
                </div>
                <button type="submit">Update Resource</button>
            </form>
            {statusMessage && <p>{statusMessage}</p>}
        </div>
    );
};

export default UpdateResource;
