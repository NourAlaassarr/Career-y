import { Box, Typography } from "@mui/material";
import React from "react";

interface SeparatorProps {
  text: string;
}

export const Separator = ({ text }: SeparatorProps) => {
  return (
    <Box display="flex" alignItems="center" width="100%" marginY={3}>
      <Box
        sx={{
          flexGrow: 1,
          height: "2px",
          backgroundColor: "#000",
        }}
      ></Box>
      <Box
        sx={{
          backgroundColor: "#057a8d",
          padding: "10px 20px",
          borderRadius: "10px",
          my: "20px",
        }}
      >
        <Typography color="#fff">{text}</Typography>
      </Box>
      <Box
        sx={{
          flexGrow: 1,
          height: "2px",
          backgroundColor: "#000",
        }}
      ></Box>
    </Box>
  );
};
