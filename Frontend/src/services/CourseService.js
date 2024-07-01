// CourseService.js

const BASE_URL = "http://localhost:3000"; // Replace with your backend URL

export const getAllCourses = async () => {
  try {
    const response = await fetch(`${BASE_URL}/api/course/GetAllCourses`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        // Add any necessary headers such as authorization token if required
      },
    });
    if (!response.ok) {
      throw new Error("Failed to fetch courses");
    }
    const data = await response.json();
    return data.courses; // Assuming backend returns courses as an array in { courses: [...] } format
  } catch (error) {
    console.error("Error fetching courses:", error);
    throw error;
  }
};
