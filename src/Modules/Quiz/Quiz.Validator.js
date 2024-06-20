import joi from "joi";
import { generalFields } from "../../middleware/validation.js";

export const AddQuestionsToNode = {
  body: joi.object({
    Questions: joi.array().items(
      joi.object({
        questionText: joi.string().required(),
        answer: joi.string().required(),
        options: joi.array().items(joi.string()).min(2).required(),
        Level: joi.string().valid('Basic', 'Intermediate', 'Advanced').required(),
        order: joi.number().integer().required(),

      })
    ).required()
  }).required(),
  query: joi.object().keys({
    SkillId:joi.string().guid({ version: ['uuidv4'] }).required(),
  }).required(),
  params: joi.object().keys({

  }).required()
};

export const GetQuiz = {
  body: joi.object().required()
    .keys({
    }).required(),
  query: joi.object().keys({
/// uuid
  SkillId:joi.string().guid({ version: ['uuidv4'] }).required(),
  }).required(),
  params: joi.object().keys({

  }).required()
}

export const GetAllQuizzes = {
  body: joi.object().required()
    .keys({
    }).required(),
  query: joi.object().keys({

  }).required(),
  params: joi.object().keys({

  }).required()
}

export const DeleteNode = {
  body: joi
    .object()
    .required()
    .keys({
      
    })
    .required(),
  query: joi.object().keys({

  }).required(),
  params: joi.object().keys({

  }).required()
}

export const GetTrackQuiz = {
  body: joi.object().required()
    .keys({
    }).required(),
  query: joi.object().keys({
/// uuid
jobId:joi.string().guid({ version: ['uuidv4'] }).required(),
SkillId:joi.string().guid({ version: ['uuidv4'] }).required(),
  }).required(),
  params: joi.object().keys({

  }).required()
}

export const getSpecificTrackSkill = {
  body: joi.object().required()
    .keys({
    }).required(),
  query: joi.object().keys({
/// uuid
jobId:joi.string().guid({ version: ['uuidv4'] }).required(),
  }).required(),
  params: joi.object().keys({

  }).required()
}