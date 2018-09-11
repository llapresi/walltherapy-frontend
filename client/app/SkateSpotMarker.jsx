import React from 'react';
import { withRouter } from 'react-router-dom';
import { Marker } from 'react-leaflet';
import ObjectPropTypes from './ObjectShapes';

class SkateSpotMarker extends React.Component {
  constructor(props) {
    super(props)
  }
  render() {
    const { position, spot } = this.props;
    const customMarker = L.icon({
      iconUrl: '/../assets/img/skatespot_icon.png',
      iconSize: [32, 32],
      iconAnchor: [16, 32],
      className: "skatespotmarker"
    });
    const linkLocation = { pathname: `/spot/${spot._id}`, state: { spot } };
    return (
      //<Link to={{ pathname: `/spot/${spot._id}`, state: { spot } }}><div className="mapMarker" /></Link>
      <Marker onClick={() => this.props.history.push(linkLocation)} position={position} icon={customMarker} />
    );
  }
};
SkateSpotMarker.propTypes = {
  spot: ObjectPropTypes.Spot.isRequired,
};

export const SkateSpotMarkerRouter = withRouter(SkateSpotMarker);

export const AddSpotMarker = ({ position }) => {
  const customMarker = L.icon({
    iconUrl: '/../assets/img/skatespot_addspot.png',
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    className: 'skatespotmarker skatespotmarker_add'
  });
  return (
    <Marker className="addspot-marker" icon={customMarker} position={position} />
  );
};