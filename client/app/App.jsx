import React from 'react';
import ReactDOM from 'react-dom';
import { Router } from 'react-router-dom';
import App from './Main';
import history from './History';

ReactDOM.render(
  <Router history={history}>
    <App />
  </Router>,
  document.querySelector('#main'),
);
