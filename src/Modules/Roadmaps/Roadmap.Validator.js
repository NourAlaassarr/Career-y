import joi from "joi";
import { generalFields } from "../../middleware/validation.js";


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
    TrackId: joi.string().guid({ version: ['uuidv4'] }).required(),
  }).required(),
  params: joi.object().keys({

  }).required()
}

