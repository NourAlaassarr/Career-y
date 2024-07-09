import { Router } from "express";
import * as RoadmapControllers from'./Roadmap.Controller.js'
import { asyncHandler } from "../../utils/ErrorHandling.js";
import  {isAuth} from'../../Middleware/auth.js'
import { ValidationCoreFunction } from '../../Middleware/Validation.js'
import * as Validator from './Roadmap.Validator.js'
import {CloudFunction}from '../../Services/MulterCloud.js'
import  {RoadmapsApiRoles} from './Roadmaps.endpoints.js'
import { allowedExtensions } from "../../utils/allowedExtensions.js";
const router =Router()

router.get('/GetRoadmap',ValidationCoreFunction(Validator.GetRoadmap),asyncHandler(RoadmapControllers.GetRoadmap))
router.get('/GetAllTracks',ValidationCoreFunction(Validator.GetAllTracks),asyncHandler(RoadmapControllers.GetAllTracks))
router.get('/SkillResources',ValidationCoreFunction(Validator.GetSkillResources),asyncHandler(RoadmapControllers.GetSkillResources))
router.get('/AllSkills',ValidationCoreFunction(Validator.GetAllSkills),asyncHandler(RoadmapControllers.GetAllSkills))

// router.get('/UpdatedSkill/:Skillid',asyncHandler(RoadmapControllers.GetUpdatedSkill))
router.get('/UpdatedSkill/:JobId/skill/:Skillid', asyncHandler(RoadmapControllers.GetUpdatedSkill));
//ADmin Only
router.post('/AddSkillToRoadmap', isAuth(RoadmapsApiRoles.AddSkillToRoadmap),ValidationCoreFunction(Validator.AddSkillToRoadmap),asyncHandler(RoadmapControllers.AddSkillToRoadmap))
router.delete('/deleteNode',isAuth(RoadmapsApiRoles.DeleteSkillFromRoadmap),ValidationCoreFunction(Validator.DeleteSkillFromRoadmap),asyncHandler(RoadmapControllers.DeleteSkillFromRoadmap))
router.put('/Update',isAuth(RoadmapsApiRoles.UpdateResource),ValidationCoreFunction(Validator.UpdateResource),asyncHandler(RoadmapControllers.UpdateResource))


//Add Img
// router.post('/AddImg',CloudFunction(allowedExtensions.Image).single('Image'),ValidationCoreFunction(Validator.AddImg),asyncHandler(RoadmapControllers.AddImg))
export default router;