import { Schema,model } from "mongoose";


const QuizQuestionsSchema = new Schema({

    QuizName:{
        ref:'Quiz',
        type:Schema.ObjectId,
    },
    
    questions:[{
        QuestionId:{
            type:String,
            required:true
        },
        questionText:{
            type: String, 
            required: true
        },
        answer: {
            type: String,
            required: true
        },
        options:{
            type  :Array,
            default:[]
        }
    }]
})

export const QuizQuestionsModel = model('Question',QuizQuestionsSchema)