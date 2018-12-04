import React from 'react';
import { Route } from 'react-router-dom';
import PropTypes from 'prop-types';
import GeolocationFAB from './GeolocationFab';

const MapFABs = ({ watchingLocation, getUserGeolocation }) => (
  <Route
    path="/*"
    render={(route) => {
      let hideProps = true;
      console.log(route.match.url);
      if (route.match.url.match(/^\/(|login|logout)$/)) {
        hideProps = false;
      }
      return (
        <React.Fragment>
          <GeolocationFAB
            watchingLocation={watchingLocation}
            onClick={getUserGeolocation}
            exited={hideProps}
          />
        </React.Fragment>
      );
    }}
  />
);
MapFABs.propTypes = {
  watchingLocation: PropTypes.bool.isRequired,
  getUserGeolocation: PropTypes.func.isRequired,
};

export default MapFABs;
