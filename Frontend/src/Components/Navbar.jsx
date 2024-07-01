import { BrowserRouter as Router, Link, Route, Routes } from "react-router-dom";
import { FaUser } from "react-icons/fa"; // Import the user icon
import "./../styles/Navbar.css";
import "./../styles/general.css";

import Sidebar from "./Sidebar";
import LoginForm from "./LoginForm";
import ResetPasswordForm from "./ResetPassword";
import { Roadmaps } from "./../pages/Roadmaps";
import SignupForm from "./../pages/SignUp";
import ProfilePage from "./UserProfile";
import JobList from "./JobList";
import Home from "./Home";
import AddSkillsPage from "./AddSkillsPage";
import CareerGuidancePage from "./CareerGuidancePage";
import AddSkills2Page from "./AddSkills2Page";
import QuizPage from "./QuizPage";
import SkillQuizPage from "./SkillQuizPage";
import TrackAssessmentPage from "./TrackAssessmentPage";
import JobPage from "./JobPage";
import TrackCoursePage from "./TrackCoursePage";
import QuizGradePage from "./QuizGradePage";
import { Roadmap } from "../pages/Roadmaps/Roadmap";

function Signup() {
  return (
    <div className="container">
      <Sidebar />
      <div className="content">
        <SignupForm />
      </div>
    </div>
  );
}

function Login() {
  return <LoginForm />;
}

function ResetPassword() {
  return <ResetPasswordForm />;
}

function Navbar() {
  return (
    <Router>
      <div>
        <nav className="navbar navbar-expand-lg">
          <div className="Navbar">
            <ul className="navbar-nav">
              <li className="nav-item">
                <Link className="brand" to="/">
                  CAREER-Y
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/about" className="nav-link smoothScroll">
                  About
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/quiz" className="nav-link smoothScroll">
                  Quiz
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/add-skills-2" className="nav-link">
                  Add Skills
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/roadmaps" className="nav-link">
                  Roadmaps
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/career-guidance" className="nav-link">
                  Career Guidance
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/login" className="nav-link contact">
                  Login
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/sign-up" className="nav-link contact">
                  Sign Up
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/UserProfile" className="nav-link">
                  <FaUser />
                </Link>
              </li>
            </ul>
          </div>
        </nav>
        <Routes>
          <Route path="/" />
          <Route path="/login" element={<Login />} />
          <Route path="/sign-up" element={<Signup />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/roadmaps" element={<Roadmaps />} />
          <Route path="/roadmaps/:id" element={<Roadmap />} />
          <Route path="/UserProfile" element={<ProfilePage />} />
          <Route path="/jobs" element={<JobList />} />
          <Route path="/add-skills" element={<AddSkillsPage />} />
          <Route path="/career-guidance" element={<CareerGuidancePage />} />

        <Route path="/track/:trackId/assessment" element={<TrackAssessmentPage />} />

          <Route path="/add-skills-2" element={<AddSkills2Page />} />
          <Route path="/quiz" element={<QuizPage />} />
          <Route path="/quiz/:skillId" element={<SkillQuizPage/>} />
          
          <Route path="/job" element={<JobPage />} />
          <Route path="/track/:id/course" element={<TrackCoursePage />} />
          
          <Route path="/quiz/:skill/grade" element={<QuizGradePage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default Navbar;
