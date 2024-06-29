import {SystemRoles}from'../../utils/SystemRoles.js'

export const JobApis={
    Add_JobOffer:[SystemRoles.Admin],
    DeleteJob:[SystemRoles.Admin],
    GetAllJobOffers:[SystemRoles.Admin,SystemRoles.User],
    UpdateJobOffer:[SystemRoles.Admin],
    GetJobDetails:[SystemRoles.Admin,SystemRoles.User],
}