import React, { useCallback, useEffect, useState } from "react";
import { Box, Grid, Typography } from "@mui/material";
import * as S from "./styled";
import { Separator } from "../../Components/Separator";
import { httpGet } from "../../axios/axiosUtils";
import { RoadmapType } from "./types";
import { useNavigate } from "react-router-dom";

export const Roadmaps = () => {
  const [roadmaps, setRoadmaps] = useState<RoadmapType[]>([]);
  const navigate = useNavigate();

  const getRoadmaps = useCallback(async () => {
    const { Jobs } = await httpGet("Roadmap/GetAllTracks");
    setRoadmaps(Jobs);
  }, []);

  useEffect(() => {
    getRoadmaps();
  }, [getRoadmaps]);

  console.log(roadmaps);

  return (
    <Box paddingTop={4}>
      <S.StyledTypography variant="h4">Roadmaps</S.StyledTypography>
      <S.StyledTypography variant="h6">
        HERE YOU CAN FIND{" "}
        <Typography
          display="inline"
          color="#F1C111"
          variant="h6"
          fontWeight="bold"
        >
          ROADMAPS
        </Typography>{" "}
        FOR YOUR DESIRED CAREER PATH
      </S.StyledTypography>
      <Separator text="Career Roadmaps" />
      {/* List of Roadmaps from api */}
      <Grid
        container
        spacing={1}
        sx={{
          paddingRight: "60px",
          paddingLeft: "70px",
          justifyContent: "flex-start",
        }}
      >
        {roadmaps.map((roadmap) => (
          <Grid
            item
            key={roadmap.Nodeid}
            xs={12}
            sm={6}
            md={3}
            onClick={() => {
              navigate(`${roadmap.Nodeid}`);
            }}
          >
            <Box
              sx={{
                backgroundColor: "#057a8d",
                minHeight: "60px",
                textAlign: "center",
                alignContent: "center",
                color: "#fff",
                borderRadius: "10px",
                cursor: "pointer",
              }}
            >
              {roadmap.name}
            </Box>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};
