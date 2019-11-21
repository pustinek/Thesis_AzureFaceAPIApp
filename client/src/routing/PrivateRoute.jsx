import React from "react";
import { Route, Redirect } from "react-router-dom";
import {useGlobal} from "reactn";

const PrivateRoute = ({ component: Component,can, ...rest }) => {
  const [auth] = useGlobal("auth");


  return (
    <Route
      {...rest} render=
      {props =>
        auth && !auth.isAuthenticated && !auth.loading ? (
          <Redirect to="/login" />
        ) : (
          <Component {...props} />
        )
      }
    />
  );
};

export default PrivateRoute;
