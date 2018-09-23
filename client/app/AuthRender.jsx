import React from 'react';
import { Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import NoTransition from './Transitions/NoTransition';

const AuthRender = ({ userAuthed, children }) => {
  if (!userAuthed) {
    return (
      <Redirect to={{
        pathname: '/login',
        state: NoTransition,
      }}
      />
    );
  }
  return children;
};

AuthRender.propTypes = {
  render: PropTypes.func.isRequired,
  userAuthed: PropTypes.bool.isRequired,
};

export default AuthRender;
