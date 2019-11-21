import { Button, Card, CardActions, CardContent, CardHeader, CircularProgress, Divider } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import React, { useEffect, useState } from "react";
import { useDispatch, useGlobal } from "reactn";
import RedditTextField from "../common/RedditTextField";
//TODO: show conformation when settings are saved
const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(3)
  },
  progress : {
    margin: theme.spacing(2),
    marginLeft: "auto"
  },
  content: {
    marginTop: theme.spacing(2)
  },
  input: {
    marginTop: theme.spacing(1)
  }
}));

const Settings = () => {
  const [settings] = useGlobal("settings");
  const setSettings = useDispatch("setSettings");
  const getSettings = useDispatch("getSettings");

  const [values, setValues] = useState({
    apiKey: settings.apiKey,
    region: settings.region
  });

  useEffect(() => {
    const getData = async () => {
      await getSettings();
    };
    getData();
  }, [getSettings]);

  useEffect(() => {
    setValues(settings);
  }, [settings]);

  const handleChange = event => {
    setValues({
      ...values,
      [event.target.name]: event.target.value
    });
  };

  const handleUpdate = () => {
    setSettings(values);
  };

  const classes = useStyles();
  return (
    <div className={classes.root}>
      {!settings.isLoading ? (
        <Card>
          <CardHeader subheader="View/edit settings" title="Settings" />
          <Divider />
          <CardContent className={classes.content}>
            <RedditTextField
              fullWidth
              label="api_key"
              name="apiKey"
              onChange={handleChange}
              type="text"
              value={values.apiKey}
              variant="filled"
            />
            <RedditTextField
              fullWidth
              label="region"
              name="region"
              onChange={handleChange}
              type="text"
              className={classes.input}
              value={values.region}
              variant="filled"
            />
          </CardContent>
          <CardActions>
            <Button color="primary" variant="outlined" onClick={handleUpdate}>
              Update
            </Button>
          </CardActions>
        </Card>
      ) : (
        <CircularProgress className={classes.progress} />
      )}
    </div>
  );
};

export default Settings;
