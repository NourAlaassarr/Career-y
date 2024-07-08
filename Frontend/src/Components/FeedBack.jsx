// import React, { useState } from 'react';
// import { httpPost } from '../axios/axiosUtils';

// const FeedBack = () => {
//     const [feedback, setFeedback] = useState('');
//     const [loading, setLoading] = useState(false);
//     const [error, setError] = useState(null);
//     const [statusMessage, setStatusMessage] = useState('');
//     const session = JSON.parse(sessionStorage.getItem("session"));

//     const handleFeedbackSubmit = async (e) => {
//         e.preventDefault();
//         setLoading(true);
//         setError(null);

//         try {
//             const response = await httpPost('/User/AddFeedBack', { feedback }, {
//                 headers: { 'token': session.token }
//             });
//             console.log(response.data);
//             setStatusMessage('Feedback Added Successfully');
            
//             setFeedback('');
//         } catch (err) {
//             console.log(err);
//             setStatusMessage(err.response?.data?.Message || err.message);
//         } finally {
//             setLoading(false);
//         }
//     };

//     return (
//         <div>
//             <h2>Add Feedback</h2>
//             <form onSubmit={handleFeedbackSubmit}>
//                 <div>
//                     <label htmlFor="feedback">Feedback:</label>
//                     <textarea
//                         id="feedback"
//                         value={feedback}
//                         onChange={(e) => setFeedback(e.target.value)}
//                         required
//                     ></textarea>
//                 </div>
//                 <button type="submit" disabled={loading}>
//                     {loading ? 'Submitting...' : 'Submit Feedback'}
//                 </button>
//             </form>
//             {/* {error && <p>Error: {error}</p>} */}
//             {statusMessage && <p>{statusMessage}</p>}
//         </div>
//     );
// };

// export default FeedBack;


import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import { httpPost, httpPatch } from '../axios/axiosUtils';

const FeedBack = () => {
    const location = useLocation();
    const initialFeedback = location.state?.initialFeedback || '';
    const [feedback, setFeedback] = useState(initialFeedback);
    const [loading, setLoading] = useState(false);
    const [statusMessage, setStatusMessage] = useState('');
    const session = JSON.parse(sessionStorage.getItem("session"));
    const navigate = useNavigate();

    useEffect(() => {
        setFeedback(initialFeedback);
    }, [initialFeedback]);

    const handleFeedbackSubmit = async (e, isUpdate) => {
        e.preventDefault();
        setLoading(true);
        setStatusMessage('');

        try {
            const endpoint = isUpdate ? '/User/UpdateFeedBack' : '/User/AddFeedBack';
            const method = isUpdate ? httpPatch : httpPost;
            const response = await method(endpoint, { feedback }, {
                headers: { 'token': session.token }
            });

            setStatusMessage(isUpdate ? 'Feedback Updated Successfully' : 'Feedback Added Successfully');
            console.log(response.data);
            navigate('/');
        } catch (err) {
            console.log(err);
            setStatusMessage(err.response?.data?.Message || err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h2>{initialFeedback ? 'Update Feedback' : 'Add Feedback'}</h2>
            <form onSubmit={(e) => handleFeedbackSubmit(e, !!initialFeedback)}>
                <div>
                    <label htmlFor="feedback">Feedback:</label>
                    <textarea
                        id="feedback"
                        value={feedback}
                        onChange={(e) => setFeedback(e.target.value)}
                        required
                    ></textarea>
                </div>
                <button type="submit" disabled={loading}>
                    {loading ? 'Submitting...' : initialFeedback ? 'Update Feedback' : 'Add Feedback'}
                </button>
            </form>
            {statusMessage && <p>{statusMessage}</p>}
        </div>
    );
};

export default FeedBack;
