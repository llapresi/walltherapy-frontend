let defaultURL = '/getSpots';

const makePublicSpotsURL = (name = '', location = '', description = '') => {
  return `/getSpots?location=${location}&name=${name}&description=${description}`;
};

const SkateSpotList = (props) => {
  return (
    <div>
      <div>
        <input id="spotName" type="text" name="name" placeholder="Spot Name" onChange={props.updatePublicView} />
        <input id="spotLoc" type="text" name="location" placeholder="Spot Location" onChange={props.updatePublicView} />
        <input id="spotDesc" type="text" name="description" placeholder="Spot Description" onChange={props.updatePublicView} />
      </div>
      <AddSkateSpotListItem csrf={props.csrf} submitCallback={props.updatePublicView}/>
      <SkateSpotDisplay selectFunc={props.selectFunc} spots={props.spots}/>
    </div>
  );
};

const SkateSpotMapIcon = ({text}) => {
  return(
    <div className="mapMarker" >{text}</div>
  );
}

const SkateSpotDisplay = (props) => {
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

class AddSkateSpotListItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showForm: false
    };
    this.onSubmit = this.onSubmit.bind(this);
  }

  onSubmit() {
    this.setState({showForm: false});
    this.props.submitCallback();
  }

  render() {
    return (
      <div className="skatespot_list add-review">
        <h3 className="spotName"
        onClick={() => this.setState({showForm: !this.state.showForm})}>
          {this.state.showForm ? '- Add Skatespot' : '+ Add Skatespot'}
        </h3>
        {this.state.showForm === true &&
          <SpotForm csrf={this.props.csrf} submitCallback={this.onSubmit}/>
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

class SkatespotRoot extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      center: {lat: 59.95, lng: 30.33},
      zoom: 17,
      sidebarState: 0, // 0 = Spots List, 1 = Spot Detail View, 3 = Profile menu
      currentSpot: {}, // data of spot we last selcted
      spots: [], // New main spot list, have skatespotlist send state to this
    };
    this.onFetchSpots = this.onFetchSpots.bind(this);
    this.setSidebarState = this.setSidebarState.bind(this);
  }

  componentDidMount() {
    sendAjax('GET', '/getSpots', null, (data) => {
      console.log("fetching ajax spots");
      this.onFetchSpots(data.spots);
    });
  }

  updatePublicView() {
    let toFetch = makePublicSpotsURL($('#spotName').val(), $('#spotLoc').val(), $('#spotDesc').val());
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

  render() {
    return(
      <div>
        <nav>
          <a href="#" onClick={() => this.setSidebarState(3)}>Profile</a>
          <div className="navlink"><a href="/logout">Log out</a></div>
        </nav>
        <div style={{ height: '100%', width: '30%', float:'left' }}>
          {this.state.sidebarState == 0 && 
              <SkateSpotList
                spots={this.state.spots}
                csrf={this.props.csrf } 
                url={defaultURL} 
                selectFunc={this.setSidebarInfo.bind(this)}
                onFetchSpots={this.onFetchSpots.bind(this)} 
                updatePublicView={this.updatePublicView.bind(this)}
              />
          }
          {this.state.sidebarState == 1 && 
            <div>
              <div onClick={() => this.setSidebarState(0)}>Back</div>
              <SpotInfoBox spot={this.state.currentSpot} csrf={this.props.csrf}/>
            </div>
          }
          {this.state.sidebarState == 3 && 
            <div>
              <div onClick={() => this.setSidebarState(0)}>Back</div>
              <AccountMenu csrf={this.props.csrf} />
            </div>
          }
        </div>
        <div style={{ height: '100%', width: '70%', float:'right' }}>
          <GoogleMapReact
            bootstrapURLKeys={{ key: 'AIzaSyCLrWfeNtdjy7sTf9YKsqYn5ZUqYVbjhWo' }}
            center={this.state.center}
            zoom={this.state.zoom}
          >
            {
              this.state.spots.map(function(spot) {
                return <SkateSpotMapIcon text={spot.name} lat={spot.location[1]} lng={spot.location[0]}></SkateSpotMapIcon>
              })
            }
          </GoogleMapReact>
        </div>
      </div>
    )
  }
}

const setup = (csrf) => {
  ReactDOM.render(
    <SkatespotRoot csrf={csrf} />, document.querySelector("#main")
  );
};

const getToken = () => {
  sendAjax("GET", "/getToken", null, (result) => {
    console.log(result.csrfToken);
    setup(result.csrfToken);
  });
};

$(document).ready(function() {
  getToken();
});