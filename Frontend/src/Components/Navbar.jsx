import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { AppBar, Toolbar, Typography, Button } from "@mui/material";
import Logo from "../../images/LogoMini.png";
import { httpPost } from "../axios/axiosUtils";

export const Navbar = () => {
  const session = JSON.parse(localStorage.getItem("session"));
  const navigate = useNavigate();

  const handleLogout = async () => {
    await httpPost("Auth/LogOut", null, {headers: {token: session.token}});
    localStorage.removeItem('session');
    navigate('/login');
  }
  console.log(session);
  return (
    session && (
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
          <img src={Logo} width="50px" height="50px" style={{position: "absolute", marginLeft: "50%"}} />
          {!session ? (
            <>
              <Button
                color="inherit"
                component={Link}
                to="/login"
                sx={{ marginLeft: "auto" }}
              >
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
            </>
          ) : (
            <Button color="inherit" component={Link} to="/login" onClick={() => handleLogout()} sx={{ marginLeft: "auto" }}>
              <Typography
                textTransform="capitalize"
                fontWeight="bold"
                fontSize="16px"
              >
                Sign Out
              </Typography>
            </Button>
          )}
        </Toolbar>
      </AppBar>
    )
  );
};

export default Navbar;
