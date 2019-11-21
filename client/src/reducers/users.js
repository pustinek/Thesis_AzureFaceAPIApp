import { addReducer } from "reactn";
import axios from "axios";
/*
  Reducers to view/manipulate other users
  Change Role, uuid, name etc....
*/
addReducer("getUsers", async (global, dispatch) => {
  try {
    const res = await axios.get("/api/users");
    return {
      users: res.data
    };
  } catch (err) {
    const res = err.response;
    dispatch.createAlert({
      title: res.status.toString(),
      description: res.data.msg,
      type: "error"
    });
  }
});
addReducer("getUser", async (global, dispatch, id) => {
  try {
    const res = await axios.get(`/api/users/${id}`);
    return {
      user: res.data
    };
  } catch (err) {
    const res = err.response;
    dispatch.createAlert({
      title: res.status.toString(),
      description: res.data.msg,
      type: "error"
    });
    return {
      user: null,
    };
   
  }
});



addReducer("editUser", async (global, dispatch, user) => {
  try {
    const res = await axios.patch(`/api/users/${user._id}`, user);
    dispatch.createAlert({
      title: res.status.toString(),
      description: "successfully saved user !",
      type: "success"
    });
    return {
      users: global.users.map(gUser => {
        if (gUser._id === user._id) {
          return res.data;
        }
        return gUser;
      })
    };
  } catch (err) {
    const res = err.response;
    dispatch.createAlert({
      title: res.status.toString(),
      description: res.data.msg,
      type: "error"
    });
  }
});

