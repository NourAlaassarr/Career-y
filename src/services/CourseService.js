// CourseService.js

import { httpGet } from "../axios/axiosUtils";

export const getAllCourses = async () => {
  const session = JSON.parse(sessionStorage.getItem("session"));
  console.log(session.token);
  try {
    const response = await httpGet("Course/GetAllCourses", {
      headers: {
        token: session.token,
      },
    });
    console.log(response.courses);
    if (!response) {
      throw new Error("Failed to fetch courses");
    }
    const data = await response.courses;
    return data; // Assuming backend returns courses as an array in { courses: [...] } format
  } catch (error) {
    console.error("Error fetching courses:", error);
    throw error;
  }
};
