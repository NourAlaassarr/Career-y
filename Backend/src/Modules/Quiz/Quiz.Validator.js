import joi from "joi";
import { generalFields } from "../../Middleware/Validation.js"

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
SkillId:joi.string().guid({ version: ['uuidv4'] }).optional(),
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

export const SubmitQuiz={

//   body:  joi.object({
//     // answer: joi.array().items(
//     //     joi.object({
//     //         questionId: joi.string().guid({ version: ['uuidv4'] }).required(),
//     //         answerId: joi.string().guid({ version: ['uuidv4'] }).required()
//     //     })
//     // ).required(),
// }).required(),
  query: joi.object().keys({
/// uuid
jobId:joi.string().guid({ version: ['uuidv4'] }).optional(),
SkillId:joi.string().guid({ version: ['uuidv4'] }).optional(),
  }).required(),
  params: joi.object().keys({

  }).required()
}

export const SubmitTopicQuiz={
  body:  joi.object({
    answer: joi.array().items(
        joi.object({
            questionId: joi.string().guid({ version: ['uuidv4'] }).required(),
            answerId: joi.string().guid({ version: ['uuidv4'] }).required()
        })
    ).required()
}),
  query: joi.object().keys({

SkillId:joi.string().guid({ version: ['uuidv4'] }).required(),
  }).required(),
  params: joi.object().keys({

  }).required()
}


export const submitFullstackTrackQuiz={
//   body:  joi.object({
//     answer: joi.array().items(
//         joi.object({
//             questionId: joi.string().guid({ version: ['uuidv4'] }).required(),
//             answerId: joi.string().guid({ version: ['uuidv4'] }).required()
//         })
//     ).required()
// }),
  query: joi.object().keys({
  }).required(),
  params: joi.object().keys({

  }).required()
}


export const GetFullStackTrackQuiz={
  body: joi.object().required()
    .keys({
    }).required(),
query: joi.object().keys({
  BackendId: joi.string().uuid({ version: 'uuidv4' }).required(),
  FrontendId: joi.string().uuid({ version: 'uuidv4' }).required(),
  BackendFrameWorkId: joi.string().uuid({ version: 'uuidv4' }).required(),
  FrontendFrameWorkId: joi.string().uuid({ version: 'uuidv4' }).required()
}).required(),
headers: joi.object().keys({
  token: joi.string().required()
}).unknown(true), // Allow other headers that are not specified
params: joi.object().keys({

}).required()
}