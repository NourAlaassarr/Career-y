import { SystemRoles } from "../../utils/SystemRoles.js"
import { RecommendTracks } from "./User.Controllers.js"

export const UserApiRoles={
    Solve:[SystemRoles.User],
    AddCareerGoal:[SystemRoles.User],
    AddSkills:[SystemRoles.User],
    GapSkills:[SystemRoles.User],
    RecommendTracks:[SystemRoles.User],
    GetALLMarksAndGrades:[SystemRoles.User],
    CareerGuidanceMatching:[SystemRoles.User],
    GetUserDetails:[SystemRoles.User],
    CareerGoalUserProgress:[SystemRoles.User],
    GetALLUserSkills:[SystemRoles.User],
}