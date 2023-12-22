import { UserModel } from "../../../DB/Models/User.Model.js";
import { QuizModel } from '../../../DB/Models/Quiz.Model.js';
import { isAuth } from "../../Middleware/auth.js";

// Add Quiz
// export const Add=async (req,res,next)=>{
//     const { Quizname} = req.body; 
//     console.log(req.body)
//     const newQuiz = new QuizModel({
//         Quizname:Quizname,
//         questions:[req.body]
//     })
//     const quiznew=await newQuiz.save()
//     res.status(200).json({ Message: "Created Successfully", quiznew })
// }

export const Add = async (req, res, next) => {
    try {
        const { Quizname, questions } = req.body;
        const Check_Quiz = await QuizModel.findOne({ Quizname })
        if (Check_Quiz) {
            return next(new Error("Quiz ALready exists", { cause: 400 }))
        }
        if (!Array.isArray(questions) || questions.length === 0) {
            return res.status(400).json({ Message: 'Questions array is required and cannot be empty.' });
        }

        const newQuiz = new QuizModel({
            Quizname,
            questions
        });

        const quiznew = await newQuiz.save();
        res.status(200).json({ Message: 'Created Successfully', quiznew });
    } catch (error) {
        console.error(error);
        res.status(500).json({ Message: 'Internal Server Error' });
    }
};

//Get quiz
export const Get = async (req, res, next) => {

    const { Quizname } = req.body;
    const Check_Quiz = await QuizModel.findOne({ Quizname })
    if (!Check_Quiz) {
        return next(new Error("Quiz doesn't exist", { cause: 400 }))
    }
    console.log(Check_Quiz)
    res.status(200).json({ Message: 'Done', Check_Quiz });
}


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
    const quizLen=Check_Quiz.questions.length
    console.log(quizLen)
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