import { Schema, model } from "mongoose";


const QuizSchema = new Schema({

    Quizname: {
        type: String,
        requires: true,
        unique:true,
    },
    level:Number,
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

export const QuizModel = model('Quiz', QuizSchema)