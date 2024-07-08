
import {generateToken,VerifyToken}from'../../utils/TokenFunction.js'
import { v4 as uuidv4 } from 'uuid';
import { Neo4jConnection } from "../../../DB/Neo4j/Neo4j.js";
import axios from 'axios';
import { tr } from 'date-fns/locale';
import {convertNeo4jDatetimeToISO,convertNeo4jDateToISO} from "../../utils/ConverNeo4jDateTimes.js";

const quizzes = new Map();
//Add Quiz Neo4j(Admins)
export const AddQuizNode = async (req, res, next) => {
    let session;
        const { JobId } = req.query;
        const { QuizName } = req.body;
        const driver = await Neo4jConnection();
        session = driver.session();

        // // Check if the quiz already exists
        // const result = await session.run(
        //     "MATCH (q:Quiz {id: $quizname}) RETURN q",
        //     { quizname: QuizName }
        // );

        // if (result.records.length > 0) {
        //     return next(new Error("Quiz already exists", { cause: 400 }));
        // }
        const QuizId = uuidv4();
        // Create a new quiz node in Neo4j
        const NewQuiz = await session.run(
            `
            MATCH (j:Job {Nodeid: $JobId})
            CREATE (q:Quiz {Nodeid: $QuizId, name: $QuizName})
            CREATE (j)-[:CORE_QUIZ]->(q)
            RETURN q
            `,
            { JobId, QuizId, QuizName }
        )
    
        const NewQuizNode = NewQuiz.records[0].get("q").properties;

        res.status(200).json({ success: true, message: 'Created Successfully', Quiz: NewQuizNode });
    
};

//Quiz (Admin Only)
export const AddQuestionsToQuiz = async (req, res, next) => {
    let session;
    let tx;
    const { SkillId } = req.query;
    const { Questions } = req.body;
    const driver = await Neo4jConnection();
    session = driver.session();
    tx = session.beginTransaction();
    try {
        let relatedLabel;
        let relatedNode;

        // Check if the SkillId corresponds to a Skill node
        const SkillResult = await tx.run(`
            MATCH (n:Skill {Nodeid: $SkillId})
            RETURN n
        `, { SkillId });

        if (SkillResult.records.length > 0) {
            relatedNode = SkillResult.records[0].get('n');
            relatedLabel = 'Skill';
        }

        // If not found as a Skill, check if it corresponds to a Quiz node
        if (!relatedNode) {
            const QuizResult = await tx.run(`
                MATCH (n:Quiz {Nodeid: $SkillId})
                RETURN n
            `, { SkillId });

            if (QuizResult.records.length > 0) {
                relatedNode = QuizResult.records[0].get('n');
                relatedLabel = 'Quiz';
            }
        }

        if (!relatedNode) {
            await tx.rollback();
            return next(new Error('Quiz or Skill not found', { cause: 404 }));
        }

        if (!Array.isArray(Questions) || Questions.length === 0) {
            await tx.rollback();
            return res.status(400).json({ Message: "Questions array is required and cannot be empty." });
        }

        const addedQuestions = await Promise.all(Questions.map(async (question, index) => {
            const { questionText, answer, options, Level } = question;
            const questionId = uuidv4(); // Generate UUID for each question
            const order = index + 1; // Set the order based on the index

            const optionsWithIds = options.map(optionText => ({
                option_id: uuidv4(),
                option_text: optionText,
                correct: optionText === answer  // Mark correct if option matches answer
            }));

            // Create question node and its relationships in Neo4j
            const result = await tx.run(
                `MATCH (s:${relatedLabel} {Nodeid: $SkillId})
                CREATE (s)-[:HAS_QUESTION]->(question:Question {
                    id: $questionId,
                    questionText: $questionText,
                    answer: $answer,
                    Level: $Level,
                    order: $order
                })
                WITH question
                UNWIND $optionsWithIds AS optionData
                CREATE (question)-[:HAS_OPTION {
                    correct: optionData.correct  // Mark correct if option matches answer
                }]->(option:Option {
                    id: optionData.option_id,
                    optionText: optionData.option_text
                })
                RETURN question`,
                { SkillId, questionId, questionText, Level, answer, optionsWithIds, order }
            );

            return result.records[0].get('question').properties;
        }));

        await tx.commit();
        res.status(200).json({ message: 'Created Successfully', questions: addedQuestions });
    } catch (error) {
        if (tx) await tx.rollback();
        next(error);
    } finally {
        if (session) await session.close();
    }
};


// Get QuizTopicQuiz neo4j
export const GetQuiz = async (req, res, next) => {
    const { SkillId } = req.query;
    let session;

    
        const driver = await Neo4jConnection();
        session = driver.session();

        const quizResult = await session.run(
            "MATCH (q:Skill {Nodeid: $SkillId})-[:HAS_QUESTION]->(question:Question) " +
            "WITH q, question ORDER BY question.order " +
            "RETURN q.name AS quizName, COLLECT({ " +
            "   id: question.id, " +
            "   questionText: question.questionText, " +
            "   options: [(question)-[:HAS_OPTION]->(option:Option) | { " +
            "       id: option.id, " +
            "       optionText: option.optionText " +
            "   }], " +
            "   order: question.order " +
            "}) AS questions",
            { SkillId }
        );

        if (quizResult.records.length === 0) {
            return next(new Error("Skill Not found", { cause: 404 }));
        }

        const quizName = quizResult.records[0].get("quizName");
        const questions = quizResult.records[0].get("questions");
        await session.close();
        
        res.status(200).json({ Message: 'Done',QuizName:quizName,  Questions: questions });
    

        
    
};

//Get allTopicQuizzes neo4j
export const GetAllQuizzes = async (req, res, next) => {
    let session;
    const driver = await Neo4jConnection();
    session = driver.session();

    // Match all skills that have a "CONTAINS" relationship and return their names

        const AllQuizzes = await session.run(
            "MATCH (s:Skill)-[:HAS_QUESTION]->(:Question) RETURN DISTINCT s.name AS name, s.Nodeid AS id" 
        );
    

    if (AllQuizzes.records.length === 0) {
        return next(new Error("No Quizzes Found", { cause: 404 }));
    }

    // Extract the name property of all skills
    const quizzes = AllQuizzes.records.map(record => ({
        id: record.get('id'),
        name: record.get('name'),
    }));

    res.status(200).json({ Message: 'Done', Quizzes: quizzes });
        if (session) {
            await session.close();
        }
};
//Career Guidance
//->GetFrameWORKs
export const GetFrameWORKs = async (req, res, next) => {
    const { jobId } = req.query; 
    const types = ['Framework', 'Development', 'Library']; // Types to filter for
    let session;
    const driver = await Neo4jConnection();
    session = driver.session();

    const result = await session.run(
        `MATCH (job:Job {Nodeid: $jobId})-[:REQUIRES {mandatory: false}]->(skill:Skill)
        WHERE skill.type IN $types
        RETURN skill`,
        { jobId, types }
    );
    const skills = result.records.map(record => record.get('skill').properties);
    res.status(200).json({ Message: 'Skills Retrieved Successfully', Skills: skills });
}

// Function to get random elements from an array
const getRandomElements = (arr, count) => {
    const shuffled = arr.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
};
//------------------------------------Topic Quiz---------------------------------------------
//Solve TopicQuiz
export const SubmitTopicQuiz = async (req, res, next) => {
    const { answer } = req.body;
    const { SkillId } = req.query;
    const UserId = req.authUser._id;
console.log(answer)

// Get current timestamp
const timestamp = new Date().toISOString();
    console.log("Current Timestamp:", timestamp);
    let session;

    const driver = await Neo4jConnection();
    session = driver.session();

    // Check if the quiz exists
    const ifQuizExists = await session.run(
        "MATCH (q:Skill {Nodeid: $SkillId}) RETURN q",
        { SkillId }
    );
    if (ifQuizExists.records.length === 0) {
        return next(new Error("Quiz does not exist", { cause: 400 }));
    }

     // Check if the user has already taken the quiz and retrieve the timestamp of the last attempt
     const quizAttemptsResult = await session.run(
        "MATCH (u:User {_id: $UserId})-[r:TOOK]->(qa:Skill {Nodeid: $SkillId}) RETURN r.timestamp AS lastAttempt",
        { UserId, SkillId }
    );

    if (quizAttemptsResult.records.length > 0) {
        const lastAttempt = quizAttemptsResult.records[0].get("lastAttempt");
        const lastAttemptDate = new Date(lastAttempt);
        const currentDate = new Date();

        console.log("Last Attempt Timestamp:", lastAttempt);
        console.log("Last Attempt Date:", lastAttemptDate);
        console.log("Current Date:", currentDate);

        // Check if 24 hours have passed since the last attempt
        const timeDifference = currentDate - lastAttemptDate;
        const hoursDifference = timeDifference / (1000 * 60 * 60);

        console.log("Hours Difference:", hoursDifference);

        if (hoursDifference < 24) {
            return next(new Error("You can retake the quiz after 24 hours", { cause: 400 }));
        } else {
            // Remove existing relationships
            await session.run(
                `
                MATCH (u:User {_id: $UserId})-[r:TOOK|PASSED|FAILED]->(q:Skill {Nodeid: $SkillId})
                DELETE r
                `,
                { UserId, SkillId }
            );
        }
    }
    const quizInfoResult = await session.run(
        "MATCH (q:Skill {Nodeid: $SkillId}) RETURN q.name AS QuizName",
        { SkillId }
    );
    const quizInfoRecord = quizInfoResult.records[0];
    const QuizName = quizInfoRecord ? quizInfoRecord.get("QuizName") : "";

    // Get Quiz information
    const quizQuestionsResult = await session.run(
        `
        MATCH (q:Skill {Nodeid: $SkillId})-[:HAS_QUESTION]->(question:Question)
        OPTIONAL MATCH (question)-[rel:HAS_OPTION]->(option:Option)
        WHERE rel.correct = true
        RETURN question.id AS questionId, option.id AS answerId
        ORDER BY question.order
        `,
        { SkillId }
    );
    
    const quizQuestions = quizQuestionsResult.records.map(record => ({
        questionId: record.get("questionId"),
        answerId: record.get("answerId")
    }));
    console.log("Quiz Name:", QuizName);
    console.log("Quiz Questions with Correct Answers:", quizQuestions);

    let Grade = 0;
    for (let i = 0; i < answer.length; i++) {
        const userAnswer = answer[i];
        const correctAnswer = quizQuestions.find(q => q.questionId === userAnswer.questionId);
        if (correctAnswer && userAnswer.answerId === correctAnswer.answerId) {
            Grade++;
        }
    }
    const totalQuestions = quizQuestions.length;
    const Pass = Grade > totalQuestions / 2;

        // Update user node with quiz results and create relationship
        let query =
            "MATCH (u:User {_id: $UserId}), (q:Skill {Nodeid: $SkillId}) " +
            "CREATE (u)-[:TOOK { QuizName: $QuizName, Grade: $Grade, TotalQuestions: $totalQuestions, Pass: $Pass,timestamp: $timestamp }]->(q)";

        if (Pass) {
            query +=
                " MERGE (u)-[:HAS_SKILL]->(q)";
        }
        
        await session.run(query, {
            UserId,
            SkillId,
            QuizName,
            Grade,
            totalQuestions,
            Pass,
            timestamp,
        });

        res.status(200).json({
            Message: "Your grade is",
            Grade,
            TotalQuestions: totalQuestions,
        });
    }


//--------------------------------Career Guidance-------------------------------------------------------------------
// Get BackendQuiz neo4j
export const GetBackendTrackQuiz = async (req, res, next) => {
    const { jobId, SkillId } = req.query;
    let session;
    let driver;

        driver = await Neo4jConnection();
        session = driver.session();
        const quizQuestions = [];
        const skillQuestions = [];

        // Fetch questions related to the job's quiz
        const Quizresult = await session.run(`
            MATCH (job:Job {Nodeid: $jobId})-[:CORE_QUIZ]->(q:Quiz)-[:HAS_QUESTION]->(question:Question)
            OPTIONAL MATCH (question)-[rel:HAS_OPTION]->(option:Option)
            OPTIONAL MATCH (question)-[correctRel:HAS_OPTION {correct: true}]->(correctOption:Option)
            RETURN ID(question) AS questionId, question, COLLECT({ id: option.id, optionText: option.optionText, correct: rel.correct }) AS options, correctOption.id AS correctAnswerId
            `,
            { jobId }
        );

        // Process the quiz result
        Quizresult.records.forEach(record => {
            const questionId = record.get('questionId');
            const question = record.get('question').properties;
            const correctAnswerId = record.get('correctAnswerId');
            const options = record.get('options').map(option => ({
                id: option.id,
                optionText: option.optionText,
                correct: option.correct
            }));

            quizQuestions.push({ id: questionId, ...question, options, correctAnswerId });
        });
        console.log(quizQuestions);

        // Fetch questions associated with the specific SkillId
        const Skillresult = await session.run(`
            MATCH (skill:Skill {Nodeid: $SkillId})-[:HAS_QUESTION]->(question:Question)
            OPTIONAL MATCH (question)-[rel:HAS_OPTION]->(option:Option)
            OPTIONAL MATCH (question)-[correctRel:HAS_OPTION {correct: true}]->(correctOption:Option)
            RETURN ID(question) AS questionId,question, COLLECT({ id: option.id, optionText: option.optionText, correct: rel.correct }) AS options, correctOption.id AS correctAnswerId
            `,
            { SkillId }
        );

        // Process the skill result
        Skillresult.records.forEach(record => {
            const questionId = record.get('questionId');
            const question = record.get('question').properties;
            const correctAnswerId = record.get('correctAnswerId');
            const options = record.get('options').map(option => ({
                id: option.id,
                optionText: option.optionText,
                correct: option.correct
            }));
            skillQuestions.push({ id: questionId, ...question, options, correctAnswerId });
        })

        // req.session.SkillId = SkillId;
        console.log(skillQuestions);

        // Get random questions and prepare the response
        const randomQuizQuestions = getRandomElements(quizQuestions, 10);
        const randomSkillQuestions = getRandomElements(skillQuestions, 5);

        const randomQuestions = [...randomQuizQuestions, ...randomSkillQuestions];
        console.log(randomQuestions)
        // const questionIdsAndCorrectIds = randomQuestions.map(question => ({
        //     questionId: question.id,
        //     correctId: question.correctAnswerId
        // }));
        // console.log(questionIdsAndCorrectIds);


        const quizId = uuidv4();

        // Store the random questions in the in-memory store with the quizId
        quizzes.set(quizId, randomQuestions);
        // Format questions as required in the output
        const formattedQuestions = randomQuestions.map((question, index) => ({
            id: question.id,
            order: index + 1,
            questionText: question.questionText,
            options: question.options.map(option => ({
                id: option.id,
                optionText: option.optionText
            })),
            Level: question.Level
        }));

        // Store data in session
        // req.session.quiz = formattedQuestions;
        // req.session.answers = questionIdsAndCorrectIds;
        // req.session.randomQuestions = randomQuestions;
        // req.session.jobId = jobId;
        session.close();
        res.status(200).json({ Message: 'Random Quiz', Questions: formattedQuestions,QuizId: quizId });
    };
//Career guide (all except Backend & Fullstack)
export const GetTrackQuiz = async (req, res, next) => {
    const { jobId, SkillId } = req.query;
    let session;
    let driver;
    

        driver = await Neo4jConnection();
        session = driver.session();
        const skillsMap = new Map();
        if (jobId) {
            
            // If jobId is provided, run the query for mandatory skills
            const result = await session.run(
                `MATCH (job:Job {Nodeid: $jobId})-[:REQUIRES {mandatory: true}]->(skill:Skill)-[:HAS_QUESTION]->(question:Question)
                 OPTIONAL MATCH (question)-[rel:HAS_OPTION]->(option:Option)
                 WITH job, skill, question, option, rel, ID(question) AS questionId, option.id AS optionUUID
                 OPTIONAL MATCH (question)-[correctRel:HAS_OPTION {correct: true}]->(correctOption:Option)
                 RETURN questionId, skill.name AS skillName, question, COLLECT({ id: optionUUID, optionText: option.optionText, correct: rel.correct }) AS options, correctOption.id AS correctAnswerId`,
                { jobId }
            );
            
            
            
            // Process the result query for mandatory skills
            result.records.forEach(record => {
                const skillName = record.get('skillName');
                const questionId = record.get('questionId');
                const question = record.get('question').properties;
                const correctAnswerId = record.get('correctAnswerId');
                const options = record.get('options').map(option => ({
                    id: option.id,
                    optionText: option.optionText,
                    correct: option.correct
                }));

                if (!skillsMap.has(skillName)) {
                    skillsMap.set(skillName, []);
                }
                skillsMap.get(skillName).push({ id: questionId, ...question, options, correctAnswerId });
            });
            // req.session.skillId = SkillId;
           
        }

        if (SkillId) {  
            const result = await session.run(
            `MATCH (job:Job {Nodeid: $jobId})-[:REQUIRES]->(skill:Skill {Nodeid: $SkillId})
             RETURN COUNT(*) AS count`,
            { jobId, SkillId }
        );

        const record = result.records[0];
        const count = record.get('count').toNumber();

        if (count === 0) {
            return next(Error('Skill is not in this track', { cause: 404 }));
        }
        
            // If SkillId is provided, run the query for the specific SkillId
            const skillResult = await session.run(
                `MATCH (skill:Skill {Nodeid: $SkillId})-[:HAS_QUESTION]->(question:Question)
                 OPTIONAL MATCH (question)-[rel:HAS_OPTION]->(option:Option)
                 WITH skill, question, option, rel, ID(question) AS questionId, option.id AS optionUUID
                 OPTIONAL MATCH (question)-[correctRel:HAS_OPTION {correct: true}]->(correctOption:Option)
                 RETURN questionId, skill.name AS skillName, question, COLLECT({ id: optionUUID, optionText: option.optionText, correct: rel.correct }) AS options, correctOption.id AS correctAnswerId`,
                { SkillId }
            );

            

            // Process the skillResult query for the specific SkillId
            skillResult.records.forEach(record => {
                const skillName = record.get('skillName');
                const questionId = record.get('questionId');
                const question = record.get('question').properties;
                const correctAnswerId = record.get('correctAnswerId');
                const options = record.get('options').map(option => ({
                    id: option.id,
                    optionText: option.optionText,
                    correct: option.correct
                }));

                if (!skillsMap.has(skillName)) {
                    skillsMap.set(skillName, []);
                }
                skillsMap.get(skillName).push({ id: questionId, ...question, options, correctAnswerId });
            });
            // req.session.SkillId = SkillId;
        }

        // Function to get random elements from an array
        const getRandomElements = (arr, count) => {
            const shuffled = arr.sort(() => 0.5 - Math.random());
            return shuffled.slice(0, count);
        };

        const randomQuestions = [];
        // const questionIdsAndCorrectIds = []; // Array to store questionId and correct answerId

        skillsMap.forEach((questions) => {
            const selectedQuestions = getRandomElements(questions, 3);
            randomQuestions.push(...selectedQuestions);

           
        });

        const quizId = uuidv4();

    // Store the random questions in the in-memory store with the quizId
    quizzes.set(quizId, randomQuestions);

        // Format questions as required in the output
        const formattedQuestions = randomQuestions.map((question, index) => ({
            id: question.id,
            order: index + 1,
            questionText: question.questionText,
            options: question.options.map(option => ({
                id: option.id,
                optionText: option.optionText
            })),
            Level: question.Level
        }));

        // Store data in session
        // req.session.quiz = formattedQuestions;
        // req.session.answers = questionIdsAndCorrectIds;
        // req.session.randomQuestions = randomQuestions;
        // req.session.jobId=jobId
        console.log(randomQuestions)

        res.status(200).json({ Message: 'Random Quiz', Questions: formattedQuestions,QuizId: quizId });

};

//SubmitTrackQuiz
export const SubmitQuiz = async (req, res, next) => {
    const { answer, quizId, SkillId, jobId } = req.body;
    const UserId = req.authUser._id;
    if (!answer || !quizId) {
        return res.status(400).json({ error: 'Invalid request. Missing required data.' });
    }
    console.log("data",quizId,jobId,SkillId)
    // Retrieve the randomQuestions using the quizId
    const randomQuestions = quizzes.get(quizId);
    if (!randomQuestions) {
        return res.status(400).json({ error: 'Invalid quiz ID or quiz has expired.' });
    }

    const questionIdsAndCorrectIds = [];
    let session;
    let driver;
    driver = await Neo4jConnection();
    session = driver.session();

    randomQuestions.forEach(question => {
        // Find correct option id
        const correctAnswer = question.options.find(option => option.correct);
        if (correctAnswer) {
            questionIdsAndCorrectIds.push({
                questionId: question.id,
                correctId: correctAnswer.id
            });
        }
    });

    const correctAnswers = [];
    correctAnswers.push(...questionIdsAndCorrectIds);
    console.log(correctAnswers)
    let Grade=0;
    answer.forEach(userAnswer => {
        const correctAnswer = correctAnswers.find(q => q.questionId === userAnswer.questionId);
        if (correctAnswer && userAnswer.answerId === correctAnswer.correctId) {
            Grade++;
        }
    });

        console.log("Grade:", Grade);

        // Determine pass status based on grade
        const totalQuestions = randomQuestions.length;
        const Pass = Grade > totalQuestions / 2;
        quizzes.delete(quizId);
        const timestamp = new Date().toISOString();


//    Check if the user has already taken the quiz and retrieve the timestamp of the last attempt
    const quizAttemptsResult = await session.run(
    "MATCH (u:User {_id: $UserId})-[r:TOOK_TRACK_QUIZ]->(j:Job {Nodeid: $jobId}) RETURN r.timestamp AS lastAttempt",
    { UserId, jobId }
);

if (quizAttemptsResult.records.length > 0) {
    const lastAttempt = quizAttemptsResult.records[0].get("lastAttempt");
    const lastAttemptDate = new Date(lastAttempt);
    const currentDate = new Date();

    console.log("Last Attempt Timestamp:", lastAttempt);
    console.log("Last Attempt Date:", lastAttemptDate);
    console.log("Current Date:", currentDate);

    // Check if 24 hours have passed since the last attempt
    const timeDifference = currentDate - lastAttemptDate;
    const hoursDifference = timeDifference / (1000 * 60 * 60);

    console.log("Hours Difference:", hoursDifference);

    if (hoursDifference < 24) {
        return next(new Error("You can retake the quiz after 24 hours", { cause: 400 }));
    } else {
        // Remove existing relationships
        await session.run(
            `
            MATCH (u:User {_id: $UserId})-[r:TOOK_TRACK_QUIZ|PASSED|FAILED]->(q:Job {Nodeid: $jobId})
            DELETE r
            `,
            { UserId, jobId }
        );
    }
}
// Create the relationship if it doesn't exist
const createTookRelationQuery = `
MATCH (u:User {_id: $UserId}), (j:Job {Nodeid: $jobId}) 
MERGE (u)-[:TOOK_TRACK_QUIZ { Grade: $Grade, TotalQuestions: $totalQuestions, Pass: $Pass, timestamp: $timestamp }]->(j)
`;

await session.run(createTookRelationQuery, {
UserId,
jobId,
Grade,
totalQuestions,
Pass,
timestamp
});


        if(!Pass)
            {

        let query = `
            MATCH (job:Job {Nodeid: $jobId})-[:REQUIRES {mandatory: true}]->(mandatorySkill:Skill)
            OPTIONAL MATCH (job)-[:REQUIRES]->(specificSkill:Skill)
        `;
        let params = { jobId };

        if (SkillId) {
            query += `
                WHERE specificSkill.Nodeid = $SkillId
            `;
            params.SkillId = SkillId;
        }

        query += `
            RETURN 
                COLLECT(DISTINCT { 
                    skillId: ID(mandatorySkill), 
                    Nodeid: mandatorySkill.Nodeid,
                    skill: mandatorySkill 
                }) AS mandatorySkills,
                CASE WHEN specificSkill IS NOT NULL THEN { 
                    skillId: ID(specificSkill), 
                    Nodeid: specificSkill.Nodeid,
                    skill: specificSkill 
                } ELSE null END AS specificSkill
        `;

        const result = await session.run(query, params);

        const record = result.records[0];
        console.log("Neo4j query result:", result.records);

        const mandatorySkills = record.get('mandatorySkills').map(skill => ({
            Nodeid: skill.Nodeid,
            ...skill.skill.properties
        }));

        let specificSkill = null;
        if (SkillId) {
            const specificSkillRecord = record.get('specificSkill');
            specificSkill = specificSkillRecord ? {
                Nodeid: specificSkillRecord.Nodeid,
                ...specificSkillRecord.skill.properties
            } : null;
        }

        console.log("Mandatory skills:", mandatorySkills);
        console.log("Specific skill:", specificSkill);

        res.status(200).json({
            grade: Grade,
            pass: Pass,
            mandatorySkills: mandatorySkills,
            specificSkill: specificSkill
        });
    }
    else
    {
    let query;
    let params = { jobId };

    if (SkillId) {
        query = `
            MATCH (skill:Skill {Nodeid: $SkillId})<-[:BELONGS_TO]-(JobOffer:JobOffer)
            RETURN JobOffer
        `;
        params.SkillId = SkillId;
    } else {
        query = `
            MATCH (job:Job {Nodeid: $jobId})<-[:BELONGS_TO]-(JobOffer:JobOffer)
            RETURN JobOffer
        `;
    }

    const result = await session.run(query, params);

    const jobs = result.records.map(record => {
        const jobNode = record.get('JobOffer') || record.get('JobOffer');
            return {
                Nodeid: jobNode.properties.Nodeid,
                ...jobNode.properties,
                date_posted: convertNeo4jDateToISO(jobNode.properties.date_posted) || "Invalid date",
                date_modified: convertNeo4jDatetimeToISO(jobNode.properties.date_modified) || "Invalid date"

            };
    });

    console.log("Job Offers:", jobs);

    res.status(200).json({
        grade: Grade,
        pass: Pass,
        jobs: jobs
    });
}
    
};



//-------------------------------------------FullStackQuiz---------------------------------------------------------------//

const fetchBackendQuiz = async (jobId, SkillId, token) => {
    try {
        console.log('Fetching backend quiz...');
        const response = await axios.get(`https://career-y-production.up.railway.app/Quiz/GetBackendTrackQuiz`, {
            params: { jobId, SkillId },
            headers: {
                token: token, 
            },
        });
        console.log(response.data);
        return response.data;
       
    } catch (error) {
        throw new Error('Failed to fetch backend quiz');
    }
};

// const fetchFrameworks = async (jobId, token) => {
//     console.log('Fetching frameworks...');
//     try {
//         const response = await axios.get(`http://localhost:8000/Quiz/SpecificFramework`, {
//             params: { jobId },
//             headers: {
//                 token: token,
//             },
//         });
//         return response.data;
//     } catch (error) {
//         throw new Error('Failed to fetch frameworks');
//     }
// };

const fetchFrontendTrackQuiz = async (jobId, SkillId, token) => {
    try {
        console.log('Fetching track quiz...');
        const response = await axios.get('https://career-y-production.up.railway.app/Quiz/GetTrackQuiz', {
            params: { jobId, SkillId },
            headers: {
                token: token,
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching track quiz:', error.response ? error.response.data : error.message);
        throw new Error('Failed to fetch track quiz');
    }
};

export const GetFullStackTrackQuiz = async (req, res, next) => {
    try {
        const { BackendId,FrontendId,BackendFrameWorkId ,FrontendFrameWorkId} = req.query;
        const token= req.headers.token
        if (!BackendId || !FrontendId || !BackendFrameWorkId || !FrontendFrameWorkId) {
            return res.status(400).json({ message: 'Missing required parameters' });
        }

        // Fetch backend Track quiz data
        const backendQuizResponse = await fetchBackendQuiz(BackendId, BackendFrameWorkId, token);

        // Fetch Frontend TrackQuiz data
        const frontendQuizResponse = await fetchFrontendTrackQuiz(FrontendId,FrontendFrameWorkId,token);
        const combinedQuestions = [...backendQuizResponse.Questions, ...frontendQuizResponse.Questions];
        const questionIds = combinedQuestions.map(q => q.id);
        console.log(questionIds);
        // Neo4j query to get correct answers
        const driver = await Neo4jConnection();
        const session = driver.session();
        
        const result = await session.run(`
            MATCH (q:Question)-[r:HAS_OPTION {correct: true}]->(o:Option)
            WHERE q.id IN $questionIds
            RETURN q.id AS questionId, o.id AS correctAnswerId
          `, { questionIds });

          // Extract and return the correct answers
          const correctAnswers = result.records.map(record => ({
            questionId: record.get('questionId'),
            correctAnswerId: record.get('correctAnswerId')
          }));

          const quizId = uuidv4();

    // Store the random questions in the in-memory store with the quizId
    quizzes.set(quizId, correctAnswers);

          console.log("correctAnswer",correctAnswers);
          console.log("combinedQuestions",combinedQuestions);
        req.session.combinedQuestions = combinedQuestions;
        req.session.correctAnswers = correctAnswers;
        req.session.BackendId = BackendId;
        req.session.BackendFrameWorkId = BackendFrameWorkId;
        req.session.FrontendId = FrontendId;
        req.session.FrontendFrameWorkId = FrontendFrameWorkId;

        return res.status(200).json({
            message: 'Data fetched successfully',
            Questions: combinedQuestions,
            QuizId: quizId,
        });
    } catch (error) {
        console.error('Error fetching data:', error);
        return next(new Error('Failed to fetch data', { cause: 500 }));
    }
};

//i am using token in header
export const submitFullstackTrackQuiz = async (req, res, next) => {
    const { answer,quizId,BackendId,BackendFrameWorkId,FrontendId,FrontendFrameWorkId } = req.body;
    const userId = req.authUser._id
    let session;
    const driver = await Neo4jConnection();
    session = driver.session();
    try {
        // console.log("helo")
        // console.log('Session Data:', req.session);

    
        // const correctAnswers = req.session.correctAnswers;
        // const BackendId = req.session.BackendId;
        // const BackendFrameWorkId = req.session.BackendFrameWorkId;
        // const FrontendId = req.session.FrontendId;
        // const FrontendFrameWorkId = req.session.FrontendFrameWorkId;
        // quizzes.delete(quizId);

        const correctAnswers = quizzes.get(quizId);
        if (!correctAnswers) {
            return res.status(400).json({ error: 'Invalid quiz ID or quiz has expired.' });
        }
        let Grade = 0;
        answer.forEach(userAnswer => {
            const correctAnswer = correctAnswers.find(q => q.questionId === userAnswer.questionId);
            if (correctAnswer && userAnswer.answerId === correctAnswer.correctId) {
                Grade++;
            }
        });

        const totalQuestions = correctAnswers.length;
        const Pass = Grade > totalQuestions / 2;
        console.log('Grade:', Grade);
        console.log('totalQuestions:', totalQuestions);
        quizzes.delete(quizId);
const fixedTrackId = '697f3adc-4fc4-4ef8-bffd-bd3cf243375f';
const timestamp = new Date().toISOString();



//    Check if the user has already taken the quiz and retrieve the timestamp of the last attempt
    const quizAttemptsResult = await session.run(
    "MATCH (u:User {_id: $userId})-[r:TOOK_TRACK_QUIZ]->(j:Job {Nodeid: $fixedTrackId}) RETURN r.timestamp AS lastAttempt",
    { userId, fixedTrackId }
);

if (quizAttemptsResult.records.length > 0) {
    const lastAttempt = quizAttemptsResult.records[0].get("lastAttempt");
    const lastAttemptDate = new Date(lastAttempt);
    const currentDate = new Date();

    console.log("Last Attempt Timestamp:", lastAttempt);
    console.log("Last Attempt Date:", lastAttemptDate);
    console.log("Current Date:", currentDate);

    // Check if 24 hours have passed since the last attempt
    const timeDifference = currentDate - lastAttemptDate;
    const hoursDifference = timeDifference / (1000 * 60 * 60);

    console.log("Hours Difference:", hoursDifference);

    if (hoursDifference < 24) {
        return next(new Error("You can retake the quiz after 24 hours", { cause: 400 }));
    } else {
        // Remove existing relationships
        await session.run(
            `
            MATCH (u:User {_id: $UserId})-[r:TOOK_TRACK_QUIZ|PASSED|FAILED]->(q:Job {Nodeid: $fixedTrackId})
            DELETE r
            `,
            { userId, fixedTrackId }
        );
    }
}
// Record the quiz result in the database for the fixed track
await session.run(
    `MATCH (u:User {_id: $userId})
     MATCH (t:Job {Nodeid: $fixedTrackId})
     CREATE (u)-[:TOOK_TRACK_QUIZ {Pass: $Pass, Grade: $Grade,TotalQuestions: $totalQuestions,timestamp: $timestamp}]->(t)`,
    {
        userId,
        Pass,
        Grade,
        fixedTrackId,
        totalQuestions,
        timestamp
    }
);

        if (Pass) {
            try {
                const BackendJobOffers = await FetchJobIfPass(BackendId, BackendFrameWorkId, req.headers.token);
                console.log("BackendJobOffers", BackendJobOffers);
                const FrontEndJobOffers = await FetchJobIfPass(FrontendId,FrontendFrameWorkId, req.headers.token);
                console.log("FrontEndJobOffers", FrontEndJobOffers);
                res.status(200).json({
                    message: 'Congratulations! You passed the quiz.',
                    grade: Grade,
                    pass: Pass,
                    backendJobOffers: BackendJobOffers,
                    frontendJobOffers: FrontEndJobOffers
                });
            } catch (fetchError) {
                console.error('Error fetching job offers:', fetchError);
                return next(fetchError);
            }
        }  else {
            try {
                // Fetch backend skills
                const FetchBackendResponse = await fetchSkills(BackendId, BackendFrameWorkId, req.headers.token);
                console.log("FetchBackendResponse", FetchBackendResponse);

                // Fetch frontend skills
                const FetchFrontendResponse = await fetchSkills(FrontendId, FrontendFrameWorkId, req.headers.token);
                console.log("FetchFrontendResponse", FetchFrontendResponse);

                // Use the response directly
                return res.status(200).json({
                    message: 'You failed the quiz. Here are the required skills.',
                    grade: Grade,
                    pass: Pass,
                    backendSkills: FetchBackendResponse.mandatorySkills,
                    backendSpecificSkill: FetchBackendResponse.specificSkill,
                    frontendSkills: FetchFrontendResponse.mandatorySkills,
                    frontendSpecificSkill: FetchFrontendResponse.specificSkill,
                });
            } catch (fetchError) {
                console.error('Error fetching skills:', fetchError); // Added logging for errors
                return next(fetchError);
            }
        }
    } catch (error) {
        console.error('Error submitting quiz:', error); // Added logging for errors
        next(error);
    }
};

const fetchSkills = async (jobId, SkillId, token) => {
    console.log('Fetching skills...');
    console.log(token)
    try {
        const response = await axios.get(`https://career-y-production.up.railway.app/Quiz/fetchSkillsIfFailed`, {
            params: { jobId, SkillId },
            headers: { 'token': token }
        });

        console.log('Skills fetched:', response.data);
        return response.data;

    } catch (error) {
        // console.error('Error fetching skills:', error);
        throw new Error('Failed to fetch skills');
    }
};

export const fetchSkillsIfFailed = async (req, res, next) => {
    const { jobId, SkillId } = req.query;
    const Pass = req.session.Pass;

    try {
        const driver = await Neo4jConnection();
        const session = driver.session();

        let query = `
            MATCH (job:Job {Nodeid: $jobId})-[:REQUIRES {mandatory: true}]->(mandatorySkill:Skill)
            OPTIONAL MATCH (job)-[:REQUIRES]->(specificSkill:Skill)
        `;
        let params = { jobId };

        if (SkillId) {
            query += `
                WHERE specificSkill.Nodeid = $SkillId
            `;
            params.SkillId = SkillId;
        }

        query += `
            RETURN 
                COLLECT(DISTINCT { 
                    skillId: ID(mandatorySkill), 
                    Nodeid: mandatorySkill.Nodeid,
                    skill: mandatorySkill 
                }) AS mandatorySkills,
                CASE WHEN specificSkill IS NOT NULL THEN { 
                    skillId: ID(specificSkill), 
                    Nodeid: specificSkill.Nodeid,
                    skill: specificSkill 
                } ELSE null END AS specificSkill
        `;

        const result = await session.run(query, params);
        const record = result.records[0];

        if (!record) {
            return res.status(404).json({ message: 'No skills found.' });
        }

        const mandatorySkills = record.get('mandatorySkills').map(skill => ({
            Nodeid: skill.Nodeid,
            ...skill.skill.properties
        }));

        let specificSkill = null;
        if (SkillId) {
            const specificSkillRecord = record.get('specificSkill');
            specificSkill = specificSkillRecord ? {
                Nodeid: specificSkillRecord.Nodeid,
                ...specificSkillRecord.skill.properties
            } : null;
        }

        console.log({
            mandatorySkills: mandatorySkills,
            specificSkill: specificSkill,
        });

        res.status(200).json({
            mandatorySkills: mandatorySkills,
            specificSkill: specificSkill,
        });
    } catch (error) {
        console.error('Error in fetchSkillsIfFailed:', error);
        next(error);
    }
};

// Fetch job offers from an external API
export const FetchJobIfPass = async (jobId, SkillId, token) => {
    console.log('Fetching JOBOFFERS...');

    try {
        const response = await axios.get(`https://career-y-production.up.railway.app/Quiz/fetchJobsOffers`, {
            params: { jobId, SkillId },
            headers: { 'token': token }
        });

        console.log('Job offers fetched:', response.data);
        return response.data;

    } catch (error) {
        console.error('Error fetching job offers:', error);
        throw new Error('Failed to fetch job offers');
    }
};
export const fetchJobsOffers = async (req, res, next) => {
    const { jobId, SkillId } = req.query;
    try {
        const driver = await Neo4jConnection();
        const session = driver.session();

        let query;
        let params = { jobId };

        if (SkillId) {
            query = `
                MATCH (skill:Skill {Nodeid: $SkillId})<-[:BELONGS_TO]-(JobOffer:JobOffer)
                RETURN JobOffer
            `;
            params.SkillId = SkillId;
        } else {
            query = `
                MATCH (job:Job {Nodeid: $jobId})<-[:BELONGS_TO]-(JobOffer:JobOffer)
                RETURN JobOffer
            `;
        }

        const result = await session.run(query, params);

        const jobs = result.records.map(record => {
            const jobNode = record.get('JobOffer');
            return {
                Nodeid: jobNode.properties.Nodeid,
                ...jobNode.properties
            };
        });

        console.log("Job Offers:", jobs);

        res.status(200).json({
            jobs: jobs
        });

        await session.close();
    } catch (error) {
        console.error('Error fetching job offers:', error);
        next(error);
    }
};


// export const AddQuestionsToNode = async (req, res, next) => {


//     let session;
//     let tx;
//     const { SkillId } = req.query;
//     const { Questions } = req.body;
//     const driver = await Neo4jConnection();
//     session = driver.session();
//     tx = session.beginTransaction();

//     try {
//         // Check if the quiz exists by QuizId
//         const QuestionResults = await tx.run(
//             "MATCH (q:Skill {Nodeid: $SkillId}) RETURN q",
//             { SkillId }
//         );

//         if (QuestionResults.records.length === 0) {
//             await tx.rollback();
//             return next(new Error("Skill Doesn't exist", { cause: 404 }));
//         }

//         if (!Array.isArray(Questions) || Questions.length === 0) {
//             await tx.rollback();
//             return res.status(400).json({ Message: "Questions array is required and cannot be empty." });
//         }

//         const addedQuestions = await Promise.all(Questions.map(async (question, index) => {
//             const { questionText, answer, options ,Level} = question;
//             const questionId = uuidv4(); // Generate UUID for each question
//             const order = index + 1; // Set the order based on the index

//             const optionsWithIds = options.map(optionText => ({
//                 option_id: uuidv4(),
//                 option_text: optionText,
//                 correct: optionText === answer  // Mark correct if option matches answer
//             }));


//             // Create question node and its relationships in Neo4j
//             const result = await tx.run(
//                 `MATCH (s:Skill {Nodeid: $SkillId})
//                 CREATE (s)-[:HAS_QUESTION]->(question:Question {
//                     id: $questionId,
//                     questionText: $questionText,
//                     answer: $answer,
//                     Level:$Level,
//                     order: $order
//                 })
//                 WITH question
//                 UNWIND $optionsWithIds AS optionData
//                 CREATE (question)-[:HAS_OPTION {
//                     correct: optionData.correct  // Mark correct if option matches answer
//                 }]->(option:Option {
//                     id: optionData.option_id,
//                     optionText: optionData.option_text
//                 })
//                 RETURN question`,
//                 { SkillId, questionId, questionText, Level,answer, optionsWithIds, order }
//             );

//             return result.records[0].get('question').properties;
//         }));

//         await tx.commit();
//         res.status(200).json({ message: 'Created Successfully', questions: addedQuestions });
//     } catch (error) {
//         await tx.rollback();
//         next(error);
//     } finally {
//         if (session) {
//             await session.close();
//         }
//     }
// };