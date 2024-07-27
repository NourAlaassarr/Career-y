
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { NavHashLink } from "react-router-hash-link";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  useScrollTrigger,
  Slide,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import Logo from "../../images/LogoMini.png";
import { httpPost } from "../axios/axiosUtils";
import { FaUser } from "react-icons/fa";

interface Props {
  children: React.ReactElement;
}

export const Navbar = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const session = JSON.parse(sessionStorage.getItem("session"));
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleLogout = async () => {
    await httpPost("Auth/LogOut", null, { headers: { token: session.token } });
    sessionStorage.removeItem("session");
    navigate("/login");
  };

  const toggleDrawer = (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
    if (
      event.type === "keydown" &&
      ((event as React.KeyboardEvent).key === "Tab" ||
        (event as React.KeyboardEvent).key === "Shift")
    ) {
      return;
    }
    setDrawerOpen(open);
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

  const drawerContent = (
    <div onClick={toggleDrawer(false)} onKeyDown={toggleDrawer(false)}>
      <List>
        {session ? (
          session.role !== "admin" ? (
            <>
              <ListItem button component={Link} to="/">
                <ListItemText primary="Home" />
              </ListItem>
              <ListItem button component={NavHashLink} to="/#About" smooth>
                <ListItemText primary="About" />
              </ListItem>
              <ListItem button component={Link} to="/quiz">
                <ListItemText primary="Quiz" />
              </ListItem>
              <ListItem button component={Link} to="/add-skills">
                <ListItemText primary="Add Skills" />
              </ListItem>
              <ListItem button component={Link} to="/roadmaps">
                <ListItemText primary="Roadmaps" />
              </ListItem>
              <ListItem button component={Link} to="/career-guidance">
                <ListItemText primary="Career Guidance" />
              </ListItem>
              <ListItem button onClick={handleLogout}>
                <ListItemText primary="Sign Out" />
              </ListItem>
              <ListItem button component={Link} to="/user-profile">
                <FaUser />
              </ListItem>
            </>
          ) : (
            <>
              <ListItem button component={Link} to="/admin">
                <ListItemText primary="Admin" />
              </ListItem>
              <ListItem button onClick={handleLogout}>
                <ListItemText primary="Sign Out" />
              </ListItem>
              <ListItem button component={Link} to="/user-profile">
                <FaUser />
              </ListItem>
            </>
          )
        ) : (
          <>
            <ListItem button component={Link} to="/login">
              <ListItemText primary="Sign In" />
            </ListItem>
            <ListItem button component={Link} to="/sign-up">
              <ListItemText primary="Sign Up" />
            </ListItem>
          </>
        )}
      </List>
    </div>
  );

  return (
    <HideOnScroll>
      <AppBar sx={{ backgroundColor: "white", color: "#057a8d" }} position="sticky">
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {isMobile && (
            <IconButton
              edge="start"
              color="inherit"
              aria-label="menu"
              onClick={toggleDrawer(true)}
              sx={{ display: { md: "none" } }}
            >
              <MenuIcon />
            </IconButton>
          )}
          <img
            src={Logo}
            width="50px"
            height="50px"
            style={{ marginLeft: 'auto', marginRight: 'auto', display: 'block' }}
          />
          {!isMobile && (
            <div style={{ flexGrow: 1, display: 'flex', gap: '10px' }}>
              {session ? (
                session.role !== "admin" ? (
                  <>
                    <Button color="inherit" component={Link} to="/">
                      <Typography textTransform="capitalize" fontWeight="bold" fontSize="16px">
                        Home
                      </Typography>
                    </Button>
                    <NavHashLink to="/#About" smooth style={{ textDecoration: "none" }}>
                      <Typography textTransform="capitalize" fontWeight="bold" fontSize="16px" color="#057a8d">
                        About
                      </Typography>
                    </NavHashLink>
                    <Button color="inherit" component={Link} to="/quiz">
                      <Typography textTransform="capitalize" fontWeight="bold" fontSize="16px">
                        Quiz
                      </Typography>
                    </Button>
                    <Button color="inherit" component={Link} to="/add-skills">
                      <Typography textTransform="capitalize" fontWeight="bold" fontSize="16px">
                        Add Skills
                      </Typography>
                    </Button>
                    <Button color="inherit" component={Link} to="/roadmaps">
                      <Typography textTransform="capitalize" fontWeight="bold" fontSize="16px">
                        Roadmaps
                      </Typography>
                    </Button>
                    <Button color="inherit" component={Link} to="/career-guidance">
                      <Typography textTransform="capitalize" fontWeight="bold" fontSize="16px">
                        Career Guidance
                      </Typography>
                    </Button>
                    <Button color="inherit" component={Link} to="/login" onClick={handleLogout} sx={{ marginLeft: "auto" }}>
                      <Typography textTransform="capitalize" fontWeight="bold" fontSize="16px">
                        Sign Out
                      </Typography>
                    </Button>
                    <Button startIcon={<FaUser />} color="inherit" component={Link} to="/user-profile" />
                  </>
                ) : (
                  <>
                    <Button color="inherit" component={Link} to="/admin">
                      <Typography textTransform="capitalize" fontWeight="bold" fontSize="16px">
                        Admin
                      </Typography>
                    </Button>
                    <Button color="inherit" component={Link} to="/login" onClick={handleLogout} sx={{ marginLeft: "auto" }}>
                      <Typography textTransform="capitalize" fontWeight="bold" fontSize="16px">
                        Sign Out
                      </Typography>
                    </Button>
                    <Button startIcon={<FaUser />} color="inherit" component={Link} to="/user-profile" />
                  </>
                )
              ) : (
                <>
                  <Button color="inherit" component={Link} to="/login" sx={{ marginLeft: "auto" }}>
                    <Typography textTransform="capitalize" fontWeight="bold" fontSize="16px">
                      Sign In
                    </Typography>
                  </Button>
                  <Button color="inherit" component={Link} to="/sign-up">
                    <Typography textTransform="capitalize" fontWeight="bold" fontSize="16px">
                      Sign Up
                    </Typography>
                  </Button>
                </>
              )}
            </div>
          )}
        </Toolbar>
        <Drawer anchor="left" open={drawerOpen} onClose={toggleDrawer(false)}>
          {drawerContent}
        </Drawer>
      </AppBar>
    </HideOnScroll>
  );
};

export default Navbar;
