import {SystemRoles}from'../../utils/SystemRoles.js'

export const JobApis={
    Add_JobOffer:[SystemRoles.Admin,SystemRoles.Instructor],
    DeleteJob:[SystemRoles.Admin,SystemRoles.Instructor],
    GetAllJobOffers:[SystemRoles.Admin,SystemRoles.User,SystemRoles.Instructor],
    UpdateJobOffer:[SystemRoles.Admin,SystemRoles.Instructor],
    GetJobDetails:[SystemRoles.Admin,SystemRoles.User,SystemRoles.Instructor],
}