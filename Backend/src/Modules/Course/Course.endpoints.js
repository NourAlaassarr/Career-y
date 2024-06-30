import {SystemRoles}from'../../utils/SystemRoles.js'


export const CourseApiRoles={
    Add_Course:[SystemRoles.Admin,SystemRoles.User],
    ApproveCourse:[SystemRoles.Admin],
    DeleteCourse:[SystemRoles.Admin],
    GetAllCourses:[SystemRoles.Admin,SystemRoles.User],
    UpdateCourse:[SystemRoles.Admin,SystemRoles.User],
    GetCourseDetails:[SystemRoles.Admin,SystemRoles.User],
    GetTrackCourses:[SystemRoles.Admin,SystemRoles.User],
}