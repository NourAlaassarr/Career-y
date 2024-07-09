import React, { useEffect, useState } from 'react';
import { httpGet } from '../axios/axiosUtils';  // Assuming you have a GET utility
import '../Styles/FeedbacksSection.css';  // Import the CSS file

const FeedbacksSection = () => {
    const [feedbacks, setFeedbacks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const session = JSON.parse(sessionStorage.getItem("session"));

    useEffect(() => {
        const fetchFeedbacks = async () => {
            try {
                const response = await httpGet('Admin/GetFeedbacks', {
                    headers: { 'token': session.token }
                });
                setFeedbacks(response);
            } catch (err) {
                setError(err.response?.data?.message || err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchFeedbacks();
    }, [session.token]);

    if (loading) return <div className="loading">Loading...</div>;
    if (error) return <div className="error">Error: {error}</div>;

    return (
        <div className="feedbacks-container">
            <h1>User Feedbacks</h1>
            {feedbacks.length > 0 ? (
                <ul className="feedbacks-list">
                    {feedbacks.map((feedback, index) => (
                        <li key={feedback.FeedbackId}>
                            <p><strong>Feedback {index + 1}:</strong> {feedback.feedback}</p>
                            <p><strong>Date Created:</strong> {feedback.createdAt}</p>
                        </li>
                    ))}
                </ul>
            ) : (
                <p className="no-feedbacks">No feedbacks found.</p>
            )}
        </div>
    );
};

export default FeedbacksSection;
