let currentDomoList = '/getProfileSpots';

const loadDomosFromServer = (sort = '') => {
  currentDomoList = '/getProfileSpots';
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

  sendAjax('POST', $("#domoForm").attr("action"), $("#domoForm").serialize(), function() {
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
    <form id="domoForm"
    onSubmit={handleDomo}
    name="domoForm"
    action="/maker"
    method="POST"
    className="domoForm">
      <label htmlFor="name">Name: </label>
      <input id="domoName" type="text" name="name" placeholder="Domo Name" />
      <label htmlFor="location">Location: </label> 
      <input id="spotLocation" type="text" name="location" placeholder="Location" />
      <label htmlFor="description" id="domoFoodLabel">Description: </label> 
      <input id="spotDescription" type="text" name="description" placeholder="description" />
      <input type="hidden" name="_csrf" value={props.csrf} />
      <input className="makeDomoSubmit" type="submit" value="Make Domo" />
    </form>
  );
};

const openSpotView = (e) => {
  console.log(e);
  $('#reviewFormSpotID').val(e);
}

const ReviewForm = (props) => {
  return(
    <div>
      <form action="/addReview" method="POST">
        Review Text: <input type="text" name="reviewText" />
        <br />
        Rating: <input type="text" name="rating" />
        <br />
        Spot ID: <input id="reviewFormSpotID" type="text" name="spot" />
        <input type="hidden" name="_csrf" value={props.csrf} />
        <input type="submit" />
      </form>
    </div>
  );
}

class ReviewList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      reviews: []
    };
    this.updateReviews = this.updateReviews.bind(this);
  }

  updateReviews (id) {
    $.ajax({
      method: 'GET',
      url: `/getReviews?spot=${id}`
    }).done((data) => {
      this.setState({reviews: data.reviews});
    });
  }
  
  componentDidMount() {
    this.updateReviews(this.props.spotId);
  }

  componentWillReceiveProps(nextProps) {
    this.updateReviews(nextProps.spotId);
  }

  render() {
    return(
      <div>
        <h3>{this.props.spotId}</h3>
        <div>Reviews:</div>
        {this.state.reviews.map(function(review) {
          return(
            <div>
              <div>User: {review.author} | Rating:{review.rating} | Review:{review.reviewText}</div>
            </div>
          );
        })}
      </div>
    );
  }
};

class DomoList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      spots: [],
    };
    this.updatePublicView = this.updatePublicView.bind(this);
  }

  componentDidMount() {
    sendAjax('GET', this.props.url, null, (data) => {
      this.setState({spots: data.spots});
      console.log(this.state.spots);
    });
  }

  updatePublicView() {
    let toFetch = makePublicSpotsURL($('#spotName').val(), $('#spotLoc').val(), $('#spotDesc').val());
    sendAjax('GET', toFetch, null, (data) => {
      this.setState({spots: data.spots});
      console.log(this.state.spots);
    });
  }

  componentWillReceiveProps(nextProps) {
    sendAjax('GET', nextProps.url, null, (data) => {
      this.setState({spots: data.spots});
      console.log(this.state.spots);
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
        <DomoListDisplay spots={this.state.spots}/>
      </div>
    );
  }
};

const DomoListDisplay = function(props) {
  return(
    <div>
    {props.spots.map(function(spot) {
      return (
        <span>
          <div key={spot._id} className="domo" onClick={() => openSpotView(spot._id)}>
            <img src="/assets/img/domoface.jpeg" alt="domo face" className="domoFace" />
            <h3 className="domoName">Name: {spot.name} </h3>
            <h3 className="domoAge">Location: {spot.location} </h3>
            <h3 className="domoFavFood">Description: {spot.description} </h3>
            <h3>{spot._id}</h3>
          </div>
          <div>
            <ReviewList spotId={spot._id} />
          </div>
        </span>
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

const setup = (csrf) => {
  ReactDOM.render(
    <SpotForm csrf={csrf} />, document.querySelector("#makeDomo")
  );

  ReactDOM.render(
    <ViewMenu />, document.querySelector("#viewMenu")
  );

  ReactDOM.render(
    <DomoList url={currentDomoList} />, document.querySelector("#domos")
  );

  ReactDOM.render(
    <ReviewForm  csrf={csrf} />, document.querySelector("#reviewForm")
  );
};

const getToken = () => {
  sendAjax("GET", "/getToken", null, (result) => {
    setup(result.csrfToken);
  });
};

$(document).ready(function() {
  getToken();
});