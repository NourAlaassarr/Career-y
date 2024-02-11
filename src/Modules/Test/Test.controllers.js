import { asyncHandler } from "../../utils/ErrorHandling.js";
import pkg, { compareSync } from "bcrypt";
import { generateToken, VerifyToken } from "../../utils/TokenFunction.js";
import { sendmailService } from "../../Services/SendEmailService.js";
import { emailTemplate } from "../../utils/EmailTemplate.js";
import { v4 as uuidv4 } from 'uuid';
import { Neo4jConnection } from "../../../DB/Neo4j/Neo4j.js";

//SignUP
export const SignUp = async (req, res, next) => {
    const { UserName, Email, password, ConfirmPassword } = req.body;
    let session;

    const driver = await Neo4jConnection();
    session = driver.session(); // Create a new session
    const UserId = uuidv4();
    console.log("Query Parameter:", { Email });
    const checkUser = await session.run(
        "MATCH (u:User {Email: $Email}) RETURN u",
        { Email }
    );
    if (checkUser.records.length > 0) {
        return next(new Error("Email is Already Exist", { cause: 400 }));
    }
    if (password != ConfirmPassword) {
        return next(new Error("Password doesn't match", { cause: 400 }));
    }
    const hashed = pkg.hashSync(password, +process.env.SALT_ROUNDS);
    const token = generateToken({
        payload: {
            Email,
        },
        signature: process.env.CONFIRMATION_EMAIL_TOKEN,
        expiresIn: "1d",
    });
    const ConfirmLink = `${req.protocol}://${req.headers.host}/Auth/Confirm/${token}`;
    const isEmailSent = sendmailService({
        to: Email,
        subject: "Confirmation Email",
        message: emailTemplate({
            link: ConfirmLink,
            linkData: "Click here to Confirm",
            subject: "Confirmation Email",
        }),
        // `<a href=${ConfirmLink}>Click here to Confirm </a>`,
    });
    if (!isEmailSent) {
        return next(new Error("Failed to send Confirmation Email", { cause: 400 }));
    }
    const result = await session.run(
        'CREATE (u:User {_id: $UserId, UserName: $UserName, Email: $Email, password: $password, ConfirmPassword: $ConfirmPassword, role:"user"})RETURN u',
        { UserId, UserName, Email, password: hashed, ConfirmPassword: hashed }
    );
    
    const userResult = result.records[0].get("u").properties;
    
    res.status(201).json({ Message: "Created Successfully ", userResult });
    if (session) {
        await session.close();
    }
};

//SignIn
export const signIn = async (req, res, next) => {
    let session;

    const driver = await Neo4jConnection();
    session = driver.session();

    const { Email, password } = req.body;

    // Check if the user exists
    const result = await session.run("MATCH (u:User {Email: $Email}) RETURN u", {
        Email,
    });

    if (result.records.length === 0) {
        return res
            .status(401)
            .json({ success: false, message: "Invalid credentials" });
    }
    const userNode = result.records[0].get("u");
    const userProperties = userNode.properties;
    const isPasswordValid = await pkg.compare(password, userProperties.password);

    if (!isPasswordValid) {
        return res
            .status(401)
            .json({ success: false, message: "Invalid credentials" });
    }

    const token = generateToken({
        payload: {
            Email,
            _id: userProperties._id,
            role: userProperties.role,
        },
        signature: process.env.SIGN_IN_TOKEN_SECRET,
        expiresIn: "1h",
    });
    const updatedUserResult=await session.run(
        'MATCH (u:User) WHERE u._id = $_id SET u.token = $token, u.status = $status RETURN u',
        { _id:userProperties._id, token, status: 'Online' }
    );


    const updatedUserNode = updatedUserResult.records[0].get("u").properties;
    return res
        .status(200)
        .json({
            message: "Authentication successful",
            updatedUserNode,
        });

    if (session) {
        await session.close();
    }
};

//LogOut
export const LogOut = async (req, res, next) => {
    let session;
    const driver = await Neo4jConnection();
    session = driver.session();
    const UserId = req.authUser._id;
    const result = await session.run(
        "MATCH (u:User) WHERE u._id = $UserId SET u.status = $status RETURN u",
        {UserId, status: "Offline" }
    );

    const updatedUser = result.records[0].get("u").properties;

    if (!updatedUser) {
        return next(new Error("Error", { cause: 404 }));
    }

    res.status(200).json({ Message: "Successfully Logged Out" });
    if (session) {
        await session.close();
    }
};

//UserSolveQuiz(any quiz)
export const Solve=async(req,res,next)=>{
    const{answer}=req.body
    const{QuizId}=req.query
    const UserId= req.authUser._id

    let session
    const driver = await Neo4jConnection();
    session = driver.session(); // Create a new session
    let Grade=0;
    const Quizes=[]
    //Check if Quiz Exsits
    const ifQuizExists = await session.run(
        "MATCH (q:Quiz {_id: $QuizId}) RETURN q",
        { QuizId }
    )
    if (ifQuizExists.records.length == 0) {
        return next(new Error("Quiz does'\t exist", { cause: 400 }));
    }

    const QuizAttemps = await session.run(
        'MATCH (u:User {_id: $UserId})-[:TOOK]->(qa:Quiz {_id: $QuizId}) RETURN COUNT(qa) AS count',
        { UserId, QuizId }
    );
    
    const ISTAKEN = QuizAttemps.records[0].get("count").toNumber();

    if (ISTAKEN > 0) {
        // User has already taken the quiz
        return res.status(400).json({ Message: 'You have already taken this quiz' });
    } else {
  // Get Quiz information
    const QuizInfo = await session.run(
    'MATCH (q:Quiz {_id: $QuizId}) RETURN q.name AS QuizName',
    { QuizId }
);

const QuizName = QuizInfo.records[0].get("QuizName");

// Calculate Grade
const QuizAnswersResult = await session.run(
    "MATCH (q:Quiz {_id: $QuizId})-[:CONTAINS]->(question:Question) RETURN COLLECT(question.answer) AS answers",
    { QuizId }
);

const QuizAnswers = QuizAnswersResult.records[0].get("answers");


for (let i = 0; i < QuizAnswers.length; i++) {
    if (QuizAnswers[i] === answer[i]) {
    
        Grade++;
    }
}
 // Update user node with quiz results and create relationship
const result = await session.run(
    'MATCH (u:User {_id: $UserId}), (q:Quiz {_id: $QuizId}) ' +
    'CREATE (u)-[:TOOK { QuizName: $QuizName, Grade: $Grade }]->(q)',
    { UserId, QuizId, QuizName, Grade }
);

    res.status(200).json({ Message: 'Your grade is',Grade });

    }
    if (session) {
        await session.close();
    }
    

}
//UserGet All Grades+QuizName
export const GetALLMarksAndGrades=async(req,res,next)=>{
    const UserId= req.authUser._id

    let session
    const driver = await Neo4jConnection();
    session = driver.session();

const AllInfo =await session.run( "MATCH (u:User {_id: $UserId})-[took:TOOK]->(quiz:Quiz)RETURN u, COLLECT({ QuizName: quiz.QuizName, Grade: took.Grade }) AS takenQuizzes",{
    UserId
});

console.log(AllInfo)
    const user = AllInfo.records[0].get('u').properties;
    const takenQuizzes = AllInfo.records[0].get('takenQuizzes');

    console.log('User:', user);
    console.log('Taken Quizzes:', takenQuizzes);
res.status(200).json({Message:"DONE",user,takenQuizzes})
if (session) {
    await session.close();
}


}
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

// Get QuizTopicQuiz
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
//Get allTopicQuizzes
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




//Get AllTrackquizzes
//Get AllTracks
//gettrackquiz
//select specific track=>roadmap


