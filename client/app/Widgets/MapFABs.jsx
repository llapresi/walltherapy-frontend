import React from 'react';
import { Route, Link } from 'react-router-dom';
import { Fab } from '@rmwc/fab';
import PropTypes from 'prop-types';
import ObjectPropTypes from '../ObjectShapes';
import GeolocationFAB from './GeolocationFab';

const MapFABs = ({ ShowAddSpotBottomBar, watchingLocation, getUserGeolocation }) => (
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
          <Link to={{ pathname: '/add', state: ShowAddSpotBottomBar }}>
            <Fab exited={hideProps} className="skatespot-map__fab" icon="add_location" />
          </Link>
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
  ShowAddSpotBottomBar: ObjectPropTypes.Transition.isRequired,
  watchingLocation: PropTypes.bool.isRequired,
  getUserGeolocation: PropTypes.func.isRequired,
};

export default MapFABs;
