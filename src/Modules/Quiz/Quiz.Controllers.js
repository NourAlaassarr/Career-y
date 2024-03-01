
import { QuizModel } from '../../../DB/Models/Quiz.Model.js';
import {generateToken,VerifyToken}from'../../utils/TokenFunction.js'
import { v4 as uuidv4 } from 'uuid';
import { Neo4jConnection } from "../../../DB/Neo4j/Neo4j.js";


//Add Quiz Neo4j
export const AddQuizNode = async (req, res, next) => {
    let session;
    try {
        const { QuizName } = req.body;
        const driver = await Neo4jConnection();
        session = driver.session();

        // Check if the quiz already exists
        const result = await session.run(
            "MATCH (q:Quiz {name: $quizname}) RETURN q",
            { quizname: QuizName }
        );

        if (result.records.length > 0) {
            return next(new Error("Quiz already exists", { cause: 400 }));
        }

        // Create a new quiz node in Neo4j
        const NewQuiz = await session.run(
            "CREATE (q:Quiz {name: $QuizName}) RETURN q",
            { QuizName }
        );
        const NewQuizNode = NewQuiz.records[0].get("q").properties;

        res.status(200).json({ success: true, message: 'Created Successfully', Quiz: NewQuizNode });
    } catch (error) {
        next(error);
    } finally {
        if (session) {
            await session.close();
        }
    }
};

//Add Questions neo4j
export const AddQuestionsToNode = async (req, res, next) => {
    let session;
    let tx;

    const { QuizName, Questions } = req.body;
    const driver = await Neo4jConnection();
    session = driver.session();
    tx = session.beginTransaction();

    const QuizResult = await tx.run(
        "MATCH (q:Quiz {name: $quizname}) RETURN q",
        { quizname: QuizName }
    );

    if (QuizResult.records.length === 0) {
        return next(new Error("Quiz Doesn't exist", { cause: 404 }));
    }

    if (!Array.isArray(Questions) || Questions.length === 0) {
        return res.status(400).json({ Message: "Questions array is required and cannot be empty." });
    }

    const addedQuestions = await Promise.all(Questions.map(async (question) => {
        const { questionText, answer, options } = question; 
        const result = await tx.run(
            'MATCH (q:Quiz {name: $QuizName}) ' +
            'CREATE (q)-[:CONTAINS]->(question:Question {questionText: $questionText, answer: $answer, options: $options}) RETURN question',
            { QuizName, questionText, answer, options: Array.isArray(options) ? options : [options] }
        );
        return result.records[0].get('question').properties;
    }));

    await tx.commit();

    res.status(200).json({ message: 'Created Successfully', questions: addedQuestions });

    if (session) {
        await session.close();
    }
}

// Get QuizTopicQuiz neo4j
export const GetQuiz = async (req, res, next) => {
    const { QuizName } = req.body;
    let session;

        const driver = await Neo4jConnection();
        session = driver.session();

        const quizResult = await session.run(
            "MATCH (q:Quiz {QuizName: $QuizName})-[:CONTAINS]->(question:Question) RETURN q, COLLECT(question) AS questions",
            { QuizName }
        );

        if (quizResult.records.length === 0) {
            return next(new Error("Quiz Not found", { cause: 404 }));
        }

        const quiz = quizResult.records[0].get("q").properties;
        const questions = quizResult.records[0].get("questions").map(question => question.properties);

        res.status(200).json({ Message: 'Done', Quiz: quiz, Questions: questions });
    
        if (session) {
            await session.close();
        }
};
//Get allTopicQuizzes neo4j
export const GetAllQuizzes = async (req, res, next) => {
    let session;

        const driver = await Neo4jConnection();
        session = driver.session();

        const AllQuizzes = await session.run("MATCH (q:Quiz) RETURN q",)

        if (AllQuizzes.records.length === 0) {
            return next(new Error("No Quizzes Found", { cause: 404 }));
        }

        const quiz = AllQuizzes.records[0].get("q").properties;

        res.status(200).json({ Message: 'Done', Quizzes: quiz });
    
        if (session) {
            await session.close();
        }
};

//FullTrackQuiz






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
