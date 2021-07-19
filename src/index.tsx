import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { EExchange, CB } from 'eexchange';

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

if (typeof document.body != 'undefined') {  // prevent click events in SSR mode

    // send event to react from out react application
    document.body.addEventListener("click", () => {
        EExchange.raiseEvent({ initiator: document.body, name: 'click-body', data: { blabla: 'bla' } });
    });

}
