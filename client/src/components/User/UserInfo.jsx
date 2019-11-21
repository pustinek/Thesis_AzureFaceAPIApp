import { Button, Card, CardActions, CardContent, CardHeader, Divider } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import clsx from "clsx";
import PropTypes from "prop-types";
import React, { useState } from "react";
import RedditTextField from "../common/RedditTextField";

const useStyles = makeStyles(theme => ({
  root: {},
  focused: {}
}));

const UserInfo = props => {
  const { className, user, onUpdateClick, ...rest } = props;
  const [values, setValues] = useState({
    _id: user._id,
    username: user.username,
    name: user.name,
    role: user.role,
    personGroupId: user.azure.personGroupId,
    personGroupPersonId: user.azure.personGroupPersonId
  });

  const handleChange = event => {
    setValues({
      ...values,
      [event.target.name]: event.target.value
    });
  };

  const handleUpdate = () => {
    const data = (({
      _id,
      username,
      name,
      role,
      personGroupId,
      personGroupPersonId
    }) => ({
      _id,
      username,
      name,
      role,
      azure: { personGroupId, personGroupPersonId }
    }))(values);

    onUpdateClick(data);
  };

  const classes = useStyles();
  return (
    <Card {...rest} className={clsx(classes.root, className)}>
      <form>
        <CardHeader subheader="View/edit user information" title="User info" />
        <Divider />
        <CardContent>
          <RedditTextField
            fullWidth
            label="id"
            name="_id"
            onChange={handleChange}
            type="text"
            value={values._id}
            variant="filled"
            disabled
          />
          <RedditTextField
            fullWidth
            label="Name"
            name="name"
            onChange={handleChange}
            style={{ marginTop: "1rem" }}
            type="text"
            value={values.name}
            variant="filled"
            disabled
          />
          <RedditTextField
            fullWidth
            label="Username"
            name="username"
            onChange={handleChange}
            style={{ marginTop: "1rem" }}
            type="text"
            value={values.username}
            variant="filled"
            disabled
          />
          <RedditTextField
            fullWidth
            label="Role"
            name="role"
            onChange={handleChange}
            style={{ marginTop: "1rem" }}
            type="text"
            value={values.role}
            variant="filled"
          />
          <RedditTextField
            fullWidth
            label="Azure_person_group_ID"
            name="personGroupId"
            onChange={handleChange}
            style={{ marginTop: "1rem" }}
            type="text"
            value={values.personGroupId}
            variant="filled"
          />
          <RedditTextField
            fullWidth
            label="Azure_person_group_person_ID"
            name="personGroupPersonId"
            onChange={handleChange}
            style={{ marginTop: "1rem" }}
            type="text"
            value={values.personGroupPersonId}
            variant="filled"
          />
        </CardContent>
        <Divider />
        <CardActions>
          <Button color="primary" variant="outlined" onClick={handleUpdate}>
            Update
          </Button>
        </CardActions>
      </form>
    </Card>
  );
};

UserInfo.propTypes = {
  user: PropTypes.object,
  onUpdateClick: PropTypes.func
};

export default UserInfo;
