import { Button, TextField, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import React, { useEffect, useState } from "react";
import { useGlobal } from "reactn";
import validate from "validate.js";

const schema = {
  email: {
    presence: { allowEmpty: false, message: "is required" },
    length: {
      maximum: 64
    }
  },
  username: {
    presence: { allowEmpty: false, message: "is required" },
    length: {
      miniumum: 6,
      maximum: 64
    }
  },
  password: {
    presence: { allowEmpty: false, message: "is required" },
    length: {
      maximum: 128
    }
  },
  password2: {
    presence: { allowEmpty: false, message: "is required" },
    length: {
      maximum: 128
    }
  }
};

const useStyles = makeStyles(theme => ({
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
  textField: {
    marginTop: theme.spacing(2)
  },
  signInButton: {
    margin: theme.spacing(2, 0)
  },
  errorMessage: {
    color: theme.palette.error.main
  }
}));

const Register = ({ onRegisterClick }) => {
  const classes = useStyles();

  const [errors] = useGlobal("errors");
  const [formState, setFormState] = useState({
    isValid: false,
    values: {},
    touched: {},
    errors: {}
  });

  useEffect(() => {
    const fronterrors = validate(formState.values, schema);

    setFormState(formState => ({
      ...formState,
      isValid: fronterrors ? false : true,
      errors: fronterrors || {}
    }));
  }, [formState.values]);

  const handleChange = event => {
    event.persist();

    setFormState(formState => ({
      ...formState,
      values: {
        ...formState.values,
        [event.target.name]:
          event.target.type === "checkbox"
            ? event.target.checked
            : event.target.value
      },
      touched: {
        ...formState.touched,
        [event.target.name]: true
      }
    }));
  };

  const handleSignIn = event => {
    event.preventDefault();
    //Handle login
  };

  const hasError = field =>
    formState.touched[field] && formState.errors[field] ? true : false;
  return (
    <div className={classes.contentBody}>
      <form className={classes.form} onSubmit={handleSignIn}>
        <Typography className={classes.title} variant="h2">
          Sign up
        </Typography>
        <Typography color="textSecondary" gutterBottom>
          Welcome :)
        </Typography>
        <TextField
          className={classes.textField}
          error={hasError("name")}
          fullWidth
          helperText={
            hasError("name") ? formState.errors.name[0] : null
          }
          label="name"
          name="name"
          onChange={handleChange}
          type="text"
          value={formState.values.name || ""}
          variant="outlined"
          InputLabelProps={{
            style: {
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              width: 100
            }
          }}
        />


        <TextField
          className={classes.textField}
          error={hasError("email")}
          fullWidth
          helperText={hasError("email") ? formState.errors.email[0] : null}
          label="email"
          name="email"
          onChange={handleChange}
          type="text"
          value={formState.values.email || ""}
          variant="outlined"
        />
        <TextField
          className={classes.textField}
          error={hasError("username")}
          fullWidth
          helperText={
            hasError("username") ? formState.errors.username[0] : null
          }
          label="Username"
          name="username"
          onChange={handleChange}
          type="text"
          value={formState.values.username || ""}
          variant="outlined"
          InputLabelProps={{
            style: {
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              width: 100
            }
          }}
        />
        <TextField
          className={classes.textField}
          error={hasError("password")}
          fullWidth
          helperText={
            hasError("password") ? formState.errors.password[0] : null
          }
          label="Password"
          name="password"
          onChange={handleChange}
          type="password"
          value={formState.values.password || ""}
          variant="outlined"
        />
        <TextField
          className={classes.textField}
          error={hasError("password2")}
          fullWidth
          helperText={
            hasError("password2") ? formState.errors.password2[0] : null
          }
          label="repeat password"
          name="password2"
          onChange={handleChange}
          type="password"
          value={formState.values.password2 || ""}
          variant="outlined"
          InputLabelProps={{
            style: {
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              width: 100
            }
          }}
        />

        <div>
          {errors &&
            errors.map(
              err =>
                err.type === "auth" && (
                  <Typography
                    variant="caption"
                    className={classes.errorMessage}
                    key={err.msg}
                  >
                    {err.msg}
                  </Typography>
                )
            )}
        </div>

        <Button
          className={classes.signInButton}
          color="primary"
          disabled={!formState.isValid}
          fullWidth
          size="large"
          type="submit"
          variant="contained"
          onClick={e => onRegisterClick(formState.values)}
        >
          Sign in now
        </Button>
      </form>
    </div>
  );
};

export default Register;
