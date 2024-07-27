import React, { FC } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./Components/Home";
import { Roadmaps } from "./pages/Roadmaps";
import ProfilePage from "./Components/UserProfile";
import JobList from "./Components/JobList";
import AddSkillsPage from "./pages/AddSkills";
import FrameworkSelectionPage from "./pages/FrameworkSelectionPage";
import TrackQuizGradePage from "./pages/TrackQuizGrade";
import CareerGuidancePage from "./Components/CareerGuidancePage";
import QuizPage from "./Components/QuizPage";
import SkillQuizPage from "./Components/SkillQuizPage";
import TrackAssessmentPage from "./Components/TrackAssessmentPage";
import ResetPassword from "./Components/ResetPassword";
import ForgetPassword from "./Components/ForgetPassword";
import ShowingMissingSkills from "./Components/ShowingMissingSkills";
import MissingSkillsPage from "./Components/MissingSkillsPage";
import CareerGoalPage from "./Components/CareerGoalPage";
import JobPage from "./Components/JobPage";
import TrackCoursePage from "./Components/TrackCoursePage";
import QuizGradePage from "./Components/QuizGradePage";
import { Roadmap } from "./pages/Roadmaps/Roadmap";
import Navbar from "./Components/Navbar";
import Footer from "./Components/Footer";
import LoginForm from "./Components/LoginForm";
import SignupForm from "./pages/SignUp";
import SkillResources from "./pages/Roadmaps/Roadmap/SkillResources";
import Admin from "./Components/Admin/Admin";
import AddQuiz from "./Components/Admin/AddQuiz";
import AddQuestions from "./Components/Admin/AddQuestions";
import GetAllUsers from "./Components/Admin/GetAllUsers";
import DeleteUsers from "./Components/Admin/DeleteUsers";
import AddCourse from "./Components/Admin/AddCourse";
import DeleteCourse from "./Components/Admin/DeleteCourse";
import UpdateResource from "./Components/Admin/UpdateResource";
import AddJobOffer from "./Components/Admin/AddJobOffer";
import AddSkillToRoadmap from "./Components/Admin/AddSkillToRoadmap";
import DeleteSkillFromRoadmap from "./Components/Admin/DeleteSkillFromRoadmap";
import DeleteJobOffer from "./Components/Admin/DeleteJobOffer";
import UpdateJobOffer from "./Components/Admin/UpdateJobOffer";
import UpdateCourse from "./Components/Admin/UpdateCourse";
import ApproveCourse from "./Components/Admin/ApproveCourse";
import WhatWeOffer from "./Components/WhatWeOffer";

function App() {
  const RequireAuth: FC<{ children: React.ReactElement }> = ({ children }) => {
    const userIsLogged = JSON.parse(sessionStorage.getItem("session"));

    if (!userIsLogged) {
      return <LoginForm />;
    }
    return children;
  };
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/roadmaps"
          element={
            <RequireAuth>
              <Roadmaps />
            </RequireAuth>
          }
        />
        <Route
          path="/roadmaps/:id"
          element={
            <RequireAuth>
              <Roadmap />
            </RequireAuth>
          }
        />
        <Route path="/roadmaps/:id/skill/:id" element={<RequireAuth><SkillResources /></RequireAuth>} />
        <Route path="/user-profile" element={<RequireAuth><ProfilePage /></RequireAuth>} />
        <Route path="/jobs" element={<RequireAuth><JobList /></RequireAuth>} />
        <Route path="/add-skills" element={<RequireAuth><AddSkillsPage /></RequireAuth>} />
        <Route path="/career-guidance" element={<RequireAuth><CareerGuidancePage /></RequireAuth>} />
        <Route path="/quiz" element={<RequireAuth><QuizPage /></RequireAuth>} />
        <Route path="/quiz/:skill" element={<RequireAuth><SkillQuizPage /></RequireAuth>} />
        <Route path="/track/:id/assessment" element={<RequireAuth><TrackAssessmentPage /></RequireAuth>} />
        <Route path="/track/:id/skill/:skillId/assessment" element={<RequireAuth><TrackAssessmentPage /></RequireAuth>} />
        <Route path="/job" element={<RequireAuth><JobPage /></RequireAuth>} />
        <Route path="/track/:id/course" element={<RequireAuth><TrackCoursePage /></RequireAuth>} />
        <Route path="/track/:id/showMissingSkills" element={<RequireAuth><ShowingMissingSkills /></RequireAuth>} />
        <Route path="/track/:id/missingSkills" element={<RequireAuth><MissingSkillsPage /></RequireAuth>} />
        <Route path="/quiz/:skill/grade" element={<RequireAuth><QuizGradePage /></RequireAuth>} />
        <Route path="/career-goal" element={<RequireAuth><CareerGoalPage /></RequireAuth>} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/sign-up" element={<SignupForm />} />
        <Route path="/courses" element={<RequireAuth><WhatWeOffer /></RequireAuth>} />
        <Route path="/admin" element={<RequireAuth><Admin /></RequireAuth>} />
        <Route path="/add-quiz" element={<RequireAuth><AddQuiz /></RequireAuth>} />
        <Route path="/add-questions" element={<RequireAuth><AddQuestions /></RequireAuth>} />
        <Route path="/get-all-users" element={<RequireAuth><GetAllUsers /></RequireAuth>} />
        <Route path="/delete-users" element={<RequireAuth><DeleteUsers /></RequireAuth>} />
        <Route path="/add-course" element={<RequireAuth><AddCourse /></RequireAuth>} />
        <Route path="/delete-course" element={<RequireAuth><DeleteCourse /></RequireAuth>} />
        <Route path="/update-resourse" element={<RequireAuth><UpdateResource /></RequireAuth>} />
        <Route path="/add-job-offer" element={<RequireAuth><AddJobOffer /></RequireAuth>} />
        <Route path="/add-skill-to-roadmap" element={<RequireAuth><AddSkillToRoadmap /></RequireAuth>} />
        <Route
          path="/delete-skill-from-roadmap"
          element={<RequireAuth><DeleteSkillFromRoadmap /></RequireAuth>}
        />
        <Route path="/delete-job-offer" element={<RequireAuth><DeleteJobOffer /></RequireAuth>} />
        <Route path="/update-job-offer" element={<RequireAuth><UpdateJobOffer /></RequireAuth>} />
        <Route path="update-course" element={<RequireAuth><UpdateCourse /></RequireAuth>} />
        <Route path="approve-course" element={<RequireAuth><ApproveCourse /></RequireAuth>} />
        <Route path="/track/:jobId/framework" element={<RequireAuth><FrameworkSelectionPage /></RequireAuth>} />
        <Route path="/track/:id/grade" element={<RequireAuth><TrackQuizGradePage /></RequireAuth>} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/forget-password" element={<ForgetPassword />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
