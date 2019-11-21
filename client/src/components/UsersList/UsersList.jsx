import { Button } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import React, { useState } from "react";
import { useDispatch, useGlobal } from "reactn";
import UsersTable from "./UsersTable";
import UserAdd from "./UserAdd";
import Dialog from '@material-ui/core/Dialog';

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(3)
  },
  content: {
    marginTop: theme.spacing(2)
  }
}));

const UsersList = props => {
  const { history } = props;
  const getUsers = useDispatch("getUsers");
  const [users] = useGlobal("users");
  const classes = useStyles();

  const onUserRowClick = user => {
    history.push(`/users/${user._id}`);
  };

  /******* Modal  *********/
  const [modalOpen, setModalOpen] = useState(false);
  const handleClickOpen = () => {
    setModalOpen(true);
  };

  const handleClose = () => {
    setModalOpen(false);
  };


  const handlePersonCreate = (data) => {
    console.log(data);
  }

  /******* Other  *********/

  const handleAddUserToAzure = user => {
    handleClickOpen();
    console.log(user);
  };


  return (
    <div className={classes.root}>
      <div className={classes.content}>
        <Button color="primary" variant="contained" onClick={() => getUsers()}>
          Get users
        </Button>
        <UsersTable
          users={users}
          handleRowClick={user => onUserRowClick(user)}
          onAddUserToAzure={user => handleAddUserToAzure(user)}
        />
      </div>
      <Dialog
        open={modalOpen}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
      >
        <UserAdd
          onCloseClick={handleClose}
          onSubmit={data => handlePersonCreate(data)}
        />
      </Dialog>
    </div>
  );
};

export default UsersList;
