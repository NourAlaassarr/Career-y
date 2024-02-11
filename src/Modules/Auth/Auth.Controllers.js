import { UserModel } from "../../../DB/Models/User.Model.js";
import pkg, { compareSync } from 'bcrypt'
import {generateToken,VerifyToken}from'../../utils/TokenFunction.js'
import { sendmailService } from '../../Services/SendEmailService.js'
import { emailTemplate } from '../../utils/EmailTemplate.js'
import jwt from 'jsonwebtoken'; // Import jsonwebtoken library


//SignUp
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


//confirm Email
export const ConfirmEmail = async (req,res,next)=>{
    const{
        token
    }=req.params
    const decoded  = VerifyToken({token,signature:process.env.CONFIRMATION_EMAIL_TOKEN})
    const User= await UserModel.findOneAndUpdate({Email:decoded.Email,isConfirmed:false},
        {
        isConfirmed:true},
        {
            new:true
        })
        if (!User) {
            return next(new Error('Already Confirmed', { cause: 400 }))
        }
        res.status(200).json({ message: 'Successfully confirmed,Try to log in' })
    }
    

//SignIn
export const SignIn = async(req,res,next)=>{
    const {
        Email,
        Password,
    }=req.body
    console.log(req.body);
    const is_User_Exist=await UserModel.findOne({Email})
    if(!is_User_Exist){
        return next(new Error('Invalid credentials', { cause: 400 }))
    }
    console.log(is_User_Exist.Password);
    const Password_Corerct=pkg.compareSync(Password,is_User_Exist.Password)
    console.log(Password_Corerct);
    if(!Password_Corerct){
        return next(new Error('Invalid credentials', { cause: 400 }))
    }
    // const pac_=await UserModel.findOne({Password})
    const token = generateToken({
        payload:{
        
            Email,
            _id:is_User_Exist._id,
            role:is_User_Exist.role
        },
        signature:process.env.SIGN_IN_TOKEN_SECRET,
        expiresIn: '1h',
    })
    const user = await UserModel.findOneAndUpdate({ Email }, {
        token,
        status: 'Online',
    }, { new: true })
    res.status(200).json({ Message: "successfully Logged IN", user })
        
    

}

//LogOut
export const LogOut= async(req,res,next)=>{
const UserId = req.authUser
console.log(UserId)
const findifOnlineUser= await UserModel.findByIdAndUpdate({_id:UserId._id},{
    status:'Offline'
})
console.log(findifOnlineUser)
if(!findifOnlineUser){
    return next(new Error('Error', { cause: 404 }))
}
res.status(200).json({ Message: "successfully Logged Out" })

}
//change pass
export const ChangePassword=async(req,res,next)=>{
    const{
        OldPassword,
        NewPassword,
        ConfirmNewPassword,
    }=req.body
    
    const UserId=req.authUser
    const User_exist= await UserModel.findById({_id:UserId._id})

    if(!User_exist){
        return next(new Error("User Not Found",{cause:404}))
    }
    const UserOldpass=compareSync(OldPassword,User_exist.Password)

    if(!UserOldpass){
        return next(new Error('incorrect password', { cause: 400 }))
    }
    if (NewPassword != ConfirmNewPassword) {
        return next(new Error('Password doesn\'t match', { cause: 400 }))
    }
    const newpass=pkg.hashSync(NewPassword,+process.env.SALT_ROUNDS)
    
    const updatedPass = await UserModel.findOneAndUpdate({_id:UserId},
        {Password:newpass,
        ConfirmPassword:newpass},{
            new:true
        })
    
    res.status(200).json({ Message: " Password successfully Changed", updatedPass })

}

//forget pass
export const ForgetPassword= async(req,res,next)=>{

}

//reset pass










