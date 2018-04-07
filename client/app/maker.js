const loadDomosFromServer = (sort = '') => {
  sendAjax('GET', '/getProfileSpots', null, (data) => {
    ReactDOM.render(
      <DomoList spots={data.spots} />, document.querySelector("#domos")
    );
  });
};

const loadPublicSpots = (name = '', location = '', description = '') => {
  sendAjax('GET', `/getSpots?location=${location}&name=${name}&description=${description}`, null, (data) => {
    ReactDOM.render(
      <DomoList spots={data.spots} renderLocationInput />, document.querySelector("#domos")
    );
  });
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
  }

  componentDidMount() {
    sendAjax('GET', `/getReviews?spot=${this.props.spot}`, null, (data) => {
      this.setState({reviews: data.reviews});
    });
  }

  render() {
    return(
      <div>
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

const DomoList = function(props) {
  // if(props.spots.length === 0) {
  //   return(
  //     <div className="domoList">
  //       <h3 className="emptyDomo">No domos yet</h3>
  //     </div>
  //   );
  // }

  const domoNodes = props.spots.map(function(spot) {
    return(
      <span>
        <div key={spot._id} className="domo" onClick={() => openSpotView(spot._id)}>
          <img src="/assets/img/domoface.jpeg" alt="domo face" className="domoFace" />
          <h3 className="domoName">Name: {spot.name} </h3>
          <h3 className="domoAge">Location: {spot.location} </h3>
          <h3 className="domoFavFood">Description: {spot.description} </h3>
        </div>
        <div>
          <ReviewList spot={spot._id} />
        </div>
      </span>
    );
  });

  const updatePublicView = () => {
    loadPublicSpots($('#spotName').val(), $('#spotLoc').val(), $('#spotDesc').val());
  }

  return (
      <div className="domoList">
      {props.renderLocationInput && 
        <div>
          <input id="spotName" type="text" name="name" placeholder="Spot Name" onChange={updatePublicView} />
          <input id="spotLoc" type="text" name="location" placeholder="Spot Location" onChange={updatePublicView} />
          <input id="spotDesc" type="text" name="description" placeholder="Spot Description" onChange={updatePublicView} />
        </div>
      }
      {domoNodes}
    </div>
  );
};

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
    <DomoList spots={[]} renderLocationInput />, document.querySelector("#domos")
  );

  ReactDOM.render(
    <ReviewForm  csrf={csrf} />, document.querySelector("#reviewForm")
  );

  loadDomosFromServer();
};

const getToken = () => {
  sendAjax("GET", "/getToken", null, (result) => {
    setup(result.csrfToken);
  });
};

$(document).ready(function() {
  getToken();
});