import { Router } from "express";
import * as AuthControllers from './Auth.Controllers.js'
import { asyncHandler } from "../../utils/ErrorHandling.js";



const router = Router()

router.post('/SignUp',asyncHandler(AuthControllers.SignUp))








export default router