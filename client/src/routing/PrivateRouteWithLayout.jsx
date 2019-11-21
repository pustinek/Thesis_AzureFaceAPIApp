import PropTypes from "prop-types";
import React from "react";
import { Redirect, Route } from "react-router-dom";
import { useGlobal } from "reactn";

const PrivateRouteWithLayout = props => {
  const { layout: Layout, component: Component, can, ...rest } = props;
  const [auth] = useGlobal("auth");



  return (
    <Route
      {...rest}
      render={props => {

        if(auth && !auth.user && !auth.loading){
          return <Redirect to="/auth" />;
        }


        if (can && auth.user && auth.isAuthenticated) {
          const userRole = auth.user.role;
          
        if (!can.includes(userRole)) {

          
          return <Redirect to="/userdashboard" />};
        }

        return (
          <Layout>
            <Component {...props} />
          </Layout>
        );
      }}
    />
  );
};

PrivateRouteWithLayout.propTypes = {
  component: PropTypes.any.isRequired,
  layout: PropTypes.any.isRequired,
  path: PropTypes.string
};

export default PrivateRouteWithLayout;
