import { session } from "neo4j-driver";
import { Neo4jConnection } from "../../../DB/Neo4j/Neo4j.js";

//add quiz 
export const AddQuizNode = async (req, res, next) => {
    let session;
    const QuizId = uuidv4();
        const { QuizName } = req.body;
        const driver = await Neo4jConnection();
        session = driver.session();

        // Check if the quiz already exists
        const result = await session.run(
            "MATCH (q:Quiz {QuizName: $quizname}) RETURN q",
            { quizname: QuizName }
        );

        if (result.records.length > 0) {
            return next(new Error("Quiz already exists", { cause: 400 }));
        }

        // Create a new quiz node in Neo4j
        const NewQuiz = await session.run(
            "CREATE (q:Quiz {QuizName: $QuizName,_id:$QuizId}) RETURN q",
            { QuizName,QuizId }
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

//Get Roadmaps
export const GetRoadmap = async (req, res, next) => {
    const { TrackName } = req.body;
    const driver = await Neo4jConnection();
    let session = driver.session();

    // Check if track exists
    const TrackCheckResult = await session.run(
        'MATCH (job:Job) WHERE trim(toLower(job.name)) = trim(toLower($name)) RETURN job',
        { name: TrackName }
    );

    if (TrackCheckResult.records.length === 0) {
        return next(new Error("Track Doesn't exist", { cause: 404 }));
    }
    const JobContainsOtherJobsResult = await session.run(
        'MATCH (job:Job)-[:Has_Job]->(nestedJob:Job)-[:Has_Component]->(component:Component)-[:Includes]->(skill:Skill) WHERE trim(toLower(job.name)) = trim(toLower($name)) RETURN job, COLLECT(DISTINCT nestedJob) AS nestedJobs',
        { name: TrackName }
    );
    
    const nestedJobNodes = JobContainsOtherJobsResult.records[0]?.get('nestedJobs')?.map(nestedJob => nestedJob.properties);
    
    if (nestedJobNodes && nestedJobNodes.length > 0) {
        // Extract data from the result
        const jobNode = JobContainsOtherJobsResult.records[0]?.get('job')?.properties;
    
        // Extract skills and components for each nested job
        const nestedJobDetails = await Promise.all(nestedJobNodes.map(async nestedJob => {
            const nestedJobName = nestedJob.name;
    

            const nestedSession = driver.session();
    
            // Extract components for the nested job
            const nestedJobComponents = await nestedSession.run(
                'MATCH (nestedJob:Job)-[:Has_Component]->(component:Component)-[:Includes]->(skill:Skill) WHERE trim(toLower(nestedJob.name)) = trim(toLower($nestedJobName)) RETURN component, skill',
                { nestedJobName }
            );
    
            
            const componentsMap = {};
    
            // Process the nested job components and skills
            nestedJobComponents.records.forEach(record => {
                const component = record.get('component')?.properties;
                const skill = record.get('skill')?.properties;
    
                // Check if the component already exists in the map
                if (componentsMap[component.name]) {
                    // Add the new skill to this component array
                    componentsMap[component.name].skills.push({
                        name: skill.name,
                        resources: skill.resources
                    });
                } else {
                    
                    componentsMap[component.name] = {
                        name: component.name,
                        skills: [{
                            name: skill.name,
                            resources: skill.resources
                        }]
                    };
                }
            });
    
            
            nestedSession.close();
    
            return {
                name: nestedJobName,
                components: Object.values(componentsMap)
            };
        }));
    
    
        const response = {
            Message: 'Track exists',
            Job: jobNode,
            ContainsJobs: nestedJobDetails
        };
    
        
        res.status(200).json(response);
    }
    else{
    const Roadmaps = await session.run(
        'MATCH (job:Job)-[:Has_Component]->(component:Component)-[:Includes]->(skill:Skill) WHERE trim(toLower(job.name)) = trim(toLower($name)) RETURN job, component, skill',
        { name: TrackName }
    );

    
    const jobNode = Roadmaps.records[0].get('job').properties;


    const componentsMap = {};


    Roadmaps.records.forEach(record => {
        const component = record.get('component').properties;
        const skill = record.get('skill').properties;

    
        if (componentsMap[component.name]) {
            // Add the new skill to array
            componentsMap[component.name].skills.push(skill);
        } else {
            
            componentsMap[component.name] = { ...component, skills: [skill] };
        }
    });

    // Convert the components map to an array format
    const componentNodes = Object.values(componentsMap);

    
    const response = {
        Message: 'Track exists',
        Job: jobNode,
        Components: componentNodes
    };

    res.status(200).json(response);
}
};

//CareerGuidance=>assessment=>acording to grade=>job=>course
//Get AllTrackquizzes
//Get AllTracks
//gettrackquiz
//select specific track=>roadmap
//AddJobs
//Addcourses

