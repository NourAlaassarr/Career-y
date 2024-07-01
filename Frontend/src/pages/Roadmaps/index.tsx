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
    const { Jobs } = await httpGet(
      "Roadmap/GetAllTracks"
    );
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
            sx={{
              minHeight: "70px",
              minWidth: "calc(25% - 20px)",
              textAlign: "center",
              alignContent: "center",
              backgroundColor: "#057a8d",
              color: "#fff",
              borderRadius: "10px",
              marginBottom: "20px",
              marginRight: "20px",
              cursor: "pointer",
            }}
            onClick={() => {
              navigate(`${roadmap.Nodeid}`);
            }}
          >
            {roadmap.name}
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};
