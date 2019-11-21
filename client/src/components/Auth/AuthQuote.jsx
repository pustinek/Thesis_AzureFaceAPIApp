import { Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import React from "react";



const useStyles = makeStyles((theme) => ({
    quote: {
        backgroundColor: theme.palette.neutral,
        height: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundImage: "url(/img/auth.jpg)",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center"
      },
      quoteInner: {
        textAlign: "center",
        flexBasis: "600px"
      },
      quoteText: {
        color: theme.palette.white,
        fontWeight: 300
      },
      name: {
        marginTop: theme.spacing(3),
        color: theme.palette.white
      },
      bio: {
        color: theme.palette.white
      },
}));


const AuthQuote = () => {

    const classes = useStyles();

    return (
        <div className={classes.quote}>
        <div className={classes.quoteInner}>
          <Typography
            className={classes.quoteText}
            variant="h1"
          >
            Dashboard for interacting with AZURE face API
          </Typography>
    
        </div>
      </div>
    );
};

export default AuthQuote;