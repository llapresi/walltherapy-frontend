// TODO: We need to refactor a bunch of stuff + clean up legacy callbacks
// to stuff from the pre-material web components UI
// Also, move toolbar to it's own file

import { hot } from 'react-hot-loader';
import React from 'react';
import SpotForm from './addspot.js';
import {AccountMenu} from './profile.js';
import { sendAjax } from '../helper/helper.js'
import GoogleMapReact from 'google-map-react';
import { Fab } from 'rmwc/Fab';
import { SkateSpotListParent } from './SpotList.js';
import SearchBox from './Searchbox.js';
import { Button, ButtonIcon } from 'rmwc/Button';
import { Elevation } from 'rmwc/Elevation';
import { Snackbar } from 'rmwc/Snackbar';
import { Route, Link } from 'react-router-dom';
import SpotViewParent from './SpotDisplay.js';
import RunOnMount from './RunOnMount.js';
import AppToolbar from './Toolbar.js';
import { ThemeProvider } from 'rmwc/Theme';

let defaultURL = '/spots';

const makePublicSpotsURL = (name = '', description = '', showOurSpots = false) => {
  let profileSpots = showOurSpots ? 'profileSpots=true' : '';
  return `/spots?filter=${name}&${profileSpots}`;
};

const SkateSpotMarker = (props) => {
  return(
    <Link to={'/spot/' + props.spot._id}><div className="mapMarker"></div></Link>
  );
}

const AddSpotMarker = (props) => {
  return(
    <div className='mapMarker mapMarker__addspot'></div>
  );
}

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      center: {lat: 43.084727, lng: -77.674423},
      zoom: 17,
      spots: [], // New main spot list, have skatespotlist send state to this
      addingNewSpot: false,
      csrf: '',
      showOurSpots: false,
      showSnackbar: false,
      toolbarTitle: "",
    };
    this.onFetchSpots = this.onFetchSpots.bind(this);
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

  onFetchSpots(newSpots) {
    this.setState({spots: newSpots})
  }

  onChange({center, zoom}) {
    this.setState({center: center});
  }

  onNewSpot() {
    this.updatePublicView();
    this.setState({showSnackbar: true});
  }

  render() {
    return(
      <ThemeProvider options={{
        primary: '#263238',
        secondary: '#d50000'
      }}>
        <AppToolbar title={this.state.toolbarTitle}/>
        <div className="appGrid">
          <div className="skatespot-map__parent">
            <GoogleMapReact className="skatespot-map__map"
              bootstrapURLKeys={{ key: 'AIzaSyCLrWfeNtdjy7sTf9YKsqYn5ZUqYVbjhWo' }}
              center={this.state.center}
              zoom={this.state.zoom}
              onChange={this.onChange.bind(this)}
              options={{
                zoomControl: false,
                fullscreenControl: false,
              }}
            >
              {
                this.state.spots.map((spot) => {
                  return(
                    <SkateSpotMarker key={spot._id} spot={spot} text={spot.name}
                      lat={spot.location[1]} lng={spot.location[0]}>
                    </SkateSpotMarker>
                  );
                })
              }
              {this.state.addingNewSpot == true &&
                <AddSpotMarker addspot={true} lat={this.state.center.lat} lng={this.state.center.lng} />
              }
            </GoogleMapReact>

            <Link to='/add'><Fab className="skatespot-map__fab">add</Fab></Link>
            <Elevation z={2}>
              <SearchBox searchCallback={(newLoc) => this.setState({center: newLoc})} />
            </Elevation>
          </div>
          <div className="skatespot-sidebar">

            <Route exact path='/' render={() =>
              <React.Fragment>
                <RunOnMount func={() => this.setState({addingNewSpot: false, toolbarTitle: ""})}/>
                <SkateSpotListParent
                  spots={this.state.spots}
                  csrf={this.state.csrf } 
                  url={defaultURL} 
                  onFetchSpots={this.onFetchSpots.bind(this)} 
                  updatePublicView={this.updatePublicView.bind(this)}
                />
              </React.Fragment>
            }/>

            <Route path='/spot/:id' render={(props)=> <React.Fragment>
              <RunOnMount func={() => this.setState({addingNewSpot: false})}/>
              <SpotViewParent 
                key={props.match.params.id}
                csrf={this.state.csrf}
                onOpen={(newCenter, title) => this.setState({center: newCenter, toolbarTitle: title}) } 
                {...props} 
              />
            </React.Fragment>} />

            <Route path='/profile' render={() => <React.Fragment>
              <RunOnMount func={() => this.setState({addingNewSpot: false, toolbarTitle: "Change Password"})}/>
              <AccountMenu csrf={this.state.csrf} />
            </React.Fragment>} />

            <Route path='/add' render={() => <React.Fragment>
              <RunOnMount func={() => this.setState({addingNewSpot: true, toolbarTitle: "Add Spot"})}/>
              <SpotForm csrf={this.state.csrf} loc={this.state.center} submitCallback={this.onNewSpot.bind(this)} />
            </React.Fragment>}/>
          </div>
        </div>
        <Snackbar
          show={this.state.showSnackbar}
          onHide={evt => this.setState({showSnackbar: false})}
          message="New Spot Created"
          actionText="Close"
          actionHandler={() => {}}
        />
      </ThemeProvider>
    )
  }
}

export default hot(module)(App);