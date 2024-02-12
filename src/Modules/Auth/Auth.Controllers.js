import { UserModel } from "../../../DB/Models/User.Model.js";
import {generateToken,VerifyToken}from'../../utils/TokenFunction.js'
import { sendmailService } from '../../Services/SendEmailService.js'
import { emailTemplate } from '../../utils/EmailTemplate.js'
import jwt from 'jsonwebtoken'; // Import jsonwebtoken library
import { asyncHandler } from "../../utils/ErrorHandling.js";
import pkg, { compareSync } from "bcrypt";


import { v4 as uuidv4 } from 'uuid';
import { Neo4jConnection } from "../../../DB/Neo4j/Neo4j.js";

//SignUP in Neo4j
export const SignUp = async (req, res, next) => {
    const { UserName, Email, password, ConfirmPassword } = req.body;
    let session;

    const driver = await Neo4jConnection();
    session = driver.session(); // Create a new session
    const UserId = uuidv4();
    console.log("Query Parameter:", { Email });
    //CheckEmail
    const checkUser = await session.run(
        "MATCH (u:User {Email: $Email}) RETURN u",
        { Email }
    );
    if (checkUser.records.length > 0) {
        return next(new Error("Email is Already Exist", { cause: 400 }));
    }

    //UsernameCheck
    const UsernameCheck = await session.run(
        "MATCH (u:User {UserName: $UserName}) RETURN u",
        { UserName }
    );
    if (UsernameCheck.records.length > 0) {
        return next(new Error("UserName Already Exists", { cause: 400 }));
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

//SignIn in Neo4j
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

//LogOut in Neo4j
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







//To be Updated isa
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










