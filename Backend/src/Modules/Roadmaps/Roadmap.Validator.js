import joi from "joi";
import { generalFields } from "../../Middleware/Validation.js"


export const GetRoadmap = {
  body: joi.object().required()
    .keys({
    }).required(),
  query: joi.object().keys({
    /// id Trackid
    TrackId: joi.string().guid({ version: ['uuidv4'] }).required(),
  }).required(),
  params: joi.object().keys({

  }).required()
}

export const GetAllTracks = {
  body: joi.object().required()
    .keys({
    }).required(),
  query: joi.object().keys({

  }).required(),
  params: joi.object().keys({

  }).required()
}

export const GetSkillResources = {
  body: joi.object().required()
    .keys({
    }).required(),
  query: joi.object().keys({
    /// id Trackid
    SkillId: joi.string().guid({ version: ['uuidv4'] }).required(),
  }).required(),
  params: joi.object().keys({

  }).required()
}

export const GetAllSkills = {
  body: joi.object().required()
    .keys({
    }).required(),
  query: joi.object().keys({

  }).required(),
  params: joi.object().keys({

  }).required()
}



export const AddSkillToRoadmap = {
  body: joi.object().required().keys({
    name: joi.string().required(),
    video_resource: joi.string().uri().optional(),
    type: joi.string().valid('video', 'reading', 'quiz', 'project').required(),
    reading_resource: joi.string().uri().optional(),
    level: joi.number().integer().min(1).max(10).required(),
    mandatory: joi.boolean().required()
  }).required(),
  query: joi.object().keys({
    TrackId: joi.string().uuid({ version: 'uuidv4' }).required()
  }).required(),
  params: joi.object().keys({}).required()
};


export const DeleteSkillFromRoadmap = {
  body: joi.object().required()
    .keys({
    }).required(),
  query: joi.object().keys({
    /// id Trackid
    Nodeid: joi.string().guid({ version: ['uuidv4'] }).required(),
  }).required(),
  params: joi.object().keys({

  }).required()
}



export const UpdateResource = {
  body: joi.object().required().keys({
    reading_resource: joi.string().uri().optional(),
    video_resource: joi.string().uri().optional()
  }).required(),
  query: joi.object().keys({
    Skillid: joi.string().uuid({ version: 'uuidv4' }).required(),
    JobIds: joi.string().uuid({ version: 'uuidv4' }).required()
  }).required(),
  params: joi.object().keys({}).required()
};
