import React from 'react';
import { List, SimpleListItem } from '@rmwc/list';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { TextField, TextFieldIcon } from '@rmwc/textfield';
import { TabBar, Tab } from '@rmwc/tabs';
import { sendAjax } from '../helper/helper';
import HideAddSpot from './Transitions/HideAddSpot';
import history from './History';

const makePublicSpotsURL = (filterValue, artists) => {
  let searchTerm = 'murals';
  if (artists === 1) {
    searchTerm = 'artists';
  }
  if (filterValue !== '') {
    return `/${searchTerm}?_q=${filterValue}`;
  }
  return `/${searchTerm}`;
};

class SpotSearchParent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      spots: [],
      activeTab: 0, // 0 is murals, 1 is artists
    };
    this.searchField = React.createRef();
    this.updateSpotList = this.updateSpotList.bind(this);
    this.switchSearchTab = this.switchSearchTab.bind(this);
  }

  componentDidMount() {
    this.updateSpotList();
  }

  updateSpotList() {
    const { activeTab } = this.state;
    const filterValue = this.searchField.current.value === undefined ? '' : this.searchField.current.value;
    const toFetch = makePublicSpotsURL(filterValue, activeTab);
    sendAjax('GET', toFetch, null, (data) => {
      this.setState({ spots: data });
    });
  }

  switchSearchTab(tabIndex) {
    this.setState({ activeTab: tabIndex }, this.updateSpotList);
  }

  render() {
    const { spots, activeTab } = this.state;
    return (
      <div className="skateSpotListParent desktop-400 horizontal__desktop">
        <div style={{ display: 'flex', alignItems: 'center', backgroundColor: '#f2f2f2' }}>
          <TextField
            inputRef={this.searchField}
            className="newSearchBar"
            onChange={this.updateSpotList}
            label={activeTab === 0 ? 'Search murals' : 'Search artists'}
            withLeadingIcon={(
              <TextFieldIcon
                tabIndex="0"
                icon="arrow_back"
                onClick={() => history.push('/', { HideAddSpot })}
              />
            )}
          />
        </div>
        <TabBar
          activeTabIndex={activeTab}
          onActivate={evt => this.switchSearchTab(evt.detail.index)}
        >
          <Tab>Murals</Tab>
          <Tab>Artists</Tab>
        </TabBar>
        <SpotSearch spots={spots} />
      </div>
    );
  }
}

const SpotSearch = ({ spots }) => (
  <List twoLine className="spotList">
    {spots.map((spot) => {
      let secondaryText = '';
      let path = {};
      // If artists field exists this is a mural
      if (spot.artists !== undefined) {
        secondaryText = `${spot.artists[0].name} | ${spot.year}`;
        path = { pathname: `/mural/${spot._id}`, state: { spot } };
      } else {
        // this is a list of artists
        secondaryText = `${spot.description}`;
        path = { pathname: `/artist/${spot._id}` };
      }
      return (
        <Link key={spot._id} className="remove-link-styling force-block" to={path}>
          <SimpleListItem
            text={spot.name}
            secondaryText={secondaryText}
            meta="info"
          />
        </Link>
      );
    })
    }
  </List>
);
SpotSearch.propTypes = {
  spots: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default SpotSearchParent;
