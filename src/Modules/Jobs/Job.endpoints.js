import {SystemRoles}from'../../utils/SystemRoles.js'
import { DeleteJob } from './Job.Controllers.js'

export const JobApis={
    Add_JobOffer:[SystemRoles.Admin],
    DeleteJob:[SystemRoles.Admin],
}