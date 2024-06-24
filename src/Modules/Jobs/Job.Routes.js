import  Router  from 'express';
const router =Router();
import * as JobControllers from'./Job.Controllers.js'
import { asyncHandler } from '../../utils/ErrorHandling.js';
import  {isAuth} from'../../Middleware/auth.js'
import {JobApis}from'./Job.endpoints.js'


//Admin Only 
router.post('/AddJob',isAuth(JobApis.Add_JobOffer),asyncHandler(JobControllers.AddJobOffer))
// router.post('AddCompany')
router.get('/GetAllJobOffers',asyncHandler(JobControllers.GetAllJobOffers))
router.delete('/DeleteJobOffer',isAuth(JobApis.DeleteJob),asyncHandler(JobControllers.DeleteJob))
export default router
