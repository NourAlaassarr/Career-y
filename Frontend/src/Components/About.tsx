import React from "react";
import officeImage from "../../images/office.png"; // Adjust the path as needed
import "../Styles/About.css";
import { Grid, Typography } from "@mui/material";

interface AboutProps {
  id: string;
}

const AboutSection = ({ id }: AboutProps) => {
  return (
    <div id={id}>
      <Grid container>
        <Grid item xs={7} sm={7} md={7}>
          <img
            src={officeImage}
            style={{ objectFit: "scale-down", width: "100%" }}
          />
        </Grid>
        <Grid item xs={5} sm={5} md={5}>
          <Typography variant="h4" textTransform="capitalize" color="#000">
            welcom to{" "}
            <Typography color="#f1c111" display="inline" variant="h4">
              career-y
            </Typography>
          </Typography>
          <Typography color="#000" variant="h6">
            where address the multifaceted needs of users in the domains of
            career guidance, learning roadmaps, and skill assessment quizzes.
            Founded in 2024, we have been building and improving the website to
            make it more comprehensive and easier to use by updating the
            roadmaps and skills on the website. Our mission is to minimize
            student distractions and enhance job opportunities.
          </Typography>
          <Typography variant="h4" textTransform="capitalize" color="#000" marginTop={4}>
            who{" "}
            <Typography color="#f1c111" display="inline" variant="h4">
              we
            </Typography>{" "}
            are
          </Typography>
          <Typography color="#000" variant="h6">
            At CAREER-Y, we are graduates of Information Systems department in
            Cairo University, we experienced first hand the difficulties that
            come with starting or even becoming a qualified programmer. Our team
            is passionate about helping others who are experiencing the same
            things and learning more about ourselves and this field in the
            process. With a commitment to make the whole process smoothe and
            helping as many people as possible, we strive to become the spring
            board for your career and walk with you every step of the way from
            learning to landing a job.
          </Typography>
          <Typography variant="h4" textTransform="capitalize" color="#000" marginTop={4}>
            what{" "}
            <Typography color="#f1c111" display="inline" variant="h4">
              sets us
            </Typography>{" "}
            apart
          </Typography>
          <Typography color="#000" variant="h6">
            What distinguishes Career-Y from the rest is that we combine the
            qualities that may be found in other places individually but creates
            a unique and complete journey when they come togther. Whether
            it&apos;s Roadmaps, Courses, Quizzes, Career Guidance and more we
            pride ourselves on combining these things toghter to make a whole
            process.
          </Typography>
        </Grid>
      </Grid>
    </div>
  );
  // return (
  //   <section className="about section-padding pb-0" id="about">
  //     <div className="container">
  //       <div className="row">
  //         <div className="col-lg-7 mx-auto col-md-10 col-12">
  //           <div className="about-info">
  //             <h2 className="mb-4" data-aos="fade-up">
  //               Welcome to <strong>CAREER-Y</strong>
  //             </h2>
  //             <p className="mb-0" data-aos="fade-up">
  //               Where reaching your career goal is a lot easier!
  //               <br />
  //               <br />
  //               At <strong>CAREER-Y</strong>, we are computer science students.
  //               Our team is passionate about [mention something that drives your
  //               team, e.g., innovation, creativity, customer satisfaction]. With
  //               a commitment to [highlight any key values], we strive to
  //               [mention any goals or objectives]
  //             </p>
  //           </div>
  //           <div
  //             className="about-image"
  //             data-aos="fade-up"
  //             data-aos-delay="200"
  //           >
  //             <img src={officeImage} className="img-fluid" alt="office" />
  //             {/* change this image */}
  //           </div>
  //         </div>
  //       </div>
  //     </div>
  //   </section>
  // );
};

export default AboutSection;
