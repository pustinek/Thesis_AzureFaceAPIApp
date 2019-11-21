import { Button, Grid } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import clsx from "clsx";
import React, { useState } from "react";
import { withRouter } from "react-router-dom";
import { useDispatch, useGlobal } from "reactn";
import AuthQuote from "./AuthQuote";
import Login from "./Login";
import Register from "./Register";

const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: theme.palette.background.default,
    height: "100%"
  },
  grid: {
    height: "100%"
  },
  quoteContainer: {
    [theme.breakpoints.down("md")]: {
      display: "none"
    }
  },
  contentContainer: {},
  content: {
    height: "100%",
    display: "flex",
    flexDirection: "column"
  },
  contentHeader: {
    display: "flex",
    alignItems: "center",
    paddingTop: theme.spacing(5),
    paddingBototm: theme.spacing(2),
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2)
  },
  logoImage: {
    marginLeft: theme.spacing(4)
  },
  contentBody: {
    flexGrow: 1,
    display: "flex",
    alignItems: "center",
    [theme.breakpoints.down("md")]: {
      justifyContent: "center"
    }
  },
  form: {
    paddingLeft: 100,
    paddingRight: 100,
    paddingBottom: 125,
    flexBasis: 700,
    [theme.breakpoints.down("sm")]: {
      paddingLeft: theme.spacing(2),
      paddingRight: theme.spacing(2)
    }
  },
  title: {
    marginTop: theme.spacing(3)
  },
  switchButton: {
    borderRadius: 0,
    width: "50%",
    boxShadow: "none",
    borderTop: "1px solid grey",
    color: theme.palette.text.secondary,
    backgroundColor: theme.palette.background.default,
    textTransform: "capitalize",
    backgroundImage: `linear-gradient(${theme.palette.primary.main}, ${
      theme.palette.primary.main
    })`,
    backgroundSize: "0 5px, auto",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "center bottom",
    transition: "all .2s ease-out",
    "&:hover": {
      backgroundColor: theme.palette.background.default,
      backgroundSize: "100% 5px, auto"
    }
  },
  switchButtonActive: {
    color: theme.palette.primary.main,
    fontWeight: "bold",
    backgroundSize: "100% 5px, auto"
  }
}));

const Auth = ({history}) => {

  const loginUser = useDispatch("loginUser");
  const registerUser = useDispatch("registerUser");
  const [auth] = useGlobal("auth");

  const [activeButton, setActiveButton] = useState(0);



   //Handle login
  const handleLogin = async data => {

    const { username, password } = data;
    const res = await loginUser(username, password);
    if(res.auth.isAuthenticated && !res.auth.loading){
      return history.push('/');
    }
   
  };
 //Handle registration
  const handleRegister = async data => {
    const { name, username, password } = data;
    const res = await registerUser(name, username, password);
    if(res.auth.isAuthenticated && !res.auth.loading){
      return history.push('/');
    }
  };

  const classes = useStyles();
  return (
    <div className={classes.root}>
      <Grid className={classes.grid} container>
        <Grid className={classes.quoteContainer} item lg={5}>
          <AuthQuote />
        </Grid>

        <Grid className={classes.content} item lg={7} xs={12}>
          <div className={classes.content}>
            {activeButton ? (
              <Register onRegisterClick={handleRegister} />
            ) : (
              <Login onLoginClick={handleLogin} />
            )}
            <div>
              <Button
                className={clsx(classes.switchButton, {
                  [classes.switchButtonActive]: !activeButton
                })}
                color="primary"
                size="large"
                type="submit"
                variant="contained"
                onClick={() => setActiveButton(0)}
              >
                Log in
              </Button>
              <Button
                className={clsx(classes.switchButton, {
                  [classes.switchButtonActive]: activeButton
                })}
                color="primary"
                size="large"
                type="submit"
                variant="contained"
                onClick={() => setActiveButton(1)}
              >
                Sign up
              </Button>
            </div>
          </div>
        </Grid>
      </Grid>
    </div>
  );
};

export default withRouter(Auth);
