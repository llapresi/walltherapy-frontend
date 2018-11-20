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

const AppToolbar = ({
  title, userAuthed, username, refreshAction,
}) => {
  let titleElement;
  if (title === '') {
    titleElement = (
      <TopAppBarTitle>
        <span>WallThearpy</span>
      </TopAppBarTitle>
    );
  } else {
    titleElement = <TopAppBarTitle>{title}</TopAppBarTitle>;
  }

  return (
    <Route
      path="/*"
      render={(route) => {
        let toolbarClassName = 'apptoolbar mdc-elevation--z4';
        if (route.match.url.match(/^\/search$/)) {
          toolbarClassName = `${toolbarClassName} apptoolbar-hidden`;
        }
        return (
          <TopAppBar fixed className={toolbarClassName}>
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
                    <React.Fragment>
                      <Link style={{ color: 'white', textDecoration: 'none' }} to="/search">
                        <TopAppBarActionItem icon="search" />
                      </Link>
                      <TopAppBarActionItem icon="refresh" onClick={refreshAction} />
                    </React.Fragment>
                  )}
                />
                <ToolbarMenuParent userAuthed={userAuthed} username={username} />
              </TopAppBarSection>
            </TopAppBarRow>
          </TopAppBar>
        );
      }}
    />
  );
};
AppToolbar.propTypes = {
  title: PropTypes.string.isRequired,
  userAuthed: PropTypes.bool.isRequired,
  username: PropTypes.string.isRequired,
  refreshAction: PropTypes.func.isRequired,
};

export default AppToolbar;
