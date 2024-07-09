
import {generateToken,VerifyToken}from'../../utils/TokenFunction.js'
import { sendmailService } from '../../Services/SendEmailService.js'
import { emailTemplate } from '../../utils/EmailTemplate.js'
import jwt from 'jsonwebtoken'; // Import jsonwebtoken library
import { asyncHandler } from "../../utils/ErrorHandling.js";
import pkg, { compareSync } from "bcrypt";
import { customAlphabet } from 'nanoid';

import { v4 as uuidv4 } from 'uuid';
import { Neo4jConnection } from "../../../DB/Neo4j/Neo4j.js";
import { nanoid } from 'nanoid';


//AdminSignUp
export const AdminSignUp = async (req, res, next) => {
    const { UserName, Email, password, ConfirmPassword} = req.body;
    if (!UserName || !Email || !password || !ConfirmPassword) {
        return next(new Error("All fields must be filled out", { cause: 400 }));
    }
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
    console.log(isEmailSent)
    if (!isEmailSent) {
        return next(new Error("Failed to send Confirmation Email", { cause: 400 }));
    }
    const result = await session.run(
        'CREATE (u:User {_id: $UserId, UserName: $UserName, Email: $Email, password: $password, ConfirmPassword: $ConfirmPassword, role:"admin", isConfirmed: false}) RETURN u',
        { UserId, UserName, Email, password: hashed, ConfirmPassword: hashed }
    );
    
    const userResult = result.records[0].get("u").properties;
    await session.close();
    res.status(201).json({ Message: "Created Successfully ", userResult });

};

//instructorSignUp
export const InstructorSignUp = async (req, res, next) => {
    const { UserName, Email, password, ConfirmPassword} = req.body;
    if (!UserName || !Email || !password || !ConfirmPassword) {
        return next(new Error("All fields must be filled out", { cause: 400 }));
    }
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
    console.log(isEmailSent)
    if (!isEmailSent) {
        return next(new Error("Failed to send Confirmation Email", { cause: 400 }));
    }
    const result = await session.run(
        'CREATE (u:User {_id: $UserId, UserName: $UserName, Email: $Email, password: $password, ConfirmPassword: $ConfirmPassword, role:"instructor", isConfirmed: false}) RETURN u',
        { UserId, UserName, Email, password: hashed, ConfirmPassword: hashed }
    );
    
    const userResult = result.records[0].get("u").properties;
    await session.close();
    res.status(201).json({ Message: "Created Successfully ", userResult });

};

//SignUP in Neo4j
export const SignUp = async (req, res, next) => {
    const { UserName, Email, password, ConfirmPassword } = req.body;
    if (!UserName || !Email || !password || !ConfirmPassword) {
        return next(new Error("All fields must be filled out", { cause: 400 }));
    }
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
    console.log(isEmailSent)
    if (!isEmailSent) {
        return next(new Error("Failed to send Confirmation Email", { cause: 400 }));
    }
    const result = await session.run(
        'CREATE (u:User {_id: $UserId, UserName: $UserName, Email: $Email, password: $password, ConfirmPassword: $ConfirmPassword, role:"user", isConfirmed: false}) RETURN u',
        { UserId, UserName, Email, password: hashed, ConfirmPassword: hashed }
    );
    
    const userResult = result.records[0].get("u").properties;
    await session.close();
    res.status(201).json({ Message: "Created Successfully ", userResult });
   
};

//SignIn in Neo4j
export const signIn = async (req, res, next) => {
    let session;

    const driver = await Neo4jConnection();
    session = driver.session();

    const { Email, Password } = req.body;

    // Check if the user exists
    const result = await session.run("MATCH (u:User {Email: $Email}) RETURN u", {
        Email,
    });

    if (result.records.length === 0) {
        return next(new Error("Invalid credentials", { cause: 400 }));
    }
    const userNode = result.records[0].get("u");
    const userProperties = userNode.properties;
    
    const isPasswordValid = pkg.compareSync(Password, userProperties.password);
console.log(isPasswordValid)
    if (!isPasswordValid) {
        return next(new Error("Invalid credentials", { cause: 400 }));
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
    await session.close();
    res.status(200).json({message: "Authentication successful",updatedUserNode,});

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
    session.close();
    res.status(200).json({ Message: "Successfully Logged Out" });

};

//Confirm Email
export const ConfirmEmail = async (req, res, next) => {
        const { token } = req.params;
        const decoded = VerifyToken({ token, signature: process.env.CONFIRMATION_EMAIL_TOKEN });
    
        let session;
        const driver = await Neo4jConnection();
        session = driver.session(); 
    
        const result = await session.run(
            'MATCH (u:User {Email: $Email, isConfirmed: false}) SET u.isConfirmed = true RETURN u',
            { Email: decoded.Email }
        );
    
        const user = result.records[0]?.get("u")?.properties;
    
        if (!user) {
            return next(new Error('Already Confirmed', { cause: 400 }));
        }
        await session.close();
        res.status(200).json({ message: 'Successfully confirmed, try to log in' });
    
        
    };
    
//Change Password
export const ChangePassword=async(req,res,next)=>{
        const UserId = req.authUser._id
        let session;
        const{
                OldPassword,
                NewPassword,
                ConfirmNewPassword,
            }=req.body

    const driver = await Neo4jConnection();
    session = driver.session();
const result = await session.run("MATCH (u:User {_id: $UserId}) RETURN u", {
    UserId,
    });

    if (result.records.length === 0) {
        return next(new Error("User Not Found",{cause:404}))
    }
    const Passwordcheck = pkg.compareSync(OldPassword, result.records[0].get("u").properties.password);
    if (!Passwordcheck) {
        return next(new Error('incorrect password', { cause: 400 }))
    }
    if (NewPassword != ConfirmNewPassword) {
            return next(new Error('Password doesn\'t match', { cause: 400 }))
                }

        const newPassHashed = pkg.hashSync(NewPassword, +process.env.SALT_ROUNDS);
        
        const NewPass = await session.run(
            'MATCH (u:User {_id: $userId}) ' +
            'SET u.password = $newPassHashed, u.ConfirmPassword = $newPassHashed ' +
            'RETURN u',
            { userId: UserId, newPassHashed }
        );

        const updatedUser = NewPass.records[0].get('u').properties;
        await session.close();
        res.status(200).json({ message: 'Successfully Changed Password', updatedUser });
        
    
}

//forget pass
// export const ForgetPassword= async(req,res,next)=>{
//     const {Email}=req.body
//     let session;
//     const driver = await Neo4jConnection();
//     session = driver.session(); 
//     const numericNanoid = customAlphabet('1234567890', 4);

//     const result = await session.run(
//         'MATCH (u:User {Email: $Email}) RETURN u',
//         { Email }
//     );

//     if (result.records.length === 0) {
//         return next(new Error("User Not Found",{cause:404}))
// }
// const Code =numericNanoid();
// const HashedCode = pkg.hashSync(Code,+process.env.SALT_ROUNDS)
// const token = generateToken({
//     payload: {
//         Email,
//         sentCode: HashedCode,
//     },
//     signature: process.env.RESET_PASS_TOKEN,
//     expiresIn: '1h',
// })
// const ResetPasswordLink = `${req.protocol}://${req.headers.host}/Auth/reset/${token}`
//     const isEmailSent = sendmailService({
//         to: Email,
//         subject: 'Reset Password',
//         message: emailTemplate({
//             link: ResetPasswordLink,
//             linkData: `Click here to Reset Password`,
//             subject: `Your OTP is ${Code}`
//         })
//     })
//     if (!isEmailSent) {
//         return next(new Error('Failed to send Reset Password Email', { cause: 400 }))
//     }
    
//     session = driver.session();
//     const updateuser = await session.run(
//     'MATCH (u:User {Email: $email}) ' +
//     'SET u.Code = $hashedCode ' +
//     'RETURN u',
//     { email:Email, hashedCode: HashedCode }
// );

// const updatedUser = result.records[0].get('u').properties;

// session.close();


// res.status(200).json({ Message: 'Done', updatedUser, ResetPasswordLink })
// }

//forget pass
export const ForgetPassword= async(req,res,next)=>{
    // console.log("helllllllllllld")
    const {Email}=req.body
    let session;
    const driver = await Neo4jConnection();
    session = driver.session(); 

    const result = await session.run(
        'MATCH (u:User {Email: $Email}) RETURN u',
        { Email }
    );

    if (result.records.length === 0) {
        return next(new Error("User Not Found",{cause:404}))
}
const Code =nanoid()
const HashedCode = pkg.hashSync(Code,+process.env.SALT_ROUNDS)
const token = generateToken({
    payload: {
        Email,
        sentCode: HashedCode,
    },
    signature: process.env.RESET_PASS_TOKEN,
    expiresIn: '1h',
})
const ResetPasswordLink = `${req.headers.origin}/reset-password`
console.log(req.protocol)
console.log(req.headers.host)
// const ResetPasswordLink = `https://career-y-production.up.railway.app/Auth/reset/${token}`
    const isEmailSent = sendmailService({
        to: Email,
        subject: 'Reset Password',
        message: emailTemplate({
            link: ResetPasswordLink,
            linkData: 'Click here to Reset Password',
            subject: 'Reset Password',
        })
    })
    if (!isEmailSent) {
        return next(new Error('Failed to send Reset Password Email', { cause: 400 }))
    }
    
    session = driver.session();
    const updateuser = await session.run(
    'MATCH (u:User {Email: $email}) ' +
    'SET u.Code = $hashedCode ' +
    'RETURN u',
    { email:Email, hashedCode: HashedCode }
);

const updatedUser = result.records[0].get('u').properties;

session.close();


res.status(200).json({ Message: 'Done', updatedUser, ForgetPassToken:token ,ResetPasswordLink })
}


//reset pass
// export const reset = async (req, res, next) => {
//     const { token } = req.params;
//     const { NewPassword,code } = req.body;
//     const decoded = VerifyToken({ token, signature: process.env.RESET_PASS_TOKEN });
//     const { Email,sentCode} = decoded;
//     let session;
//     const driver = await Neo4jConnection();
//     session = driver.session(); 
//     if(!code){
//         return next(new Error('OTP Required', { cause: 400 }))
//     }
    
//     const user = await session.run(
//         'MATCH (u:User {Email: $email, Code: $code}) RETURN u',
//         { email: Email, code: sentCode }
//     );
    
//     if (user.records.length === 0) {
//         // User not found
//         return next(new Error('you already rest your password, try to login', { cause: 400 }))
//     }
//     const isValidOTP = pkg.compareSync(code, sentCode);

//     if (!isValidOTP) {
//         return next(new Error('Invalid or expired OTP', { cause: 400 }));
//     }
//     const NewPasswordHashed = pkg.hashSync(NewPassword, +process.env.SALT_ROUNDS);

//     const ResetPassword = await session.run(
//         'MATCH (u:User {Email: $email, Code: $code}) ' +
//         'SET u.password = $newPassword, u.ConfirmPassword=$newPassword, u.Code = null, u.ChangePassAt = $changePassAt ' +
//         'RETURN u',
//         {
//             email: decoded?.Email,
//             code: decoded?.sentCode,
//             newPassword: NewPasswordHashed,
//             changePassAt: Date.now()
//         }
//     );
    
    
//     session.close(); // Close the Neo4j session
//     res.status(200).json({ Message: 'Password Reset Successful'});
// };

export const reset = async (req, res, next) => {
    const { token } = req.query;
    const { NewPassword } = req.body;
    const decoded = VerifyToken({ token, signature: process.env.RESET_PASS_TOKEN });
    let session;
    const driver = await Neo4jConnection();
    session = driver.session(); 


    
    const user = await session.run(
        'MATCH (u:User {Email: $email, Code: $code}) RETURN u',
        { email: decoded?.Email, code: decoded?.sentCode }
    );
    
    if (user.records.length === 0) {
        // User not found
        return next(new Error('you already rest your password, try to login', { cause: 400 }))
    }
    const NewPasswordHashed = pkg.hashSync(NewPassword, +process.env.SALT_ROUNDS);
    const ResetPassword = await session.run(
        'MATCH (u:User {Email: $email, Code: $code}) ' +
        'SET u.password = $newPassword, u.Code = null, u.ChangePassAt = $changePassAt ' +
        'RETURN u',
        {
            email: decoded?.Email,
            code: decoded?.sentCode,
            newPassword: NewPasswordHashed,
            changePassAt: Date.now()
        }
    );
    
    
    session.close(); // Close the Neo4j session
    res.status(200).json({ Message: 'Password Reset Successful'});
};

