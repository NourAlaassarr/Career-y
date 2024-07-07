import React, { useCallback, useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";
import * as S from "./styled";
import { Separator } from "../../Components/Separator";
import { httpGet } from "../../axios/axiosUtils";
import { RoadmapType } from "./types";

// import Android from "../../images/logo/Android.png";
import Android from "../../../images/logo/Android.png";
import Backend from "../../../images/logo/backend.png";
import DataAnalyst from "../../../images/logo/Data Analyst.png";
import FullStack from "../../../images/logo/FullStack.png";
import Frontend from "../../../images/logo/frontend.png";
import Security from "../../../images/logo/security.png";
import DataArchitect from "../../../images/logo/database-management.png"; // Example, replace with correct image
import DataEngineer from "../../../images/logo/Data Engineering .png"; // Example, replace with correct image
import DataScientist from "../../../images/logo/Data Science.png";
import DatabaseAdministrator from "../../../images/logo/Database Administration.png";
import EmbeddedSystems from "../../../images/logo/Embedded Systems.png";
import Flutter from "../../../images/logo/Flutter.png";
import SoftwareTesting from "../../../images/logo/Software Testing.png";
import GameDevelopment from "../../../images/logo/Game Development.png";
import ReactNative from "../../../images/logo/React Native.png";
import RoboticsAutomationTechnician from "../../../images/logo/robotic-process-automation.png";
import BusinessIntelligenceDeveloper from "../../../images/logo/business.png";

export const Roadmaps = () => {
  const [roadmaps, setRoadmaps] = useState<RoadmapType[]>([]);

  const getRoadmaps = useCallback(async () => {
    const { Jobs } = await httpGet("Roadmap/GetAllTracks");
    setRoadmaps(Jobs);
  }, []);

  useEffect(() => {
    getRoadmaps();
  }, [getRoadmaps]);

  const getTrackImage = (roadmap: RoadmapType) => {
    // Adjust this switch statement to match each roadmap name with its corresponding image
    switch (roadmap.name.toLowerCase()) {
      case "android developer":
        return Android;
      case "backend":
        return Backend;
      case "data analyst":
        return DataAnalyst;
      case "full_stack":
        return FullStack;
      case "frontend":
        return Frontend;
      case "cybersecurity":
        return Security;
      case "data architect":
        return DataArchitect;
      case "data engineer":
        return DataEngineer;
      case "data scientist":
        return DataScientist;
      case "database administrator":
        return DatabaseAdministrator;
      case "embedded systems":
        return EmbeddedSystems;
      case "flutter development":
        return Flutter;
      case "software testing ":
        return SoftwareTesting;
      case "game development":
        return GameDevelopment;
      case "react native":
        return ReactNative;
      case "robotics automation technician":
        return RoboticsAutomationTechnician;
      case "business intelligence developer":
        return BusinessIntelligenceDeveloper;
      default:
        return null; // Default image or no image
    }
  };

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
      <Box display="flex" flexWrap="wrap" gap="20px" justifyContent="center" marginX={2}>
        {roadmaps.filter((roadmap) => roadmap.name != undefined).map((roadmap) => (
          <S.StyledLink
            key={roadmap.Nodeid}
            to={`${roadmap.Nodeid}`}
          >
            <Box
              display="flex"
              flexDirection="column"
              alignItems="center"
              textAlign="center"
              sx={{
                "hover": {
                  transform: "translateY(-5px)",
                  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                  backgroundColor:" #0c8195",
                  color: "#f1c111"
                }
              }}
            >
              <img
                src={getTrackImage(roadmap)}
                alt={`${roadmap.name} logo`}
                style={{
                  width: "100px",
                  height: "100px",
                  objectFit: "contain",
                  marginBottom: "10px",
                }}
              />
              <Typography
                color="#0c8195"
                fontSize="18px"
                fontWeight="500"
                sx={{
                  hover: { color: "#f1c111" },
                }}
              >
                {roadmap.name}
              </Typography>
            </Box>
          </S.StyledLink>
        ))}
      </Box>
    </Box>
  );
};
