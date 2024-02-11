import { UserModel } from "../../../DB/Models/User.Model.js";





//Add skills
export const AddSkills = async (req,res,next)=>{
    const {Skills}=req.body
    // console.log (req.body)
    const UserId = req.authUser._id
    const updatedUser = await UserModel.findOneAndUpdate(
        { _id: UserId, status: 'Online' },
        {
        $push: {
            Skills: Skills,
        },
        },
        { new: true } 
    );

    if (!updatedUser) {
        return res.status(400).json({ error: 'Please SignIn to continue' });
    }
    res.status(200).json({ Message: " successfully Added", updatedUser })
}

//Add CareerGoal
export const AddCareerGoal = async (req,res,next)=>{
    const {CareerGoal}=req.body
    // console.log (req.body)
    const UserId = req.authUser._id
    const updatedUser = await UserModel.findOneAndUpdate(
        { _id: UserId, status: 'Online' },
        {
        CareerGoal:CareerGoal,
        },
        { new: true } 
    );

    if (!updatedUser) {
        return res.status(400).json({ error: 'Please SignIn to continue' });
    }
    res.status(200).json({ Message: " successfully Added", updatedUser })
}