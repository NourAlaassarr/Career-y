import { SystemRoles } from "../../utils/SystemRoles.js"


export const RoadmapsApiRoles={
    GetRoadmap:[SystemRoles.Admin,SystemRoles.User,SystemRoles.Instructor],
    GetAllTracks:[SystemRoles.Admin,SystemRoles.User,SystemRoles.Instructor],
    SkillResources:[SystemRoles.Admin,SystemRoles.User,SystemRoles.Instructor],
    AllSkills:[SystemRoles.Admin,SystemRoles.User,SystemRoles.Instructor],
    UpdatedSkill:[SystemRoles.Admin,SystemRoles.User,SystemRoles.Instructor],
    
    AddSkillToRoadmap:[SystemRoles.Admin,SystemRoles.Instructor],
    DeleteSkillFromRoadmap:[SystemRoles.Admin,SystemRoles.Instructor],
    UpdateResource:[SystemRoles.Admin,SystemRoles.Instructor],
}