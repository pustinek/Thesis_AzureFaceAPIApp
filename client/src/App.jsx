import React, { Fragment, useEffect } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { useDispatch, useGlobal } from "reactn";

import { createBrowserHistory } from 'history';

import Alerts from "./components/common/Alerts";

import theme from "./theme";
import index from "./reducers";

import setAuthToken from "./utils/setAuthToken";
import './assets/css/index.css';
import { ThemeProvider } from "@material-ui/styles";
import Routes from "./routing/Routes";



// Set auth token if it exists in localstore
if (localStorage.token) {
  setAuthToken(localStorage.token);
}

const browserHistory = createBrowserHistory();

const App = () => {
  const loadUser = useDispatch("loadUser");


  useEffect(() => {
    loadUser();
  }, []);



  return (
    <ThemeProvider theme={theme}>
      <Router history={browserHistory}>
        <Fragment>
          <Routes></Routes>
          <Alerts />
        </Fragment>
      </Router>
    </ThemeProvider>
  );
};

export default App;
