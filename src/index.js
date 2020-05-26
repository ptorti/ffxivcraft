import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';
import App2 from './components/App2';
import * as serviceWorker from './serviceWorker';
import './scss/main.scss';
import {
    BrowserRouter as Router,
    Switch,
    Route
} from "react-router-dom";


ReactDOM.render(
    <React.StrictMode>
        <Router>
            <Switch>
                <Route exact={true} path="/">
                    <App/>
                </Route>
                <Route path="/refactor">
                    <App2/>
                </Route>
            </Switch>
        </Router>
    </React.StrictMode>
    ,
    document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
