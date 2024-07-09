import { Neo4jConnection } from "../../../DB/Neo4j/Neo4j.js";
import axios from "axios";
import { v4 as uuidv4 } from 'uuid';
import {emailTemplate}from'../../utils/EmailTemplate.js'

import {sendmailService}from'../../Services/SendEmailService.js'
//Get Roadmap of Specific Track ID
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
        console.log(JobContainsOtherJobsResult.records)
        let skills = [];

        if (JobContainsOtherJobsResult.records.length > 0) {
           // Process each connected otherJob node
        for (const record of JobContainsOtherJobsResult.records) {
            const otherJobNode = record.get('otherJob');

            // Query to get skills associated with the current otherJob and their mandatory status
            const skillsResult = await session.run(
                'MATCH (otherJob:Job {Nodeid: $otherJobId})-[:REQUIRES]->(skill:Skill) ' +
                'MATCH (otherJob)-[r:REQUIRES]->(skill) ' +
                'RETURN skill, r.mandatory AS mandatory',
                { otherJobId: otherJobNode.properties.Nodeid }
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
                job: otherJobNode.properties.name,
                skills: jobSkills
            });
        }
    }
        else {
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
        res.json({
          Message: "Success",
          roadmapSkills: skills,
          roadmapDetails: {
            name: TrackCheckResult.records[0].get("job").properties.name,
            description:
              TrackCheckResult.records[0].get("job").properties.description,
          },
        });
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
        await session.close();
        res.status(200).json({ Message: 'Success', Skills: skills });
        
    
};


//get all skills in daatabase
export const GetAllSkills= async(req,res,next)=>{
    let session;
    const driver = await Neo4jConnection();
    session = driver.session();

    const result = await session.run(`
        MATCH (skill:Skill) RETURN skill
    `);
    
    const skills = result.records.map(record => record.get('skill').properties);
    
    res.status(200).json({ Message: 'Skills', Skills: skills });
}

//Update ResourcesAdmin + Send Notification for the Updation (Only Admins can do this)
export const UpdateResource = async (req, res, next) => {
    const { Skillid } = req.query;
    const { JobIds } = req.query;
    const { reading_resource, video_resource } = req.body
    const driver = await Neo4jConnection();
    let session = driver.session();
    // Check if Skill exists
    const SkillCheckResult = await session.run(
        'MATCH (s:Skill {Nodeid:$Skillid}) RETURN s',
        { Skillid }
    );
    if (SkillCheckResult.records.length === 0) {
        return next(new Error("Skill Doesn't exist", { cause: 404 }));
    }

    // Ensure resources are arrays and convert them to strings with new lines
    const readingResourceString = Array.isArray(reading_resource) ? reading_resource.join('\n') : reading_resource;
    const videoResourceString = Array.isArray(video_resource) ? video_resource.join('\n') : video_resource;

    // Update the reading_resource and video_resource properties
    const updateQuery = `
     MATCH (s:Skill {Nodeid: $Skillid})
     SET s.reading_resource = coalesce(s.reading_resource, '') + '\n' + $readingResourceString,
         s.video_resource = coalesce(s.video_resource, '') + '\n' + $videoResourceString
     RETURN s
 `;
    const updateResult = await session.run(updateQuery, {
        Skillid,
        readingResourceString,
        videoResourceString
    });
    const timestampQuery = `
            MATCH (j:Job)-[:REQUIRES]->(s:Skill {Nodeid: $Skillid})
            SET j.date_modified = apoc.date.format(timestamp(), 'ms', 'yyyy-MM-dd HH:mm:ss')
            WITH j
            OPTIONAL MATCH (Job)-[:REQUIRES]->(j)
            SET Job.date_modified = apoc.date.format(timestamp(), 'ms', 'yyyy-MM-dd HH:mm:ss')
            RETURN j, Job
        `;
    const timestampResult = await session.run(timestampQuery, { Skillid });


    //Send Email to users that have this skill/Roadmap // Query users whose CareerGoal property matches JobId or any parent JobId
    const usersQuery = `
    MATCH (j:Job {Nodeid: $JobId})
    OPTIONAL MATCH (j)-[:REQUIRES*]->(parentJob:Job)
    WITH COLLECT(j.Nodeid) + COLLECT(parentJob.Nodeid) AS jobIds
    MATCH (u:User)
    WHERE ANY(goal IN u.CareerGoal WHERE goal IN jobIds)
    RETURN DISTINCT u.Email AS email
`;
    const JobId = timestampResult.records[0].get('j').properties.Nodeid; // Assuming JobId is a property of the Job node
    const usersResult = await session.run(usersQuery, { JobId });

    // Collect all email addresses
    const emails = usersResult.records.map(record => record.get('email'));
    
    const RoadMapLink = `${req.headers.origin}/roadmaps/${JobIds}/skill/${Skillid}`;
    if (emails.length > 0) {
        for (let i = 0; i < emails.length; i++) {
        
        // Send email to the group of users
        const subject = 'Update on CareerGoal Skill';
        const message = emailTemplate({
            link: RoadMapLink,  // Adjust the link as needed
            linkData: "Skill Updation",
            subject: "There has been an update to the resources related to your career goal Roadmap."
        });

        const isEmailSent = await sendmailService({
            to: emails[i],
            subject: subject,
            message: message
        });

        if (!isEmailSent) {
            return next(new Error("Failed to Send Email", { cause: 400 }));
        }
    }
    }

    // Return the updated Skill node
    const updatedSkill = updateResult.records[0].get('s').properties;
    res.status(200).json(updatedSkill);
}

// export const UpdateResource = async (req, res, next) => {
//     const { Skillid } = req.query;
//     const { reading_resource, video_resource } = req.body
//     const driver = await Neo4jConnection();
//     let session = driver.session();
//     // Check if Skill exists
//     const SkillCheckResult = await session.run(
//         'MATCH (s:Skill {Nodeid:$Skillid}) RETURN s',
//         { Skillid }
//     );
//     if (SkillCheckResult.records.length === 0) {
//         return next(new Error("Skill Doesn't exist", { cause: 404 }));
//     }

//     // Ensure resources are arrays and convert them to strings with new lines
//     const readingResourceString = Array.isArray(reading_resource) ? reading_resource.join('\n') : reading_resource;
//     const videoResourceString = Array.isArray(video_resource) ? video_resource.join('\n') : video_resource;

//     // Update the reading_resource and video_resource properties
//     const updateQuery = `
//      MATCH (s:Skill {Nodeid: $Skillid})
//      SET s.reading_resource = coalesce(s.reading_resource, '') + '\n' + $readingResourceString,
//          s.video_resource = coalesce(s.video_resource, '') + '\n' + $videoResourceString
//      RETURN s
//  `;
//     const updateResult = await session.run(updateQuery, {
//         Skillid,
//         readingResourceString,
//         videoResourceString
//     });
//     const timestampQuery = `
//             MATCH (j:Job)-[:REQUIRES]->(s:Skill {Nodeid: $Skillid})
//             SET j.date_modified = apoc.date.format(timestamp(), 'ms', 'yyyy-MM-dd HH:mm:ss')
//             WITH j
//             OPTIONAL MATCH (Job)-[:REQUIRES]->(j)
//             SET Job.date_modified = apoc.date.format(timestamp(), 'ms', 'yyyy-MM-dd HH:mm:ss')
//             RETURN j, Job
//         `;
//     const timestampResult = await session.run(timestampQuery, { Skillid });


//     //Send Email to users that have this skill/Roadmap // Query users whose CareerGoal property matches JobId or any parent JobId
//     const usersQuery = `
//     MATCH (j:Job {Nodeid: $JobId})
//     OPTIONAL MATCH (j)-[:REQUIRES*]->(parentJob:Job)
//     WITH COLLECT(j.Nodeid) + COLLECT(parentJob.Nodeid) AS jobIds
//     MATCH (u:User)
//     WHERE ANY(goal IN u.CareerGoal WHERE goal IN jobIds)
//     RETURN DISTINCT u.Email AS email
// `;
//     const JobId = timestampResult.records[0].get('j').properties.Nodeid; // Assuming JobId is a property of the Job node
//     const usersResult = await session.run(usersQuery, { JobId });

//     // Collect all email addresses
//     const emails = usersResult.records.map(record => record.get('email'));
    
//     const RoadMapLink = `${req.protocol}://${req.headers.host}/Roadmap/UpdatedSkill/${Skillid}`;
//     if (emails.length > 0) {
//         for (let i = 0; i < emails.length; i++) {
        
//         // Send email to the group of users
//         const subject = 'Update on CareerGoal Skill';
//         const message = emailTemplate({
//             link: RoadMapLink,  // Adjust the link as needed
//             linkData: "Skill Updation",
//             subject: "There has been an update to the resources related to your career goal Roadmap."
//         });

//         const isEmailSent = await sendmailService({
//             to: emails[i],
//             subject: subject,
//             message: message
//         });

//         if (!isEmailSent) {
//             return next(new Error("Failed to Send Email", { cause: 400 }));
//         }
//     }
//     }

//     // Return the updated Skill node
//     const updatedSkill = updateResult.records[0].get('s').properties;
//     res.status(200).json(updatedSkill);
// }

//GetUpdatedSkill
export const GetUpdatedSkill= async (req, res, next) => {
    const {Skillid} = req.params;
    console.log(Skillid);
    const driver = await Neo4jConnection();
    let session = driver.session();
    const SkillCheckResult = await session.run(
        'MATCH (s:Skill {Nodeid: $Skillid}) RETURN s',
        { Skillid }
    );
    
    if (SkillCheckResult.records.length === 0) {
        return res.status(404).json({ error: "Skill doesn't exist" });
    }

    const skill = SkillCheckResult.records[0].get('s').properties;

    res.json({ Message: 'Success', Skill: skill });

}

//GetUpdatedRoadMap
export const GetUpdatedRoadMap= async (req, res, next) => {
    const {JobId} = req.params;
    console.log(JobId);
    const driver = await Neo4jConnection();
    let session = driver.session();
    const TrackCheckResult = await session.run(
        'MATCH (job:Job {Nodeid: $JobId}) RETURN job',
        { JobId }
    );

    if (TrackCheckResult.records.length === 0) {
        return next(new Error("Track Doesn't exist", { cause: 404 }));
    }

    // Query to get other jobs connected to the track
    const JobContainsOtherJobsResult = await session.run(
        'MATCH (job:Job)-[:REQUIRES]->(otherJob:Job) WHERE job.Nodeid = $JobId RETURN otherJob',
        { JobId }
    );

    let skills = [];

    if (JobContainsOtherJobsResult.records.length > 0) {
        // If there are other jobs connected to the track, get their names
        const otherJobNames = JobContainsOtherJobsResult.records.map(record => record.get('otherJob').properties.name);
        
        // Query to get skills associated with the other jobs
        for (const otherJobName of otherJobNames) {
            const skillsResult = await session.run(
                'MATCH (job:Job {Nodeid: $JobId})-[:REQUIRES]->(skill:Skill) ' +
                'OPTIONAL MATCH (job)-[r:REQUIRES]->(skill) ' +
                'RETURN skill, COALESCE(r.mandatory, false) AS mandatory',
                { JobId }
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
            'MATCH (job:Job {Nodeid: $JobId})-[:REQUIRES]->(skill:Skill) ' +
            'OPTIONAL MATCH (job)-[r:REQUIRES]->(skill) ' +
            'RETURN skill, COALESCE(r.mandatory, false) AS mandatory',
            { JobId }
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
}


//Add Node to Roadmap (Admin Only)
export const AddSkillToRoadmap = async (req, res, next) => {
    const { name,video_resource,type,reading_resource,level,mandatory} = req.body;
    const { TrackId } = req.query;
    const Nodeid=uuidv4()
    let session;
    const driver = await Neo4jConnection();
    session = driver.session();

    // Check if track exists
    const TrackCheckResult = await session.run(`MATCH (job:Job {Nodeid: $TrackId}) RETURN job`, { TrackId });
    if (TrackCheckResult.records.length === 0) {
        return next(new Error("Track Doesn't exist", { cause: 404 }));
    }
      // Create new node
    const createNodeResult = await session.run(
        'CREATE (s:Skill {name: $name, Nodeid: $Nodeid, video_resource: $video_resource, type: $type, reading_resource: $reading_resource, level: $level}) RETURN s',
        { name, Nodeid, video_resource, type, reading_resource, level }
    );

    // Create relationship with mandatory property
    const createRelationshipResult = await session.run(
        'MATCH (t:Job {Nodeid: $TrackId}), (s:Skill {Nodeid: $Nodeid}) ' +
        'CREATE (t)-[:REQUIRES {mandatory: $mandatory}]->(s)',
        { TrackId, Nodeid, mandatory }
    );

    session.close();
    res.status(201).send({ message: 'Node and relationship created successfully' });
}

//DeleteNode (only admins)
export const DeleteSkillFromRoadmap = async (req, res, next) => {
    const { Nodeid } = req.query;
    const driver = await Neo4jConnection();
    const session = driver.session();
    const result = await session.run(
        'MATCH (s:Skill {Nodeid: $Nodeid}) DETACH DELETE s',
        { Nodeid }
    );
    res.send({ message: 'Node deleted successfully' });
}


//Create new Roadmap TOBE Implemented (Admins Only)



