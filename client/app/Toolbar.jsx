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


const AppToolbar = ({ title }) => {
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
              path="/(spot|profile|add|search)/"
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
              <TopAppBarActionItem>
                <Link style={{ color: 'white', textDecoration: 'none' }} to="/search">search</Link>
              </TopAppBarActionItem>
            )}
          />
          <SimpleMenu handle={<TopAppBarActionItem use="account_circle" />}>
            <MenuItem><Link to="/profile"> Change Password</Link></MenuItem>
            <a href="/logout"><MenuItem>Log out</MenuItem></a>
          </SimpleMenu>
        </TopAppBarSection>
      </TopAppBarRow>
    </TopAppBar>
  );
};
AppToolbar.propTypes = {
  title: PropTypes.string.isRequired,
};

export default AppToolbar;
