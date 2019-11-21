import { addReducer } from "reactn";
import axios from "axios";
import setAuthToken from "../utils/setAuthToken";

/*
  Reducers for a single user
  Login/register/load
*/
addReducer("loadUser", async (global, dispatch) => {
  if (localStorage.token) setAuthToken(localStorage.token);
  try {
    const res = await axios.get("/api/auth");
    return {
      auth: {
        ...global.auth,
        user: res.data,
        isAuthenticated: true,
        loading: false
      }
    };
  } catch (err) {
    localStorage.removeItem("token");
    console.error(err);
    return {
      auth: {
        user: null,
        token: null,
        isAuthenticated: false,
        loading: false
      }
    };
  }
});

addReducer("loginUser", async (global, dispatch, username, password) => {
  try {
    const config = {
      headers: {
        "Content-Type": "Application/json"
      }
    };
    const body = JSON.stringify({ username, password });

    const res = await axios.post("/api/auth/login", body, config);
    localStorage.setItem("token", res.data.token);

    if (localStorage.token) setAuthToken(localStorage.token);

    const userLoadRes = await axios.get("/api/auth");

    return {
      auth: {
        user: userLoadRes.data,
        token: res.data.token,
        isAuthenticated: true,
        loading: false
      }
    };
  } catch (err) {
    const errors = err.response.data.errors;
    if (errors)
      errors.map(error =>
        dispatch.createError({
          msg: error.msg,
          type: "auth"
        })
      );
    else
      dispatch.createError({
        msg: "unknown error",
        type: "auth"
      });
  }
});
addReducer(
  "registerUser",
  async (global, dispatch, username, name, password) => {
    try {
      const config = {
        headers: {
          "Content-Type": "Application/json"
        }
      };
      const body = JSON.stringify({ username, name, password });

      const res = await axios.post("/api/auth/register", body, config);
      localStorage.setItem("token", res.data.token);

      if (localStorage.token) setAuthToken(localStorage.token);

      const userLoadRes = await axios.get("/api/auth");

      return {
        auth: {
          user: userLoadRes.data,
          token: res.data.token,
          isAuthenticated: true,
          loading: false
        }
      };
    } catch (err) {
      const errors = err.response.data.errors;
      if (errors)
        errors.map(error =>
          dispatch.createError({
            msg: error.msg,
            type: "auth"
          })
        );
      else
        dispatch.createError({
          msg: "unknown error",
          type: "auth"
        });
    }
  }
);

addReducer("logoutUser", (global, dispatch) => {
  localStorage.removeItem("token");
  return {
    auth: {
      token: null,
      isAuthenticated: false,
      loading: false,
      user: null
    }
  };
});
