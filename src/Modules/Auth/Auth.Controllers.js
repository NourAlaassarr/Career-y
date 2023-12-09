import { UserModel } from "../../../DB/Models/User.Model.js";
import pkg from 'bcrypt'
import {generateToken,VerifyToken}from'../../utils/TokenFunction.js'
import { sendmailService } from '../../Services/SendEmailService.js'
import { emailTemplate } from '../../utils/EmailTemplate.js'
import jwt from 'jsonwebtoken'; // Import jsonwebtoken library

export const SignUp = async (req, res, next) => {
    const{
        UserName,
        Email,
        Password,
        ConfirmPassword,
        Gender,
        Address,
        Age,
        FirstName,
        LastName

    }=req.body

    console.log(Email)
    //check if user Exists
    const Check_Email= await UserModel.findOne({Email})
    console.log(Check_Email)
    const check_Username= await UserModel.findOne({UserName})
    if(Check_Email){
        return next(new Error('Email is Already Exsit', { cause: 400 }))
    }
    if(check_Username){
        return next(new Error('Username is Already Exsit', { cause: 400 }))
    }
    if (Password != ConfirmPassword) {
        return next(new Error('Password doesn\'t match', { cause: 400 }))
    }
    // const hashed = pkg.hashSync(Password,+process.env.SALT_ROUNDS)
    const token=generateToken({
        payload:{
            Email,
        },
        signature:process.env.CONFIRMATION_EMAIL_TOKEN,
        expiresIn:'1d'
    })
    const ConfirmLink = `${req.protocol}://${req.headers.host}/Auth/Confirm/${token}`
    const isEmailSent = sendmailService({
        to: Email,
        subject: 'Confirmation Email',
        message: emailTemplate({
            link: ConfirmLink,
            linkData: 'Click here to Confirm',
            subject: 'Confirmation Email'
        })
        // `<a href=${ConfirmLink}>Click here to Confirm </a>`,
    })
    if (!isEmailSent) {
        return next(new Error('Failed to send Confirmation Email', { cause: 400 }))
    }

    const User = new UserModel({
        UserName,
        Password,
        ConfirmPassword,
        Gender,
        Address,
        Age,
        Email,
        FirstName,
        LastName
    })
    const SavedUser= await User.save()
    res.status(201).json({ Message: 'Created Successfully ', SavedUser })


    
}
