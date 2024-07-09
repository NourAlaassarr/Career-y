import { Router } from "express";
import * as AuthControllers from './Auth.Controllers.js'
import { asyncHandler } from "../../utils/ErrorHandling.js";
import  {isAuth} from'../../Middleware/auth.js'
import * as Validator from './Auth.Validator.js'
import { ValidationCoreFunction } from '../../Middleware/Validation.js'
import{AuthRolesApi}from'./Auth.endpoints.js'
const router = Router()

//Admin
router.post('/instructor',ValidationCoreFunction(Validator.SignUp),asyncHandler(AuthControllers.InstructorSignUp))
router.post('/AdminSignUp',ValidationCoreFunction(Validator.SignUp),asyncHandler(AuthControllers.AdminSignUp))
router.post('/SignUp',ValidationCoreFunction(Validator.SignUp),asyncHandler(AuthControllers.SignUp))
router.post('/SignIn',ValidationCoreFunction(Validator.SignIn),asyncHandler(AuthControllers.signIn))
router.post('/LogOut',isAuth(AuthRolesApi.LogOut),ValidationCoreFunction(Validator.LogOut),asyncHandler(AuthControllers.LogOut))
router.patch('/ChangePassword',isAuth(AuthRolesApi.ChangePassword),ValidationCoreFunction(Validator.ChangePassword),asyncHandler(AuthControllers.ChangePassword))
router.get('/Confirm/:token',ValidationCoreFunction(Validator.ConfirmEmail),asyncHandler(AuthControllers.ConfirmEmail))
router.patch('/ForgetPassword',ValidationCoreFunction(Validator.ForgetPassword),asyncHandler(AuthControllers.ForgetPassword))
router.patch('/reset/',asyncHandler(AuthControllers.reset))






export default router