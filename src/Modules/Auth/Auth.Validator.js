import Joi from "joi";
import { generalFields } from "../../middleware/validation.js";

export const signUp = {
  body:Joi.object({
    UserName:Joi.string().min(3).max(15).messages({'any.required': 'userName is required',
}).required(),
        
        Email:generalFields.email,
        ConfirmPassword:Joi.valid(Joi.ref('password')).required(),
        password:generalFields.password,
        
}).options({allowUnknown:true})
};




export const SignIn={
  body:Joi.object({
      Email:generalFields.email
      , Password:generalFields.password
  })

}