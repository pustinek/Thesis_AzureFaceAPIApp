import { useDispatch } from "reactn";

/*  
    @desc       Create alerts from errors occuring in reducers
    @.err       passed error response from reducer
    @.id        ID for the alert, debugging purpose  
*/
const responseToError = (dispatch,err, id) => {
  const { errors } = err.response.data;
  if (errors) {
    errors.map(error =>
        dispatch.createAlert({
        title: error.code.toString(),
        description: error.msg,
        id: id,
        type: "error"
      })
    );
  } else {
    dispatch.createAlert({
      title: "520",
      description: "unknown error occured",
      id: id,
      type: "error"
    });
  }
};

export default responseToError;
