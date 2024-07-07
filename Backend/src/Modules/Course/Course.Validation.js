import joi from "joi";
import { generalFields } from "../../Middleware/Validation.js"



export const AddCourse = {
    body: joi.object().required().keys({
        CourseName: joi.string().required(),
        CourseDescription: joi.string().required(),
        Duration: joi.string().required(),
        prerequisites: joi.string().required(),
        language: joi.string().required(),
        Courselink: joi.string().uri().required()
    }).required(),
    query: joi.object().keys({
        JobId: joi.string().uuid({ version: 'uuidv4' }).required()
    }).required(),
    params: joi.object().keys({

    }).required()
};
export const DeleteCourse = {
    body: joi.object().required().keys({

    }).required(),
    query: joi.object().keys({
        CourseId: joi.string().uuid({ version: 'uuidv4' }).required()
    }).required(),
    params: joi.object().keys({

    }).required()
};
export const GetAllCourses={
    body: joi.object().required().keys({

    }).required(),
    query: joi.object().keys({
    
    }).required(),
    params: joi.object().keys({

    }).required()
}

export const ApproveCourse = {
    
    body: joi.object().required().keys({

    }).required(),
    query: joi.object().keys({
        CourseId: joi.string().uuid({ version: 'uuidv4' }).required()
    }).required(),
    params: joi.object().keys({

    }).required()
};

export const UnApprovedCourses = {
    body: joi.object().required().keys({

    }).required(),
    query: joi.object().keys({
    }).required(),
    params: joi.object().keys({

    }).required()
};


export const GetALLCourses = {
    body: joi.object().required().keys({

    }).required(),
    query: joi.object().keys({

    }).required(),
    params: joi.object().keys({

    }).required()
};


export const GetCourseDetails = {
    body: joi.object().required().keys({

    }).required(),
    query: joi.object().keys({
        CourseId: joi.string().uuid({ version: 'uuidv4' }).required()
    }).required(),
    params: joi.object().keys({

    }).required()
};

export const GetTrackCourses={
body: joi.object().required().keys({

}).required(),
query: joi.object().keys({
    TrackId: joi.string().uuid({ version: 'uuidv4' }).required()
}).required(),
params: joi.object().keys({

}).required()
};



export const UpdateCourse = {
  body: joi.object().required().keys({
    Courselink: joi.string().uri().optional(),
    CourseName: joi.string().optional(),
    CourseDescription: joi.string().optional(),
    Duration: joi.string().optional(),
    prerequisites: joi.string().optional(),
    language: joi.string().optional()
  }).required(),
  query: joi.object().keys({
    CourseId: joi.string().uuid({ version: 'uuidv4' }).required()
  }).required(),
  params: joi.object().keys({}).required()
};
