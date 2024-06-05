
import {generateToken,VerifyToken}from'../../utils/TokenFunction.js'
import { v4 as uuidv4 } from 'uuid';
import { Neo4jConnection } from "../../../DB/Neo4j/Neo4j.js";


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
//             "CREATE (q:Quiz {id: $QuizId, name: $QuizName}) RETURN q",
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
            const { questionText, answer, options } = question;
            const questionId = uuidv4(); // Generate UUID for each question
            const order = index + 1; // Set the order based on the index

            const result = await tx.run(
                'MATCH (q:Skill {Nodeid: $SkillId}) ' +
                'CREATE (q)-[:CONTAINS]->(question:Question {id: $questionId, questionText: $questionText, answer: $answer, options: $options, order: $order}) RETURN question',
                { SkillId, questionId, questionText, answer, options: Array.isArray(options) ? options : [options], order }
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

// Get QuizTopicQuiz neo4j
export const GetQuiz = async (req, res, next) => {
    const { SkillId } = req.query;
    let session;

    try {
        const driver = await Neo4jConnection();
        session = driver.session();

        const quizResult = await session.run(
            "MATCH (q:Skill {Nodeid: $SkillId})-[:CONTAINS]->(question:Question) WITH q, question ORDER BY question.order RETURN q, COLLECT({id: question.id, questionText: question.questionText, options: question.options, order: question.order}) AS questions",
            { SkillId }
        );

        if (quizResult.records.length === 0) {
            return next(new Error("Skill Not found", { cause: 404 }));
        }

        const quiz = quizResult.records[0].get("q").properties;
        const questions = quizResult.records[0].get("questions").map(question => question);
        
        res.status(200).json({ Message: 'Done',QuizName:quiz.name,  Questions: questions });
    } catch (error) {
        next(error);
    } finally {
        if (session) {
            await session.close();
        }
    }
};

//Get allTopicQuizzes neo4j
export const GetAllQuizzes = async (req, res, next) => {
    let session;
    const driver = await Neo4jConnection();
    session = driver.session();

    // Match all skills that have a "CONTAINS" relationship and return their names

        const AllQuizzes = await session.run(
            "MATCH (s:Skill)-[:CONTAINS]->(:Question) RETURN DISTINCT s.name AS name"
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



//FullTrackQuiz