import { Grid } from "@mui/material";
import React from "react";

interface LabelBoxProps {
  text: string;
}

export const LabelBox = ({ text }: LabelBoxProps) => {
  return (
    <Grid
      item
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
      }}
    >
      {text}
    </Grid>
  );
};
