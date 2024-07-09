import {SystemRoles}from'../../utils/SystemRoles.js'



export const AdminApiRoles={
    GetAllUsers:[SystemRoles.Admin,SystemRoles.Instructor],
    DeleteUser:[SystemRoles.Admin,SystemRoles.Instructor],
    update:[SystemRoles.Admin,SystemRoles.Instructor],
    GetFeedbacks:[SystemRoles.Admin,SystemRoles.Instructor,SystemRoles.User],
}