import { Router } from "express";
import * as AdminControllers from './Admin.controlller.js'
import { asyncHandler } from "../../utils/ErrorHandling.js";
import  {isAuth} from'../../Middleware/auth.js'
import { ValidationCoreFunction } from '../../Middleware/Validation.js'
import{AdminApiRoles}from'./Admin.endpoints.js'

const router = Router()

router.get('/GetAllUsers',isAuth(AdminApiRoles.GetAllUsers),asyncHandler(AdminControllers.GetAllUsers))
router.delete('/DeleteUser',isAuth(AdminApiRoles.DeleteUser),asyncHandler(AdminControllers.DeleteUser))
router.get('/GetFeedbacks',isAuth(AdminApiRoles.GetFeedbacks),asyncHandler(AdminControllers.GetFeedbacks))

export default router