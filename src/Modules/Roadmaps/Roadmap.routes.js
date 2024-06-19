import { Router } from "express";
import * as RoadmapControllers from'./Roadmap.Controller.js'
import { asyncHandler } from "../../utils/ErrorHandling.js";
import  {isAuth} from'../../Middleware/auth.js'
import { ValidationCoreFunction } from "../../middleware/validation.js";
import * as Validator from './Roadmap.Validator.js'
const router =Router()

router.get('/GetRoadmap',ValidationCoreFunction(Validator.GetRoadmap),asyncHandler(RoadmapControllers.GetRoadmap))
router.get('/GetAllTracks',ValidationCoreFunction(Validator.GetAllTracks),asyncHandler(RoadmapControllers.GetAllTracks))
router.get('/SkillResources',ValidationCoreFunction(Validator.GetSkillResources),asyncHandler(RoadmapControllers.GetSkillResources))

export default router;