import React from 'react';
import ReactDOM from 'react-dom';
import { Router } from 'react-router-dom';
import App from './Main';
import history from './History';
import './material-style.css';

ReactDOM.render(
  <Router history={history}>
    <App />
  </Router>,
  document.querySelector('#main'),
);
