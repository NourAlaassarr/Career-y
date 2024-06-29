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

