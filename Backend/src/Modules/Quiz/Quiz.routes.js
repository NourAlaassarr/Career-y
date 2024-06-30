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


router.get('/Quiz',isAuth(QuizApiRoles.GetQuiz),ValidationCoreFunction(QuizValidation.GetQuiz),asyncHandler(QuizControllers.GetQuiz))
router.get('/AllQuizzes',ValidationCoreFunction(QuizValidation.GetAllQuizzes),asyncHandler(QuizControllers.GetAllQuizzes))

//Topic Quiz 
router.post('/SubmitTopicQuiz',isAuth(QuizApiRoles.SubmitTopicQuiz),asyncHandler(QuizControllers.SubmitTopicQuiz))

//Careeer Guidance
router.get('/SpecificFramework',isAuth(QuizApiRoles.GetFrameWORKs),ValidationCoreFunction(QuizValidation.getSpecificTrackSkill),asyncHandler(QuizControllers.GetFrameWORKs))
router.get('/GetTrackQuiz',isAuth(QuizApiRoles.GetTrackQuiz),asyncHandler(QuizControllers.GetTrackQuiz))
router.post('/SubmitQuiz',isAuth(QuizApiRoles.SubmitQuiz),ValidationCoreFunction(QuizValidation.SubmitQuiz),asyncHandler(QuizControllers.SubmitQuiz))
router.get('/GetBackendTrackQuiz',isAuth(QuizApiRoles.GetBackendTrackQuiz),ValidationCoreFunction(QuizValidation.GetTrackQuiz),asyncHandler(QuizControllers.GetBackendTrackQuiz))

/// FullStack ///
router.get('/GetFullStackTrackQuiz',isAuth(QuizApiRoles.GetFullStackTrackQuiz),asyncHandler(QuizControllers.GetFullStackTrackQuiz))
router.post('/submitFullstackTrackQuiz',isAuth(QuizApiRoles.GetFullStackTrackQuiz),asyncHandler(QuizControllers.submitFullstackTrackQuiz))
router.get('/fetchSkillsIfFailed',isAuth(QuizApiRoles.fetchSkillsIfFailed),asyncHandler(QuizControllers.fetchSkillsIfFailed))

router.get('/fetchJobsOffers',isAuth(QuizApiRoles.fetchJobsOffers),asyncHandler(QuizControllers.fetchJobsOffers))
export default router 