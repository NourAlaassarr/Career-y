// import React, { useEffect, useState } from 'react';
// import { httpGet } from "../axios/axiosUtils";

// const JobOffers = () => {
//     const [jobOffers, setJobOffers] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);
//     const session = JSON.parse(sessionStorage.getItem("session"));

//     useEffect(() => {
//         const fetchJobOffers = async () => {
//             try {
//                 const response = await httpGet('/Job/GetAllJobOffers' , {
//                     headers: { 'token': session.token }
//                      });
//                 setJobOffers(response);
//             } catch (err) {
//                 setError(err.response?.data?.message || err.message);
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchJobOffers();
//     }, []);

//     if (loading) return <div>Loading...</div>;
//     if (error) return <div>Error: {error}</div>;

//     return (

//         <div>
//       <h1 >Job Offers</h1>
//       {error ? (
//         <p className="error-message">Error fetching Job Offers: {error}</p>
//       ) : (
//         <div >
//           {jobOffers.length > 0 && (
//             <ul>
//               {jobOffers.map(offer => (
//                 <li key={offer.jobOfferId} >
//                  <p><strong>Company:</strong> {offer.CompanyName}</p>
//                         <p><strong>Description:</strong> {offer.JobDescription}</p>
//                         <p><strong>Requirements:</strong> {offer.JobRequirements}</p>
//                         <p><strong>Salary Range:</strong> {offer.salary_range}</p>
//                         <p><strong>Date Posted:</strong> {offer.date_posted}</p>
//                         <p><strong>Employment Type:</strong> {offer.employment_type}</p>
                  
//                 </li>
//               ))}
//             </ul>
//           )}
//         </div>
//       )}
//       </div>
//     );
// };

// export default JobOffers;


import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { httpGet } from "../axios/axiosUtils";

const JobOffers = () => {
    const [jobOffers, setJobOffers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const session = JSON.parse(sessionStorage.getItem("session"));

    useEffect(() => {
        const fetchJobOffers = async () => {
            try {
                const response = await httpGet('/Job/GetAllJobOffers', {
                    headers: { 'token': session.token }
                });
                setJobOffers(response);
            } catch (err) {
                setError(err.response?.data?.message || err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchJobOffers();
    }, []);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div>
            <h1>Job Offers</h1>
            {jobOffers.length > 0 && (
                <ul>
                    {jobOffers.map(offer => (
                        <li key={offer.jobOfferId}>
                            <Link to={`/job-details/${offer.jobOfferId}`}>
                                <p><strong>Company:</strong> {offer.CompanyName}</p>
                                <p><strong>Description:</strong> {offer.JobDescription}</p>
                                <p><strong>Requirements:</strong> {offer.JobRequirements}</p>
                                <p><strong>Salary Range:</strong> {offer.salary_range}</p>
                                <p><strong>Date Posted:</strong> {offer.date_posted}</p>
                                <p><strong>Employment Type:</strong> {offer.employment_type}</p>
                            </Link>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default JobOffers;
