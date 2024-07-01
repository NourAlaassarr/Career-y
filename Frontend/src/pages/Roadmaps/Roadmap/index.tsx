import React, { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { RoadmapType } from "../types";
import { httpGet } from "../../../axios/axiosUtils";
import { Box, Grid, LinearProgress } from "@mui/material";
import * as S from "../styled";
import { Separator } from "../../../Components/Separator";
import { LabelBox } from "../../../Components/LabelBox";

export const Roadmap = () => {
  const { id } = useParams();
  const [skills, setSkills] = useState([]);
  const [name, setName] = useState();
  const [description, setDescription] = useState();
  const navigate = useNavigate();

  const getRoadmap = useCallback(async () => {
    const { RoadMap, Name, Description } = await httpGet(
      `Roadmap/GetRoadmap?TrackId=${id}`
    );
    console.log(RoadMap);
    setSkills(RoadMap);
    setName(Name);
    setDescription(Description);
  }, [id]);

  useEffect(() => {
    getRoadmap();
  }, [getRoadmap]);

  console.log(skills);

  return (
    skills && (
      <Box paddingTop={4}>
        <S.StyledTypography variant="h4">{name}</S.StyledTypography>
        <S.StyledTypography variant="h6" paddingX={2} paddingTop={2}>
          {description}
        </S.StyledTypography>
        <Separator text="Skills" />
        <Grid container>
          {skills.map((skill) => (
            <S.StyledLabelBox key={skill} text={skill.name} />
          ))}
        </Grid>
      </Box>
    )
  );
};
