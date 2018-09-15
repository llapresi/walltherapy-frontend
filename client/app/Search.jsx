import React from 'react';
import { List, SimpleListItem } from 'rmwc/List';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { TextField } from 'rmwc/TextField';
import { sendAjax } from '../helper/helper';

const makePublicSpotsURL = (name = '', showOurSpots = false, latlng = null) => {
  const maxDistanceKm = 400;
  const profileSpots = showOurSpots ? '&profileSpots=true' : '';
  const locCenter = latlng !== null ? `&lat=${latlng.lat}&lng=${latlng.lng}&dist=${maxDistanceKm}` : '';
  console.log(`/spots?filter=${name}${profileSpots}${locCenter}`);
  return `/spots?filter=${name}${profileSpots}${locCenter}`;
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
    const filterValue = e === undefined ? '' : e.target.value;
    const toFetch = makePublicSpotsURL(filterValue);
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
    <TransitionGroup className="spotList-anim" component={null}>
      {spots.map((spot) => {
        let classNameString = '';
        let descriptionAppend = '';
        if (spot.isSponsored === true) {
          classNameString += 'spot__sponsored';
          descriptionAppend += 'Sponsored: ';
        }
        return (
          <CSSTransition
            key={spot._id}
            timeout={200}
            classNames="spotAnim"
          >
            <Link className="remove-link-styling force-block" to={{ pathname: `/spot/${spot._id}`, state: { spot } }}>
              <SimpleListItem className={classNameString} text={spot.name} secondaryText={descriptionAppend + spot.description} meta="info" />
            </Link>
          </CSSTransition>
        );
      })}
    </TransitionGroup>
  </List>
);
SpotSearch.propTypes = {
  spots: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default SpotSearchParent;
