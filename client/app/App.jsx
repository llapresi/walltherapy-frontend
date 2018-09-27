import React from 'react';
import ReactDOM from 'react-dom';
import { Router } from 'react-router-dom';
import App from './Main';
import history from './History';

// Import styles
import '@material/top-app-bar/dist/mdc.top-app-bar.min.css';
import '@material/menu/dist/mdc.menu.min.css';
import '@material/menu-surface/dist/mdc.menu-surface.min.css';
import '@material/list/dist/mdc.list.min.css';
import '@material/textfield/dist/mdc.textfield.min.css';
import '@material/floating-label/dist/mdc.floating-label.min.css';
import '@material/notched-outline/dist/mdc.notched-outline.min.css';
import '@material/line-ripple/dist/mdc.line-ripple.min.css';
import '@material/ripple/dist/mdc.ripple.min.css';
import '@material/theme/dist/mdc.theme.min.css';
import '@material/fab/dist/mdc.fab.min.css';
import '@material/tab-bar/dist/mdc.tab-bar.min.css';
import '@material/tab/dist/mdc.tab.min.css';
import '@material/tab-scroller/dist/mdc.tab-scroller.min.css';
import '@material/tab-indicator/dist/mdc.tab-indicator.min.css';
import '@material/dialog/dist/mdc.dialog.min.css';
import '@material/button/dist/mdc.button.css';
import '@material/snackbar/dist/mdc.snackbar.min.css';
import '@material/card/dist/mdc.card.min.css';
import '@material/button/dist/mdc.button.min.css';
import '@material/icon-button/dist/mdc.icon-button.min.css';
import '@material/typography/dist/mdc.typography.min.css';


import './material-style.css';


ReactDOM.render(
  <Router history={history}>
    <App />
  </Router>,
  document.querySelector('#main'),
);
