
import joi from "joi";
import { Types } from "mongoose";
import { validate as isUuid } from 'uuid';
const dataMethods = ["body", "params", "query", "headers"];

const validateObjectId = (value, helper) => {
  return Types.ObjectId.isValid(value) ? true : helper.message("Invalid Id");
};

export const validateUuid = (value, helper) => {
  if (isUuid(value)) {
    return value; // return the value if it's valid
  } else {
    return helper.message('Invalid UUID');
  }
};

export const generalFields = {
  id: joi.string().custom(validateObjectId).required(),
  name: joi.string(),
  //!todo add address
  email: joi
    .string()
    .email({
      minDomainSegments: 2,
      maxDomainSegments: 4,
      tlds: { allow: ["com", "net", "org","outlook","gov","edu"] },
    }).message('Please enter a valid email address.'),
  password: joi
    .string()
    .regex(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+}{:;'?/>.<,])(?=.*[a-zA-Z]).{8,}$/).message('Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character.')
    .required(),
  cPassword: joi.string(),
  phone: joi
    .string()
    .trim()
    .pattern(/^(010|012|011|015)\d{8}$/).message('Phone number must start with 010, 012, 011, or 015 followed by 8 digits.')

   . required(),
   code:joi
   .string()
   .trim()
   .regex(/^\d{4}$/),
   id: joi.custom(validateUuid).required()
};

export const ValidationCoreFunction = (joiSchema) => {
  return (req, res, next) => {
    const validationErr = [];
    dataMethods.forEach((method) => {
      if (joiSchema[method]) {
        const validationResult = joiSchema[method].validate(req[method], {
          abortEarly: false,
        });
        if (validationResult.error) {
          validationErr.push(validationResult.error.details[0].message);
        }
      }
    });
    if (validationErr.length) {
      return res
        .status(400)
        .json({ message: "Validation Error", errors: validationErr });
    }
    return next();
  };
};
//*The abortEarly: false option ensures that all validation errors are collected rather than stopping after the first one.


const objectId = (value, helpers) => {
    return Types.ObjectId.isValid(value)?true:helpers.message('invalid id')
}
























// import Joi from 'joi'
// import joi from 'joi'
// import { Types } from 'mongoose'
// const reqMethods = ['body','query','headers','file','files',"params"]

// // const objectId = (value, helpers) => {
// //     if (!value.match(/^[0-9a-fA-F]{24}$/)) {
// //     return helpers.error('any.invalid');
// //     }
// //     return value;
// // }
// const objectId = (value, helpers) => {
//     return Types.ObjectId.isValid(value)?true:helpers.message('invalid id')
// }

// export const generalFields={
//     email: joi
//     .string()
//     .email({ tlds: { allow: ['com', 'net', 'org'] } })
//     .required(),
//     password: joi
//     .string()
//     .regex(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/)
//     .messages({
//     'string.pattern.base': 'Password regex fail',
//     }).required(),
// _id:Joi.string().custom(objectId)
// }
// export const ValidationCoreFunction =(schema)=>{
//     return(req,res,next)=>{
//         const ValidationErrArray=[]
//         for(const key of reqMethods){
//             if(schema[key])
//             {
//                 const ValidateResults = schema[key].validate(req[key],{
//                     abortEarly:false,
//                 })
//                 if(ValidateResults.error)
//                 {
//                     ValidationErrArray.push(ValidateResults.error.details)
//                 }
//             }
//         }

//         if (ValidationErrArray.length) {
//             // return res
//             // .status(400)
//             // .json({ message: 'Validation Error', Errors: ValidationErrArray })
//             req.ValidationErrArray=ValidationErrArray
//             return next(new Error('',{cause:400}))  
//         }
    
//         next()
//         } 
    
// }

