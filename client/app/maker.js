let currentDomoList = '/getSpots';

const loadDomosFromServer = (sort = '') => {
  currentDomoList = '/getSpots';
};

const loadPublicSpots = (name = '', location = '', description = '') => {
  currentDomoList = `/getSpots?location=${location}&name=${name}&description=${description}`;
};

const makePublicSpotsURL = (name = '', location = '', description = '') => {
  return `/getSpots?location=${location}&name=${name}&description=${description}`;
};

const handleDomo = (e) => {
  e.preventDefault();

  $("#domoMessage").animate({width:'hide'},350);

  // if($("domoName").val() == '' || $('#domoAge').val() == '' || $("domoFavFood").val()) {
  //   handleError('RAWR! All fields are required');
  //   return false;
  // }

  sendAjax('POST', $("#spotForm").attr("action"), $("#spotForm").serialize(), function() {
    loadDomosFromServer($('#sortSelector').val());
  });

  return false;
};

const handleViewMenu = (e) => {
  e.preventDefault();
  if (e.target.dataset.menuitem === "profile") {
    loadDomosFromServer();
  } else if (e.target.dataset.menuitem === "public") {
    loadPublicSpots();
    console.log("PUBLIC");
  } 
}

const sortSelect = (name, loc, desc) => {
  loadDomosFromServer(e.target.value);
};

const SpotForm = (props) => {
  return(
    <form id="spotForm"
    onSubmit={handleDomo}
    name="spotForm"
    action="/maker"
    method="POST"
    className="spotForm">
      <label htmlFor="name">Name: </label>
      <input id="spotName" type="text" name="name" placeholder="Domo Name" />
      <label htmlFor="longitude">Longitude: </label> 
      <input id="spotLong" type="text" name="longitude" placeholder="Longitude:" />
      <label htmlFor="latitude">Latitude: </label> 
      <input id="spotLat" type="text" name="latitude" placeholder="Latitude:" />

      <label htmlFor="description" id="domoFoodLabel">Description: </label> 
      <input id="spotDescription" type="text" name="description" placeholder="description" />
      <input type="hidden" name="_csrf" value={props.csrf} />
      <input className="addSpotSubmit" type="submit" value="Make Domo" />
    </form>
  );
};

const openSpotView = (e) => {
  console.log(e);
  $('#reviewFormSpotID').val(e);
}

class SkateSpotList extends React.Component {
  constructor(props) {
    super(props);
    this.updatePublicView = this.updatePublicView.bind(this);
  }

  componentDidMount() {
    sendAjax('GET', this.props.url, null, (data) => {
      this.props.onFetchSpots(data.spots);
    });
  }

  updatePublicView() {
    let toFetch = makePublicSpotsURL($('#spotName').val(), $('#spotLoc').val(), $('#spotDesc').val());
    sendAjax('GET', toFetch, null, (data) => {
      this.props.onFetchSpots(data.spots);
    });
  }

  render() {
    return (
      <div className="domoList">
        <div>
          <input id="spotName" type="text" name="name" placeholder="Spot Name" onChange={this.updatePublicView} />
          <input id="spotLoc" type="text" name="location" placeholder="Spot Location" onChange={this.updatePublicView} />
          <input id="spotDesc" type="text" name="description" placeholder="Spot Description" onChange={this.updatePublicView} />
        </div>
        <SkateSpotDisplay selectFunc={this.props.selectFunc} spots={this.props.spots}/>
      </div>
    );
  }
};

const SkateSpotMapIcon = ({text}) => {
  return(
    <div class="mapMarker">{text}</div>
  );
}

const SkateSpotDisplay = function(props) {
  return(
    <div>
    {props.spots.map(function(spot) {
      return (
        <div key={spot._id} className="skatespot" onClick={() => props.selectFunc(spot)}>
          <h3 className="spotName">Name: {spot.name} </h3>
          <h3 className="spotAge">Location: {spot.location[0]} </h3>
          <h3 className="spotDescription">Description: {spot.description} </h3>
        </div>
      );
    })}
    </div>
  );
}

const ViewMenu = function(props) {
  return(
    <div id="viewMenu">
      <a href="#" data-menuitem="profile" onClick={handleViewMenu}>Your Skate Spots</a>
      <br />
      <a href="#" data-menuitem="public" onClick={handleViewMenu}>Public Skate Spots</a>
    </div>
  );
}

const SpotInfoBox = ({spot, csrf}) => {
  return(
    <div>
      <h2>{spot.name}</h2>
      <div>{spot.description}</div>
      <ReviewList spotId={spot._id} csrf={csrf} />
    </div>
  );
}

class NewAppRoot extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      center: {lat: 59.95, lng: 30.33},
      zoom: 11,
      sidebarState: 0, // 0 = Spots List, 1 = Spot Detail View, 2 = Make Spot Form, 3 = Profile menu
      currentSpot: {}, // data of spot we last selcted
      spots: [], // New main spot list, have skatespotlist send state to this
    };
  }

  setSidebarState(state) {
    this.setState({sidebarState: state});
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
        <div style={{ height: '90%', width: '30%', float:'left' }}>
          {this.state.sidebarState == 0 && 
            <div>
              <div onClick={() => this.setSidebarState(2)}>Add New Skatespot</div>
              <SkateSpotList spots={this.state.spots} url={currentDomoList} 
              selectFunc={this.setSidebarInfo.bind(this)} onFetchSpots={this.onFetchSpots.bind(this)}/>
            </div>
          }
          {this.state.sidebarState == 1 && 
            <div>
              <div onClick={() => this.setSidebarState(0)}>Back</div>
              <SpotInfoBox spot={this.state.currentSpot} csrf={this.props.csrf}/>
            </div>
          }
          {this.state.sidebarState == 2 && 
            <div>
              <div onClick={() => this.setSidebarState(0)}>Back</div>
              <SpotForm csrf={this.props.csrf} />
            </div>
          }
          {this.state.sidebarState == 3 && 
            <div>
              <div onClick={() => this.setSidebarState(0)}>Back</div>
              <AccountMenu csrf={this.props.csrf} />
            </div>
          }
        </div>
        <div style={{ height: '90%', width: '70%', float:'right' }}>
          <GoogleMapReact
            bootstrapURLKeys={{ key: 'AIzaSyCLrWfeNtdjy7sTf9YKsqYn5ZUqYVbjhWo' }}
            center={this.state.center}
            zoom={this.state.zoom}
          >
            {
              this.state.spots.map(function(spot) {
                console.log(spot);
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
    <NewAppRoot csrf={csrf} />, document.querySelector("#main")
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