import { Router } from "express";
import * as QuizControllers from './Quiz.Controllers.js'
import { asyncHandler } from "../../utils/ErrorHandling.js";
import  {isAuth} from'../../Middleware/auth.js'
import * as SystemRoles from "../../utils/SystemRoles.js";
import {Add_Quiz} from './Quiz.endpoints.js'
const router = Router()
// isAuth(Add_Quiz.Add),
router.post('/Add',asyncHandler(QuizControllers.Add))
router.get('/Get',asyncHandler(QuizControllers.Get))
router.post('/solve',isAuth(),asyncHandler(QuizControllers.solve))


export default router