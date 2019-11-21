import {
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider
} from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import React, { Fragment } from "react";
import uuid from "uuid";

const useStyles = makeStyles(theme => ({
  root: {
    marginTop: theme.spacing(2)
  },
  content: {
    marginTop: theme.spacing(2)
  },
  row: {
    borderBottom: "1px solid #f4f4f4"
  },
  rowContent: {
    display: "grid",
    gridTemplateColumns: "230px 400px 200px"
  },
  img: {
    objectFit: "contain",
    height: "120px",
    width: "120pxpx"
  },
  info: {
    display: "flex",
    flexDirection: "column"
  },
  actions: {}
}));

const UserImages = ({ user, onDeleteImage, onUploadImage, onDeletePersistedFaceId }) => {
  const classes = useStyles();

  return (
    <Card className={classes.root}>
      <CardHeader subheader="View/edit user images" title="User images" />
      <Divider />
      <CardContent className={classes.content}>
        {user.images &&
          user.images.map(image => (
            <div className={classes.row} key={uuid.v4()}>
              <div className={classes.rowContent}>
                <img
                  src={`data:jpeg;base64,${image.content}`}
                  className={classes.img}
                />
                <div className={classes.info}>
                  <span>persisted face ID: {image.azure.persistedFaceId}</span>
                  <span>person group ID: {image.azure.personGroupId}</span>
                  <span>person ID: {image.azure.personGroupPersonId}</span>
                  <span>upload date: {image.azure.uploadDate}</span>
                </div>
                <div className={classes.actions}>
                  <Button
                    onClick={() =>
                      onDeleteImage({ userId: user._id, imageId: image._id })
                    }
                  >
                    Delete Image
                  </Button>
                  <Button
                    onClick={() =>
                      onUploadImage({ userId: user._id, imageId: image._id })
                    }
                  >
                    Upload image
                  </Button>
                </div>
              </div>
            </div>
          ))}
        {user.images &&
          user.azure.persistedFaceIds &&
          user.azure.persistedFaceIds.map(id => (
            <div className={classes.row} key={uuid.v4()}>
              <div className={classes.rowContent}>
                {!user.images
                  .map(img => img.azure.persistedFaceId)
                  .includes(id) && (
                  <Fragment>
                    <div className={classes.info}>{id}</div>
                    <div className={classes.actions}>
                      <Button
                        onClick={() => onDeletePersistedFaceId(id)}
                      >
                        Delete Persisted Face
                      </Button>
                    </div>
                  </Fragment>
                )}
              </div>
            </div>
          ))}
      </CardContent>
    </Card>
  );
};

export default UserImages;
