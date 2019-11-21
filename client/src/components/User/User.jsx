import { makeStyles } from "@material-ui/styles";
import React, { Fragment, useEffect } from "react";
import { useDispatch, useGlobal } from "reactn";
import UserImages from "./UserImages";
import UserInfo from "./UserInfo";
import { S_IFREG } from "constants";

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(3)
  },
  content: {
    marginTop: theme.spacing(2)
  }
}));

const User = ({ match }) => {
  const getUser = useDispatch("getUser");
  const editUser = useDispatch("editUser");
  const getUserImages = useDispatch("getUserImages");
  const getPersonGroupPerson = useDispatch("getPersonGroupPerson");
  const deletePersonPersistedFaceId = useDispatch("deletePersonPersistedFaceId");
  const deleteUserImage = useDispatch("deleteUserImage");
  const azureUploadUserImage = useDispatch("azureUploadUserImage");
  const [user, setUser] = useGlobal("user");

  useEffect(() => {
    const getData = async id => {
      const global = await getUser(id);
      await getUserImages(id);
      await getPersonGroupPerson(global.user.azure.personGroupId, global.user.azure.personGroupPersonId);
    };
    getData(match.params.id);
  }, [getUser]);

  useEffect(() => {
    return () => {
      setUser(null);
    };
  }, []);


  const handleUserUpdate = newUser => {
    editUser(newUser);
  };




  const handleUserImageUpload = (data) => {
    const payload = {
      ...data,
      personGroupId: user.azure.personGroupId,
      personGroupPersonId: user.azure.personGroupPersonId
    }
    azureUploadUserImage(payload);
  }
  const handleUserImageDelete = (data) => {
    deleteUserImage(data);
  }

  const handleDeletePersistedFaceId = (faceId) => {
    const {personGroupId, personGroupPersonId} = user.azure;
    deletePersonPersistedFaceId(personGroupId, personGroupPersonId, faceId);
  }


  const classes = useStyles();
  return (
    <div className={classes.root}>
      {user && (
        <Fragment>
          <UserInfo
            user={user}
            onUpdateClick={data => handleUserUpdate(data)}
          />
          <UserImages 
          user={user}
          onDeleteImage={(data) => handleUserImageDelete(data)}
          onUploadImage={(data) => handleUserImageUpload(data)}
          onDeletePersistedFaceId={(faceId) => handleDeletePersistedFaceId(faceId)}
          />
        </Fragment>
      )}
    </div>
  );
};

export default User;
