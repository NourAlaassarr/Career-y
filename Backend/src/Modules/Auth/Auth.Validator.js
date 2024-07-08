import joi from "joi";
import { generalFields } from "../../Middleware/Validation.js"
export const SignUp = {
  body: joi.object().required()
    .keys({
      UserName: generalFields.name.required(),
      Email: generalFields.email.required(),
      password: generalFields.password.required(),
      ConfirmPassword: generalFields.password.required(),
        })
    .required(),
    query: joi.object().keys({
      
    }).required(),
    params:joi.object().keys({
      
    }).required()
};

export const SignIn = {
  body: joi
    .object()
    .required()
    .keys({
      Email: generalFields.email.required(),
    //   password: generalFields.password,
    Password:joi.string().required(),
    })
    .required(),
    query: joi.object().keys({
      
    }).required(),
    params:joi.object().keys({
      
    }).required()
};

export const LogOut={
    body: joi.object().required()
      .keys({
      }).required(),
      query: joi.object().keys({
      
      }).required(),
      params:joi.object().keys({
        
      }).required()
}

export const ConfirmEmail={
  body: joi.object().required()
      .keys({
      }).required(),
      query: joi.object().keys({
      
      }).required(),
      params:joi.object().keys({
        token: joi.string().required() 
      }).required()
}

export const ChangePassword={
  body: joi
    .object()
    .required()
    .keys({
      OldPassword:generalFields.password.required(),
      NewPassword:generalFields.password.required(),
      ConfirmNewPassword:generalFields.password.required(),

    })
    .required(),
    query: joi.object().keys({
      
    }).required(),
    params:joi.object().keys({
      
    }).required()
}

export const ForgetPassword={
  body: joi
    .object()
    .required()
    .keys({
      Email:generalFields.email.required(),
    })
    .required(),
    query: joi.object().keys({
      
    }).required(),
    params:joi.object().keys({
      
    }).optional()
}

export const reset={
  body: joi
    .object()
    .required()
    .keys({
      NewPassword :generalFields.password.required(),
    })
    .required(),
    query: joi.object().keys({
      
    }).required(),
    params:joi.object().keys({
      
    }).optional()
}