
import Jwt  from "jsonwebtoken"
import { VerifyToken, generateToken } from '../utils/TokenFunction.js'
import{Neo4jConnection} from'../../DB/Neo4j/Neo4j.js'

export const isAuth = (roles)=>{
    
    return async(req,res,next)=>{
        let session;
        const tokens = req.headers.token
    try{
        
        // console.log(tokens)
        if(!tokens)
        {
            return res.status(400).json({message: 'No token provided.'})
        }
        try{
        const decoded= VerifyToken({token:tokens,signature:process.env.SIGN_IN_TOKEN_SECRET})
        if(!decoded || !decoded._id )
        {
            return res.status(400).json({Message:'error invalid token!'})
        }
        // console.log(decoded)
        // const findUser = await UserModel.findById(decoded._id,
        //     'email userName role');
        //     // console.log(findUser)
        // if(!findUser)
        // {
        //     return res.status(400).json({Message:'Please Sign Up!'})
        // }
        
        

        const driver = await Neo4jConnection();
        session = driver.session()
        const result = await session.run(
            'MATCH (u:User) WHERE u._id = $_id RETURN u._id  AS _id, u.Email AS Email, u.UserName AS name, u.role AS role',
            { _id : decoded._id }
        );
        // console.log(result)
        if (result.records.length === 0) {
            return res.status(400).json({ Message: 'Please Sign Up!' });
        }
        const findUser = {
            _id: result.records[0].get('_id'),
            Email: result.records[0].get('Email'),
            name: result.records[0].get('name'),
            role: result.records[0].get('role'),
        }
        // console.log(findUser)
        // if(parseInt(decoded.ChangePassAt.GetTime()/1000)>decoded.iat)
        // {
        //     return res.status(400).json({Message:'token expired after change password'})
        // }
        
        console.log(roles)
        console.log(findUser.role)
        if (!roles.includes(findUser.role))
        {
            return next(new Error('unauthorized to acceess this api',{cause:401}))
        }
        console.log("finduser",findUser)
        req.authUser=findUser
        next()
    }
    catch(error){
        const driver = await Neo4jConnection();
        session = driver.session()
        if(error == 'TokenExpiredError: jwt expired')
        {
            const result = await session.run(
                'MATCH (user:User {token: $token}) RETURN user',
                { token: tokens }
            );
            console.log(result)
            // Check if the user exists
            const user = result.records[0].get('user');
            if (!result.records[0]) {
                return next(new Error('Error token', { cause: 500 }));
            }
            console.log(user)
            //generate NewToken
            const newToken = generateToken({
                payload: {
                    name: user.properties.UserName, 
                    _id: user.properties._id
                },
                signature: process.env.SIGN_IN_TOKEN_SECRET
            }, { expiresIn: '1h' });
            await session.run(
        'MATCH (user:User {token: $oldToken}) SET user.token = $newToken RETURN user',
        { oldToken: tokens, newToken: newToken }
    );
    return res.status(200).json({ message: 'Token refreshed', userToken: newToken });
            }
        console.log(error)
    return next (new Error('invalid tokenn',{cause:500}))
        }
    }
catch(error)
        {   console.log({"error":error.stack})
            return next (new Error('error',{cause:500}))
            
        }
finally{
    if (session) {
        await session.close();
    }
}

    }}
