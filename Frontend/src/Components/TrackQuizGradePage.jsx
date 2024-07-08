// //mn 8er el api
import React from "react";
import { useLocation } from "react-router-dom";
import "../Styles/TrackQuizGradePage.css";

const TrackQuizGradePage = () => {
  const location = useLocation();
  const { result } = location.state;

  return (
    <div className="track-quiz-grade-page">
      <h1>Quiz Results</h1>
      <p>Grade: {result.grade}</p>
      <p>Status: {result.pass ? "Passed" : "Failed"}</p>
      {result.mandatorySkills && (
        <div>
          <h2>you must learn these Mandatory Skills:</h2>
          <ul>
            {result.mandatorySkills.map((skill) => (
              <li key={skill.Nodeid}>
                {skill.name}
                <ul>
                  <li>Video Resource: {skill.video_resource}</li>
                  <li>Level: {skill.level}</li>
                  <li>Type: {skill.type}</li>
                  <li>Reading Resource: {skill.reading_resource}</li>
                </ul>
              </li>
            ))}
          </ul>
        </div>
      )}
      {result.specificSkill && (
        <div>
          <h2>Specific Skill:</h2>
          <p>{result.specificSkill.name}</p>
        </div>
      )}
      {result.jobs && (
        <div>
          <h2>Job Offers:</h2>
          <ul>
            {result.jobs.map((job) => (
              <li key={job.Nodeid}>
                {job.title}
                <ul>
                  <li>
                    <strong>Company Name:</strong> {job.CompanyName}
                  </li>
                  <li>
                    <strong>Employment Type:</strong> {job.employment_type}
                  </li>
                  <li>
                    <strong>Salary Range:</strong> {job.salary_range}
                  </li>
                  {/* <li><strong>Date Posted:</strong> {job.date_posted}</li> */}
                  <li>
                    <strong>Job Description:</strong> {job.JobDescription}
                  </li>
                  <li>
                    <strong>Job Requirements:</strong> {job.JobRequirements}
                  </li>
                </ul>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default TrackQuizGradePage;

//bel api bs m4 byrg3 7aga
// import React, { useEffect, useState } from "react";
// import { useLocation,useParams } from "react-router-dom";
// import { httpGet } from "../axios/axiosUtils";
// import "../Styles/TrackQuizGradePage.css";

// const TrackQuizGradePage = () => {
//   const location = useLocation();
//   const { result } = location.state;
//   const { id, skillId } = useParams();
//   console.log('resulttt',result);
//   console.log('Idd',id)
//           console.log('skillid',skillId)

//   const [mandatorySkills, setMandatorySkills] = useState([]);
//   const [specificSkill, setSpecificSkill] = useState(null);
//   const [jobs, setJobs] = useState([]);
//   const session = JSON.parse(localStorage.getItem("session"));

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         if (result.pass) {

//           console.log('Idd',id)
//           console.log('skillid',skillId)
//           const response =  await httpGet(
//               `Quiz/fetchJobsOffers?jobId='802a5e4c-edf8-476d-a4d4-a76f7c74f476'&SkillId='0b6294fd-87b7-4e10-b873-1151bb7356fe'`,
//               {
//                 headers: { token: session?.token },
//               }
//             )
//           //setJobs(response.data.jobs);
//           console.log('res.jobss',response);
//           setJobs(response.jobs);///////////////////////////////////////
//         } else {
//           const response =  await httpGet(
//             `Quiz/fetchSkillsIfFailed?jobId=${result.jobId}&SkillId=${result.SkillId}`,
//             {
//               headers: { token: session?.token },
//             }
//           )
//           setMandatorySkills(response.data.mandatorySkills);
//           setSpecificSkill(response.data.specificSkill);
//         }
//       } catch (error) {
//         console.error("Error fetching data:", error);
//       }
//     };

//     fetchData();
//   }, [result]);

//   return (
//     <div className="track-quiz-grade-page">
//       <h1>Quiz Results</h1>
//       <p>Grade: {result.grade}</p>
//       <p>Status: {result.pass ? "Passed" : "Failed"}</p>
//       {!result.pass && mandatorySkills.length > 0 && (
//         <div>
//           <h2>You must learn these Mandatory Skills:</h2>
//           <ul>
//             {mandatorySkills.map((skill) => (
//               <li key={skill.Nodeid}>
//                 {skill.name}
//                 <ul>
//                   <li>Video Resource: {skill.video_resource}</li>
//                   <li>Level: {skill.level}</li>
//                   <li>Type: {skill.type}</li>
//                   <li>Reading Resource: {skill.reading_resource}</li>
//                 </ul>
//               </li>
//             ))}
//           </ul>
//         </div>
//       )}
//       {!result.pass && specificSkill && (
//         <div>
//           <h2>Specific Skill:</h2>
//           <p>{specificSkill.name}</p>
//         </div>
//       )}
//       {result.pass && jobs.length > 0 && (
//         <div>
//           <h2>Job Offers:</h2>
//           <ul>
//             {jobs.map((job) => (
//               <li key={job.Nodeid}>
//                 {job.title}
//                 <ul>
//                   <li>
//                     <strong>Company Name:</strong> {job.CompanyName}
//                   </li>
//                   <li>
//                     <strong>Employment Type:</strong> {job.employment_type}
//                   </li>
//                   <li>
//                     <strong>Salary Range:</strong> {job.salary_range}
//                   </li>
//                   {/* <li><strong>Date Posted:</strong> {job.date_posted}</li> */}
//                   <li>
//                     <strong>Job Description:</strong> {job.JobDescription}
//                   </li>
//                   <li>
//                     <strong>Job Requirements:</strong> {job.JobRequirements}
//                   </li>
//                 </ul>
//               </li>
//             ))}
//           </ul>
//         </div>
//       )}
//     </div>
//   );
// };

// export default TrackQuizGradePage;