import React from 'react';
import { sendAjax } from '../helper/helper.js'
import { Typography } from 'rmwc/Typography';
import { ReviewList } from './reviews.js';

const SpotView = (props) => {
  return(
    <div className='spot_infobox'>
      <div className='spotDescription'>{props.spot.description}</div>
        <ReviewList spotId={props.id} csrf={props.csrf} />
    </div>
  );
}

class SpotViewParent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      spot: {},
    };
  }

  componentDidMount() {
    if (this.props.location.state !== undefined && this.props.location.state.spot !== undefined) {
      // Re-using existing spot data
      console.log("Re-using existing spot data");
      this.setState({spot: this.props.location.state.spot});
      this.onNewSpotData(this.props.location.state.spot);
    } else {
      // Fetching new spot data
      console.log("Fetching new spot data");
      sendAjax('GET', `/spots?id=${this.props.match.params.id}`, null, (data) => {
        this.setState({spot: data.spots[0]});
        this.onNewSpotData(data.spots[0]);
      });
    }
  }

  onNewSpotData(spot) {
    let newCenter = {
      lat: spot.location[1],
      lng: spot.location[0],
    };
    this.props.onOpen(newCenter, spot.name);
  }

  render() {
    return (
      <SpotView spot={this.state.spot} id={this.props.match.params.id} csrf={this.props.csrf} />
    );
  }
}

export default SpotViewParent;