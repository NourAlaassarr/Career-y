import { styled, Typography } from "@mui/material";
import { LabelBox } from "../../Components/LabelBox";
import { Link } from "react-router-dom";

// Styled component for LabelBox with responsive width
export const StyledLabelBox = styled(LabelBox)`
  width: 25%;

  @media (max-width: 1200px) {
    width: 33%;
  }

  @media (max-width: 900px) {
    width: 50%;
  }

  @media (max-width: 600px) {
    width: 100%;
  }
`;

// Styled Typography with responsive font size
export const StyledTypography = styled(Typography)`
  font-weight: bold;
  text-align: center;
  color: #057a8d;
  font-size: 1.5rem; // Default font size

  @media (max-width: 768px) {
    font-size: 1.25rem;
  }

  @media (max-width: 480px) {
    font-size: 1rem;
  }
`;

// Styled Typography for value display with word wrap
export const ValueTypography = styled(Typography)`
  overflow-wrap: anywhere;
  font-size: 2rem; // Default font size

  @media (max-width: 768px) {
    font-size: 0.875rem;
  }

  @media (max-width: 480px) {
    font-size: 2rem;
  }
`;

// Styled Link with responsive design
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
    color: #f1c111;  // Change text color on hover
  }

  &:hover p {
    color: inherit; // Ensure text color changes on hover
  }

  @media (max-width: 768px) {
    width: 120px;
    padding: 8px;
  }

  @media (max-width: 480px) {
    width: 100px;
    padding: 6px;
  }
`;
