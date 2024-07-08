import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { NavHashLink } from "react-router-hash-link";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  useScrollTrigger,
  Slide,
} from "@mui/material";
import Logo from "../../images/LogoMini.png";
import { httpPost } from "../axios/axiosUtils";
import { FaUser } from "react-icons/fa";

interface Props {
  children: React.ReactElement;
}

export const Navbar = () => {
  const session = JSON.parse(sessionStorage.getItem("session"));
  const navigate = useNavigate();

  const handleLogout = async () => {
    await httpPost("Auth/LogOut", null, { headers: { token: session.token } });
    sessionStorage.removeItem("session");
    navigate("/login");
  };

  function HideOnScroll(props: Props) {
    const { children } = props;
    const trigger = useScrollTrigger();

    return (
      <Slide appear={false} direction="down" in={!trigger}>
        {children}
      </Slide>
    );
  }
  console.log(session);
  return session ? (
    <HideOnScroll>
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
          <NavHashLink to="/#About" smooth style={{ textDecoration: "none" }}>
            <Typography
              textTransform="capitalize"
              fontWeight="bold"
              fontSize="16px"
              color="#057a8d"
            >
              About
            </Typography>
          </NavHashLink>
          {/* <Button color="inherit" component={NavHashLink} to="#About">
          <Typography
            textTransform="capitalize"
            fontWeight="bold"
            fontSize="16px"
          >
            About
          </Typography>
        </Button> */}
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
          <img
            src={Logo}
            width="50px"
            height="50px"
            style={{ position: "absolute", marginLeft: "50%" }}
          />
          <Button
            color="inherit"
            component={Link}
            to="/login"
            onClick={() => handleLogout()}
            sx={{ marginLeft: "auto" }}
          >
            <Typography
              textTransform="capitalize"
              fontWeight="bold"
              fontSize="16px"
            >
              Sign Out
            </Typography>
          </Button>
          <Button
            startIcon={<FaUser />}
            color="inherit"
            component={Link}
            to="/user-profile"
          />
        </Toolbar>
      </AppBar>
    </HideOnScroll>
  ) : (
    <HideOnScroll>
      <AppBar
        sx={{ backgroundColor: "white", color: "#057a8d" }}
        position="sticky"
      >
        <Toolbar>
          <img
            src={Logo}
            width="50px"
            height="50px"
            style={{ position: "absolute", marginLeft: "50%" }}
          />
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
        </Toolbar>
      </AppBar>
    </HideOnScroll>
  );
};

export default Navbar;
