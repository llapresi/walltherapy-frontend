import React from 'react';
import PropTypes from 'prop-types';
import ReactRouterPropTypes from 'react-router-prop-types';
import SpotCard from './Widgets/SpotCard';
import { sendAjax } from '../helper/helper';
import { ReviewList } from './reviews';
import ObjectPropTypes from './ObjectShapes';

const SpotView = ({ spot, id, csrf }) => (
  <div className="spot_infobox">
    <div className="spotDescription">{spot.description}</div>
    <ReviewList spotId={id} csrf={csrf} />
  </div>
);
SpotView.propTypes = {
  spot: ObjectPropTypes.Spot,
  id: PropTypes.string.isRequired,
  csrf: PropTypes.string.isRequired,
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
      console.log('Fetching new spot data');
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
    const { match, csrf } = this.props;
    const { spot } = this.state;
    return (
      <SpotView spot={spot} id={match.params.id} csrf={csrf} />
    );
  }
}
SpotViewParent.propTypes = {
  location: ReactRouterPropTypes.location.isRequired,
  match: ReactRouterPropTypes.match.isRequired,
  csrf: PropTypes.string.isRequired,
  onOpen: PropTypes.func.isRequired,
};

export default SpotViewParent;
