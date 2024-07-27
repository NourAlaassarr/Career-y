import React, { Fragment, useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { RoadmapType } from "../types";
import { httpGet } from "../../../axios/axiosUtils";
import {
  Accordion,
  AccordionDetails,
  Box,
  Grid,
  Link,
  Typography,
} from "@mui/material";
import * as S from "./styled";
import { Separator } from "../../../Components/Separator";
import { SkillType, FullStackType } from "./types";

export const Roadmap = () => {
  const { id } = useParams();
  const [skills, setSkills] = useState<SkillType[] | FullStackType[]>([]);
  const [courses, setCourses] = useState([]);
  const [name, setName] = useState();
  const [description, setDescription] = useState();
  const session = JSON.parse(sessionStorage.getItem("session"));
  const navigate = useNavigate();

  const getRoadmap = useCallback(async () => {
    const { roadmapSkills, roadmapDetails } = await httpGet(
      `Roadmap/GetRoadmap?TrackId=${id}`
    );
    setSkills(roadmapSkills);
    setName(roadmapDetails.name);
    setDescription(roadmapDetails.description);
  }, [id]);

  const getTrackCourses = useCallback(async () => {
    const { courses } = await httpGet(`Course/GetTrackCourses?TrackId=${id}`, {
      headers: { token: session.token },
    });
    setCourses(courses);
  }, [id, session.token]);

  useEffect(() => {
    getRoadmap();
  }, [getRoadmap]);

  useEffect(() => {
    getTrackCourses();
  }, [getTrackCourses]);

  console.log(skills);

  return (
    skills &&
    courses && (
      <Box paddingTop={4}>
        <S.StyledTypography variant="h4">{name}</S.StyledTypography>
        <S.StyledTypography variant="h6" paddingX={2} paddingTop={2}>
          {description}
        </S.StyledTypography>
        <Separator text="Skills" />
        <Box paddingX={2} paddingBottom={4}>
          {skills.length > 2
            ? skills
                .sort((skill1, skill2) => (skill1.name > skill2.name ? 1 : -1))
                .map((skill) => {
                  return (
                    <Grid item xs={12} key={skill.name} paddingTop={2}>
                      <Accordion key={skill.name} defaultExpanded={false}>
                        <S.BorderBox>
                          <S.StyledAccordionSummary
                            sx={{
                              flexDirection: "row-reverse",
                              padding: "8px 16px",
                            }}
                            expandIcon={
                              <svg
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  d="M20.1316 17.5117L21.9016 15.7417L12.0016 5.84172L2.10156 15.7417L3.87156 17.5117L12.0016 9.38172L20.1316 17.5117Z"
                                  fill="#4E4B66"
                                />
                              </svg>
                            }
                          >
                            <Box padding="8px" />
                            <Typography color="#057a8d" variant="h5">
                              {skill.name}
                            </Typography>
                            <S.MandatoryBox>
                              {skill.mandatory ? (
                                <Typography color="red" fontWeight="bold">
                                  Mandatory
                                </Typography>
                              ) : (
                                <Typography color="green" fontWeight="bold">
                                  Optional
                                </Typography>
                              )}
                            </S.MandatoryBox>
                          </S.StyledAccordionSummary>
                        </S.BorderBox>
                        <AccordionDetails sx={{ padding: "0px" }}>
                          <S.SkillDetailsGrid container>
                            <S.DetailGrid item md={3} sm={6} xs={6}>
                              <S.KeyTypography>Level</S.KeyTypography>
                            </S.DetailGrid>
                            <S.DetailGrid item md={3} sm={6} xs={6}>
                              <Typography>{skill.properties.level}</Typography>
                            </S.DetailGrid>
                            <S.DetailGrid item md={3} sm={6} xs={6}>
                              <S.KeyTypography>Type</S.KeyTypography>
                            </S.DetailGrid>
                            <S.DetailGrid
                              item
                              md={3}
                              sm={6}
                              xs={6}
                              className="lastItem"
                            >
                              <Typography>{skill.properties.type}</Typography>
                            </S.DetailGrid>
                            <S.DetailGrid
                              item
                              md={12}
                              sm={12}
                              xs={12}
                              className="lastItem"
                              onClick={() =>
                                navigate(`skill/${skill.properties.Nodeid}`)
                              }
                              sx={{
                                cursor: "pointer",
                                "&:hover": { textDecoration: "underline" },
                              }}
                            >
                              <S.KeyTypography padding="8px 0px">
                                Click here for related resources
                              </S.KeyTypography>
                            </S.DetailGrid>
                          </S.SkillDetailsGrid>
                        </AccordionDetails>
                      </Accordion>
                    </Grid>
                  );
                })
            : skills.map((skill) => {
                return (
                  <>
                    <Separator text={skill.job} />
                    {skill.skills.map((skill) => (
                      <Grid
                        item
                        xs={12}
                        key={skill.properties.name}
                        paddingTop={2}
                      >
                        <Accordion
                          key={skill.properties.name}
                          defaultExpanded={false}
                        >
                          <S.BorderBox>
                            <S.StyledAccordionSummary
                              sx={{
                                flexDirection: "row-reverse",
                                padding: "8px 16px",
                              }}
                              expandIcon={
                                <svg
                                  width="24"
                                  height="24"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    d="M20.1316 17.5117L21.9016 15.7417L12.0016 5.84172L2.10156 15.7417L3.87156 17.5117L12.0016 9.38172L20.1316 17.5117Z"
                                    fill="#4E4B66"
                                  />
                                </svg>
                              }
                            >
                              <Box padding="8px" />
                              <Typography color="#057a8d" variant="h5">
                                {skill.properties.name}
                              </Typography>
                              <S.MandatoryBox>
                                {skill.properties.mandatory ? (
                                  <Typography color="red" fontWeight="bold">
                                    Mandatory
                                  </Typography>
                                ) : (
                                  <Typography color="green" fontWeight="bold">
                                    Optional
                                  </Typography>
                                )}
                              </S.MandatoryBox>
                            </S.StyledAccordionSummary>
                          </S.BorderBox>
                          <AccordionDetails sx={{ padding: "0px" }}>
                            <S.SkillDetailsGrid container>
                              <S.DetailGrid item md={3} sm={6} xs={6}>
                                <S.KeyTypography>Level</S.KeyTypography>
                              </S.DetailGrid>
                              <S.DetailGrid item md={3} sm={6} xs={6}>
                                <Typography>
                                  {skill.properties.level}
                                </Typography>
                              </S.DetailGrid>
                              <S.DetailGrid item md={3} sm={6} xs={6}>
                                <S.KeyTypography>Type</S.KeyTypography>
                              </S.DetailGrid>
                              <S.DetailGrid
                                item
                                md={3}
                                sm={6}
                                xs={6}
                                className="lastItem"
                              >
                                <Typography>{skill.properties.type}</Typography>
                              </S.DetailGrid>
                              <S.DetailGrid
                                item
                                md={12}
                                sm={12}
                                xs={12}
                                className="lastItem"
                                onClick={() =>
                                  navigate(`skill/${skill.properties.Nodeid}`)
                                }
                                sx={{
                                  cursor: "pointer",
                                  "&:hover": { textDecoration: "underline" },
                                }}
                              >
                                <S.KeyTypography padding="8px 0px">
                                  Click here for related resources
                                </S.KeyTypography>
                              </S.DetailGrid>
                            </S.SkillDetailsGrid>
                          </AccordionDetails>
                        </Accordion>
                      </Grid>
                    ))}
                  </>
                );
              })}
        </Box>
        <Separator text="Courses" />
        <Box paddingX={2} paddingBottom={4}>
          {courses.map((course) => (
            <Grid item xs={12} key={course.CourseId} paddingTop={2}>
              <Accordion key={course.CourseId} defaultExpanded={false}>
                <S.BorderBox>
                  <S.StyledAccordionSummary
                    sx={{
                      flexDirection: "row-reverse",
                      padding: "8px 16px",
                    }}
                    expandIcon={
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M20.1316 17.5117L21.9016 15.7417L12.0016 5.84172L2.10156 15.7417L3.87156 17.5117L12.0016 9.38172L20.1316 17.5117Z"
                          fill="#4E4B66"
                        />
                      </svg>
                    }
                  >
                    <Box padding="8px" />
                    <Typography color="#057a8d" variant="h5">
                      {course.CourseName}
                    </Typography>
                  </S.StyledAccordionSummary>
                </S.BorderBox>
                <AccordionDetails sx={{ padding: "0px" }}>
                  <S.SkillDetailsGrid container>
                    <S.DetailGrid item md={3} sm={3} xs={3}>
                      <S.KeyTypography>Description</S.KeyTypography>
                    </S.DetailGrid>
                    <S.DetailGrid
                      item
                      md={9}
                      sm={9}
                      xs={9}
                      className="lastItem"
                    >
                      <Typography>{course.CourseDescription}</Typography>
                    </S.DetailGrid>
                    <S.DetailGrid item md={3} sm={3} xs={3}>
                      <S.KeyTypography>Prerequisites</S.KeyTypography>
                    </S.DetailGrid>
                    <S.DetailGrid
                      item
                      md={9}
                      sm={9}
                      xs={9}
                      className="lastItem"
                    >
                      <Typography>{course.prerequisites}</Typography>
                    </S.DetailGrid>
                    <S.DetailGrid item md={3} sm={6} xs={6}>
                      <S.KeyTypography>Language</S.KeyTypography>
                    </S.DetailGrid>
                    <S.DetailGrid item md={3} sm={6} xs={6}>
                      <Typography>{course.language}</Typography>
                    </S.DetailGrid>
                    <S.DetailGrid item md={3} sm={6} xs={6}>
                      <S.KeyTypography>Duration</S.KeyTypography>
                    </S.DetailGrid>
                    <S.DetailGrid
                      item
                      md={3}
                      sm={6}
                      xs={6}
                      className="lastItem"
                    >
                      <Typography>{course.Duration}</Typography>
                    </S.DetailGrid>
                    <S.DetailGrid item md={3} sm={3} xs={3}>
                      <S.KeyTypography>Link</S.KeyTypography>
                    </S.DetailGrid>
                    <S.DetailGrid
                      item
                      md={9}
                      sm={9}
                      xs={9}
                      className="lastItem"
                    >
                      <Link
                        rel="noopener noreferrer"
                        target="_blank"
                        href={course.Courselink}
                      >
                        {course.Courselink}
                      </Link>
                    </S.DetailGrid>
                  </S.SkillDetailsGrid>
                </AccordionDetails>
              </Accordion>
            </Grid>
          ))}
        </Box>
      </Box>
    )
  );
};
