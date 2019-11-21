import { makeStyles } from "@material-ui/styles";
import MaterialTable, { MTableBodyRow } from "material-table";
import React, { Fragment, useState } from "react";
import { Paper } from '@material-ui/core';
const useStyles = makeStyles(theme => ({
  root: {},
  content: {
    padding: 0
  },
  inner: {
    minWidth: 800,
    width: "auto"
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




const PersonGroupsTable = props => {
  const {
    className,
    data,
    onRowClick,
    onPersonGroupDelete,
    onPersonGroupPersonDelete,
    onGetPersons,
    onCreatePerson,
    onPersonGroupTrain,
  } = props;

  const classes = useStyles();

  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [page, setPage] = useState(0);

  // const handlePageChange = (event, page) => {
  //   setPage(page);
  // };

  // const handleRowsPerPageChange = event => {
  //   setRowsPerPage(event.target.value);
  // };

  return (
    <div className={classes.inner}>
      <MaterialTable
       
        data={data}
        components={{
          Row: props => (
            <Fragment>
              <MTableBodyRow {...props} />
            </Fragment>
          ),
          Container: props => <Paper {...props} elevation={0}/>
        }
      }
        columns={[
          { title: "id", field: "id" },
          { title: "name", field: "name" },
          { title: "description", field: "userData" }
        ]}
        actions={[
     
          rowData => (
            {
              icon: "get_app",
              hidden: rowData.type === "group" ? false : true,
              tooltip: "get persons",
              onClick: (event, rowData) => {
                onGetPersons(rowData.id);
              }
            }),
            rowData => ({
              icon: "add",
              hidden: rowData.type === "group" ? false : true,
              tooltip: "create person",
              onClick: (event, rowData) => {
                onCreatePerson(rowData.id);
              }
            }),
            rowData => ({
              icon: "sync",
              hidden: rowData.type === "group" ? false : true,
              tooltip: "train person group",
              onClick: (event, rowData) => {
                onPersonGroupTrain(rowData.id);
              }
            }),
            {
              icon: "delete",
              tooltip: "delete",
              onClick: (event, rowData) => {
                if (rowData.type === "group") onPersonGroupDelete(rowData.id);
                else if (rowData.type === "person")
                  onPersonGroupPersonDelete(rowData.parentGroup, rowData.id);
                else console.warn("unknown type on delete - ", rowData.id);
              }
            },
          
        ]}
        parentChildData={(row, rows) =>
          rows.find(a => a.id === row.parentGroup)
        }
        options={{
          actionsColumnIndex: -1,
          selection: false,
          showTitle: false,
          elevation: 0
        }}
      />
    </div>
  );
};

export default PersonGroupsTable;
