// TODO: We need to refactor a bunch of stuff

import { hot } from 'react-hot-loader';
import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { ThemeProvider } from '@rmwc/theme';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { Map, TileLayer, AttributionControl } from 'react-leaflet';
import SpotSearchParent from './Search';
import SpotCard from './Widgets/SpotCard';
import CardSlide from './Transitions/CardSlide';
import ShowAddSpotBottomBar from './Transitions/ShowAddSpotBottomBar';
import { sendAjax, distance } from '../helper/helper';
import SpotViewParent from './SpotDisplay';
import RunOnMount from './Widgets/RunOnMount';
import AppToolbar from './Toolbar';
import { SkateSpotMarker, AddSpotMarker } from './Widgets/SkateSpotMarker';
import history from './History';
import LoginWindow from './Login';
import Logout from './Logout';
import MapFABs from './Widgets/MapFABs';
import ArtistViewParent from './ArtistDisplay';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      center: { lat: 43.152614, lng: -77.606773 },
      lastFetchedCenter: { lat: 43.152614, lng: -77.606773 },
      newSpotLocation: {},
      zoom: 14,
      spots: [], // New main spot list, have skatespotlist send state to this
      addingNewSpot: 0, // 0 = not adding spot, 1 = current center, 2 = spot location set
      csrf: '',
      toolbarTitle: '',
      locationWatchId: null,
      watchingLocation: false,
      selectedSpot: null, // Spot to show card of in base route
    };
    this.onFetchSpots = this.onFetchSpots.bind(this);
    this.onChange = this.onChange.bind(this);
    this.updateSpots = this.updateSpots.bind(this);
    this.setNewSpotLocation = this.setNewSpotLocation.bind(this);
    this.onZoomChange = this.onZoomChange.bind(this);
    this.hideSpotCard = this.hideSpotCard.bind(this);
    this.setSpotCard = this.setSpotCard.bind(this);
    this.checkUserAuth = this.checkUserAuth.bind(this);
    this.getUserGeolocation = this.getUserGeolocation.bind(this);
  }

  componentDidMount() {
    sendAjax('GET', '/murals', null, (data) => {
      console.log('fetching ajax spots');
      this.onFetchSpots(data);
    });
  }

  onFetchSpots(newSpots) {
    this.setState({ spots: newSpots });
  }

  onChange(e) {
    this.setState({ center: e.target.getCenter(), selectedSpot: null });
    this.stopWatchingGeolocation();
    this.updateSpots();
  }

  onZoomChange(e) {
    this.setState({ zoom: e.target.getZoom() });
  }

  setSnackbar(message) {
    this.snackbar.current.setSnackbar(message);
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
        }, {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0,
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

  setNewSpotLocation(loc) {
    this.setState({ newSpotLocation: loc, addingNewSpot: 2 });
  }

  getCSRFToken() {
    sendAjax('GET', '/getToken', null, (result) => {
      console.log(result.csrfToken);
      this.setState({ csrf: result.csrfToken });
    });
  }

  setSpotCard(spot) {
    this.setState({
      selectedSpot: spot,
      center: {
        lat: spot.location.coordinates[1],
        lng: spot.location.coordinates[0],
      },
    });
    if (history.location.pathname.includes('/mural/')) {
      history.push('/');
    }
  }

  checkUserAuth() {
    sendAjax('GET', '/isUserAuthed', null, (data) => {
      if (data.account !== undefined) {
        this.setState({ userAuthed: true, userAuthedName: data.account.username });
      }
    });
  }

  hideSpotCard() {
    this.setState({ selectedSpot: null });
    if (history.location.pathname.includes('/mural/')) {
      history.push('/');
    }
  }

  stopWatchingGeolocation() {
    const { watchingLocation, locationWatchId } = this.state;
    if (watchingLocation === true) {
      console.log('Stopping location watch');
      navigator.geolocation.clearWatch(locationWatchId);
      this.setState({ watchingLocation: false });
    }
  }

  updateSpots(forceUpate = false) {
    // current search dist is 1700 m
    const { center, lastFetchedCenter } = this.state;
    if (distance(center, lastFetchedCenter) > 0.8 || forceUpate === true) {
      sendAjax('GET', '/murals', null, (data) => {
        console.log(data);
        console.log('fetching ajax spots');
        this.setState({ spots: data, lastFetchedCenter: center });
      });
    }
  }

  render() {
    const {
      center,
      zoom,
      spots,
      addingNewSpot,
      csrf,
      toolbarTitle,
      watchingLocation,
      newSpotLocation,
      selectedSpot,
    } = this.state;
    return (
      <ThemeProvider options={{
        primary: '#263238',
        secondary: '#d50000',
      }}
      >
        <AppToolbar
          title={toolbarTitle}
          refreshAction={() => this.updateSpots(true)}
        />
        <div className="appGrid">
          <Route render={({ location }) => {
            // Use default if animation vales are not provided by the Link
            const transitionToUse = (location.state !== undefined
              && location.state.transition !== undefined)
              ? location.state.transition : CardSlide.transition;
            const timeoutToUse = (location.state !== undefined
              && location.state.duration !== undefined)
              ? location.state.duration : CardSlide.duration;

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
                  <Switch location={location}>
                    <Route
                      exact
                      path="/"
                      render={() => (
                        <React.Fragment>
                          <RunOnMount func={() => {
                            this.setState({ addingNewSpot: 0, toolbarTitle: '' });
                          }}
                          />
                          {selectedSpot !== null
                          && <SpotCard spot={selectedSpot} bottomCard />
                          }
                        </React.Fragment>
                      )}
                    />
                    <Route
                      exact
                      path="/login"
                      render={() => (
                        <React.Fragment>
                          <RunOnMount func={() => {
                            this.setState({ addingNewSpot: 0, toolbarTitle: 'Login' });
                          }}
                          />
                          <LoginWindow
                            csrf={csrf}
                            onLogin={() => {
                              this.checkUserAuth();
                              this.setSnackbar('Logged In');
                            }}
                            onError={this.setSnackbar}
                          />
                        </React.Fragment>
                      )}
                    />

                    <Route
                      path="/search"
                      render={() => (
                        <React.Fragment>
                          <RunOnMount func={() => {
                            this.setState({ addingNewSpot: 0, toolbarTitle: '' });
                          }}
                          />
                          <SpotSearchParent center={center} />
                        </React.Fragment>
                      )}
                    />

                    <Route
                      path="/mural/:id"
                      render={props => (
                        <React.Fragment>
                          <RunOnMount func={() => {
                            this.setState({ addingNewSpot: 0 });
                            this.stopWatchingGeolocation();
                          }}
                          />
                          <SpotViewParent
                            key={props.match.params.id}
                            csrf={csrf}
                            onOpen={(newCenter, title) => {
                              this.setState({ center: newCenter, toolbarTitle: title }, () => {
                                this.updateSpots(true);
                              });
                            }}
                            onReviewAdd={this.setSnackbar}
                            {...props}
                          />
                        </React.Fragment>
                      )}
                    />

                    <Route
                      path="/artist/:id"
                      render={props => (
                        <React.Fragment>
                          <RunOnMount func={() => {
                            this.setState({ addingNewSpot: 0 });
                            this.stopWatchingGeolocation();
                          }}
                          />
                          <ArtistViewParent
                            key={props.match.params.id}
                            csrf={csrf}
                            onOpen={(title) => {
                              this.setState({ toolbarTitle: title });
                            }}
                            onReviewAdd={this.setSnackbar}
                            {...props}
                          />
                        </React.Fragment>
                      )}
                    />
                  </Switch>
                </CSSTransition>
              </TransitionGroup>
            );
          }}
          />
          <div className="skatespot-map__parent">
            <Map
              center={[center.lat, center.lng]}
              zoom={zoom}
              onDragend={this.onChange}
              onZoomend={this.onZoomChange}
              onClick={this.hideSpotCard}
              attributionControl={false}
              zoomControl={false}
            >
              <TileLayer
                attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.osm.org/{z}/{x}/{y}.png"
              />
              <AttributionControl position="topright" />
              {
                spots.map(spot => (
                  <SkateSpotMarker
                    key={spot._id}
                    spot={spot}
                    onClick={this.setSpotCard}
                  />
                ))
              }
              {addingNewSpot === 1
              && <AddSpotMarker position={[center.lat, center.lng]} />
              }
              {addingNewSpot === 2
              && <AddSpotMarker position={[newSpotLocation.lat, newSpotLocation.lng]} />
              }
            </Map>
            <MapFABs
              ShowAddSpotBottomBar={ShowAddSpotBottomBar}
              watchingLocation={watchingLocation}
              getUserGeolocation={this.getUserGeolocation}
            />
          </div>
        </div>
      </ThemeProvider>
    );
  }
}

export default hot(module)(App);
