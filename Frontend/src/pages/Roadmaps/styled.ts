import { styled, Typography } from "@mui/material";
import { LabelBox } from "../../Components/LabelBox";
import { Link } from "react-router-dom";

export const StyledLabelBox = styled(LabelBox)`
  width: 25%;
`;

export const StyledTypography = styled(Typography)`
  font-weight: bold;
  text-align: center;
  color: #057a8d;
`;

export const ValueTypography = styled(Typography)`
  overflow-wrap: anywhere;
`;

export const StyledLink = styled(Link)`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-decoration: none;
  color: #333;
  width: 150px;
  border: 1px solid #0c8195;
  border-radius: 8px;
  padding: 10px;
  transition: transform 0.2s, box-shadow 0.2s, background-color 0.2s, color 0.2s;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    background-color: #0c8195;
  }

  &:hover p {
    color: #f1c111;
  }
`;
