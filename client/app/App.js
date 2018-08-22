import React from 'react';
import ReactDOM from 'react-dom';
import App from './Main';
import { Router } from 'react-router-dom'
import history from './History.js'

ReactDOM.render(
  <Router history={history}>
    <App />
  </Router>,
document.querySelector("#main"));