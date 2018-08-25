// TODO: We need to refactor a bunch of stuff + clean up legacy callbacks
// to stuff from the pre-material web components UI
// Also, move toolbar to it's own file

import { hot } from 'react-hot-loader';
import React from 'react';
import GoogleMapReact from 'google-map-react';
import { Fab } from 'rmwc/Fab';
import { Elevation } from 'rmwc/Elevation';
import { Snackbar } from 'rmwc/Snackbar';
import { Route, Link, Switch } from 'react-router-dom';
import { ThemeProvider } from 'rmwc/Theme';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import PropTypes from 'prop-types';
import { SkateSpotListParent } from './SpotList';
import ShowAddSpot from './Transitions/ShowAddSpot';
import SpotForm from './addspot';
import { AccountMenu } from './profile';
import { sendAjax } from '../helper/helper';
import SpotViewParent from './SpotDisplay';
import RunOnMount from './Widgets/RunOnMount';
import AppToolbar from './Toolbar';
import SearchBox from './Widgets/Searchbox';
import ObjectPropTypes from './ObjectShapes';

const defaultURL = '/spots';

const makePublicSpotsURL = (name = '', showOurSpots = false) => {
  const profileSpots = showOurSpots ? 'profileSpots=true' : '';
  return `/spots?filter=${name}&${profileSpots}`;
};

const SkateSpotMarker = ({ spot }) => (
  <Link to={{ pathname: `/spot/${spot._id}`, state: { spot } }}><div className="mapMarker" /></Link>
);
SkateSpotMarker.propTypes = {
  spot: ObjectPropTypes.Spot.isRequired,
};

const AddSpotMarker = () => (
  <div className="mapMarker mapMarker__addspot" />
);

const GeolocationFAB = ({ watchingLocation, onClick }) => {
  const cssClassNames = watchingLocation ? 'skatespot-map__location skatespot-map__location-active' : 'skatespot-map__location';
  return (
    <Fab className={cssClassNames} onClick={onClick}>gps_fixed</Fab>
  );
};
GeolocationFAB.propTypes = {
  watchingLocation: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired,
};

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      center: { lat: 43.084727, lng: -77.674423 },
      zoom: 17,
      spots: [], // New main spot list, have skatespotlist send state to this
      addingNewSpot: false,
      csrf: '',
      showOurSpots: false,
      showSnackbar: false,
      toolbarTitle: '',
      locationWatchId: null,
      watchingLocation: false,
    };
    this.onFetchSpots = this.onFetchSpots.bind(this);
    this.onChange = this.onChange.bind(this);
    this.updatePublicView = this.updatePublicView.bind(this);
    this.onNewSpot = this.onNewSpot.bind(this);
  }

  componentDidMount() {
    sendAjax('GET', '/getToken', null, (result) => {
      console.log(result.csrfToken);
      this.setState({ csrf: result.csrfToken });
    });

    sendAjax('GET', '/spots', null, (data) => {
      console.log('fetching ajax spots');
      this.onFetchSpots(data.spots);
    });
  }

  onFetchSpots(newSpots) {
    this.setState({ spots: newSpots });
  }

  onChange({ center }) {
    this.setState({ center });
  }

  onNewSpot() {
    this.updatePublicView();
    this.setState({ showSnackbar: true });
  }

  getUserGeolocation() {
    const { watchingLocation } = this.state;
    if ('geolocation' in navigator) {
      if (watchingLocation === false) {
        this.setState({ watchingLocation: true });
        console.log('Asking for user location/Starting');
        const watchID = navigator.geolocation.watchPosition((position) => {
          console.log('Fetching position');
          this.setState({
            center: { lat: position.coords.latitude, lng: position.coords.longitude },
          });
        }, (error) => {
          console.log(error);
          if (error.code === 1) {
            console.log("User doesn't allow location");
          }
          this.stopWatchingGeolocation();
        });
        this.setState({ locationWatchId: watchID });
        console.log(watchID);
      } else {
        this.stopWatchingGeolocation();
      }
    } else {
      /* geolocation IS NOT available */
    }
  }

  updatePublicView() {
    const { showOurSpots } = this.state;
    const toFetch = makePublicSpotsURL($('#spotName').val(), showOurSpots);
    console.log(toFetch);
    sendAjax('GET', toFetch, null, (data) => {
      console.log('fetching ajax spots');
      this.setState({ spots: data.spots });
    });
  }

  stopWatchingGeolocation() {
    const { watchingLocation, locationWatchId } = this.state;
    if (watchingLocation === true) {
      console.log('Stopping location watch');
      navigator.geolocation.clearWatch(locationWatchId);
      this.setState({ watchingLocation: false });
    }
  }

  render() {
    const {
      center,
      zoom,
      spots,
      addingNewSpot,
      csrf,
      showSnackbar,
      toolbarTitle,
      watchingLocation,
    } = this.state;
    return (
      <ThemeProvider options={{
        primary: '#263238',
        secondary: '#d50000',
      }}
      >
        <AppToolbar title={toolbarTitle} />
        <div className="appGrid">
          <div className="skatespot-map__parent">
            <GoogleMapReact
              className="skatespot-map__map"
              bootstrapURLKeys={{ key: 'AIzaSyCLrWfeNtdjy7sTf9YKsqYn5ZUqYVbjhWo' }}
              center={center}
              zoom={zoom}
              onChange={this.onChange}
              options={{
                zoomControl: false,
                fullscreenControl: false,
              }}
              onDrag={() => this.stopWatchingGeolocation()}
            >
              {
                spots.map(spot => (
                  <SkateSpotMarker
                    key={spot._id}
                    spot={spot}
                    text={spot.name}
                    lat={spot.location[1]}
                    lng={spot.location[0]}
                  />
                ))
              }
              {addingNewSpot === true
              && <AddSpotMarker lat={center.lat} lng={center.lng} />
              }
            </GoogleMapReact>

            <Link to={{ pathname: '/add', state: ShowAddSpot }}><Fab className="skatespot-map__fab">add_location</Fab></Link>
            <GeolocationFAB
              watchingLocation={watchingLocation}
              onClick={() => this.getUserGeolocation()}
            />
            <Elevation z={2}>
              <SearchBox searchCallback={newLoc => this.setState({ center: newLoc })} />
            </Elevation>
          </div>
          <Route render={({ location }) => {
            // Use default if animation vales are not provided by the Link
            const transitionToUse = (location.state !== undefined
              && location.state.transition !== undefined) ? location.state.transition : 'transition__show_addspot';
            const timeoutToUse = (location.state !== undefined
              && location.state.duration !== undefined) ? location.state.duration : 250;
            return (
              <TransitionGroup
                childFactory={child => React.cloneElement(
                  child,
                  {
                    classNames: transitionToUse,
                    timeout: timeoutToUse,
                  },
                )}
              >
                <CSSTransition key={location.key}>
                  <div className="skatespot-sidebar">
                    <Switch location={location}>
                      <Route
                        exact
                        path="/"
                        render={() => (
                          <React.Fragment>
                            <RunOnMount func={() => this.setState({ addingNewSpot: false, toolbarTitle: '' })} />
                            <SkateSpotListParent
                              spots={spots}
                              csrf={csrf}
                              url={defaultURL}
                              updatePublicView={this.updatePublicView}
                            />
                          </React.Fragment>
                        )}
                      />

                      <Route
                        path="/spot/:id"
                        render={props => (
                          <React.Fragment>
                            <RunOnMount func={() => {
                              this.setState({ addingNewSpot: false });
                              this.stopWatchingGeolocation();
                            }}
                            />
                            <SpotViewParent
                              key={props.match.params.id}
                              csrf={csrf}
                              onOpen={(newCenter, title) => this.setState({
                                center: newCenter, toolbarTitle: title,
                              })}
                              {...props}
                            />
                          </React.Fragment>
                        )}
                      />

                      <Route
                        path="/profile"
                        render={() => (
                          <React.Fragment>
                            <RunOnMount func={() => this.setState({ addingNewSpot: false, toolbarTitle: 'Change Password' })} />
                            <AccountMenu csrf={csrf} />
                          </React.Fragment>
                        )}
                      />

                      <Route
                        path="/add"
                        render={() => (
                          <React.Fragment>
                            <RunOnMount func={() => {
                              this.setState({ addingNewSpot: true, toolbarTitle: 'Add Spot' });
                              this.stopWatchingGeolocation();
                            }}
                            />
                            <SpotForm
                              csrf={csrf}
                              loc={center}
                              submitCallback={this.onNewSpot}
                            />
                          </React.Fragment>
                        )}
                      />
                    </Switch>
                  </div>
                </CSSTransition>
              </TransitionGroup>
            );
          }}
          />
        </div>
        <Snackbar
          show={showSnackbar}
          onHide={evt => this.setState({ showSnackbar: false })}
          message="New Spot Created"
          actionText="Close"
          actionHandler={() => {}}
        />
      </ThemeProvider>
    );
  }
}

export default hot(module)(App);
