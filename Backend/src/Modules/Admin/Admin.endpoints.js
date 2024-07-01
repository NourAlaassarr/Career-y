import {SystemRoles}from'../../utils/SystemRoles.js'


export const AdminApiRoles={
    GetAllUsers:[SystemRoles.Admin],
    DeleteUser:[SystemRoles.Admin],
    update:[SystemRoles.Admin],
}