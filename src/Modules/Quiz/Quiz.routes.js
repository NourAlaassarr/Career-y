import { Router } from "express";
import * as QuizControllers from './Quiz.Controllers.js'
import { asyncHandler } from "../../utils/ErrorHandling.js";
import  {isAuth} from'../../Middleware/auth.js'
import {QuizApiRoles} from './Quiz.endpoints.js'
import { ValidationCoreFunction } from "../../middleware/validation.js";
import * as QuizValidation from './Quiz.Validator.js'

const router = Router()

// router.post('/AddQuiz',asyncHandler(QuizControllers.AddQuizNode))

//Admin Only
router.post('/AddQuestions',isAuth(QuizApiRoles.Add_Quiz),ValidationCoreFunction(QuizValidation.AddQuestionsToNode),asyncHandler(QuizControllers.AddQuestionsToNode))
//Admin Only
router.delete('/delete',isAuth(QuizApiRoles.Add_Quiz),ValidationCoreFunction(QuizValidation.DeleteNode),asyncHandler(QuizControllers.DeleteNode))

router.get('/Quiz',ValidationCoreFunction(QuizValidation.GetQuiz),asyncHandler(QuizControllers.GetQuiz))
router.get('/TrackQuiz',ValidationCoreFunction(QuizValidation.GetQuiz),asyncHandler(QuizControllers.GetTrackQuiz))
router.get('/AllQuizzes',ValidationCoreFunction(QuizValidation.GetAllQuizzes),asyncHandler(QuizControllers.GetAllQuizzes))

export default router 