

import joi from "joi";
import { generalFields } from "../../Middleware/Validation.js"


export const AddJobOffer = {
    body: joi.object().required().keys({
        CompanyName: joi.string().required(),
        JobDescription: joi.string().required(),
        JobRequirements: joi.string().required(),
        salary_range: joi.string().required(),
        date_posted: joi.string().required(),
        employment_type: joi.string().valid('full-time', 'part-time', 'contract', 'temporary', 'internship').required(),
        title: joi.string().required()
      }).required(),
    query: joi.object().keys({
      // JobId id
      JobId: generalFields.id.required(),
        }).required(),
  params: joi.object().keys({

  }).required()
}
export const DeleteJob = {
    body: joi
      .object()
      .required()
      .keys({
        
      })
      .required(),
      query: joi.object().keys({
        // JobId id
        JobOfferId: generalFields.id.required(),
          }).required(),
    params: joi.object().keys({
  
    }).required()
  }
  
export const GetAllJobsIntrack = {
    body: joi
      .object()
      .required()
      .keys({
        
      })
      .required(),
      query: joi.object().keys({
        // JobId id
        JobId: generalFields.id.required(),
          }).required(),
    params: joi.object().keys({
  
    }).required()
  }

  export const JobDetails = {
    body: joi
      .object()
      .required()
      .keys({
        
      })
      .required(),
      query: joi.object().keys({
        // JobId id
        jobOfferId: generalFields.id.required(),
          }).required(),
    params: joi.object().keys({
  
    }).required()
  }