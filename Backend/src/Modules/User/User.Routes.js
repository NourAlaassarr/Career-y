import { Router } from "express";
import * as UserContollers from './User.Controllers.js'
import { asyncHandler } from "../../utils/ErrorHandling.js";
import  {isAuth} from'../../Middleware/auth.js'
import { ValidationCoreFunction } from '../../Middleware/Validation.js'
import {UserApiRoles}from './User.endpoints.js'
import * as UserValidation from './User.validation.js'
const router = Router()



router.get('/GetAllMarks',isAuth(UserApiRoles.GetALLMarksAndGrades),ValidationCoreFunction(UserValidation.GetAllMarks),asyncHandler(UserContollers.GetALLMarksAndGrades))
router.post('/AddCareerGoal',isAuth(UserApiRoles.AddCareerGoal),ValidationCoreFunction(UserValidation.AddCareerGoal),asyncHandler(UserContollers.AddCareerGoal))
router.post('/AddSkills',isAuth(UserApiRoles.AddSkills),ValidationCoreFunction(UserValidation.AddSkills),asyncHandler(UserContollers.AddSkills))
router.get('/GapSkills',isAuth(UserApiRoles.GapSkills),ValidationCoreFunction(UserValidation.GapSkills),asyncHandler(UserContollers.GapSkills))
router.get('/RecommendTracks',isAuth(UserApiRoles.RecommendTracks),ValidationCoreFunction(UserValidation.RecommendTracks),asyncHandler(UserContollers.RecommendTracks))
router.get('/GetUserDetails',isAuth(UserApiRoles.GetUserDetails),ValidationCoreFunction(UserValidation.GetUserDetails),asyncHandler(UserContollers.GetUserDetails))

router.get('/CareerGoalUserProgress',isAuth(UserApiRoles.CareerGoalUserProgress),ValidationCoreFunction(UserValidation.CareerGoalUserProgress),asyncHandler(UserContollers.CareerGoalUserProgress))
router.get('/GetAllSkills',isAuth(UserApiRoles.GetALLUserSkills),ValidationCoreFunction(UserValidation.GetALLUserSkills),asyncHandler(UserContollers.GetALLUserSkills))

router.post('/AddFeedBack',isAuth(UserApiRoles.AddFeedBack),ValidationCoreFunction(UserValidation.AddFeedBack),asyncHandler(UserContollers.AddFeedBack))
router.patch('/UpdateFeedBack',isAuth(UserApiRoles.UpdateFeedBack),ValidationCoreFunction(UserValidation.Update),asyncHandler(UserContollers.UpdateFeedBack))
export default router