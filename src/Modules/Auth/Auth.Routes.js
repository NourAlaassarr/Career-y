import { Router } from "express";
import * as AuthControllers from './Auth.Controllers.js'
import { asyncHandler } from "../../utils/ErrorHandling.js";
import  {isAuth} from'../../Middleware/auth.js'


const router = Router()

router.post('/SignUp',asyncHandler(AuthControllers.SignUp))
router.get('/Confirm/:token',asyncHandler(AuthControllers.ConfirmEmail))
router.post('/SignIn',asyncHandler(AuthControllers.SignIn))
router.patch('/ChangePassword',isAuth(),asyncHandler(AuthControllers.ChangePassword))





export default router