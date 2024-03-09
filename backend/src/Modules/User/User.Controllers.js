import { UserModel } from "../../../DB/Models/User.Model.js";

//UserSolveQuiz(any quiz) in Neo4j
export const Solve=async(req,res,next)=>{
    const{answer}=req.body
    const{QuizId}=req.query
    const UserId= req.authUser._id

    let session
    const driver = await Neo4jConnection();
    session = driver.session(); 
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
//UserGet All Grades+QuizName Neo4j
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


// //Add skills
// export const AddSkills = async (req,res,next)=>{
//     const {Skills}=req.body
//     // console.log (req.body)
//     const UserId = req.authUser._id
//     const updatedUser = await UserModel.findOneAndUpdate(
//         { _id: UserId, status: 'Online' },
//         {
//         $push: {
//             Skills: Skills,
//         },
//         },
//         { new: true } 
//     );

//     if (!updatedUser) {
//         return res.status(400).json({ error: 'Please SignIn to continue' });
//     }
//     res.status(200).json({ Message: " successfully Added", updatedUser })
// }

//Recommend GapSkillsin each track

// //Add CareerGoal
// export const AddCareerGoal = async (req,res,next)=>{
//     const {CareerGoal}=req.body
//     // console.log (req.body)
//     const UserId = req.authUser._id
//     const updatedUser = await UserModel.findOneAndUpdate(
//         { _id: UserId, status: 'Online' },
//         {
//         CareerGoal:CareerGoal,
//         },
//         { new: true } 
//     );

//     if (!updatedUser) {
//         return res.status(400).json({ error: 'Please SignIn to continue' });
//     }
//     res.status(200).json({ Message: " successfully Added", updatedUser })
// }

