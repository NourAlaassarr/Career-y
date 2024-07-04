import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./Components/Home";
import {Roadmaps} from "./pages/Roadmaps";
import ProfilePage from "./Components/UserProfile";
import JobList from "./Components/JobList";
import AddSkillsPage from "./Components/AddSkillsPage";
import CareerGuidancePage from "./Components/CareerGuidancePage";
import QuizPage from "./Components/QuizPage";
import SkillQuizPage from "./Components/SkillQuizPage";
import TrackAssessmentPage from "./Components/TrackAssessmentPage";
import JobPage from "./Components/JobPage";
import TrackCoursePage from "./Components/TrackCoursePage";
import QuizGradePage from "./Components/QuizGradePage";
import {Roadmap} from "./pages/Roadmaps/Roadmap";
import Navbar from "./Components/Navbar";
import LoginForm from "./Components/LoginForm";
import SignupForm from "./pages/SignUp";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/roadmaps" element={<Roadmaps />} />
        <Route path="/roadmaps/:id" element={<Roadmap />} />
        <Route path="/UserProfile" element={<ProfilePage />} />
        <Route path="/jobs" element={<JobList />} />
        <Route path="/add-skills" element={<AddSkillsPage />} />
        <Route path="/career-guidance" element={<CareerGuidancePage />} />
        <Route path="/quiz" element={<QuizPage />} />
        <Route path="/quiz/:skill" element={<SkillQuizPage />} />
        <Route
          path="/track/:id/assessment"
          element={<TrackAssessmentPage />}
        />
        <Route path="/job" element={<JobPage />} />
        <Route path="/track/:id/course" element={<TrackCoursePage />} />
        <Route
          path="/track/:id/assessment/option1"
          element={<TrackAssessmentPage option="1" />}
        />
        <Route
          path="/track/:id/assessment/option2"
          element={<TrackAssessmentPage option="2" />}
        />
        <Route
          path="/track/:id/assessment/option3"
          element={<TrackAssessmentPage option="3" />}
        />
        <Route path="/quiz/:skill/grade" element={<QuizGradePage />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/sign-up" element={<SignupForm />} />
      </Routes>
    </Router>
  );
}

export default App;