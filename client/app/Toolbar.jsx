import React from 'react';
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
import ToolbarMenuParent from './Widgets/ToolbarMenu';

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
          <ToolbarMenuParent userAuthed={userAuthed} username={username} />
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
