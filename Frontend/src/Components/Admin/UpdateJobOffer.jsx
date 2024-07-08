import React, { useState } from 'react';
import { httpPut } from "../../axios/axiosUtils";

const UpdateJobOffer = () => {
    const [jobOfferId, setJobOfferId] = useState('');
    const [companyName, setCompanyName] = useState('');
    const [jobDescription, setJobDescription] = useState('');
    const [jobRequirements, setJobRequirements] = useState('');
    const [salaryRange, setSalaryRange] = useState('');
    const [datePosted, setDatePosted] = useState('');
    const [employmentType, setEmploymentType] = useState('');
    const [title, setTitle] = useState('');
    const [statusMessage, setStatusMessage] = useState('');
    const session = JSON.parse(sessionStorage.getItem("session"));

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await httpPut(`Job/UpdateJobOffer?JobOfferId=${jobOfferId}`,
            {
                    CompanyName: companyName,
                    JobDescription: jobDescription,
                    JobRequirements: jobRequirements,
                    salary_range: salaryRange,
                    date_posted: datePosted,
                    employment_type: employmentType,
                    title: title
                },{
                headers: { 'token': session.token }
              });

           
                setStatusMessage('Job offer updated successfully.');
            
        } catch (error) {
            setStatusMessage(`Error: ${error.response?.data?.message || error.message}`);
        }
    };

    return (
        <div>
            <h2>Update Job Offer</h2>
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
                <div>
                    <label htmlFor="companyName">Company Name:</label>
                    <input
                        type="text"
                        id="companyName"
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                    />
                </div>
                <div>
                    <label htmlFor="jobDescription">Job Description:</label>
                    <textarea
                        id="jobDescription"
                        value={jobDescription}
                        onChange={(e) => setJobDescription(e.target.value)}
                    ></textarea>
                </div>
                <div>
                    <label htmlFor="jobRequirements">Job Requirements:</label>
                    <textarea
                        id="jobRequirements"
                        value={jobRequirements}
                        onChange={(e) => setJobRequirements(e.target.value)}
                    ></textarea>
                </div>
                <div>
                    <label htmlFor="salaryRange">Salary Range:</label>
                    <input
                        type="text"
                        id="salaryRange"
                        value={salaryRange}
                        onChange={(e) => setSalaryRange(e.target.value)}
                    />
                </div>
                <div>
                    <label htmlFor="datePosted">Date Posted:</label>
                    <input
                        type="date"
                        id="datePosted"
                        value={datePosted}
                        onChange={(e) => setDatePosted(e.target.value)}
                    />
                </div>
                <div>
                    <label htmlFor="employmentType">Employment Type:</label>
                    <input
                        type="text"
                        id="employmentType"
                        value={employmentType}
                        onChange={(e) => setEmploymentType(e.target.value)}
                    />
                </div>
                <div>
                    <label htmlFor="title">Title:</label>
                    <input
                        type="text"
                        id="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                </div>
                <button type="submit">Update Job Offer</button>
            </form>
            {statusMessage && <p>{statusMessage}</p>}
        </div>
    );
};

export default UpdateJobOffer;
