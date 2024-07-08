import joi from "joi";
import { generalFields } from "../../Middleware/Validation.js"


// export const Solve = {
//   body: joi.object().required()
//     .keys({
//       Questions: joi.array().items(joi.string()).required()  // Add your array field here
//     }).required(),
//   query: joi.object().keys({
//     // skill id 
//     SkillId: generalFields.id.required(),
//   }).required(),
//   params: joi.object().keys({}).required()
// };

export const GetAllMarks ={
  body: joi.object().required()
    .keys({
      
    }).required(),
  query: joi.object().keys({

  }).required(),
  params: joi.object().keys({

  }).required()
}

export const AddCareerGoal ={
  body: joi.object().required()
    .keys({
      
    }).required(),
  query: joi.object().keys({
// skill id
CareerGoalId: generalFields.id.required(),
  }).required(),
  params: joi.object().keys({

  }).required()
}

export const AddSkills = {
  body: joi.object().required().keys({
    Skills: joi.array().items(
      joi.string().uuid({ version: 'uuidv4' })
    ).required()
  }).required(),
  query: joi.object().keys({}).required(),
  params: joi.object().keys({}).required()
};

export const GapSkills  ={
  body: joi.object().required()
    .keys({
      
    }).required(),
  query: joi.object().keys({

  }).required(),
  params: joi.object().keys({

  }).required()
}
  
export const RecommendTracks  ={
  body: joi.object().required()
    .keys({
      
    }).required(),
  query: joi.object().keys({

  }).required(),
  params: joi.object().keys({

  }).required()
}

export const GetUserDetails  ={
  body: joi.object().required()
    .keys({
      
    }).required(),
  query: joi.object().keys({

  }).required(),
  params: joi.object().keys({

  }).required()
}

export const CareerGoalUserProgress  ={
  body: joi.object().required()
    .keys({
      
    }).required(),
  query: joi.object().keys({

  }).required(),
  params: joi.object().keys({

  }).required()
}

export const GetALLUserSkills  ={
  
  body: joi.object().required()
    .keys({
      
    }).required(),
  query: joi.object().keys({

  }).required(),
  params: joi.object().keys({

  }).required()
}

export const AddFeedBack = {
  body: joi.object().required().keys({
    feedback: joi.string().required()
  }).required(),
  query: joi.object().keys({}).required(),
  params: joi.object().keys({}).required()
};

export const Update = {
  body: joi.object().required().keys({
    feedback: joi.string().required()
  }).required(),
  query: joi.object().keys({}).required(),
  params: joi.object().keys({}).required()
};