import React from 'react';
//import ReactDOM from 'react-dom';
import { hydrate, render } from "react-dom";
import './index.css';
import { PageLoader } from './PageLoader';

import reportWebVitals from './reportWebVitals';
import eexchange from 'eexchange';

import {
    BrowserRouter as Router,
    Switch,
    Route
} from "react-router-dom";

const AAPP = <React.StrictMode>
    <Router>
        <Switch>
            <Route path="/:path*" component={PageLoader} />
        </Switch>
    </Router>
</React.StrictMode>;

const rootElement = document.getElementById("root");

if (rootElement === null) {
    // так надо
} else {

    if (rootElement.hasChildNodes()) {
        hydrate(AAPP, rootElement);
    } else {
        render(AAPP, rootElement);
    }

    // If you want to start measuring performance in your app, pass a function
    // to log results (for example: reportWebVitals(console.log))
    // or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
    reportWebVitals();

    if (typeof document.body != 'undefined') {  // prevent click events in SSR mode

        // send event to react from out react application
        document.body.addEventListener("click", () => {
            eexchange.raiseEvent({ initiator: document.body, name: 'click-body', data: { blabla: 'bla' } });
        });
    }
}