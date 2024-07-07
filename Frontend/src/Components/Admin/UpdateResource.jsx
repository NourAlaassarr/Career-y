import React, { useState } from 'react';
import { httpPut } from '../../axios/axiosUtils';

const UpdateResource = () => {
    const [skillId, setSkillId] = useState('');
    const [readingResource, setReadingResource] = useState([]);
    const [videoResource, setVideoResource] = useState([]);
    const [statusMessage, setStatusMessage] = useState('');

    const handleReadingResourceChange = (e) => {
        setReadingResource(e.target.value.split('\n'));
    };

    const handleVideoResourceChange = (e) => {
        setVideoResource(e.target.value.split('\n'));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await httpPut('Roadmap/Update', {
                reading_resource: readingResource,
                video_resource: videoResource,
            }, {
                params: { Skillid: skillId }
            });

            setStatusMessage('Resource updated successfully.');
            
        } catch (error) {
            setStatusMessage(`Error: ${error.response?.data?.message || error.message}`);
        }
    };

    return (
        <div>
            <h2>Update Resource</h2>
            <form onSubmit={handleSubmit}>
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
