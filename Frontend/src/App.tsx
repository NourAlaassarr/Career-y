import React, { FC } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./Components/Home";
import { Roadmaps } from "./pages/Roadmaps";
import ProfilePage from "./Components/UserProfile";
import JobList from "./Components/JobList";
import AddSkillsPage from "./Components/AddSkillsPage";
import CareerGuidancePage from "./Components/CareerGuidancePage";
import QuizPage from "./Components/QuizPage";
import SkillQuizPage from "./Components/SkillQuizPage";
import TrackAssessmentPage from "./Components/TrackAssessmentPage";
import ShowingMissingSkills from "./Components/ShowingMissingSkills";
import MissingSkillsPage from "./Components/MissingSkillsPage";
import CareerGoalPage from "./Components/CareerGoalPage";
import JobPage from "./Components/JobPage";
import TrackCoursePage from "./Components/TrackCoursePage";
import QuizGradePage from "./Components/QuizGradePage";
import { Roadmap } from "./pages/Roadmaps/Roadmap";
import Navbar from "./Components/Navbar";
import LoginForm from "./Components/LoginForm";
import SignupForm from "./pages/SignUp";
import SkillResources from "./pages/Roadmaps/Roadmap/SkillResources";
import Admin from "./Components/Admin/Admin";
import DeleteUsers from "./Components/Admin/DeleteUsers";
import WhatWeOffer from "./Components/WhatWeOffer";

function App() {
  const RequireAuth: FC<{ children: React.ReactElement }> = ({ children }) => {
    const userIsLogged = JSON.parse(localStorage.getItem("session"));

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
        <Route path="/job" element={<RequireAuth><JobPage /></RequireAuth>} />
        <Route path="/track/:id/course" element={<RequireAuth><TrackCoursePage /></RequireAuth>} />
        <Route path="/track/:id/showMissingSkills" element={<RequireAuth><ShowingMissingSkills /></RequireAuth>} />
        <Route path="/track/:id/missingSkills" element={<RequireAuth><MissingSkillsPage /></RequireAuth>} />
        <Route path="/quiz/:skill/grade" element={<RequireAuth><QuizGradePage /></RequireAuth>} />
        <Route path="/career-goal" element={<RequireAuth><CareerGoalPage /></RequireAuth>} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/sign-up" element={<SignupForm />} />
        <Route path="/courses" element={<WhatWeOffer />} />
      </Routes>
    </Router>
  );
}

export default App;
