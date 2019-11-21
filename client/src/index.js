import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import * as serviceWorker from './serviceWorker';
import {setGlobal} from 'reactn';

import addReactNDevTools from 'reactn-devtools';

addReactNDevTools();

//Set the global state
setGlobal({
    auth: {
        token: localStorage.getItem('token'),
        isAuthenticated: null,
        loading: true,
        user: null
    },
    settings: {
        isLoading: true,
        apiKey: "default-api-key",
        region: ""
    },
    personGroups: [],
    user: null,
    users: [],
    errors: [],
    alerts: [],
});


ReactDOM.render(<App />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
