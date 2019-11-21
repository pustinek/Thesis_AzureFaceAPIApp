import React from "react";
import { Redirect, Route, Switch } from "react-router-dom";
import { NotFound, SecondaryDashboard, UsersList } from "../components";
import Auth from "../components/Auth";
import PersonGroups from "../components/PersonGroups";
import Settings from "../components/Settings";
import User from "../components/User";
import { Main as MainLayout, Minimal as MinimalLayout } from "../layouts";
import PrivateRouteWithLayout from "./PrivateRouteWithLayout";



const Routes = () => {
  return (
    <Switch>
      {/* <Route exact path="/" component={Landing} /> */}
      <Route exact path="/auth" component={Auth} />
      <Redirect exact from="/" to="/users" />
      <PrivateRouteWithLayout
        component={SecondaryDashboard}
        exact
        can={["admin", "guest"]}
        layout={MinimalLayout}
        path="/userdashboard"
      />
      {/* <PrivateRoute exact path="/userdashboard" component={UserDashboard} /> */}
      <PrivateRouteWithLayout
        component={PersonGroups}
        exact
        can={[ "admin"]}
        layout={MainLayout}
        path="/personGroups"
      />
      <PrivateRouteWithLayout
        component={UsersList}
        exact
        can={[ "admin"]}
        layout={MainLayout}
        path="/users"
      />
      <PrivateRouteWithLayout
        component={User}
        can={[ "admin"]}
        layout={MainLayout}
        path={`/users/:id`}
      />

      <PrivateRouteWithLayout
        component={Settings}
        exact
        can={[ "admin"]}
        layout={MainLayout}
        path="/settings"
      />

      {/* <Route can={[ "admin"]} path="/dashboard" component={Dashboard} /> */}
      <Route exact path="/not-found" component={NotFound} />
      <Redirect to="/not-found" />
    </Switch>
  );
};

export default Routes;
