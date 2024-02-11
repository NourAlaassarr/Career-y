import { UserModel } from "../../../DB/Models/User.Model.js";
import { QuizModel } from '../../../DB/Models/Quiz.Model.js';
import { isAuth } from "../../Middleware/auth.js";

//Add Quiz 
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

//Add Questions
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

//Get quiz



// export const solve = async (req, res, next) => {
//     const { Quizname,answer } = req.body
//     let ans=0;
//     // console.log('====================================');
//     // console.log(req.body);
//     // console.log('====================================');
//     // console.log('====================================');
//     const Check_Quiz = await QuizModel.findOne({ Quizname })
//     if (!Check_Quiz) {
//         return next(new Error("Quiz doesn't exist", { cause: 400 }))
//     }
//     // console.log('====================================');
//     // console.log(Check_Quiz.questions);
//     // console.log('====================================');
//     // console.log('====================================');
//     // console.log(Check_Quiz.questions[0]);
//     // console.log('====================================')
//     if(Check_Quiz.questions[0]){
//         if(Check_Quiz.questions[0].answer==answer[0]){
//             console.log("yes")
//             ans++
//         }
//     }
//     if(Check_Quiz.questions[1]){
//         if(Check_Quiz.questions[1].answer==answer[1]){
//             console.log("yes")
//             ans++
//         }
//         console.log("no")
//     }
//     res.status(200).json({ Message: 'Your grade is', ans });
// }

//slove
export const solve = async (req, res, next) => {
    const { Quizname,answer } = req.body
    const UserId= req.authUser._id
    const User_exist= await UserModel.findById({_id:UserId})
    if(!User_exist){
        return next(new Error("User Not Found",{cause:404}))
    }
    let Grade=0;
    const Quizes=[]
    const Check_Quiz = await QuizModel.findOne({ Quizname })
    if (!Check_Quiz) {
        return next(new Error("Quiz doesn't exist", { cause: 400 }))
    }
    const CheckIfExamed=await UserModel.findOne({'QuizMarks.QuizName': Quizname})
    if(CheckIfExamed){
        return next(new Error("You have already taken this quiz", { cause: 400 }))
    }

    for (let i =0 ; i<quizLen;i++){
            if(Check_Quiz.questions[i].answer==answer[i]){
                {
                    Grade++
                }
    }
    }
    const QuizMarksOb={
        QuizId:Check_Quiz._id,
        QuizName:Quizname,
        Mark:Grade,
    }
    Quizes.push(QuizMarksOb)
    await UserModel.findByIdAndUpdate(UserId,{
        QuizMarks:Quizes
    })

    res.status(200).json({ Message: 'Your grade is',Grade });
}