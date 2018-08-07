// TODO: We need to refactor a bunch of stuff + clean up legacy callbacks
// to stuff from the pre-material web components UI
// Also, move toolbar to it's own file

import { hot } from 'react-hot-loader';
import React from 'react';
import SpotForm from './addspot.js';
import {AccountMenu} from './profile.js';
import { sendAjax } from '../helper/helper.js'
import GoogleMapReact from 'google-map-react';
import { Toolbar, ToolbarRow, ToolbarSection, ToolbarTitle, ToolbarMenuIcon, ToolbarIcon } from 'rmwc/Toolbar';
import { Fab } from 'rmwc/Fab';
import { SkateSpotListParent } from './SpotList.js';
import SearchBox from './Searchbox.js';
import { Button, ButtonIcon } from 'rmwc/Button';
import { SimpleMenu, MenuItem } from 'rmwc/Menu';
import { Elevation } from 'rmwc/Elevation';
import { Snackbar } from 'rmwc/Snackbar';
import { Route, Link } from 'react-router-dom';
import SpotViewParent from './SpotDisplay.js';
import RunOnMount from './RunOnMount.js';

let defaultURL = '/spots';

const makePublicSpotsURL = (name = '', description = '', showOurSpots = false) => {
  let profileSpots = showOurSpots ? 'profileSpots=true' : '';
  return `/spots?filter=${name}&${profileSpots}`;
};

const SkateSpotMarker = (props) => {
  let classNameString = "mapMarker";
  if (props.addspot === true) {
    classNameString += " mapMarker__addspot";
  }
  return(
    <Link to={'/spot/' + props.spot._id}><div className={classNameString}></div></Link>
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
      spots: [], // New main spot list, have skatespotlist send state to this
      addingNewSpot: false,
      csrf: '',
      showOurSpots: false,
      showSnackbar: false,
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
      <React.Fragment>
        <Elevation z={4}>
          <Toolbar>
            <ToolbarRow>
              <ToolbarSection alignStart>
                <ToolbarTitle><span className="toolbar-logo"></span>skatespot.io</ToolbarTitle>
              </ToolbarSection>
              <ToolbarSection alignEnd>
                <SimpleMenu handle={<ToolbarIcon use="account_circle" />}>
                  <MenuItem><Link to="/profile"> Change Password</Link></MenuItem>
                  <a href="/logout"><MenuItem>Log out</MenuItem></a>
                </SimpleMenu>
              </ToolbarSection>
            </ToolbarRow>
          </Toolbar>
        </Elevation>
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
                <SkateSpotMarker addspot={true} lat={this.state.center.lat} lng={this.state.center.lng} />
              }
            </GoogleMapReact>

            <Link to='/add'><Fab className="skatespot-map__fab">add</Fab></Link>
            <Elevation z={2}>
              <SearchBox searchCallback={(newLoc) => this.setState({center: newLoc})} />
            </Elevation>
          </div>
          <div className="skatespot-sidebar">
            <Route path="/" render={() => <React.Fragment>
              <RunOnMount func={() => this.setState({addingNewSpot: false})}/>
            </React.Fragment>} />

            <Route exact path='/' render={() =>
              <React.Fragment>
                <RunOnMount func={() => this.setState({addingNewSpot: false})}/>
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
              <Link to='/'><Button><ButtonIcon use="arrow_back" />Back</Button></Link>
              <SpotViewParent csrf={this.state.csrf} onOpen={(newCenter) => this.setState({center: newCenter}) } {...props} />
            </React.Fragment>} />

            <Route path='/profile' render={() => <React.Fragment>
              <RunOnMount func={() => this.setState({addingNewSpot: false})}/>
              <Link to='/'><Button><ButtonIcon use="arrow_back" />Back</Button></Link>
              <AccountMenu csrf={this.state.csrf} />
            </React.Fragment>} />

            <Route path='/add' render={() => <React.Fragment>
              <RunOnMount func={() => this.setState({addingNewSpot: true})}/>
              <Link to='/'><Button><ButtonIcon use="arrow_back" />Back</Button></Link>
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

      </React.Fragment>
    )
  }
}

export default hot(module)(App);