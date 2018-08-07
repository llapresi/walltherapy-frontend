import React from 'react';
import { sendAjax } from '../helper/helper.js'
import { Typography } from 'rmwc/Typography';
import { ReviewList } from './reviews.js';

const SpotView = (props) => {
  return(
    <div className='spot_infobox'>
      <h2 className='spotName'><Typography use="display2">{props.spot.name}</Typography></h2>
      <div className='spotDescription'>{props.spot.description}</div>
      <ReviewList spotId={props.id} csrf={props.csrf} />
    </div>
  );
}

class SpotViewParent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      spot: {}
    };
  }

  componentDidMount() {
    sendAjax('GET', `/spots?id=${this.props.match.params.id}`, null, (data) => {
      this.setState({spot: data.spots[0]});
      let newCenter = {
        lat: this.state.spot.location[1],
        lng: this.state.spot.location[0],
      };
      this.props.onOpen(newCenter);
    });
  }
  render() {
    return (
      <SpotView spot={this.state.spot} id={this.props.match.params.id} csrf={this.props.csrf} />
      // <div className='spot_infobox'>
      //   <h2 className='spotName'><Typography use="display2">{this.state.spot.name}</Typography></h2>
      //   <div className='spotDescription'>{this.state.spot.description}</div>
      //   <ReviewList spotId={this.props.match.params.id} csrf={this.props.csrf} />
      // </div>
    );
  }
}

export default SpotViewParent;