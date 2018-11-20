import React from 'react';
import PropTypes from 'prop-types';
import ReactRouterPropTypes from 'react-router-prop-types';
import { sendAjax } from '../helper/helper';
import ObjectPropTypes from './ObjectShapes';

const SpotView = ({
  spot,
}) => (
  <article className="spot_infobox">
    <h2>{spot.name}</h2>
    <h3>{spot.artist}</h3>
    <h3>{spot.locationName}</h3>
    <div
      className="spotDescription"
      dangerouslySetInnerHTML={{ __html: spot.description }}
    />
  </article>
);
SpotView.propTypes = {
  spot: ObjectPropTypes.Spot,
};
SpotView.defaultProps = {
  spot: {},
};


class SpotViewParent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      spot: {},
    };
  }

  componentDidMount() {
    const { location, match } = this.props;
    if (location.state !== undefined && location.state.spot !== undefined) {
      // Re-using existing spot data
      console.log('Re-using existing spot data');
      this.setState({ spot: location.state.spot });
      this.onNewSpotData(location.state.spot);
    } else {
      // Fetching new spot data
      console.log(`Fetching new spot data: /spots?id=${match.params.id}`);
      sendAjax('GET', `/spots?id=${match.params.id}`, null, (data) => {
        this.setState({ spot: data.spots[0] });
        this.onNewSpotData(data.spots[0]);
      });
    }
  }

  onNewSpotData(spot) {
    const { onOpen } = this.props;
    const newCenter = {
      lat: spot.location[1],
      lng: spot.location[0],
    };
    onOpen(newCenter, spot.name);
  }

  render() {
    const { spot } = this.state;
    return (
      <SpotView
        spot={spot}
      />
    );
  }
}
SpotViewParent.propTypes = {
  location: ReactRouterPropTypes.location.isRequired,
  match: ReactRouterPropTypes.match.isRequired,
  onOpen: PropTypes.func.isRequired,
};

export default SpotViewParent;
