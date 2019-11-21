import AppBar from "@material-ui/core/AppBar";
import IconButton from "@material-ui/core/IconButton";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import { makeStyles } from "@material-ui/core/styles";
import Toolbar from "@material-ui/core/Toolbar";
import AccountCircle from "@material-ui/icons/AccountCircle";
import React, { forwardRef, Fragment } from "react";
import { useDispatch, useGlobal } from "reactn";
import { Button, Divider } from "@material-ui/core";
import { NavLink as RouterLink } from "react-router-dom";

const useStyles = makeStyles(theme => ({
  root: {
    boxShadow: "none"
  },
  flexGrow: {
    flexGrow: 1
  },
  signOutButton: {
    marginLeft: theme.spacing(1)
  },
  content: {
    marginLeft: "auto",
    marginRight: 0,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    color: "white"
  },
  button: {
    color: "white",
    opacity: ".7",
    padding: "10px 8px",
    justifyContent: "flex-start",
    textTransform: "none",
    letterSpacing: 0,
    width: "100%",
    fontWeight: theme.typography.fontWeightMedium
  },



}));

const Userbar = () => {
  const CustomRouterLink = forwardRef((props, ref) => (
    <div ref={ref} style={{ flexGrow: 1 }}>
      <RouterLink {...props} />
    </div>
  ));

  const pages = [
    {
      title: "admin panel",
      href: "/users"
    },
    {
      title: "user panel",
      href: "/userdashboard"
    }
  ];

  const classes = useStyles();
  const [auth] = useGlobal("auth");
  const logoutUser = useDispatch("logoutUser");

  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  function handleMenu(event) {
    setAnchorEl(event.currentTarget);
  }

  function handleClose() {
    setAnchorEl(null);
  }

  return (
    <div className={classes.root}>
      <AppBar>
        <Toolbar>
          {auth && (
            <div className={classes.content}>

              {auth.user && auth.user.role === "admin" && (
                <Fragment>
                  <Button
                    activeClassName={classes.active}
                    className={classes.button}
                    component={CustomRouterLink}
                    to={pages[0].href}
                  >
                    {pages[0].title}
                  </Button>
                  <Button
                    activeClassName={classes.active}
                    className={classes.button}
                    component={CustomRouterLink}
                    to={pages[1].href}
                  >
                    {pages[1].title}
                  </Button>
                </Fragment>
              )}
              <Divider orientation="vertical"></Divider>
              <IconButton
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleMenu}
                color="inherit"
              >
                <AccountCircle />
              </IconButton>
              {auth.user && auth.user.username}
              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right"
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right"
                }}
                open={open}
                onClose={handleClose}
              >
                <MenuItem onClick={logoutUser}>Logout</MenuItem>
              </Menu>
            </div>
          )}
        </Toolbar>
      </AppBar>
    </div>
  );
};

export default Userbar;
