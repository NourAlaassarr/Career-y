import { Router } from "express";
import * as QuizControllers from './Quiz.Controllers.js'
import { asyncHandler } from "../../utils/ErrorHandling.js";
import  {isAuth} from'../../Middleware/auth.js'
import {QuizApiRoles} from './Quiz.endpoints.js'
import { ValidationCoreFunction } from "../../middleware/validation.js";
import * as QuizValidation from './Quiz.Validator.js'

const router = Router()
//Admin Only
router.post('/AddQuiz',asyncHandler(QuizControllers.AddQuizNode))
//Admin Only
// router.post('/AddQuestions',isAuth(QuizApiRoles.Add_Quiz),ValidationCoreFunction(QuizValidation.AddQuestionsToNode),asyncHandler(QuizControllers.AddQuestionsToNode))

//Admin Only
router.post('/AddQuestionsToQuiz',isAuth(QuizApiRoles.Add_Quiz),ValidationCoreFunction(QuizValidation.AddQuestionsToNode),asyncHandler(QuizControllers.AddQuestionsToQuiz))

router.get('/GetBackTrackQuiz',ValidationCoreFunction(QuizValidation.GetTrackQuiz),asyncHandler(QuizControllers.GetBackendQuiz))
router.get('/Quiz',isAuth(QuizApiRoles.GetQuiz),ValidationCoreFunction(QuizValidation.GetQuiz),asyncHandler(QuizControllers.GetQuiz))
router.get('/AllQuizzes',isAuth(QuizApiRoles.GetAllQuizzes),ValidationCoreFunction(QuizValidation.GetAllQuizzes),asyncHandler(QuizControllers.GetAllQuizzes))
router.get('/SpecificFramework',isAuth(QuizApiRoles.GetFrameWORKs),ValidationCoreFunction(QuizValidation.getSpecificTrackSkill),asyncHandler(QuizControllers.GetFrameWORKs))
router.get('/GetTrackQuiz',isAuth(),ValidationCoreFunction(QuizValidation.GetTrackQuiz),asyncHandler(QuizControllers.GetTrackQuiz))
router.post('/SubmitQuiz',isAuth(QuizApiRoles.SubmitQuiz),ValidationCoreFunction(QuizValidation.SubmitQuiz),asyncHandler(QuizControllers.SubmitQuiz))
export default router 