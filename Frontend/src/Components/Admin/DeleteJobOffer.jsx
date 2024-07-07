import React, { useState } from 'react';
import { httpDelete } from "../../axios/axiosUtils";

const DeleteJobOffer = () => {
    const [jobOfferId, setJobOfferId] = useState('');
    const [statusMessage, setStatusMessage] = useState('');
    const session = JSON.parse(localStorage.getItem("session"));

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {   
         const response = await httpDelete(`Job/DeleteJobOffer?JobOfferId=${jobOfferId}`, {
          headers: { 'token': session.token }
        });

            
         setStatusMessage('Job offer deleted successfully.');
            
        } catch (error) {
            setStatusMessage(`Error: ${error.response?.data?.message || error.message}`);
        }
    };

    return (
        <div>
            <h2>Delete Job Offer</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="jobOfferId">Job Offer ID:</label>
                    <input
                        type="text"
                        id="jobOfferId"
                        value={jobOfferId}
                        onChange={(e) => setJobOfferId(e.target.value)}
                        required
                    />
                </div>
                <button type="submit">Delete Job Offer</button>
            </form>
            {statusMessage && <p>{statusMessage}</p>}
        </div>
    );
};

export default DeleteJobOffer;
