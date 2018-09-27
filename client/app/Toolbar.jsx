import React from 'react';
import { SimpleMenuSurface, MenuItem } from '@rmwc/menu';
import { Switch, Route, Link } from 'react-router-dom';
import {
  TopAppBar,
  TopAppBarRow,
  TopAppBarSection,
  TopAppBarActionItem,
  TopAppBarTitle,
} from '@rmwc/top-app-bar';
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
        <MenuItem><Link to="/profile">Change Password</Link></MenuItem>
        <MenuItem><Link to="/logout">Log out</Link></MenuItem>
      </React.Fragment>
    );
  } else {
    toolbarMenu = (
      <MenuItem>
        <Link to={{ pathname: '/login', state: NoTransition }}>Log-in / Sign-up</Link>
      </MenuItem>
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
                  <TopAppBarActionItem icon="arrow_back" />
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
                <TopAppBarActionItem icon="search" />
              </Link>
            )}
          />
          <SimpleMenuSurface style={{ width: '10rem' }} handle={<TopAppBarActionItem icon="account_circle" />}>
            {toolbarMenu}
          </SimpleMenuSurface>
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
