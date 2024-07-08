import React from "react";

import "../Styles/ProjectSection.css";
import roadmapImage from "../../images/project/roadmap.jpg"; // Adjust the path as needed
import quizImage from "../../images/project/quiz.jpg";
import skillsImage from "../../images/project/skills.jpg";
import courseImage from "../../images/project/course.jpg";

const ProjectSection = () => {
  return (
    <section className="project section-padding" id="project">
      <div className="container-fluid">
        <div className="row">
          <div className="col-lg-12 col-12">
            <h2 className="mb-5 text-center" data-aos="fade-up">
              What we offer at
              <strong>Career-y</strong>
            </h2>

            <div className="owl-carousel owl-theme" id="project-slide">
              <div
                className="item project-wrapper"
                data-aos="fade-up"
                data-aos-delay="100"
              >
                <img
                  src={roadmapImage}
                  className="img-fluid"
                  alt="project image"
                />

                <div className="project-info">
                  <small>Roadmaps</small>

                  <h3>
                    <a href="#">
                      <span>Finding a Roadmaps for your desired path.</span>
                      <i className="fa fa-angle-right project-icon"></i>
                    </a>
                  </h3>
                </div>
              </div>

              <div className="item project-wrapper" data-aos="fade-up">
                <img
                  src={quizImage}
                  className="img-fluid"
                  alt="project image"
                />

                <div className="project-info">
                  <small>Quizzes</small>

                  <h3>
                    <a href="#">
                      <span>Testing yourself to track your progress.</span>
                      <i className="fa fa-angle-right project-icon"></i>
                    </a>
                  </h3>
                </div>
              </div>

              <div className="item project-wrapper" data-aos="fade-up">
                <img
                  src={skillsImage}
                  className="img-fluid"
                  alt="project image"
                />

                <div className="project-info">
                  <small>Skills</small>

                  <h3>
                    <a href="#">
                      <span>Adding skills to know the best path for you.</span>
                      <i className="fa fa-angle-right project-icon"></i>
                    </a>
                  </h3>
                </div>
              </div>

              <div className="item project-wrapper" data-aos="fade-up">
                <img
                  src={courseImage}
                  className="img-fluid"
                  alt="project image"
                />

                <div className="project-info">
                  <small>Courses</small>

                  <h3>
                    <a href="#">
                      <span>We offer Courses to help you reach your goal.</span>
                      <i className="fa fa-angle-right project-icon"></i>
                    </a>
                  </h3>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProjectSection;
