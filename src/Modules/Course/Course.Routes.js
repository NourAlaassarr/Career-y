import  Router  from 'express';
const router =Router();
import * as CourseControllers from'./Course.Controllers.js'
import { asyncHandler } from '../../utils/ErrorHandling.js';
import  {isAuth} from'../../Middleware/auth.js'
import{CourseApiRoles}from'./Course.endpoints.js'

router.post('/AddCourse',isAuth(CourseApiRoles.Add_Course),asyncHandler(CourseControllers.AddCourse));
//Admins
router.delete('/DeleteCourse',isAuth(CourseApiRoles.DeleteCourse),asyncHandler(CourseControllers.DeleteCourse))
//Admins
router.patch('/ApproveCourse',isAuth(CourseApiRoles.ApproveCourse),asyncHandler(CourseControllers.ApproveCourse))

router.get('/GetAllCourses',isAuth(CourseApiRoles.GetAllCourses),asyncHandler(CourseControllers.GetALLCourses))

router.get('/CourseDetails',isAuth(CourseApiRoles.GetCourseDetails),asyncHandler(CourseControllers.GetCourseDetails))


//Owner/Admin
router.put('/UpdateCourse',isAuth(CourseApiRoles.UpdateCourse),asyncHandler(CourseControllers.UpdateCourse))
export default router
