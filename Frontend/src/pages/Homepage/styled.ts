import { styled, Typography } from "@mui/material";
import { Link } from "react-router-dom";

export const StyledLink = styled(Link)`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-decoration: none;
  color: #333;
  width: 160px;
  height: 240px;
  border: 5px solid #0c819550;
  border-radius: 32px;
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
