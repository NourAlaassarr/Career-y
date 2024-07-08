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
        height="500px"
        justifyContent="space-between"
        sx={{ backgroundColor: "#057a8d" }}
      >
        <Grid item width="50%" alignSelf="center" paddingLeft={4}>
          <Typography
            variant="h1"
            color="#ffffff"
            fontWeight="bold"
            letterSpacing={4}
            textAlign="center"
            sx={{ textShadow: "4px 4px #00000025" }}
          >
            CAREER
            <Typography variant="h1" color="#F1C111" display="inline">
              -
            </Typography>
            Y
          </Typography>
          <Typography
            textAlign="center"
            variant="h4"
            color="#ffffff"
            width="50%"
            mr="auto"
            ml="auto"
          >
            Unsure of your future path? We can help you decide!
          </Typography>
        </Grid>
        <img
          src={workingGirlImage}
          width="700px"
          height="550px"
          style={{
            position: "absolute",
            bottom: "5%",
            left: "55%",
            zIndex: 10,
          }}
        />
      </Grid>
      <Grid container>
        <Grid item md={12} ml="25%" padding="8px 0px">
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
          gap="20px"
          justifyContent="center"
          marginX={5}
          marginY={4}
        >
          <S.StyledLink to={`/roadmaps`}>
            <Box
              display="flex"
              flexDirection="column"
              alignItems="center"
              textAlign="center"
              sx={{
                hover: {
                  transform: "translateY(-5px)",
                  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                  backgroundColor: " #0c8195",
                  color: "#f1c111",
                },
              }}
            >
              <Typography
                color="#0c8195"
                fontSize="18px"
                fontWeight="600"
                sx={{
                  hover: { color: "#f1c111" },
                }}
              >
                Roadmaps
              </Typography>
              <img
                src={roadmaps}
                alt={`${roadmaps} logo`}
                style={{
                  width: "100px",
                  height: "100px",
                  objectFit: "contain",
                  marginTop: "16px",
                  marginBottom: "24px",
                }}
              />
              <Typography
                color="#0c8195"
                fontSize="18px"
                fontWeight="600"
                sx={{
                  hover: { color: "#f1c111" },
                }}
              >
                Finding a Roadmap for your desired path
              </Typography>
            </Box>
          </S.StyledLink>
          <S.StyledLink to={`/add-skills`}>
            <Box
              display="flex"
              flexDirection="column"
              alignItems="center"
              textAlign="center"
              sx={{
                hover: {
                  transform: "translateY(-5px)",
                  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                  backgroundColor: " #0c8195",
                  color: "#f1c111",
                },
              }}
            >
              <Typography
                color="#0c8195"
                fontSize="18px"
                fontWeight="600"
                sx={{
                  hover: { color: "#f1c111" },
                }}
              >
                Skills
              </Typography>
              <img
                src={skills}
                alt={`${skills} logo`}
                style={{
                  width: "100px",
                  height: "100px",
                  objectFit: "contain",
                  marginTop: "16px",
                  marginBottom: "24px",
                }}
              />
              <Typography
                color="#0c8195"
                fontSize="18px"
                fontWeight="600"
                sx={{
                  hover: { color: "#f1c111" },
                }}
              >
                Adding Skills to know the best path for you
              </Typography>
            </Box>
          </S.StyledLink>
          <S.StyledLink to={`/quiz`}>
            <Box
              display="flex"
              flexDirection="column"
              alignItems="center"
              textAlign="center"
              sx={{
                hover: {
                  transform: "translateY(-5px)",
                  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                  backgroundColor: " #0c8195",
                  color: "#f1c111",
                },
              }}
            >
              <Typography
                color="#0c8195"
                fontSize="18px"
                fontWeight="600"
                sx={{
                  hover: { color: "#f1c111" },
                }}
              >
                Quiz
              </Typography>
              <img
                src={quiz}
                alt={`${quiz} logo`}
                style={{
                  width: "100px",
                  height: "100px",
                  objectFit: "contain",
                  marginTop: "16px",
                  marginBottom: "24px",
                }}
              />
              <Typography
                color="#0c8195"
                fontSize="18px"
                fontWeight="600"
                sx={{
                  hover: { color: "#f1c111" },
                }}
              >
                Testing yourself to track your progress
              </Typography>
            </Box>
          </S.StyledLink>
          <S.StyledLink to={`/courses`}>
            <Box
              display="flex"
              flexDirection="column"
              alignItems="center"
              textAlign="center"
              sx={{
                hover: {
                  transform: "translateY(-5px)",
                  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                  backgroundColor: " #0c8195",
                  color: "#f1c111",
                },
              }}
            >
              <Typography
                color="#0c8195"
                fontSize="18px"
                fontWeight="600"
                sx={{
                  hover: { color: "#f1c111" },
                }}
              >
                Courses
              </Typography>
              <img
                src={courses}
                alt={`${courses} logo`}
                style={{
                  width: "100px",
                  height: "100px",
                  objectFit: "contain",
                  marginTop: "16px",
                  marginBottom: "24px",
                }}
              />
              <Typography
                color="#0c8195"
                fontSize="18px"
                fontWeight="600"
                sx={{
                  hover: { color: "#f1c111" },
                }}
              >
                Learning to imporve yourself
              </Typography>
            </Box>
          </S.StyledLink>
          <S.StyledLink to={`/courses`}>
            <Box
              display="flex"
              flexDirection="column"
              alignItems="center"
              textAlign="center"
              sx={{
                hover: {
                  transform: "translateY(-5px)",
                  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                  backgroundColor: " #0c8195",
                  color: "#f1c111",
                },
              }}
            >
              <Typography
                color="#0c8195"
                fontSize="18px"
                fontWeight="600"
                sx={{
                  hover: { color: "#f1c111" },
                }}
              >
                Jobs
              </Typography>
              <img
                src={job}
                alt={`${job} logo`}
                style={{
                  width: "100px",
                  height: "100px",
                  objectFit: "contain",
                  marginTop: "16px",
                  marginBottom: "24px",
                }}
              />
              <Typography
                color="#0c8195"
                fontSize="18px"
                fontWeight="600"
                sx={{
                  hover: { color: "#f1c111" },
                }}
              >
                Jumpstart your career
              </Typography>
            </Box>
          </S.StyledLink>
        </Box>
      </Grid>
    </>
  );
};
