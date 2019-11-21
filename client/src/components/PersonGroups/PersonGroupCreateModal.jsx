import { Button } from "@material-ui/core";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import TextField from "@material-ui/core/TextField";
import { makeStyles } from "@material-ui/styles";
import React, { Fragment, useEffect, useState } from "react";
import validate from "validate.js";

/** Schema for validation */
const schema = {
  personGroupId: {
    presence: { allowEmpty: false, message: "is required" },
    length: {
      maximum: 24,
      minimum: 4
    }
  },
  name: {
    presence: { allowEmpty: false, message: "is required" },
    length: {
      maximum: 24
    }
  },
  userData: {}
  
};

const useStyles = makeStyles(theme => ({
  textField: {
    marginTop: theme.spacing(2),
    paddingTop: theme.spacing(2)
  }
}));

const PersonGroupCreateModal = ({ onCloseClick, onSubmit }) => {
  const [formState, setFormState] = useState({
    isValid: false,
    values: {},
    touched: {},
    errors: {}
  });

  useEffect(() => {
    const errors = validate(formState.values, schema);

    setFormState(formState => ({
      ...formState,
      isValid: errors ? false : true,
      errors: errors || {}
    }));
  }, [formState.values]);

  const handleChange = event => {
    event.persist();

    setFormState(formState => ({
      ...formState,
      values: {
        ...formState.values,
        [event.target.name]: event.target.value
      },
      touched: {
        ...formState.touched,
        [event.target.name]: true
      }
    }));
  };

  const handleSubmit = event => {
    event.preventDefault();
    if(formState.isValid)
    onSubmit(formState.values);


  };

  const hasError = field =>
    formState.touched[field] && formState.errors[field] ? true : false;

    const classes = useStyles();
  return (
    <Fragment>
      <form onSubmit={handleSubmit}>
        <DialogTitle id="form-dialog-title">Create person group</DialogTitle>
        <DialogContent>
          <DialogContentText>Create person group person</DialogContentText>
          {/* TODO: validate ID, must be only lowercase... (check azure face API docs) */}
          <TextField
            className={classes.textField}
            autoFocus
            margin="dense"
            name="personGroupId"
            onChange={handleChange}
            value={formState.values.personGroupId || ""}
            error={hasError("personGroupId")}
            helperText={
              hasError("personGroupId")
                ? formState.errors.personGroupId[0]
                : null
            }
            label="person group ID"
            type="text"
            fullWidth
          />
          <TextField
            className={classes.textField}
            margin="dense"
            name="name"
            onChange={handleChange}
            value={formState.values.name || ""}
            helperText={hasError("name") ? formState.errors.name[0] : null}
            label="name"
            type="text"
            fullWidth
          />
          <TextField
            className={classes.textField}
            margin="dense"
            name="userData"
            onChange={handleChange}
            value={formState.values.userData || ""}
            helperText={
              hasError("userData") ? formState.errors.userData[0] : null
            }
            label="user data / description"
            type="text"
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={onCloseClick} color="primary">
            Cancel
          </Button>
          <Button type="submit" color="primary">
            Create
          </Button>
        </DialogActions>
      </form>
    </Fragment>
  );
};

export default PersonGroupCreateModal;
