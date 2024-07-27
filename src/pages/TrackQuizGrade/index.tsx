// //mn 8er el api
import React from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import {
  Accordion,
  AccordionDetails,
  Box,
  Grid,
  Link,
  Typography,
} from "@mui/material";
import "../../Styles/TrackQuizGradePage.css";
import * as S from "./styled";

const TrackQuizGradePage = () => {
  const location = useLocation();
  const { result } = location.state;
  const navigate = useNavigate();
  const {id} = useParams();

  return (
    <div className="track-quiz-grade-page">
      <h1>Quiz Results</h1>
      <p>Grade: {result.grade}</p>
      <p>Status: {result.pass ? "Passed" : "Failed"}</p>
      {result.mandatorySkills && (
        <div>
          <h2>you must learn these Mandatory Skills:</h2>
          {result.mandatorySkills.map((skill) => (
            <Grid item xs={12} key={skill.name} paddingTop={2}>
              <Accordion key={skill.name} defaultExpanded={false}>
                <S.BorderBox>
                  <S.StyledAccordionSummary
                    sx={{
                      flexDirection: "row-reverse",
                      padding: "8px 16px",
                    }}
                    expandIcon={
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M20.1316 17.5117L21.9016 15.7417L12.0016 5.84172L2.10156 15.7417L3.87156 17.5117L12.0016 9.38172L20.1316 17.5117Z"
                          fill="#4E4B66"
                        />
                      </svg>
                    }
                  >
                    <Box padding="8px" />
                    <Typography color="#057a8d" variant="h5">
                      {skill.name}
                    </Typography>
                  </S.StyledAccordionSummary>
                </S.BorderBox>
                <AccordionDetails sx={{ padding: "0px" }}>
                  <S.SkillDetailsGrid container>
                    <S.DetailGrid item md={3} sm={6} xs={6}>
                      <S.KeyTypography>Level</S.KeyTypography>
                    </S.DetailGrid>
                    <S.DetailGrid item md={3} sm={6} xs={6}>
                      <Typography>{skill.level}</Typography>
                    </S.DetailGrid>
                    <S.DetailGrid item md={3} sm={6} xs={6}>
                      <S.KeyTypography>Type</S.KeyTypography>
                    </S.DetailGrid>
                    <S.DetailGrid
                      item
                      md={3}
                      sm={6}
                      xs={6}
                      className="lastItem"
                    >
                      <Typography>{skill.type}</Typography>
                    </S.DetailGrid>
                    <S.DetailGrid
                      item
                      md={12}
                      sm={12}
                      xs={12}
                      className="lastItem"
                      onClick={() =>
                        navigate(`../../roadmaps/${id}/skill/${skill.Nodeid}`)
                      }
                      sx={{
                        cursor: "pointer",
                        "&:hover": { textDecoration: "underline" },
                      }}
                    >
                      <S.KeyTypography padding="8px 0px">
                        Click here for related resources
                      </S.KeyTypography>
                    </S.DetailGrid>
                  </S.SkillDetailsGrid>
                </AccordionDetails>
              </Accordion>
            </Grid>
          ))}
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
          {result.jobs.map((job) => (
            <Grid item xs={12} key={job.jobOfferId} paddingTop={2}>
              <Accordion key={job.jobOfferId} defaultExpanded={false}>
                <S.BorderBox>
                  <S.StyledAccordionSummary
                    sx={{
                      flexDirection: "row-reverse",
                      padding: "8px 16px",
                    }}
                    expandIcon={
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M20.1316 17.5117L21.9016 15.7417L12.0016 5.84172L2.10156 15.7417L3.87156 17.5117L12.0016 9.38172L20.1316 17.5117Z"
                          fill="#4E4B66"
                        />
                      </svg>
                    }
                  >
                    <Box padding="8px" />
                    <Typography color="#057a8d" variant="h5">
                      {job.title}
                    </Typography>
                  </S.StyledAccordionSummary>
                </S.BorderBox>
                <AccordionDetails sx={{ padding: "0px" }}>
                  <S.SkillDetailsGrid container>
                    <S.DetailGrid item md={3} sm={6} xs={6}>
                      <S.KeyTypography>Company Name</S.KeyTypography>
                    </S.DetailGrid>
                    <S.DetailGrid item md={3} sm={6} xs={6}>
                      <Typography>{job.CompanyName}</Typography>
                    </S.DetailGrid>
                    <S.DetailGrid item md={3} sm={6} xs={6}>
                      <S.KeyTypography>Salary Range</S.KeyTypography>
                    </S.DetailGrid>
                    <S.DetailGrid
                      item
                      md={3}
                      sm={6}
                      xs={6}
                      className="lastItem"
                    >
                      <Typography>{job.salary_range}</Typography>
                    </S.DetailGrid>
                    <S.DetailGrid item md={3} sm={6} xs={6}>
                      <S.KeyTypography>Type</S.KeyTypography>
                    </S.DetailGrid>
                    <S.DetailGrid item md={3} sm={6} xs={6}>
                      <Typography>{job.employment_type}</Typography>
                    </S.DetailGrid>
                    <S.DetailGrid item md={3} sm={6} xs={6}>
                      <S.KeyTypography>Date Posted</S.KeyTypography>
                    </S.DetailGrid>
                    <S.DetailGrid
                      item
                      md={3}
                      sm={6}
                      xs={6}
                      className="lastItem"
                    >
                      <Typography>{job.date_posted}</Typography>
                    </S.DetailGrid>
                    <S.DetailGrid item md={3} sm={6} xs={6}>
                      <S.KeyTypography>Description</S.KeyTypography>
                    </S.DetailGrid>
                    <S.DetailGrid
                      item
                      md={9}
                      sm={9}
                      xs={9}
                      className="lastItem"
                    >
                      <Typography padding="8px 0px">
                        {job.JobDescription}
                      </Typography>
                    </S.DetailGrid>
                    <S.DetailGrid item md={3} sm={6} xs={6}>
                      <S.KeyTypography>Job Requirments</S.KeyTypography>
                    </S.DetailGrid>
                    <S.DetailGrid
                      item
                      md={9}
                      sm={9}
                      xs={9}
                      className="lastItem"
                    >
                      <Typography padding="8px 0px">
                        {job.JobRequirements}
                      </Typography>
                    </S.DetailGrid>
                  </S.SkillDetailsGrid>
                </AccordionDetails>
              </Accordion>
            </Grid>
          ))}
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
