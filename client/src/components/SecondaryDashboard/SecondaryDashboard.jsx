import { Card, CardContent } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import clsx from "clsx";
import MaterialTable from "material-table";
import React, { Fragment } from "react";
import { useDispatch, useGlobal } from "reactn";
import ImageUpload from "./ImageUpload";
const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: theme.palette.background.default,
  },
  content: {
    padding: 0
  },
  inner: {
    minWidth: 1050
  },
  nameContainer: {
    display: "flex",
    alignItems: "center"
  },
  avatar: {
    marginRight: theme.spacing(2)
  },
  actions: {
    justifyContent: "flex-end"
  }
}));


const SecondaryDashboard = ({ className,staticContext, ...rest }) => {
  const [auth] = useGlobal("auth");
  const deleteImage = useDispatch("deleteUserImage");
  

  const classes = useStyles();
  return (
    <div className={classes.root}>
      {auth.user && (
        <Fragment>
          <Card {...rest} className={clsx(classes.root, className)}>
            <CardContent className={classes.content}>
              <MaterialTable
                data={auth.user.images}
             
                columns={[
                  { title: "name", field: "originalName" },
                  { title: "upload date", field: "uploadDate" }
                ]}
                actions={[
                  {
                    icon: "delete",
                    tooltip: "delete",
                    onClick: (event, rowData) => deleteImage({userId: auth.user._id,imageId: rowData._id})
                  }
                ]}
                options={{
                  actionsColumnIndex: -1,
                  selection: false,
                  showTitle: false
                }}
              />
            </CardContent>
          </Card>
          <Card>
            <CardContent className={classes.content}>
              <ImageUpload />
            </CardContent>
          </Card>
        </Fragment>
      )}
    </div>
  );
};

export default SecondaryDashboard;
