import React from 'react';
import { Route, Link } from 'react-router-dom';
import {
  TopAppBar,
  TopAppBarRow,
  TopAppBarSection,
  TopAppBarActionItem,
  TopAppBarTitle,
} from '@rmwc/top-app-bar';
import PropTypes from 'prop-types';
import ToolbarMenuParent from './Widgets/Toolbar/ToolbarMenu';
import ToolbarBackButton from './Widgets/Toolbar/ToolbarBackButton';

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
          <ToolbarBackButton />
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
