import React from "react";
import officeImage from "../../images/office.png"; // Adjust the path as needed
import "./../styles/About.css";

const AboutSection = () => {
  return (
    <section className="about section-padding pb-0" id="about">
      <div className="container">
        <div className="row">
          <div className="col-lg-7 mx-auto col-md-10 col-12">
            <div className="about-info">
              <h2 className="mb-4" data-aos="fade-up">
                Welcome to <strong>CAREER-Y</strong>
              </h2>
              <p className="mb-0" data-aos="fade-up">
                Where reaching your career goal is a lot easier!
                <br />
                <br />
                At <strong>CAREER-Y</strong>, we are computer science students.
                Our team is passionate about [mention something that drives your
                team, e.g., innovation, creativity, customer satisfaction]. With
                a commitment to [highlight any key values], we strive to
                [mention any goals or objectives]
              </p>
            </div>
            <div
              className="about-image"
              data-aos="fade-up"
              data-aos-delay="200"
            >
              <img src={officeImage} className="img-fluid" alt="office" />
              {/* change this image */}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
