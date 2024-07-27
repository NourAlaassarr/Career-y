import { styled, Typography, Box, AccordionSummary, Grid } from "@mui/material";

export const StyledTypography = styled(Typography)`
  font-weight: bold;
  text-align: center;
  color: #057a8d;
`;


export const BorderBox = styled(Box)`
  border-radius: 6px 6px 0px 0px;
  border: 2px solid #a8a8a8;
  margin-bottom: 16px;
  border-bottom: none;
  margin-bottom: 0;
`;

export const StyledAccordionSummary = styled(AccordionSummary)`
  div[class*="MuiAccordionSummary-content"] {
    margin: 0;
  }

  padding: 0;
  border-bottom: 2px;
`;

export const MandatoryBox = styled(Box)`
  margin-left: auto;
  display: flex;
  align-items: center;
`;

export const SkillDetailsGrid = styled(Grid)`
  width: 100%;
  min-width: 100%;
  padding: 0px;
  margin: 0px;
`;

export const DetailGrid = styled(Grid)`
  border: 2px solid;
  border-color: #a8a8a8;
  border-bottom: 0px;
  box-sizing: border-box;
  padding: 4px 8px;

  &:not(.lastItem) {
    border-right: none;
  }
`;

export const KeyTypography = styled(Typography)`
  width: fit-content;
  font-weight: 600;
`;
