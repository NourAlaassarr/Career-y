import { SystemRoles } from "../../utils/SystemRoles.js"
import { RecommendTracks } from "./User.Controllers.js"

export const UserApiRoles={
    Solve:[SystemRoles.User,SystemRoles.Admin],
    AddCareerGoal:[SystemRoles.User,SystemRoles.Admin],
    AddSkills:[SystemRoles.User,SystemRoles.Admin],
    GapSkills:[SystemRoles.User,SystemRoles.Admin],
    RecommendTracks:[SystemRoles.User,SystemRoles.Admin],
    GetALLMarksAndGrades:[SystemRoles.User,SystemRoles.Admin],
    CareerGuidanceMatching:[SystemRoles.User],
    GetUserDetails:[SystemRoles.User,SystemRoles.Admin],
    CareerGoalUserProgress:[SystemRoles.User,SystemRoles.Admin],
    GetALLUserSkills:[SystemRoles.User,SystemRoles.Admin],
}