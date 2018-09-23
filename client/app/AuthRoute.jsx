import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import NoTransition from './Transitions/NoTransition';

const AuthRoute = ({ path, render, userAuthed }) => (
  <Route
    path={path}
    render={() => {
      if (!userAuthed) {
        return (
          <Redirect to={{
            pathname: '/login',
            state: NoTransition,
          }}
          />
        );
      }
      return render();
    }}
  />
);

AuthRoute.defaultProps = {
  userAuthed: false,
};

AuthRoute.propTypes = {
  path: PropTypes.string.isRequired,
  render: PropTypes.func.isRequired,
  userAuthed: PropTypes.bool,
};

export default AuthRoute;
