import React from 'react';
import { Toolbar, ToolbarRow, ToolbarSection, ToolbarTitle, ToolbarMenuIcon, ToolbarIcon } from 'rmwc/Toolbar';
import { SimpleMenu, MenuItem } from 'rmwc/Menu';
import { IconButton } from 'rmwc/IconButton';
import { Switch, Route, Link } from 'react-router-dom';


const AppToolbar = (props) => {
  let title;
  if (props.title == "") {
    title = <ToolbarTitle><span className="toolbar-logo"></span>skatespot.io</ToolbarTitle>;
  } else {
    title = <ToolbarTitle>{props.title}</ToolbarTitle>;
  }
  return(
    <Toolbar fixed>
      <ToolbarRow>
        <ToolbarSection alignStart>
          <Switch>
            <Route path="/(spot|profile|add)/" render={() => <Link to='/' className="remove-link-styling"><IconButton use="arrow_back"/></Link>} />
          </Switch>
          {title}
        </ToolbarSection>
        <ToolbarSection alignEnd>
          <SimpleMenu handle={<ToolbarIcon use="account_circle" />}>
            <MenuItem><Link to="/profile"> Change Password</Link></MenuItem>
            <a href="/logout"><MenuItem>Log out</MenuItem></a>
          </SimpleMenu>
        </ToolbarSection>
      </ToolbarRow>
    </Toolbar>
  );
};

export default AppToolbar;