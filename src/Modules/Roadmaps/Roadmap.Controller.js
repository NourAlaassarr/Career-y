import { Neo4jConnection } from "../../../DB/Neo4j/Neo4j.js";





////Get Roadmap of Specific Track by name
// export const GetRoadmap = async (req, res, next) => {
//     const { TrackName } = req.body;
//     let session;
//     const driver = await Neo4jConnection();
//     session = driver.session(); 
//         // Check if track exists
//         const TrackCheckResult = await session.run(
//             'MATCH (job:Job) WHERE trim(toLower(job.name)) = trim(toLower($name)) RETURN job',
//             { name: TrackName }
//         );

//         if (TrackCheckResult.records.length === 0) {
//             return next(new Error("Track Doesn't exist", { cause: 404 }));
//         }

//         // Query to get other jobs connected to the track
//         const JobContainsOtherJobsResult = await session.run(
//             'MATCH (job:Job)-[:REQUIRES]->(otherJob:Job) WHERE job.name = $name RETURN otherJob',
//             { name: TrackName }
//         );

//         let skills = [];

//         if (JobContainsOtherJobsResult.records.length > 0) {
//             // If there are other jobs connected to the track, get their names
//             const otherJobNames = JobContainsOtherJobsResult.records.map(record => record.get('otherJob').properties.name);
            
//             // Query to get skills associated with the other jobs
//             for (const otherJobName of otherJobNames) {
//                 const skillsResult = await session.run(
//                     'MATCH (job:Job {name: $name})-[:REQUIRES]->(skill:Skill) ' +
//                     'OPTIONAL MATCH (job)-[r:REQUIRES]->(skill) ' +
//                     'RETURN skill, COALESCE(r.mandatory, false) AS mandatory',
//                     { name: otherJobName }
//                 );
            
//                 const jobSkills = skillsResult.records.map(record => {
//                     const skillNode = record.get('skill');
//                     return {
//                         name: skillNode.properties.name,
//                         properties: skillNode.properties,
//                         mandatory: record.get('mandatory')
//                     };
//                 });
            
//                 skills.push({
//                     job: otherJobName,
//                     skills: jobSkills
//                 });
//             }
//         } else {
//             // If there are no other jobs connected to the track, get the skills of the track itself
//             const RoadMap = await session.run(
//                 'MATCH (job:Job {name: $name})-[:REQUIRES]->(skill:Skill) ' +
//                 'OPTIONAL MATCH (job)-[r:REQUIRES]->(skill) ' +
//                 'RETURN skill, COALESCE(r.mandatory, false) AS mandatory',
//                 { name: TrackName }
//             );
            
//             skills = RoadMap.records.map(record => {
//                 const skillNode = record.get('skill');
//                 return {
//                     name: skillNode.properties.name,
//                     properties: skillNode.properties,
//                     mandatory: record.get('mandatory')
//                 };
//             });
//         }
//         res.json({ Message: 'Success', RoadMap: skills });
//         session.close();
    
// };
//Get Roadmap of Specific Track id
export const GetRoadmap = async (req, res, next) => {
    const { TrackId } = req.query;
    let session;
    const driver = await Neo4jConnection();
    session = driver.session(); 
        // Check if track exists
        const TrackCheckResult = await session.run(
            'MATCH (job:Job {Nodeid: $TrackId}) RETURN job',
            { TrackId }
        );

        if (TrackCheckResult.records.length === 0) {
            return next(new Error("Track Doesn't exist", { cause: 404 }));
        }

        // Query to get other jobs connected to the track
        const JobContainsOtherJobsResult = await session.run(
            'MATCH (job:Job)-[:REQUIRES]->(otherJob:Job) WHERE job.Nodeid = $TrackId RETURN otherJob',
            { TrackId }
        );

        let skills = [];

        if (JobContainsOtherJobsResult.records.length > 0) {
            // If there are other jobs connected to the track, get their names
            const otherJobNames = JobContainsOtherJobsResult.records.map(record => record.get('otherJob').properties.name);
            
            // Query to get skills associated with the other jobs
            for (const otherJobName of otherJobNames) {
                const skillsResult = await session.run(
                    'MATCH (job:Job {Nodeid: $TrackId})-[:REQUIRES]->(skill:Skill) ' +
                    'OPTIONAL MATCH (job)-[r:REQUIRES]->(skill) ' +
                    'RETURN skill, COALESCE(r.mandatory, false) AS mandatory',
                    { TrackId }
                );
            
                const jobSkills = skillsResult.records.map(record => {
                    const skillNode = record.get('skill');
                    return {
                        name: skillNode.properties.name,
                        properties: skillNode.properties,
                        mandatory: record.get('mandatory')
                    };
                });
            
                skills.push({
                    job: otherJobName,
                    skills: jobSkills
                });
            }
        } else {
            // If there are no other jobs connected to the track, get the skills of the track itself
            const RoadMap = await session.run(
                'MATCH (job:Job {Nodeid: $TrackId})-[:REQUIRES]->(skill:Skill) ' +
                'OPTIONAL MATCH (job)-[r:REQUIRES]->(skill) ' +
                'RETURN skill, COALESCE(r.mandatory, false) AS mandatory',
                { TrackId }
            );
            
            skills = RoadMap.records.map(record => {
                const skillNode = record.get('skill');
                return {
                    name: skillNode.properties.name,
                    properties: skillNode.properties,
                    mandatory: record.get('mandatory')
                };
            });
        }
        res.json({ Message: 'Success', RoadMap: skills });
        session.close();
};

//Get AllTracks
export const GetAllTracks= async(req,res,next)=>{
    let session;
    const driver = await Neo4jConnection();
    session = driver.session(); 

        const result = await session.run(
            'MATCH (job:Job) RETURN job'
        );

        const jobs = result.records.map(record => record.get('job').properties);
        res.json({ Message: 'Tracks', Jobs: jobs });
        session.close();
}

//getLearningResourcesSkill
export const GetSkillResources = async (req, res, next) => {
    const { SkillId } = req.query;
    const driver = await Neo4jConnection();
    let session = driver.session();

        const result = await session.run(
            'MATCH (skill:Skill {Nodeid: $SkillId}) RETURN skill',
            { SkillId }
        );
        // console.log(result.records.map(record => record.get('skill').properties))
        const skills = result.records.map(record => record.get('skill').properties);
        res.json({ Message: 'Success', Skills: skills });
        session.close();
    
};

//UpdateRoadmap TOBE IMPLEMENTED
