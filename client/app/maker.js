import React from 'react';
import SpotForm from './addspot.js';
import Folder from './folder.js';
import {ChangePasswordForm, AccountMenu} from './profile.js';
import {ReviewForm, ReviewList, ReviewListItem} from './reviews.js';
import {sendAjax, redirect, handleError} from '../helper/helper.js'
import GoogleMapReact from 'google-map-react';
import { hot } from 'react-hot-loader';

let defaultURL = '/spots';

const makePublicSpotsURL = (name = '', description = '') => {
  return `/spots?name=${name}&description=${description}`;
};

const SkateSpotListParent = (props) => {
  return (
    <div>
      <Folder folderName="Folder Test">Pizza at dickies</Folder>
      <AddSkateSpotButton csrf={props.csrf} submitCallback={props.updatePublicView}
      toggleCallback={props.toggleAddSpotCallback} loc={props.newSpotLatLog}/>
      <div>
        <input id="spotName" type="text" name="name" placeholder="Filter by Spot Name" onChange={props.updatePublicView} />
        <input id="spotDesc" type="text" name="description" placeholder="Filter by Spot Description" onChange={props.updatePublicView} />
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
    <div style={{height: '90%', overflowY: 'scroll'}}>
    {props.spots.map(function(spot) {
      return (
        <div key={spot._id} className="skatespot_list" onClick={() => props.selectFunc(spot)}>
          <h3 className="spotName">{spot.name}</h3>
          <div className="spotDescription">{spot.description}</div>
        </div>
      );
    })}
    </div>
  );
}

class AddSkateSpotButton extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showForm: false
    };
    this.onSubmit = this.onSubmit.bind(this);
  }

  onSubmit() {
    this.setState({showForm: false});
    this.props.toggleCallback(!this.state.showForm);
    this.props.submitCallback();
  }

  toggle() {
    this.setState({showForm: !this.state.showForm})
    this.props.toggleCallback(this.state.showForm);
  }

  render() {
    let addReviewClasses = 'skatespot_list add-review';
    if(this.state.showForm) {
      addReviewClasses = `${addReviewClasses} skatespot_list-open`;
    }
    return (
      <div className={addReviewClasses}>
        <h3 className="spotName"
        onClick={() => this.toggle()}>
          {this.state.showForm ? '- Add Skatespot' : '+ Add Skatespot'}
        </h3>
        {this.state.showForm === true &&
          <SpotForm csrf={this.props.csrf} submitCallback={this.onSubmit} loc={this.props.loc}/>
        }
      </div>
    );
  }
}

const SpotInfoBox = ({spot, csrf}) => {
  return(
    <div className='spot_infobox'>
      <h3 className='spotName'>{spot.name}</h3>
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
    let toFetch = makePublicSpotsURL($('#spotName').val(), $('#spotDesc').val());
    sendAjax('GET', toFetch, null, (data) => {
      console.log("fetching ajax spots");
      this.onFetchSpots(data.spots);
    });
  }

  setSidebarState(state) {
    this.setState({sidebarState: state});
    if(this.state.sidebarState === 0) {
      this.updatePublicView();
    }
  }

  setSidebarInfo(spot) {
    this.setState({center: {lat: spot.location[1], lng: spot.location[0]}, sidebarState: 1, currentSpot: spot});
  }

  onFetchSpots(newSpots) {
    this.setState({spots: newSpots})
  }

  setNewPointLatLong({x, y, lat, lng, event  }) {
    if(this.state.addingNewSpot === true) {
      this.setState({newSpotLatLog: [lat, lng]});
    }
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
        <nav style={{height: '5%'}}>
          <a href="#" style={{float: 'left'}} onClick={() => this.setSidebarState(3)}
            className="back-button">Profile</a>
        </nav>
        <div style={{ height: '94%', width: '30%', float:'left' }}>
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
            <div>
              <div onClick={() => this.setSidebarState(0)} className="back-button">Back</div>
              <SpotInfoBox spot={this.state.currentSpot} csrf={this.state.csrf}/>
            </div>
          }
          {this.state.sidebarState == 3 && 
            <div>
              <div onClick={() => this.setSidebarState(0)} className="back-button">Back</div>
              <AccountMenu csrf={this.state.csrf} />
              <br />
              <a href="/logout" className="back-button" style={{width: '300px'}}>Log out</a>
            </div>
          }
        </div>
        <div style={{ height: '95%', width: '70%', float:'left' }}>
          <GoogleMapReact
            bootstrapURLKeys={{ key: 'AIzaSyCLrWfeNtdjy7sTf9YKsqYn5ZUqYVbjhWo' }}
            center={this.state.center}
            zoom={this.state.zoom}
            onClick={this.setNewPointLatLong.bind(this)}
          >
            {
              this.state.spots.map(function(spot) {
                return <SkateSpotMarker text={spot.name} lat={spot.location[1]} lng={spot.location[0]}></SkateSpotMarker>
              })
            }
            {newSpotMarker}
          </GoogleMapReact>
        </div>
      </div>
    )
  }
}

export default hot(module)(App);