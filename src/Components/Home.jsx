import AboutSection from "./About";
import {HeroSection} from "../pages/Homepage"
import FeedbacksSection from "./FeedbacksSection";

const Home = () => {
  return (
    <>
      <HeroSection />
      <AboutSection id="About" />
      <FeedbacksSection />
    </>
  );
};

export default Home;
