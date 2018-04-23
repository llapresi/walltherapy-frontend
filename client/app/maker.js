// TODO: We need to refactor a bunch of stuff + clean up legacy callbacks
// to stuff from the pre-material web components UI
// Also, move toolbar to it's own file

import React from 'react';
import SpotForm from './addspot.js';
import Folder from './folder.js';
import {ChangePasswordForm, AccountMenu} from './profile.js';
import {ReviewForm, ReviewList, ReviewListItem} from './reviews.js';
import {sendAjax, redirect, handleError} from '../helper/helper.js'
import GoogleMapReact from 'google-map-react';
import { Grid, GridCell } from 'rmwc/Grid';
import { List, SimpleListItem } from 'rmwc/List';
import { TabBar, Tab, TabIcon, TabIconText, TabBarScroller } from 'rmwc/Tabs';
import { hot } from 'react-hot-loader';
import { Toolbar, ToolbarRow, ToolbarSection, ToolbarTitle, ToolbarMenuIcon, ToolbarIcon } from 'rmwc/Toolbar';
import { TextField, TextFieldIcon, TextFieldHelperText } from 'rmwc/TextField';
import { Typography } from 'rmwc/Typography';

let defaultURL = '/spots';

const makePublicSpotsURL = (name = '', description = '', showOurSpots = false) => {
  let profileSpots = showOurSpots ? 'profileSpots=true' : '';
  return `/spots?name=${name}&description=${description}&${profileSpots}`;
};

const SkateSpotListParent = (props) => {
  return (
    <div>
      <div>
        <TextField id="spotName" className="search_field" box withLeadingIcon="search" label="Name" onChange={props.updatePublicView} />
        <TextField id="spotDesc" className="search_field" box withLeadingIcon="search" label="Description" onChange={props.updatePublicView} />
      </div>
      <SkateSpotList selectFunc={props.selectFunc} spots={props.spots} />
    </div>
  );
};

const SkateSpotMarker = ({text}) => {
  return(
    <div className="mapMarker" >{text}</div>
  );
}

const SkateSpotList = (props) => {
  return(
    <div className="spotList">
      <List twoLine>
      {props.spots.map(function(spot) {
        return (
          <SimpleListItem key={spot._id} text={spot.name} secondaryText={spot.description} meta="info" onClick={() => props.selectFunc(spot)}/>
        );
      })}
      </List>
    </div>
  );
}

const SpotInfoBox = ({spot, csrf}) => {
  return(
    <div className='spot_infobox'>
      <h2 className='spotName'><Typography use="display2">{spot.name}</Typography></h2>
      <div className='spotDescription'>{spot.description}</div>
      <ReviewList spotId={spot._id} csrf={csrf} />
    </div>
  );
}

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      center: {lat: 43.084727, lng: -77.674423},
      zoom: 17,
      sidebarState: 0, // 0 = Spots List, 1 = Spot Detail View, 3 = Profile menu
      currentSpot: {}, // data of spot we last selcted
      spots: [], // New main spot list, have skatespotlist send state to this
      newSpotLatLog: [0.0, 0.0],
      addingNewSpot: false,
      csrf: '',
      showOurSpots: false,
    };
    this.onFetchSpots = this.onFetchSpots.bind(this);
    this.setSidebarState = this.setSidebarState.bind(this);
  }

  componentDidMount() {
    sendAjax("GET", "/getToken", null, (result) => {
      console.log(result.csrfToken);
      this.setState({csrf: result.csrfToken});
    });

    sendAjax('GET', '/spots', null, (data) => {
      console.log("fetching ajax spots");
      this.onFetchSpots(data.spots);
    });
  }

  updatePublicView() {
    let toFetch = makePublicSpotsURL($('#spotName').val(), $('#spotDesc').val(), this.state.showOurSpots);
    console.log(toFetch);
    sendAjax('GET', toFetch, null, (data) => {
      console.log("fetching ajax spots");
      this.onFetchSpots(data.spots);
    });
  }

  setSidebarState(state, profileSpots) {
    this.setState({sidebarState: state, showOurSpots: profileSpots});
    this.updatePublicView();
  }

  setSidebarInfo(spot) {
    this.setState({center: {lat: spot.location[1], lng: spot.location[0]}, sidebarState: 1, currentSpot: spot});
  }

  onFetchSpots(newSpots) {
    this.setState({spots: newSpots})
  }

  setNewPointLatLong({x, y, lat, lng, event  }) {
    this.setState({newSpotLatLog: [lat, lng]});
  }

  render() {
    const addingNewSpot = this.state.addingNewSpot;
    const newSpotMarker = addingNewSpot ? (
      <SkateSpotMarker text="New Spot" lat={this.state.newSpotLatLog[0]} lng={this.state.newSpotLatLog[1]} />
    ) : (
      <span></span>
    );
    return(
      <div>
        <Toolbar>
          <ToolbarRow>
            <ToolbarSection alignStart>
              <ToolbarTitle>Skatespot</ToolbarTitle>
            </ToolbarSection>
            <ToolbarSection alignEnd>
              <ToolbarIcon use="account_circle" onClick={() => this.setState({sidebarState: 3})}/>
            </ToolbarSection>
          </ToolbarRow>
        </Toolbar>
        <div className="appGrid">
          <div className="skatespot-map__parent">
            <GoogleMapReact className="skatespot-map__map"
              bootstrapURLKeys={{ key: 'AIzaSyCLrWfeNtdjy7sTf9YKsqYn5ZUqYVbjhWo' }}
              center={this.state.center}
              zoom={this.state.zoom}
              onClick={this.setNewPointLatLong.bind(this)}
            >
              {
                this.state.spots.map(function(spot) {
                  return <SkateSpotMarker key={spot._id} text={spot.name} lat={spot.location[1]} lng={spot.location[0]}></SkateSpotMarker>
                })
              }
              {newSpotMarker}
            </GoogleMapReact>
          </div>
          <div className="skatespot-sidebar">
            <TabBar>
              <Tab className="spot_menu_tabs" onClick={() => this.setSidebarState(0, false)}>Your Spots</Tab>
              <Tab className="spot_menu_tabs" onClick={() => this.setSidebarState(0, true)}>All Spots</Tab>
              <Tab className="spot_menu_tabs" onClick={() => this.setSidebarState(4, false)}>Add Spot</Tab>
            </TabBar>
            {this.state.sidebarState == 0 && 
                <SkateSpotListParent
                  spots={this.state.spots}
                  csrf={this.state.csrf } 
                  url={defaultURL} 
                  selectFunc={this.setSidebarInfo.bind(this)}
                  onFetchSpots={this.onFetchSpots.bind(this)} 
                  updatePublicView={this.updatePublicView.bind(this)}
                  toggleAddSpotCallback={(newState) => this.setState({addingNewSpot: !newState})}
                  newSpotLatLog={this.state.newSpotLatLog}
                />
            }
            {this.state.sidebarState == 1 && 
              <SpotInfoBox spot={this.state.currentSpot} csrf={this.state.csrf}/>
            }
            {this.state.sidebarState == 3 && 
              <div>
                <div onClick={() => this.setSidebarState(0)} className="back-button">Back</div>
                <AccountMenu csrf={this.state.csrf} />
                <br />
                <a href="/logout" className="back-button" style={{width: '300px'}}>Log out</a>
              </div>
            }
            {this.state.sidebarState == 4 &&
              <SpotForm csrf={this.state.csrf} loc={this.state.newSpotLatLog} />
            }
          </div>

        </div>
      </div>
    )
  }
}

export default hot(module)(App);