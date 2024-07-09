import { SystemRoles } from "../../utils/SystemRoles.js"


export const QuizApiRoles={
    Add_Quiz:[SystemRoles.Admin,SystemRoles.Instructor],
    AddQuestionsToQuiz:[SystemRoles.Admin,SystemRoles.Instructor],
    GetQuiz:[SystemRoles.Admin,SystemRoles.User,SystemRoles.Instructor],
    GetTrackQuiz:[SystemRoles.Admin,SystemRoles.User,SystemRoles.Instructor],
    GetAllQuizzes:[SystemRoles.Admin,SystemRoles.User,SystemRoles.Instructor],
    GetFrameWORKs:[SystemRoles.Admin,SystemRoles.User,SystemRoles.Instructor],
    SubmitQuiz:[SystemRoles.User,SystemRoles.Admin,SystemRoles.Instructor],
    
    GetBackendTrackQuiz:[SystemRoles.User,SystemRoles.Admin,SystemRoles.Instructor],
    GetFullStackTrackQuiz:[SystemRoles.User,SystemRoles.Admin,SystemRoles.Instructor],

    fetchSkillsIfFailed:[SystemRoles.User,SystemRoles.Admin,SystemRoles.Instructor],
    fetchJobsOffers:[SystemRoles.User,SystemRoles.Admin,SystemRoles.Instructor],
    SubmitTopicQuiz:[SystemRoles.User,SystemRoles.Admin,SystemRoles.Instructor],
}