import React from "react";
import { Link } from "react-router-dom";
import { AppBar, Toolbar, Typography, Button } from "@mui/material";

export const Navbar = () => {
  return (
    <AppBar
      sx={{ backgroundColor: "white", color: "#057a8d" }}
      position="sticky"
    >
      <Toolbar>
        <Button color="inherit" component={Link} to="/">
          <Typography
            textTransform="capitalize"
            fontWeight="bold"
            fontSize="16px"
          >
            Home
          </Typography>
        </Button>
        <Button color="inherit" component={Link} to="/about">
          <Typography
            textTransform="capitalize"
            fontWeight="bold"
            fontSize="16px"
          >
            About
          </Typography>
        </Button>
        <Button color="inherit" component={Link} to="/quiz">
          <Typography
            textTransform="capitalize"
            fontWeight="bold"
            fontSize="16px"
          >
            Quiz
          </Typography>
        </Button>
        <Button color="inherit" component={Link} to="/add-skills">
          <Typography
            textTransform="capitalize"
            fontWeight="bold"
            fontSize="16px"
          >
            Add SKills
          </Typography>
        </Button>
        <Button color="inherit" component={Link} to="/roadmaps">
          <Typography
            textTransform="capitalize"
            fontWeight="bold"
            fontSize="16px"
          >
            Roadmaps
          </Typography>
        </Button>
        <Button color="inherit" component={Link} to="/career-guidance">
          <Typography
            textTransform="capitalize"
            fontWeight="bold"
            fontSize="16px"
          >
            Career Guidance
          </Typography>
        </Button>
        <Typography
          variant="h6"
          component="div"
          sx={{ flexGrow: 1, ml: "15%" }}
        >
          Career-Y
        </Typography>
        <Button color="inherit" component={Link} to="/login">
          <Typography
            textTransform="capitalize"
            fontWeight="bold"
            fontSize="16px"
          >
            Sign In
          </Typography>
        </Button>
        <Button color="inherit" component={Link} to="/sign-up">
          <Typography
            textTransform="capitalize"
            fontWeight="bold"
            fontSize="16px"
          >
            Sign Up
          </Typography>
        </Button>
        <Button color="inherit" component={Link} to="/admin">
          <Typography
            textTransform="capitalize"
            fontWeight="bold"
            fontSize="16px"
          >
            Admin
          </Typography>
        </Button>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
