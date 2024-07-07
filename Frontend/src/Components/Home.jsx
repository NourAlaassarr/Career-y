import Footer from "./Footer";
import AboutSection from "./About";
import ProjectSection from "./Projectsection";
import {HeroSection} from "../pages/Homepage"

const Home = () => {
  return (
    <>
      <HeroSection />
      <AboutSection />
      <ProjectSection />
      <Footer />
    </>
  );
};

export default Home;
