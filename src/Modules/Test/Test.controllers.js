import { session } from "neo4j-driver";
import { Neo4jConnection } from "../../../DB/Neo4j/Neo4j.js";
import { sendmailService } from '../../Services/SendEmailService.js'
import { emailTemplate } from '../../utils/EmailTemplate.js'
import { GetRoadmap } from '../Roadmaps/Roadmap.Controller.js'
//add quiz 
export const AddQuizNode = async (req, res, next) => {
    let session;
    const QuizId = uuidv4();
    const { QuizName } = req.body;
    const driver = await Neo4jConnection();
    session = driver.session();

    // Check if the quiz already exists
    const result = await session.run(
        "MATCH (q:TrackQuiz {QuizName: $quizname}) RETURN q",
        { quizname: QuizName }
    );

    if (result.records.length > 0) {
        return next(new Error("Quiz already exists", { cause: 400 }));
    }

    // Create a new quiz node in Neo4j
    const NewQuiz = await session.run(
        "CREATE (q:TrackQuiz {QuizName: $QuizName,Nodeid:$QuizId}) RETURN q",
        { QuizName, QuizId }
    );
    const NewQuizNode = NewQuiz.records[0].get("q").properties;

    res.status(200).json({ Message: 'Created Successfully', Quiz: NewQuizNode });
    if (session) {
        await session.close();
    }

};

//Add Questions
export const AddQuestionsToNode = async (req, res, next) => {
    let session;
    let tx;


    const { QuizName, Questions } = req.body;
    const driver = await Neo4jConnection();
    session = driver.session();
    tx = session.beginTransaction();

    const QuizResult = await tx.run(
        "MATCH (q:Quiz {QuizName: $quizname}) RETURN q",
        { quizname: QuizName }
    );

    if (QuizResult.records.length === 0) {
        return next(new Error("Quiz Doesn't exist", { cause: 404 }));
    }
    const quizResult = await tx.run(
        "MATCH (q:Quiz {QuizName: $QuizName})-[:CONTAINS]->(question:Question) RETURN q, COLLECT(question) AS questions",
        { QuizName }
    );
    const existingQuestions = quizResult.records[0]?.get('questions');

    if (quizResult.records[0]?.get('questions')) {
        return res.status(400).json({ Message: "Quiz already contains questions." });
    }

    if (!Array.isArray(Questions) || Questions.length === 0) {
        return res.status(400).json({ Message: "Questions array is required and cannot be empty." });
    }

    const addedQuestions = await Promise.all(Questions.map(async (question, index) => {
        const { questionText, answer, options, Level } = question;
        const questionId = uuidv4();
        const result = await tx.run(
            'MATCH (q:Quiz {QuizName: $QuizName}) ' +
            'CREATE (q)-[:CONTAINS {order: $order}]->(question:Question {_id: $questionId, questionText: $questionText, options: $options, answer: $answer, Level: $Level}) RETURN question',
            { QuizName, questionId, questionText, answer, options: Array.isArray(options) ? options : [options], Level, order: index + 1 }
        );
        return result.records[0].get('question').properties;
    }));


    await tx.commit();

    res.status(200).json({ Message: 'Created Successfully', questions: addedQuestions });

    if (session) {
        await session.close();
    }
}

// DeleteNodeQuizByname
export const DeleteNode = async (req, res, next) => {
    const { QuizName } = req.body;
    let session;

    try {
        const driver = await Neo4jConnection();
        session = driver.session();

        // Execute a READ query to check if the node with the specified QuizName exists
        const readResult = await session.run("MATCH (n:Quiz {QuizName: $QuizName}) RETURN n", { QuizName });

        if (readResult.records.length === 0) {
            return res.status(404).json({ success: false, message: 'Node not found' });
        }

        // Execute the DELETE query
        await session.run("MATCH (n:Quiz {QuizName: $QuizName}) DETACH DELETE n", { QuizName });

        // Respond with success message or appropriate response
        res.status(200).json({ success: true, message: 'Node deleted successfully' });
    } catch (error) {
        // Handle errors
        next(error);
    } finally {
        // Close the session
        if (session) {
            await session.close();
        }
    }
};


//Update ResourcesAdmin + Send Notification for the Updation
export const UpdateResource = async (req, res, next) => {
    const { Skillid } = req.query;
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
    
    const RoadMapLink = `${req.protocol}://${req.headers.host}/Test/UpdatedSkill/${Skillid}`;
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



export const AddId = async (req, res, next) => {
    const { name } = req.body;
    const driver = await Neo4jConnection();
    let session = driver.session();

    try {
        // Check if the node already has the Nodeid property
        const checkResult = await session.run(
            'MATCH (n {name: $name}) WHERE n.Nodeid IS NOT NULL RETURN n',
            { name: name }
        );

        // If the property already exists, return early
        if (checkResult.records.length > 0) {
            return res.status(200).json({ Message: "Node already has the Nodeid property" });
        }

        // Add the unique ID property
        const result = await session.run(
            'MATCH (n {name: $name}) SET n.Nodeid = apoc.create.uuid() RETURN n',
            { name: name }
        );

        res.status(200).json({ Message: "Success" });
    } catch (error) {
        return next(error);
    } finally {
        await session.close();
    }
};


//CareerGuidance=>assessment=>acording to grade=>job=>course

//AddJobs
//Addcourses

