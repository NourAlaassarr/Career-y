


import React from "react";
import officeImage from "../../images/office.png"; // Adjust the path as needed
import { Box, Grid, Typography } from "@mui/material";

interface AboutProps {
  id: string;
}

const AboutSection = ({ id }: AboutProps) => {
  return (
    <Box id={id} sx={{ padding: { xs: 2, sm: 4, md: 6 }, backgroundColor: "#f9f9f9" }}>
      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <img
            src={officeImage}
            alt="Office"
            style={{ objectFit: "cover", width: "100%", borderRadius: "8px" }}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <Typography variant="h4" textTransform="capitalize" color="#000" gutterBottom>
            Welcome to{" "}
            <Typography color="#f1c111" display="inline" variant="h4">
              Career-Y
            </Typography>
          </Typography>
          <Typography color="#000" variant="body1" paragraph>
            We address the multifaceted needs of users in the domains of career guidance, learning roadmaps, and skill assessment quizzes. Founded in 2024, we have been building and improving the website to make it more comprehensive and easier to use by updating the roadmaps and skills on the website. Our mission is to minimize student distractions and enhance job opportunities.
          </Typography>
          <Typography variant="h4" textTransform="capitalize" color="#000" marginTop={4} gutterBottom>
            Who{" "}
            <Typography color="#f1c111" display="inline" variant="h4">
              We
            </Typography>{" "}
            Are
          </Typography>
          <Typography color="#000" variant="body1" paragraph>
            At CAREER-Y, we are graduates of the Information Systems department at Cairo University. We experienced firsthand the difficulties that come with starting or even becoming a qualified programmer. Our team is passionate about helping others who are experiencing the same challenges and learning more about ourselves and this field in the process. With a commitment to making the whole process smooth and helping as many people as possible, we strive to become the springboard for your career and walk with you every step of the way from learning to landing a job.
          </Typography>
          <Typography variant="h4" textTransform="capitalize" color="#000" marginTop={4} gutterBottom>
            What{" "}
            <Typography color="#f1c111" display="inline" variant="h4">
              Sets Us
            </Typography>{" "}
            Apart
          </Typography>
          <Typography color="#000" variant="body1" paragraph>
            What distinguishes Career-Y from the rest is that we combine the qualities that may be found in other places individually but create a unique and complete journey when they come together. Whether it&apos;s Roadmaps, Courses, Quizzes, Career Guidance, and more, we pride ourselves on combining these elements to create a comprehensive process.
          </Typography>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AboutSection;
