import { Router } from "express";
import * as TestControllers from'./Test.controllers.js'
import { asyncHandler } from "../../utils/ErrorHandling.js";
import  {isAuth} from'../../Middleware/auth.js'


const router =Router()

// router.post('/SignUp',asyncHandler(TestControllers.SignUp))


// router.post('/SignIn',asyncHandler(TestControllers.signIn))
// router.post('/LogOut',isAuth(),asyncHandler(TestControllers.LogOut))
// router.post('/AddQuiz',asyncHandler(TestControllers.AddQuizNode))
// router.post('/AddQuestions',asyncHandler(TestControllers.AddQuestionsToNode))
router.delete('/delete',asyncHandler(TestControllers.DeleteNode))
// router.get('/Quiz',asyncHandler(TestControllers.GetQuiz))
// router.get('/AllQuizzes',asyncHandler(TestControllers.GetAllQuizzes))
// router.post('/Solve',isAuth(),asyncHandler(TestControllers.Solve))
// router.get('/AllSolved',isAuth(),asyncHandler(TestControllers.GetALLMarksAndGrades))
// router.get('/GetRoadmap/:Nodeid',asyncHandler(TestControllers.GetRoadmap))
// router.get('/GetAllTracks',asyncHandler(TestControllers.GetAllTracks))
// router.get('/SkillResources',asyncHandler(TestControllers.GetSkillResources))
router.post('/AddId',asyncHandler(TestControllers.AddId))
router.put('/Update',asyncHandler(TestControllers.UpdateResource))
router.get('/UpdatedSkill/:Skillid',asyncHandler(TestControllers.GetUpdatedSkill))
// router.get('/UpdatedRoadMap/:JobId', asyncHandler(TestControllers.GetUpdatedRoadMap));

export default router