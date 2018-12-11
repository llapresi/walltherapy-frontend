import React from 'react';
import PropTypes from 'prop-types';
import ReactRouterPropTypes from 'react-router-prop-types';
import { Link } from 'react-router-dom';
import { sendAjax } from '../helper/helper';
import ObjectPropTypes from './ObjectShapes';

const SpotView = ({
  spot,
}) => {
  let artist = '';
  let artistId = '';
  if (spot.artists !== undefined) {
    artist = spot.artists[0].name;
    artistId = spot.artists[0]._id;
  }
  let images = '';
  if (spot.images !== undefined) {
    images = spot.images.map(image => <img src={image.url} alt={image.name} className="responsive-image" />);
  }
  return (
    <article className="spot_infobox">
      <h2>{spot.name}</h2>
      <h3>
        <Link to={{ pathname: `/artist/${artistId}` }}>
          <span>{artist}</span>
        </Link>
      </h3>
      <h3>{spot.streetname}</h3>
      <div>
        {images}
      </div>
      <div
        className="spotDescription"
        dangerouslySetInnerHTML={{ __html: spot.description }}
      />
    </article>
  );
};
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
    const { match } = this.props;
    // Fetching new spot data
    console.log(`Fetching new spot data: /murals?id=${match.params.id}`);
    sendAjax('GET', `${process.env.API_URL}/murals?id=${match.params.id}`, null, (data) => {
      this.setState({ spot: data[0] });
      this.onNewSpotData(data[0]);
      console.log(data[0]);
    });
  }

  onNewSpotData(spot) {
    const { onOpen } = this.props;
    const newCenter = {
      lat: spot.location.coordinates[1],
      lng: spot.location.coordinates[0],
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
