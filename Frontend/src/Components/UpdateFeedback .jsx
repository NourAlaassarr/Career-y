import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { httpPatch } from '../axios/axiosUtils';

const UpdateFeedback = () => {
    const location = useLocation();
    const feedback = location.state?.feedback;
    const [updatedFeedback, setUpdatedFeedback] = useState(feedback);
    const [loading, setLoading] = useState(false);
    const [statusMessage, setStatusMessage] = useState('');
    const session = JSON.parse(sessionStorage.getItem("session"));

    useEffect(() => {
        setUpdatedFeedback(feedback);
    }, [feedback]);

    const handleUpdateFeedback = async (e) => {
        e.preventDefault();
        setLoading(true);
        setStatusMessage('');

        try {
            const response = await httpPatch('/User/UpdateFeedBack', { feedback: updatedFeedback }, {
                headers: { 'token': session.token }
            });

            setStatusMessage('Feedback Updated Successfully');
            console.log(response.data);
            
        } catch (err) {
            console.log(err);
            setStatusMessage(err.response?.data?.Message || err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h2>Update Feedback</h2>
            <form onSubmit={handleUpdateFeedback}>
                <div>
                    <label htmlFor="updated-feedback">Updated Feedback:</label>
                    <textarea
                        id="updated-feedback"
                        value={updatedFeedback}
                        onChange={(e) => setUpdatedFeedback(e.target.value)}
                        required
                    ></textarea>
                </div>
                <button type="submit" disabled={loading}>
                    {loading ? 'Updating...' : 'Update Feedback'}
                </button>
            </form>
            {statusMessage && <p>{statusMessage}</p>}
        </div>
    );
};

export default UpdateFeedback;
