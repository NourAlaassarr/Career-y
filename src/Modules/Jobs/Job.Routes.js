import  Router  from 'express';
const router =Router();
import * as JobControllers from'./Job.Controllers.js'
import { asyncHandler } from '../../utils/ErrorHandling.js';
import  {isAuth} from'../../Middleware/auth.js'
import {JobApis}from'./Job.endpoints.js'


//Admin Only 
router.post('/AddJob',isAuth(JobApis.Add_JobOffer),asyncHandler(JobControllers.AddJobOffer))
router.delete('/DeleteJobOffer',isAuth(JobApis.DeleteJob),asyncHandler(JobControllers.DeleteJob))
router.put('/UpdateJobOffer',isAuth(JobApis.UpdateJobOffer),asyncHandler(JobControllers.UpdateJobOffer))


router.get('/GetAllJobOffers',isAuth(JobApis.GetAllJobOffers),asyncHandler(JobControllers.GetAllJobOffers))
router.get('/GetTrackJobOffers',isAuth(JobApis.GetAllJobOffers),asyncHandler(JobControllers.GetAllJobOffers))
router.get('/JobDetails',isAuth(JobApis.GetJobDetails),asyncHandler(JobControllers.GetJobDetails))
router.post('/SendNoti',asyncHandler(JobControllers.sendNotification))
export default router
