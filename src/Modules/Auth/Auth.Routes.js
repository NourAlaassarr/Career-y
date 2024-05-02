import { Router } from "express";
import * as AuthControllers from './Auth.Controllers.js'
import { asyncHandler } from "../../utils/ErrorHandling.js";
import  {isAuth} from'../../Middleware/auth.js'
import * as Validator from './Auth.Validator.js'
import { ValidationCoreFunction } from "../../middleware/validation.js";
const router = Router()

router.post('/SignUp',ValidationCoreFunction(Validator.signUp),asyncHandler(AuthControllers.SignUp))
router.post('/SignIn',ValidationCoreFunction(Validator.SignIn),asyncHandler(AuthControllers.signIn))
router.post('/LogOut',isAuth(),asyncHandler(AuthControllers.LogOut))
router.patch('/ChangePassword',isAuth(),asyncHandler(AuthControllers.ChangePassword))
router.get('/Confirm/:token',asyncHandler(AuthControllers.ConfirmEmail))
router.patch('/ForgetPassword',asyncHandler(AuthControllers.ForgetPassword))
router.patch('/reset/:token',asyncHandler(AuthControllers.reset))






export default router