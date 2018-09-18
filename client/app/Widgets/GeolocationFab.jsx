import React from 'react';
import { Fab } from 'rmwc';
import PropTypes from 'prop-types';

const GeolocationFAB = ({ exited, watchingLocation, onClick }) => {
  const cssClassNames = watchingLocation ? 'skatespot-map__fab skatespot-map__location skatespot-map__location-active' : 'skatespot-map__fab skatespot-map__location';
  return (
    <Fab exited={exited} className={cssClassNames} onClick={onClick} icon="gps_fixed" />
  );
};
GeolocationFAB.propTypes = {
  watchingLocation: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired,
  exited: PropTypes.bool,
};
GeolocationFAB.defaultProps = {
  exited: false,
};

export default GeolocationFAB;
