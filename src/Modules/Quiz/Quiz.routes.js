import { Router } from "express";
import * as QuizControllers from './Quiz.Controllers.js'
import { asyncHandler } from "../../utils/ErrorHandling.js";
import  {isAuth} from'../../Middleware/auth.js'
import * as SystemRoles from "../../utils/SystemRoles.js";




const router = Router()

router.post('/AddQuiz',asyncHandler(QuizControllers.AddQuizNode))
router.post('/AddQuestions',asyncHandler(QuizControllers.AddQuestionsToNode))

router.delete('/delete',asyncHandler(QuizControllers.DeleteNode))
router.get('/Quiz',asyncHandler(QuizControllers.GetQuiz))
router.get('/AllQuizzes',asyncHandler(QuizControllers.GetAllQuizzes))

export default router 