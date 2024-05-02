import { Router } from "express";
import * as RoadmapControllers from'./Roadmap.Controller.js'
import { asyncHandler } from "../../utils/ErrorHandling.js";
import  {isAuth} from'../../Middleware/auth.js'

const router =Router()

router.get('/GetRoadmap',asyncHandler(RoadmapControllers.GetRoadmap))
router.get('/GetAllTracks',asyncHandler(RoadmapControllers.GetAllTracks))
router.get('/SkillResources',asyncHandler(RoadmapControllers.GetSkillResources))

export default router;