import { Button, Card, CardActions, CardContent, CardHeader, Divider } from "@material-ui/core";
import Dialog from '@material-ui/core/Dialog';
import { makeStyles } from "@material-ui/styles";
import clsx from "clsx";
import React, { useEffect, useState } from "react";
import PerfectScrollbar from "react-perfect-scrollbar";
import { useDispatch, useGlobal } from "reactn";
import PersonCreateModal from './PersonCreateModal';
import PersonGroupCreateModal from './PersonGroupCreateModal';
import PersonGroupsTable from "./PersonGroupsTable";

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(3)
  },
  
  content: {}
}));


const PersonGroups = ({className, staticContext, ...rest}) => {
  const classes = useStyles();
  const getPersonGroups = useDispatch("getPersonGroups");
  const getPersonGroupsPersons = useDispatch("getPersonGroupsPersons");
  const createPersonGroup = useDispatch("createPersonGroup");
  const personGroupPersonCreate = useDispatch("personGroupPersonCreate");
  const personGroupPersonDelete = useDispatch("personGroupPersonDelete");
  const trainPersonGroups = useDispatch("trainPersonGroups");
  const deletePersonGroup = useDispatch("deletePersonGroup");
  const [personGroups] = useGlobal("personGroups");
  const getSettings = useDispatch("getSettings");
  const [auth] = useGlobal("auth");
  const [data,setData] = useState([]);



  const [modalType, setModalType] = useState(null); // group\person
  const [addPersonGroupId, setAddPersonGroupId] = useState(null); //used when creating PERSON in PERSON-GROUP

  function handleClickOpen(type) {
    setModalType(type);
  }

  function handleClose() {
    setModalType(null);
  }

  const handleGroupCreate = (data) => {
    handleClose();
    createPersonGroup(data);
  }
  const handlePersonCreate = (data) => {
    handleClose();
    const payload = {
      ...data,
      personGroupId: addPersonGroupId
    }
    personGroupPersonCreate(payload);
  }


  useEffect(() => {
    if (auth.isAuthenticated) {
      getSettings();
    }
  }, [auth]);

  useEffect(() => {
    if(personGroups){
      const groups = personGroups.map(group => ({
        id: group.personGroupId,
        name: group.name,
        userData: group.userData,
        type: "group"
      }));
   

    const x = [];
    personGroups.forEach(group => {

      if(group.persons)
        x.push(group.persons.map(person => ({
          parentGroup: group.personGroupId,
          id: person.personId,
          name: person.name,
          userData: person.userData,
          type: "person"
          
        })))
    });
    
    let merged = [].concat.apply([], x);
    console.log(merged);
    setData([
      ...groups,
      ...merged
    ]);

    }
 

  }, [personGroups]);

  return (
    <div className={classes.root}>
      <Card {...rest} className={clsx(classes.root, className)}>
        <CardHeader subheader="View/edit person groups" title="Person groups" />
        <Divider />
        <CardActions>
          <Button color="success.main" variant="contained" onClick={() => getPersonGroups()}>
            GET
          </Button>
          <Button color="primary" variant="contained" onClick={() => handleClickOpen("group")}>
            CREATE PERSON-GROUP
          </Button>
        </CardActions>
        <CardContent className={classes.content}>
          <PerfectScrollbar>
            <PersonGroupsTable
              data={data}
              onPersonGroupDelete={groupId => deletePersonGroup(groupId)}
              onGetPersons={(groupId) => getPersonGroupsPersons(groupId)}
              onPersonGroupPersonDelete={(groupId, personId) =>
                personGroupPersonDelete(groupId, personId)
              }
              onCreatePerson={(groupId) => {setAddPersonGroupId(groupId);handleClickOpen("person")}}
              onPersonGroupTrain={(groupId) => {trainPersonGroups(groupId)}}
            />
          </PerfectScrollbar>
        </CardContent>
      </Card>
      <Dialog open={modalType == "group" ? true : false} onClose={handleClose} aria-labelledby="form-dialog-title">
               <PersonGroupCreateModal
               onCloseClick={handleClose}
               onSubmit={handleGroupCreate}
               />
      </Dialog>
      <Dialog open={modalType == "person" ? true : false} onClose={handleClose} aria-labelledby="form-dialog-title">
               <PersonCreateModal
               onCloseClick={handleClose}
               onSubmit={(data) => handlePersonCreate(data)}
               />
      </Dialog>
    </div>
  );
};

export default PersonGroups;
