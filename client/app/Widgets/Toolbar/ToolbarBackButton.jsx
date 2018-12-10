import React from 'react';
import { Route, Link } from 'react-router-dom';
import { TopAppBarActionItem } from '@rmwc/top-app-bar';

const ToolbarBackButton = () => (
  <Route
    path="/(mural|profile|add|login|artist)/"
    render={() => (
      <Link to={{ pathname: '/' }} className="remove-link-styling">
        <TopAppBarActionItem icon="arrow_back" />
      </Link>
    )}
  />
);

export default ToolbarBackButton;
