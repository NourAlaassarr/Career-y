import  Router  from 'express';
const router =Router();
import * as JobControllers from'./Job.Controllers.js'
import { asyncHandler } from '../../utils/ErrorHandling.js';
import  {isAuth} from'../../Middleware/auth.js'
import {JobApis}from'./Job.endpoints.js'
import { ValidationCoreFunction } from '../../Middleware/Validation.js'
import * as JobValidation from'./Job.Validator.js'
//Admin Only 
router.post('/AddJob',isAuth(JobApis.Add_JobOffer),ValidationCoreFunction(JobValidation.AddJobOffer),asyncHandler(JobControllers.AddJobOffer))
//Admin Only 
router.delete('/DeleteJobOffer',isAuth(JobApis.DeleteJob),ValidationCoreFunction(JobValidation.DeleteJob),asyncHandler(JobControllers.DeleteJob))
//Admin Only 
router.put('/UpdateJobOffer',isAuth(JobApis.UpdateJobOffer),asyncHandler(JobControllers.UpdateJobOffer))


router.get('/GetAllJobOffers',isAuth(JobApis.GetAllJobOffers),asyncHandler(JobControllers.GetAllJobOffers))
router.get('/GetTrackJobOffers',isAuth(JobApis.GetAllJobOffers),ValidationCoreFunction(JobValidation.GetAllJobsIntrack),asyncHandler(JobControllers.GetAllJobsIntrack))
router.get('/JobDetails',isAuth(JobApis.GetJobDetails),ValidationCoreFunction(JobValidation.JobDetails),asyncHandler(JobControllers.GetJobDetails))


//Crons
router.post('/SendNoti',asyncHandler(JobControllers.sendNotification))
export default router
