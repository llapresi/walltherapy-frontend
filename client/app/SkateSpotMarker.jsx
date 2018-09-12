import React from 'react';
import { Marker } from 'react-leaflet';
import PropTypes from 'prop-types';
import * as L from 'leaflet';
import ObjectPropTypes from './ObjectShapes';
import history from './History';

export const SkateSpotMarker = ({ position, spot }) => {
  const customMarker = L.icon({
    iconUrl: '/../assets/img/skatespot_icon.png',
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    className: 'skatespotmarker',
  });
  const linkLocation = { pathname: `/spot/${spot._id}`, state: { spot } };
  return (
    <Marker onClick={() => history.push(linkLocation)} position={position} icon={customMarker} />
  );
};
SkateSpotMarker.propTypes = {
  position: PropTypes.arrayOf(PropTypes.number).isRequired,
  spot: ObjectPropTypes.Spot.isRequired,
};

export const AddSpotMarker = ({ position }) => {
  const customMarker = L.icon({
    iconUrl: '/../assets/img/skatespot_addspot.png',
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    className: 'skatespotmarker skatespotmarker_add',
  });
  return (
    <Marker className="addspot-marker" icon={customMarker} position={position} />
  );
};
AddSpotMarker.propTypes = {
  position: PropTypes.arrayOf(PropTypes.number).isRequired,
};
