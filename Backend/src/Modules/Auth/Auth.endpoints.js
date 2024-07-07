import {SystemRoles}from'../../utils/SystemRoles.js'
import { ChangePassword } from './Auth.Controllers.js'


export const AuthRolesApi={
    LogOut:[SystemRoles.User,SystemRoles.Admin],
    ChangePassword:[SystemRoles.User,SystemRoles.Admin],
    
}