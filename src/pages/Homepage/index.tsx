
import React from "react";
import workingGirlImage from "../../../images/working-girl.png";
import roadmaps from "../../../images/roadmaps.png";
import skills from "../../../images/skills.png";
import quiz from "../../../images/quiz.png";
import courses from "../../../images/online-learning.png";
import job from "../../../images/job.png";
import { Box, Grid, Typography } from "@mui/material";
import * as S from "./styled";

export const HeroSection = () => {
  return (
    <>
      <Grid
        container
        width="100%"
        height={{ xs: 'auto', md: '500px' }}
        justifyContent="center"
        alignItems="center"
        sx={{ backgroundColor: "#057a8d", position: 'relative', padding: 2 }}
      >
        <Grid
          item
          xs={12}
          md={6}
          display="flex"
          flexDirection="column"
          alignItems="center"
          textAlign="center"
          padding={2}
        >
          <Typography
            variant="h2" // Changed from h1 to h2 for a smaller size
            color="#ffffff"
            fontWeight="bold"
            letterSpacing={2} // Reduced letter spacing
            sx={{ textShadow: "2px 2px #00000025", mb: 2 }} // Adjusted text shadow for a smaller title
          >
            CAREER
            <Typography variant="h2" color="#F1C111" display="inline">
              -
            </Typography>
            Y
          </Typography>
          <Typography
            variant="h4"
            color="#ffffff"
          >
            Unsure of your future path? We can help you decide!
          </Typography>
        </Grid>
        <Grid
          item
          xs={12}
          md={6}
          display="flex"
          justifyContent="center"
          alignItems="center"
        >
          <Box
            component="img"
            src={workingGirlImage}
            alt="Working Girl"
            sx={{
              width: { xs: '80%', sm: '70%', md: '90%' },
              height: { xs: 'auto', md: 'auto' },
              objectFit: "contain",
              maxWidth: '100%',
            }}
          />
        </Grid>
      </Grid>
      <Grid container justifyContent="center" padding={2}>
        <Grid item xs={12} textAlign="center" marginBottom={2}>
          <Typography variant="h4" textTransform="uppercase" color="#000">
            we can help{" "}
            <Typography variant="h4" color="#f1c111" textTransform="uppercase" display="inline">
              you
            </Typography>
          </Typography>
        </Grid>
        <Box
          display="flex"
          flexWrap="wrap"
          gap={2}
          justifyContent="center"
          marginX={2}
        >
          {[
            { to: '/roadmaps', title: 'Roadmaps', description: 'Finding a Roadmap for your desired path', img: roadmaps },
            { to: '/add-skills', title: 'Skills', description: 'Adding Skills to know the best path for you', img: skills },
            { to: '/quiz', title: 'Quiz', description: 'Testing yourself to track your progress', img: quiz },
            { to: '/courses', title: 'Courses', description: 'Learning to improve yourself', img: courses },
            { to: '/jobs', title: 'Jobs', description: 'Jumpstart your career', img: job },
          ].map(({ to, title, description, img }) => (
            <S.StyledLink to={to} key={title}>
              <Box
                display="flex"
                flexDirection="column"
                alignItems="center"
                textAlign="center"
                sx={{
                  backgroundColor: "#ffffff",
                  borderRadius: "8px",
                  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                  transition: "transform 0.3s, box-shadow 0.3s",
                  ':hover': {
                    transform: "translateY(-5px)",
                    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
                  },
                  padding: 2,
                  width: { xs: '90%', sm: '200px', md: '250px' },
                }}
              >
                <Typography
                  color="#0c8195"
                  fontSize={{ xs: '16px', sm: '18px' }}
                  fontWeight="600"
                >
                  {title}
                </Typography>
                <Box
                  component="img"
                  src={img}
                  alt={`${title} logo`}
                  sx={{
                    width: "80px",
                    height: "80px",
                    objectFit: "contain",
                    marginTop: 2,
                    marginBottom: 2,
                  }}
                />
                <Typography
                  color="#0c8195"
                  fontSize={{ xs: '14px', sm: '16px' }}
                >
                  {description}
                </Typography>
              </Box>
            </S.StyledLink>
          ))}
        </Box>
      </Grid>
    </>
  );
};



