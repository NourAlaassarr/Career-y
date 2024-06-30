import { SystemRoles } from "../../utils/SystemRoles.js"


export const QuizApiRoles={
    Add_Quiz:[SystemRoles.Admin],
    AddQuestionsToQuiz:[SystemRoles.Admin],
    GetQuiz:[SystemRoles.Admin,SystemRoles.User],
    GetTrackQuiz:[SystemRoles.Admin,SystemRoles.User],
    GetAllQuizzes:[SystemRoles.Admin,SystemRoles.User],
    GetFrameWORKs:[SystemRoles.Admin,SystemRoles.User],
    SubmitQuiz:[SystemRoles.User,SystemRoles],
    GetBackendTrackQuiz:[SystemRoles.User,SystemRoles.Admin],
    GetFullStackTrackQuiz:[SystemRoles.User,SystemRoles.Admin],
    fetchSkillsIfFailed:[SystemRoles.User,SystemRoles.Admin],
    fetchJobsOffers:[SystemRoles.User,SystemRoles.Admin],
}