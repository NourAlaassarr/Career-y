import { Router } from "express";
import * as UserContollers from './User.Controllers.js'
import { asyncHandler } from "../../utils/ErrorHandling.js";
import  {isAuth} from'../../Middleware/auth.js'


const router = Router()


router.post('/Solve',isAuth(),asyncHandler(UserContollers.Solve))
router.get('/AllSolved',isAuth(),asyncHandler(UserContollers.GetALLMarksAndGrades))






// router.post('/AddSkills',isAuth(),asyncHandler(UserContollers.AddSkills))
// router.post('/AddCareerGoal',isAuth(),asyncHandler(UserContollers.AddCareerGoal))

export default router