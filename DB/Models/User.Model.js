import { Schema,model } from "mongoose";
import {SystemRoles}from '../../src/utils/SystemRoles.js'
import pkg from'bcrypt'
const UserSchema = new Schema({
    UserName:{
        type:String,
        required:true,
        lowercase:true,
        unique:true,

    },
    Email:{
        type:String,
        unique:true,
        required:true,
        lowercase:true,

    },
    Password:{
        type:String,
        required:true,

    },
    ConfirmPassword:{
        type:String,
        required:true,
    },
    ProfilePic:{
        public_id:String,
        secure_url:String
    },
    Gender:{
        type:String,
        lowercase:true,
        enum:['female','male','not specified'],
        default:'not specified',
    },
    isConfirmed:{
        type:Boolean,
        required:true,
        default:false
    },
    Address:[{
        type:String,
        required:true
        },
        ],
    isDeleted:{
        type:Boolean,
        default:false,
    },
    token:{
        type:String,
    },
    Code:{
        type:String,
        default:null
    },
    role:{
        type:String,
        enum:[SystemRoles.User,SystemRoles.Admin,SystemRoles.Super],
        default:SystemRoles.User,
    },
    ChangePassAt:{
        type:Date
    },
    QuizMarks:[{
        Topic:String,
        Mark:Number,
    }],
    Age:Number,
    FirstName:String,
    LastName:String,
    professionalheadline:String,
},{timestamps:true}
)
UserSchema.pre("save",function(next,hash){
    this.Password=pkg.hashSync(this.Password,+process.env.SALT_ROUNDS)
    this.ConfirmPassword=this.Password
    next()
})
export const UserModel=model('User',UserSchema)