import React from 'react';
import ReactDOM from 'react-dom';
import App from './Main';
import { BrowserRouter } from 'react-router-dom'

ReactDOM.render(
  <BrowserRouter basename='/app/'>
    <App />
  </BrowserRouter>,
document.querySelector("#main"));