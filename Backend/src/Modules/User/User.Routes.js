import { Router } from "express";
import * as UserContollers from './User.Controllers.js'
import { asyncHandler } from "../../utils/ErrorHandling.js";
import  {isAuth} from'../../Middleware/auth.js'
import { ValidationCoreFunction } from "../../middleware/validation.js";
import {UserApiRoles}from './User.endpoints.js'

const router = Router()



router.get('/AllSolved',isAuth(UserApiRoles.GetALLMarksAndGrades),asyncHandler(UserContollers.GetALLMarksAndGrades))
router.post('/AddCareerGoal',isAuth(UserApiRoles.AddCareerGoal),asyncHandler(UserContollers.AddCareerGoal))
router.post('/AddSkills',isAuth(UserApiRoles.AddSkills),asyncHandler(UserContollers.AddSkills))
router.get('/GapSkills',isAuth(UserApiRoles.GapSkills),asyncHandler(UserContollers.GapSkills))
router.get('/RecommendTracks',isAuth(UserApiRoles.RecommendTracks),asyncHandler(UserContollers.RecommendTracks))
router.get('/GetUserDetails',isAuth(UserApiRoles.GetUserDetails),asyncHandler(UserContollers.GetUserDetails))

router.get('/CareerGoalUserProgress',isAuth(UserApiRoles.CareerGoalUserProgress),asyncHandler(UserContollers.CareerGoalUserProgress))
router.get('/GetAllSklls',isAuth(UserApiRoles.GetALLUserSkills),asyncHandler(UserContollers.GetALLUserSkills))


export default router