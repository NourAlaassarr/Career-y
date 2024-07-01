import React from "react";
import "./../styles/homebody.css"; // Adjust the path as needed
import workingGirlImage from "../../images/working-girl.png"; // Adjust the path as needed

const HeroSection = () => {
  return (
    <section className="hero hero-bg d-flex justify-content-center align-items-center">
      <div className="container">
        <div className="row">
          <div className="col-lg-6 col-md-10 col-12 d-flex flex-column justify-content-center align-items-center">
            <div className="hero-text">
              <h1 className="text-white" data-aos="fade-up">
                Unsure Of your future path? We can help you decide!
              </h1>

              <a
                href="contact.html"
                className="custom-btn btn-bg btn mt-3"
                data-aos="fade-up"
                data-aos-delay="100"
              >
                Let us discuss together!
              </a>
              {/* You can update the href link to route to the add skills page */}
            </div>
          </div>

          <div className="col-lg-6 col-12">
            <div className="hero-image" data-aos="fade-up" data-aos-delay="300">
              <img
                src={workingGirlImage}
                className="img-fluid"
                alt="working girl"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
