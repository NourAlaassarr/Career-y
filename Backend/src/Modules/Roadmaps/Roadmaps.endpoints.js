import { SystemRoles } from "../../utils/SystemRoles.js"


export const RoadmapsApiRoles={
    GetRoadmap:[SystemRoles.Admin,SystemRoles.User],
    GetAllTracks:[SystemRoles.Admin,SystemRoles.User],
    SkillResources:[SystemRoles.Admin,SystemRoles.User],
    AllSkills:[SystemRoles.Admin,SystemRoles.User],
    UpdatedSkill:[SystemRoles.Admin,SystemRoles.User],
    
    AddSkillToRoadmap:[SystemRoles.Admin],
    DeleteSkillFromRoadmap:[SystemRoles.Admin],
    UpdateResource:[SystemRoles.Admin],
}