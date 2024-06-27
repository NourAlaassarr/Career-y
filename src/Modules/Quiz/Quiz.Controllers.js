
import {generateToken,VerifyToken}from'../../utils/TokenFunction.js'
import { v4 as uuidv4 } from 'uuid';
import { Neo4jConnection } from "../../../DB/Neo4j/Neo4j.js";

//Add Quiz Neo4j
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
            "MATCH (s:Skill)-[:HAS_QUESTION]->(:Question) RETURN DISTINCT s.name AS name"
        );
    

    if (AllQuizzes.records.length === 0) {
        return next(new Error("No Quizzes Found", { cause: 404 }));
    }

    // Extract the name property of all skills
    const quizzes = AllQuizzes.records.map(record => record.get("name"));

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

// Get BackendQuiz neo4j
export const GetBackendQuiz = async (req, res, next) => {
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

        req.session.SkillId = SkillId;
        console.log(skillQuestions);

        // Get random questions and prepare the response
        const randomQuizQuestions = getRandomElements(quizQuestions, 10);
        const randomSkillQuestions = getRandomElements(skillQuestions, 5);

        const randomQuestions = [...randomQuizQuestions, ...randomSkillQuestions];
        const questionIdsAndCorrectIds = randomQuestions.map(question => ({
            questionId: question.id,
            correctId: question.correctAnswerId
        }));
        console.log(questionIdsAndCorrectIds);
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
        req.session.quiz = formattedQuestions;
        req.session.answers = questionIdsAndCorrectIds;
        req.session.randomQuestions = randomQuestions;
        req.session.jobId = jobId;
        session.close();
        res.status(200).json({ Message: 'Random Quiz', Questions: formattedQuestions });
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
            req.session.skillId = SkillId;
           
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
            req.session.SkillId = SkillId;
        }

        // Function to get random elements from an array
        const getRandomElements = (arr, count) => {
            const shuffled = arr.sort(() => 0.5 - Math.random());
            return shuffled.slice(0, count);
        };

        const randomQuestions = [];
        const questionIdsAndCorrectIds = []; // Array to store questionId and correct answerId

        skillsMap.forEach((questions) => {
            const selectedQuestions = getRandomElements(questions, 3);
            randomQuestions.push(...selectedQuestions);

            selectedQuestions.forEach(question => {
                // Find correct option id
                const correctAnswer = question.options.find(option => option.correct);
                if (correctAnswer) {
                    questionIdsAndCorrectIds.push({
                        questionId: question.id,
                        correctId: correctAnswer.id
                    });
                }
            });
        });

        

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
        req.session.quiz = formattedQuestions;
        req.session.answers = questionIdsAndCorrectIds;
        req.session.randomQuestions = randomQuestions;

        res.status(200).json({ Message: 'Random Quiz', Questions: formattedQuestions });

};

export const SubmitQuiz = async (req, res, next) => {
    const { answer } = req.body;

    let session;
    let driver;

    try {
        driver = await Neo4jConnection();
        session = driver.session();

        let Grade = 0;

        // Retrieve quiz and correct answers from the session
        const quiz = req.session.quiz;
        const correctAnswers = req.session.answers;
        const randomQuestions = req.session.randomQuestions;
        const SkillId =req.session.SkillId
         const jobId=req.session.jobId

        console.log(SkillId)
        // console.log("Quiz from session:", quiz);
        // console.log("Correct answers from session:", correctAnswers);

        if (!quiz || !correctAnswers) {
            return res.status(400).json({ error: 'Quiz session not found.' });
        }

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
    } catch (error) {
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