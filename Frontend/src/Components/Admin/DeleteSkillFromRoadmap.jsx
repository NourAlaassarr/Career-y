import React, { useState } from 'react';
import { httpDelete } from "../../axios/axiosUtils";

const DeleteSkillFromRoadmap = () => {
    const [nodeid, setNodeid] = useState('');
    const [statusMessage, setStatusMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await httpDelete('Roadmap/deleteNode', {
                params: { Nodeid: nodeid }
            });

            
                setStatusMessage('Skill deleted successfully.');
            
        } catch (error) {
            setStatusMessage(`Error: ${error.response?.data?.message || error.message}`);
        }
    };

    return (
        <div>
            <h2>Delete Skill from Roadmap</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="nodeid">Skill Node ID:</label>
                    <input
                        type="text"
                        id="nodeid"
                        value={nodeid}
                        onChange={(e) => setNodeid(e.target.value)}
                        required
                    />
                </div>
                <button type="submit">Delete Skill</button>
            </form>
            {statusMessage && <p>{statusMessage}</p>}
        </div>
    );
};

export default DeleteSkillFromRoadmap;
