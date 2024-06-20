
import {generateToken,VerifyToken}from'../../utils/TokenFunction.js'
import { v4 as uuidv4 } from 'uuid';
import { Neo4jConnection } from "../../../DB/Neo4j/Neo4j.js";


export const AddQuestionsToNode = async (req, res, next) => {
    let session;
    let tx;
    const { SkillId } = req.query;
    const { Questions } = req.body;
    const driver = await Neo4jConnection();
    session = driver.session();
    tx = session.beginTransaction();

    try {
        // Check if the quiz exists by QuizId
        const QuestionResults = await tx.run(
            "MATCH (q:Skill {Nodeid: $SkillId}) RETURN q",
            { SkillId }
        );

        if (QuestionResults.records.length === 0) {
            await tx.rollback();
            return next(new Error("Skill Doesn't exist", { cause: 404 }));
        }

        if (!Array.isArray(Questions) || Questions.length === 0) {
            await tx.rollback();
            return res.status(400).json({ Message: "Questions array is required and cannot be empty." });
        }

        const addedQuestions = await Promise.all(Questions.map(async (question, index) => {
            const { questionText, answer, options ,Level} = question;
            const questionId = uuidv4(); // Generate UUID for each question
            const order = index + 1; // Set the order based on the index

            const optionsWithIds = options.map(optionText => ({
                option_id: uuidv4(),
                option_text: optionText,
                correct: optionText === answer  // Mark correct if option matches answer
            }));


            // Create question node and its relationships in Neo4j
            const result = await tx.run(
                `MATCH (s:Skill {Nodeid: $SkillId})
                CREATE (s)-[:HAS_QUESTION]->(question:Question {
                    id: $questionId,
                    questionText: $questionText,
                    answer: $answer,
                    Level:$Level,
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
                { SkillId, questionId, questionText, Level,answer, optionsWithIds, order }
            );

            return result.records[0].get('question').properties;
        }));

        await tx.commit();
        res.status(200).json({ message: 'Created Successfully', questions: addedQuestions });
    } catch (error) {
        await tx.rollback();
        next(error);
    } finally {
        if (session) {
            await session.close();
        }
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
//             const { questionText, answer, options } = question;
//             const questionId = uuidv4(); // Generate UUID for each question
//             const order = index + 1; // Set the order based on the index

//             const result = await tx.run(
//                 'MATCH (q:Skill {Nodeid: $SkillId}) ' +
//                 'CREATE (q)-[:CONTAINS]->(question:Question {id: $questionId, questionText: $questionText, answer: $answer, options: $options, order: $order}) RETURN question',
//                 { SkillId, questionId, questionText, answer, options: Array.isArray(options) ? options : [options], order }
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

//DeleteNode
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

//Add Quiz Neo4j
// export const AddQuizNode = async (req, res, next) => {
//     let session;
//     try {
//         const { QuizName } = req.body;
//         const driver = await Neo4jConnection();
//         session = driver.session();

//         // Check if the quiz already exists
//         const result = await session.run(
//             "MATCH (q:Quiz {name: $quizname}) RETURN q",
//             { quizname: QuizName }
//         );

//         if (result.records.length > 0) {
//             return next(new Error("Quiz already exists", { cause: 400 }));
//         }
//         const QuizId = uuidv4();
//         // Create a new quiz node in Neo4j
//         const NewQuiz = await session.run(
//             "CREATE (q:TrackQuiz {id: $QuizId, name: $QuizName}) RETURN q",
//             { QuizId, QuizName }
//         );
//         const NewQuizNode = NewQuiz.records[0].get("q").properties;

//         res.status(200).json({ success: true, message: 'Created Successfully', Quiz: NewQuizNode });
//     } catch (error) {
//         next(error);
//     } finally {
//         if (session) {
//             await session.close();
//         }
//     }
// };


// //Get Random Quiz
// export const GetTrackQuiz = async (req, res, next) => {
//     const { jobId } = req.query; // Using query parameter for jobId
//     let session;
//     let driver; // Define driver variable in function scope

//     try {
//         const driver = await Neo4jConnection();
//         session = driver.session();

//         const result = await session.run(
//             `MATCH (job:Job {Nodeid: $jobId})-[:REQUIRES {mandatory: true}]->(skill:Skill)-[:HAS_QUESTION]->(question:Question)
//              OPTIONAL MATCH (question)-[r:HAS_OPTION]->(option:Option)
//              RETURN ID(question) AS questionId, skill.name AS skillName, question, COLLECT({ id: ID(option), optionText: option.optionText, correct: r.correct }) AS options`,
//             { jobId }
//         );
        
//         const skillsMap = new Map();
        
//         // Process the query results
//         result.records.forEach(record => {
//             const skillName = record.get('skillName');
//             const questionId = record.get('questionId');
//             const question = record.get('question').properties;
//             const options = record.get('options').map(option => ({
//                 id: option.id,
//                 optionText: option.optionText,
//                 correctId: option.correct ? option.id : null // Assign correctId based on option.correct
//             }));
        
//             if (!skillsMap.has(skillName)) {
//                 skillsMap.set(skillName, []);
//             }
//             skillsMap.get(skillName).push({ id: questionId, ...question, options });
//         });
        
//         console.log(skillsMap);
//         // Function to get random elements from an array
//         const getRandomElements = (arr, count) => {
//             const shuffled = arr.sort(() => 0.5 - Math.random());
//             return shuffled.slice(0, count);
//         };

//         // Randomly select 3 questions from each skill
//         const randomQuestions = [];
//         skillsMap.forEach((questions) => {
//             const selectedQuestions = getRandomElements(questions, 3); 
//             randomQuestions.push(...selectedQuestions);
//         });
        

//         // Format questions as required in the output
//         const formattedQuestions = randomQuestions.map((question, index) => ({
//             questionText: question.questionText,
//             options: question.options.map(option => option.optionText),
//             Level: question.Level,
//             order: index + 1
//         }));

//         res.status(200).json({ Message: 'Random Quiz', Questions: formattedQuestions });
//     } catch (error) {
//         console.error('Error fetching random quiz:', error);
//         res.status(500).json({ Message: 'Error fetching random quiz', Error: error.message });
//     } finally {
//         if (session) {
//             session.close();
//         }
//         if (driver) {
//             driver.close();
//         }
//     }
// };



export const getSpecificTrackSkill= async (req, res, next) => {
    const { jobId } = req.query;
    let session;
    const driver = await Neo4jConnection();
    session = driver.session();

    const result = await session.run(
        `MATCH (job:Job {Nodeid: $jobId})-[:REQUIRES {mandatory: false}]->(skill:Skill)
        RETURN skill`,
        { jobId }
    );
    const skills = result.records.map(record => record.get('skill').properties);
    res.status(200).json({ Message: 'Skills Retrieved Successfully', Skills: skills });
}

export const GetTrackQuiz = async (req, res, next) => {
    const { jobId ,SkillId} = req.query; 
    const {answer}=req.body
    let session;
    let driver; 

        driver = await Neo4jConnection();
        session = driver.session();
        
        const result = await session.run(
            `MATCH (job:Job {Nodeid: $jobId})-[:REQUIRES {mandatory: true}]->(skill:Skill)-[:HAS_QUESTION]->(question:Question)
             OPTIONAL MATCH (question)-[rel:HAS_OPTION]->(option:Option)
             WITH job, skill, question, option, rel, ID(question) AS questionId, option.id AS optionUUID
             OPTIONAL MATCH (question)-[correctRel:HAS_OPTION {correct: true}]->(correctOption:Option)
             RETURN questionId, skill.name AS skillName, question, COLLECT({ id: optionUUID, optionText: option.optionText, correct: rel.correct }) AS options, correctOption.id AS correctAnswerId`,
            { jobId }
        );
        const skillResult = await session.run(
            `MATCH (skill:Skill {Nodeid: $SkillId})-[:HAS_QUESTION]->(question:Question)
             OPTIONAL MATCH (question)-[rel:HAS_OPTION]->(option:Option)
             WITH skill, question, option, rel, ID(question) AS questionId, option.id AS optionUUID
             OPTIONAL MATCH (question)-[correctRel:HAS_OPTION {correct: true}]->(correctOption:Option)
             RETURN questionId, skill.name AS skillName, question, COLLECT({ id: optionUUID, optionText: option.optionText, correct: rel.correct }) AS options, correctOption.id AS correctAnswerId`,
            { SkillId }
        );

        const skillsMap = new Map();

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

        // res.status(200).json({ Message: 'Random Quiz', Questions: formattedQuestions });

        let Grade = 0;
        answer.forEach(userAnswer => {
            const correctAnswer = questionIdsAndCorrectIds.find(q => q.questionId === userAnswer.questionId);
            if (correctAnswer && userAnswer.answerId === correctAnswer.correctId) {
                Grade++;
            }
        });

        // Determine pass status based on grade
        const totalQuestions = randomQuestions.length;
        const Pass = Grade > totalQuestions / 2;

        res.status(200).json({ Message: 'Quiz Results', Questions: formattedQuestions, Grade: Grade, TotalQuestions: totalQuestions, Pass: Pass });

            session.close();
        
        
    }

