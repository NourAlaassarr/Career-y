import { Router } from "express";
import * as AuthControllers from './Auth.Controllers.js'
import { asyncHandler } from "../../utils/ErrorHandling.js";
import  {isAuth} from'../../Middleware/auth.js'


const router = Router()

router.post('/SignUp',asyncHandler(AuthControllers.SignUp))

router.post('/SignIn',asyncHandler(AuthControllers.signIn))
router.post('/LogOut',isAuth(),asyncHandler(AuthControllers.LogOut))

router.get('/Confirm/:token',asyncHandler(AuthControllers.ConfirmEmail))
router.patch('/ChangePassword',isAuth(),asyncHandler(AuthControllers.ChangePassword))





export default router