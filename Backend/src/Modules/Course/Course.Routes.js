import  Router  from 'express';
const router =Router();
import * as CourseControllers from'./Course.Controllers.js'
import { asyncHandler } from '../../utils/ErrorHandling.js';
import  {isAuth} from'../../Middleware/auth.js'
import{CourseApiRoles}from'./Course.endpoints.js'
import { ValidationCoreFunction } from '../../Middleware/Validation.js'
import * as Validator from './Course.Validation.js'
//Admins Only
router.post('/AddCourse',isAuth(CourseApiRoles.Add_Course),ValidationCoreFunction(Validator.AddCourse),asyncHandler(CourseControllers.AddCourse));
//Admins Only
router.delete('/DeleteCourse',isAuth(CourseApiRoles.DeleteCourse),ValidationCoreFunction(Validator.DeleteCourse),asyncHandler(CourseControllers.DeleteCourse))
//Admins Only
router.patch('/ApproveCourse',isAuth(CourseApiRoles.ApproveCourse),ValidationCoreFunction(Validator.ApproveCourse),asyncHandler(CourseControllers.ApproveCourse))

router.get('/GetAllCourses',ValidationCoreFunction(Validator.GetAllCourses),asyncHandler(CourseControllers.GetALLCourses))

router.get('/GetALLUnapprovedCourses',isAuth(CourseApiRoles.GetCourseDetails),ValidationCoreFunction(Validator.UnApprovedCourses),asyncHandler(CourseControllers.GetALLUnapprovedCourses))

router.get('/CourseDetails',isAuth(CourseApiRoles.GetCourseDetails),ValidationCoreFunction(Validator.GetCourseDetails),asyncHandler(CourseControllers.GetCourseDetails))

router.get("/GetTrackCourses",isAuth(CourseApiRoles.GetTrackCourses),ValidationCoreFunction(Validator.GetTrackCourses),asyncHandler(CourseControllers.GetTrackCourses))

//Owner/Admin
router.put('/UpdateCourse',isAuth(CourseApiRoles.UpdateCourse),ValidationCoreFunction(Validator.UpdateCourse),asyncHandler(CourseControllers.UpdateCourse))
export default router
