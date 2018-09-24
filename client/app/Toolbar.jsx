import React from 'react';
import { SimpleMenu, MenuItem } from 'rmwc/Menu';
import { Switch, Route, Link } from 'react-router-dom';
import {
  TopAppBar,
  TopAppBarRow,
  TopAppBarSection,
  TopAppBarActionItem,
  TopAppBarTitle,
} from 'rmwc/TopAppBar';
import PropTypes from 'prop-types';
import HideAddSpot from './Transitions/HideAddSpot';
import NoTransition from './Transitions/NoTransition';


const AppToolbar = ({ title, userAuthed, username }) => {
  let titleElement;
  if (title === '') {
    titleElement = (
      <TopAppBarTitle>
        <span className="toolbar-logo" />
        <span>skatespot.io</span>
      </TopAppBarTitle>
    );
  } else {
    titleElement = <TopAppBarTitle>{title}</TopAppBarTitle>;
  }

  let toolbarMenu;
  if (userAuthed) {
    toolbarMenu = (
      <React.Fragment>
        <MenuItem style={{ borderBottom: '1px solid #BBBBBB' }}>{username}</MenuItem>
        <Link to="/profile"><MenuItem>Change Password</MenuItem></Link>
        <Link to="/logout"><MenuItem>Log out</MenuItem></Link>
      </React.Fragment>
    );
  } else {
    toolbarMenu = (
      <Link to={{ pathname: '/login', state: NoTransition }}><MenuItem>Log-in / Sign-up</MenuItem></Link>
    );
  }
  return (
    <TopAppBar fixed className="mdc-elevation--z4">
      <TopAppBarRow>
        <TopAppBarSection alignStart>
          <Switch>
            <Route
              path="/(spot|profile|add|search|login)/"
              render={() => (
                <Link to={{ pathname: '/', state: HideAddSpot }} className="remove-link-styling">
                  <TopAppBarActionItem use="arrow_back" />
                </Link>
              )}
            />
          </Switch>
          {titleElement}
        </TopAppBarSection>
        <TopAppBarSection alignEnd>
          <Route
            exact
            path="/"
            render={() => (
              <Link style={{ color: 'white', textDecoration: 'none' }} to="/search">
                <TopAppBarActionItem>search</TopAppBarActionItem>
              </Link>
            )}
          />
          <SimpleMenu handle={<TopAppBarActionItem use="account_circle" />}>
            {toolbarMenu}
          </SimpleMenu>
        </TopAppBarSection>
      </TopAppBarRow>
    </TopAppBar>
  );
};
AppToolbar.propTypes = {
  title: PropTypes.string.isRequired,
  userAuthed: PropTypes.bool.isRequired,
  username: PropTypes.string.isRequired,
};

export default AppToolbar;
