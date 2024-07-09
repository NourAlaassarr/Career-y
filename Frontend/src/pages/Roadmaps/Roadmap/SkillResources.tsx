import React, { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
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
import { SkillProperties } from "./types";

const SkillResources = () => {
  const { id } = useParams();
  const [skill, setSKill] = useState<SkillProperties>();
  const [skillName, setSkillName] = useState("");
  const navigate = useNavigate();

  const getSkillResources = useCallback(async () => {
    const { Skills } = await httpGet(`Roadmap/SkillResources?SkillId=${id}`);
    if (Skills.length > 0) {
      setSKill(Skills[0]);
      setSkillName(Skills[0].name); // assuming the skill name is the same for all resources
    }
  }, [id]);

  useEffect(() => {
    getSkillResources();
  }, [getSkillResources]);

  return (
    skill && (
      <Box height="100vh" paddingTop={4}>
        <S.StyledTypography variant="h4">
          {skillName} Resources
        </S.StyledTypography>
        <Separator text="Resources" />
        <Grid container spacing={2} paddingX={2}>
          <Grid item md={6} sm={6} xs={12}>
            <Accordion key={skill.Nodeid} defaultExpanded={false}>
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
                    Videos
                  </Typography>
                </S.StyledAccordionSummary>
              </S.BorderBox>
              <AccordionDetails sx={{ padding: "0px" }}>
                <S.SkillDetailsGrid container>
                  <S.DetailGrid
                    item
                    md={12}
                    sm={12}
                    xs={12}
                    className="lastItem"
                    sx={{
                      cursor: "pointer",
                      "&:hover": { textDecoration: "underline" },
                    }}
                  >
                    <S.KeyTypography padding="8px 0px">
                      <Link rel="noopener noreferrer" target="_blank" href={skill.video_resource}>
                        {skill.video_resource}
                      </Link>
                    </S.KeyTypography>
                  </S.DetailGrid>
                </S.SkillDetailsGrid>
              </AccordionDetails>
            </Accordion>
          </Grid>
          <Grid item md={6} sm={6} xs={12}>
            <Accordion key={skill.Nodeid} defaultExpanded={false}>
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
                    Reading Materials
                  </Typography>
                </S.StyledAccordionSummary>
              </S.BorderBox>
              <AccordionDetails sx={{ padding: "0px" }}>
                <S.SkillDetailsGrid container>
                  <S.DetailGrid
                    item
                    md={12}
                    sm={12}
                    xs={12}
                    className="lastItem"
                    sx={{
                      cursor: "pointer",
                      "&:hover": { textDecoration: "underline" },
                    }}
                  >
                    <S.KeyTypography padding="8px 0px">
                      <Link rel="noopener noreferrer" target="_blank" href={skill.reading_resource}>
                        {skill.reading_resource}
                      </Link>
                    </S.KeyTypography>
                  </S.DetailGrid>
                </S.SkillDetailsGrid>
              </AccordionDetails>
            </Accordion>
          </Grid>
        </Grid>
      </Box>
    )
  );
};

export default SkillResources;
