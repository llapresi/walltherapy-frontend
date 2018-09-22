import React from 'react';
import { List, SimpleListItem } from 'rmwc/List';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { TextField } from 'rmwc/TextField';
import { sendAjax } from '../helper/helper';

const makePublicSpotsURL = (name = '', latlng = null) => {
  const maxDistanceKm = 6;
  let locCenter = latlng !== null ? `&lat=${latlng.lat}&lng=${latlng.lng}` : '';
  if (locCenter !== '' && name === '') {
    locCenter = `${locCenter}&dist=${maxDistanceKm}`;
  }
  console.log(`/spots?filter=${name}${locCenter}`);
  return `/spots?filter=${name}${locCenter}`;
};

class SpotSearchParent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      spots: [],
    };
    this.updateSpotList = this.updateSpotList.bind(this);
  }

  componentDidMount() {
    this.updateSpotList();
  }

  updateSpotList(e) {
    const { center } = this.props;
    const filterValue = e === undefined ? '' : e.target.value;
    const toFetch = makePublicSpotsURL(filterValue, center);
    sendAjax('GET', toFetch, null, (data) => {
      console.log('Searchbar fetching spots');
      this.setState({ spots: data.spots });
    });
  }

  render() {
    const { spots } = this.state;
    return (
      <div className="skateSpotListParent desktop-400 horizontal__desktop">
        <TextField className="newSearchBar" onChange={this.updateSpotList} label="Search" box withLeadingIcon="search" />
        <SpotSearch spots={spots} />
      </div>
    );
  }
}

const SpotSearch = ({ spots }) => (
  <List twoLine className="spotList">
    {spots.map((spot) => {
      let classNameString = '';
      let descriptionAppend = '';
      if (spot.isSponsored === true) {
        classNameString += 'spot__sponsored';
        descriptionAppend += 'Sponsored: ';
      }
      return (
        <Link className="remove-link-styling force-block" to={{ pathname: `/spot/${spot._id}`, state: { spot } }}>
          <SimpleListItem className={classNameString} text={spot.name} secondaryText={descriptionAppend + spot.description} meta="info" />
        </Link>
      );
    })}
  </List>
);
SpotSearch.propTypes = {
  spots: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default SpotSearchParent;
