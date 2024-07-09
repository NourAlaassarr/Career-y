import { Neo4jConnection } from "../../../DB/Neo4j/Neo4j.js";
import { convertNeo4jDatetimeToISO } from "../../utils/ConverNeo4jDateTimes.js";
//admin- get all user 
export const GetAllUsers = async(req,res,next)=>{
    let session;
    const driver = await Neo4jConnection();
    session = driver.session();
    const AllUsers = await session.run(`Match (u:User) return u`);
    res.status(200).json(AllUsers.records.map(record => record.get('u').properties));
}


//delete user
export const DeleteUser = async(req,res,next)=>{
    let session;
    const driver = await Neo4jConnection();
    const{UserId}=req.query;
    session = driver.session();
    await session.run(`MATCH (u:User) WHERE u._id = $UserId DETACH DELETE u`,{UserId});
    res.status(200).json({Message:"User Deleted Successfully"});
}



export const GetFeedbacks = async (req, res, next) => {
    let session;
    try {
        const driver = await Neo4jConnection();
        session = driver.session();
        const Feedbacks = await session.run(`Match (u:Feedback) return u`);
        
        const feedbackList = Feedbacks.records.map(record => {
            const feedback = record.get('u').properties;
            return {
                ...feedback,
                createdAt: convertNeo4jDatetimeToISO(feedback.createdAt),
                updatedAt: convertNeo4jDatetimeToISO(feedback.updatedAt),
            };
        });

        res.status(200).json(feedbackList);
    } catch (error) {
        next(error);
    } finally {
        if (session) {
            await session.close();
        }
    }
};
