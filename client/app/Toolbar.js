import React from 'react';
import { SimpleMenu, MenuItem } from 'rmwc/Menu';
import { Switch, Route, Link } from 'react-router-dom';
import {
  TopAppBar,
  TopAppBarRow,
  TopAppBarSection,
  TopAppBarNavigationIcon,
  TopAppBarActionItem,
  TopAppBarTitle
} from 'rmwc/TopAppBar';
import HideAddSpot from './Transitions/HideAddSpot.js'



const AppToolbar = (props) => {
  let title;
  if (props.title == "") {
    title = <TopAppBarTitle><span className="toolbar-logo"></span>skatespot.io</TopAppBarTitle>;
  } else {
    title = <TopAppBarTitle>{props.title}</TopAppBarTitle>;
  }
  return(
    <TopAppBar fixed className="mdc-elevation--z4">
      <TopAppBarRow>
        <TopAppBarSection alignStart>
          <Switch>
            <Route path="/(spot|profile|add)/" render={() => <Link to={{pathname: '/', state: HideAddSpot}} className="remove-link-styling"><TopAppBarActionItem use="arrow_back"/></Link>} />
          </Switch>
          {title}
        </TopAppBarSection>
        <TopAppBarSection alignEnd>
          <SimpleMenu handle={<TopAppBarActionItem use="account_circle" />}>
            <MenuItem><Link to="/profile"> Change Password</Link></MenuItem>
            <a href="/logout"><MenuItem>Log out</MenuItem></a>
          </SimpleMenu>
        </TopAppBarSection>
      </TopAppBarRow>
    </TopAppBar>
  );
};

export default AppToolbar;