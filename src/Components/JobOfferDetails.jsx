// import React, { useEffect, useState } from 'react';
// import { useParams } from 'react-router-dom';
// import { httpGet } from "../axios/axiosUtils";

// const JobOfferDetails = () => {
//     const { jobOfferId } = useParams();
//     const [jobDetails, setJobDetails] = useState(null);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);
//     const session = JSON.parse(sessionStorage.getItem("session"));

//     useEffect(() => {
//         const fetchJobDetails = async () => {
//             try {
//                 const response = await httpGet(`/Job/JobDetails?jobOfferId=${jobOfferId}`, {
//                     headers: { 'token': session.token }
//                 });
//                 setJobDetails(response);
//             } catch (err) {
//                 setError(err.response?.data?.message || err.message);
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchJobDetails();
//     }, [jobOfferId]);

//     if (loading) return <div>Loading...</div>;
//     if (error) return <div>Error: {error}</div>;

//     return (
//         <div>
//             <h2>Job Offer Details</h2>
//             {jobDetails && (
//                 <div>
//                     <p><strong>Title:</strong> {jobDetails.title}</p>
//                     <p><strong>Company:</strong> {jobDetails.CompanyName}</p>
//                     <p><strong>Description:</strong> {jobDetails.JobDescription}</p>
//                     <p><strong>Requirements:</strong> {jobDetails.JobRequirements}</p>
//                     <p><strong>Salary Range:</strong> {jobDetails.salary_range}</p>
//                     <p><strong>Date Posted:</strong> {jobDetails.date_posted}</p>
//                     <p><strong>Employment Type:</strong> {jobDetails.employment_type}</p>
//                 </div>
//             )}

// {/* {jobDetails.length > 0 && (
//                 <ul>
//                     {jobDetails.map(job => (
//                         <li key={job.jobOfferId}>
                           
//                            <p><strong>Title:</strong> {job.title}</p>
//                                 <p><strong>Company:</strong> {job.CompanyName}</p>
//                                 <p><strong>Description:</strong> {job.JobDescription}</p>
//                                 <p><strong>Requirements:</strong> {job.JobRequirements}</p>
//                                 <p><strong>Salary Range:</strong> {job.salary_range}</p>
//                                 <p><strong>Date Posted:</strong> {job.date_posted}</p>
//                                 <p><strong>Employment Type:</strong> {job.employment_type}</p>
                            
//                         </li>
//                     ))}
//                 </ul>
//             )} */}
//         </div>
//     );
// };

// export default JobOfferDetails;


import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { httpGet } from "../axios/axiosUtils";

const JobOfferDetails = () => {
    const { jobOfferId } = useParams();
    const [jobDetails, setJobDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const session = JSON.parse(sessionStorage.getItem("session"));

    useEffect(() => {
        const fetchJobDetails = async () => {
            try {
                const response = await httpGet(`/Job/JobDetails?jobOfferId=${jobOfferId}`, {
                    headers: { 'token': session.token }
                });
                setJobDetails(response.JobData);
            } catch (err) {
                setError(err.response?.data?.message || err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchJobDetails();
    }, [jobOfferId]);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div>
            <h2>Job Offer Details</h2>
            {jobDetails ? (
                <div>
                    <p><strong>Title:</strong> {jobDetails.title}</p>
                    <p><strong>Company:</strong> {jobDetails.CompanyName}</p>
                    <p><strong>Description:</strong> {jobDetails.JobDescription}</p>
                    <p><strong>Requirements:</strong> {jobDetails.JobRequirements}</p>
                    <p><strong>Salary Range:</strong> {jobDetails.salary_range}</p>
                    <p><strong>Date Posted:</strong> {jobDetails.date_posted}</p>
                    <p><strong>Employment Type:</strong> {jobDetails.employment_type}</p>
                </div>
            ) : (
                <p>No job details available</p>
            )}
        </div>
    );
};

export default JobOfferDetails;
