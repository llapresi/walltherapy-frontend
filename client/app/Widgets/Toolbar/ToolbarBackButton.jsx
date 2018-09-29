import React from 'react';
import { Route, Link } from 'react-router-dom';
import { TopAppBarActionItem } from '@rmwc/top-app-bar';
import HideAddSpot from '../../Transitions/HideAddSpot';

const ToolbarBackButton = () => (
  <Route
    path="/(spot|profile|add|search|login)/"
    render={() => (
      <Link to={{ pathname: '/', state: HideAddSpot }} className="remove-link-styling">
        <TopAppBarActionItem icon="arrow_back" />
      </Link>
    )}
  />
);

export default ToolbarBackButton;
