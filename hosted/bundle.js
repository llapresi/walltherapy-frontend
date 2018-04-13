'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var currentDomoList = '/getSpots';

var loadDomosFromServer = function loadDomosFromServer() {
  var sort = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';

  currentDomoList = '/getSpots';
};

var loadPublicSpots = function loadPublicSpots() {
  var name = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
  var location = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
  var description = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '';

  currentDomoList = '/getSpots?location=' + location + '&name=' + name + '&description=' + description;
};

var makePublicSpotsURL = function makePublicSpotsURL() {
  var name = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
  var location = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
  var description = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '';

  return '/getSpots?location=' + location + '&name=' + name + '&description=' + description;
};

var handleDomo = function handleDomo(e) {
  e.preventDefault();

  $("#domoMessage").animate({ width: 'hide' }, 350);

  // if($("domoName").val() == '' || $('#domoAge').val() == '' || $("domoFavFood").val()) {
  //   handleError('RAWR! All fields are required');
  //   return false;
  // }

  sendAjax('POST', $("#spotForm").attr("action"), $("#spotForm").serialize(), function () {
    loadDomosFromServer($('#sortSelector').val());
  });

  return false;
};

var handleViewMenu = function handleViewMenu(e) {
  e.preventDefault();
  if (e.target.dataset.menuitem === "profile") {
    loadDomosFromServer();
  } else if (e.target.dataset.menuitem === "public") {
    loadPublicSpots();
    console.log("PUBLIC");
  }
};

var sortSelect = function sortSelect(name, loc, desc) {
  loadDomosFromServer(e.target.value);
};

var SpotForm = function SpotForm(props) {
  return React.createElement(
    'form',
    { id: 'spotForm',
      onSubmit: handleDomo,
      name: 'spotForm',
      action: '/maker',
      method: 'POST',
      className: 'spotForm' },
    React.createElement(
      'label',
      { htmlFor: 'name' },
      'Name: '
    ),
    React.createElement('input', { id: 'spotName', type: 'text', name: 'name', placeholder: 'Domo Name' }),
    React.createElement(
      'label',
      { htmlFor: 'longitude' },
      'Longitude: '
    ),
    React.createElement('input', { id: 'spotLong', type: 'text', name: 'longitude', placeholder: 'Longitude:' }),
    React.createElement(
      'label',
      { htmlFor: 'latitude' },
      'Latitude: '
    ),
    React.createElement('input', { id: 'spotLat', type: 'text', name: 'latitude', placeholder: 'Latitude:' }),
    React.createElement(
      'label',
      { htmlFor: 'description', id: 'domoFoodLabel' },
      'Description: '
    ),
    React.createElement('input', { id: 'spotDescription', type: 'text', name: 'description', placeholder: 'description' }),
    React.createElement('input', { type: 'hidden', name: '_csrf', value: props.csrf }),
    React.createElement('input', { className: 'addSpotSubmit', type: 'submit', value: 'Make Domo' })
  );
};

var openSpotView = function openSpotView(e) {
  console.log(e);
  $('#reviewFormSpotID').val(e);
};

var SkateSpotList = function (_React$Component) {
  _inherits(SkateSpotList, _React$Component);

  function SkateSpotList(props) {
    _classCallCheck(this, SkateSpotList);

    var _this = _possibleConstructorReturn(this, (SkateSpotList.__proto__ || Object.getPrototypeOf(SkateSpotList)).call(this, props));

    _this.updatePublicView = _this.updatePublicView.bind(_this);
    return _this;
  }

  _createClass(SkateSpotList, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      var _this2 = this;

      sendAjax('GET', this.props.url, null, function (data) {
        _this2.props.onFetchSpots(data.spots);
      });
    }
  }, {
    key: 'updatePublicView',
    value: function updatePublicView() {
      var _this3 = this;

      var toFetch = makePublicSpotsURL($('#spotName').val(), $('#spotLoc').val(), $('#spotDesc').val());
      sendAjax('GET', toFetch, null, function (data) {
        _this3.props.onFetchSpots(data.spots);
      });
    }
  }, {
    key: 'render',
    value: function render() {
      return React.createElement(
        'div',
        { className: 'domoList' },
        React.createElement(
          'div',
          null,
          React.createElement('input', { id: 'spotName', type: 'text', name: 'name', placeholder: 'Spot Name', onChange: this.updatePublicView }),
          React.createElement('input', { id: 'spotLoc', type: 'text', name: 'location', placeholder: 'Spot Location', onChange: this.updatePublicView }),
          React.createElement('input', { id: 'spotDesc', type: 'text', name: 'description', placeholder: 'Spot Description', onChange: this.updatePublicView })
        ),
        React.createElement(SkateSpotDisplay, { selectFunc: this.props.selectFunc, spots: this.props.spots })
      );
    }
  }]);

  return SkateSpotList;
}(React.Component);

;

var SkateSpotMapIcon = function SkateSpotMapIcon(_ref) {
  var text = _ref.text;

  return React.createElement(
    'div',
    { 'class': 'mapMarker' },
    text
  );
};

var SkateSpotDisplay = function SkateSpotDisplay(props) {
  return React.createElement(
    'div',
    null,
    props.spots.map(function (spot) {
      return React.createElement(
        'div',
        { key: spot._id, className: 'skatespot', onClick: function onClick() {
            return props.selectFunc(spot);
          } },
        React.createElement(
          'h3',
          { className: 'spotName' },
          'Name: ',
          spot.name,
          ' '
        ),
        React.createElement(
          'h3',
          { className: 'spotAge' },
          'Location: ',
          spot.location[0],
          ' '
        ),
        React.createElement(
          'h3',
          { className: 'spotDescription' },
          'Description: ',
          spot.description,
          ' '
        )
      );
    })
  );
};

var ViewMenu = function ViewMenu(props) {
  return React.createElement(
    'div',
    { id: 'viewMenu' },
    React.createElement(
      'a',
      { href: '#', 'data-menuitem': 'profile', onClick: handleViewMenu },
      'Your Skate Spots'
    ),
    React.createElement('br', null),
    React.createElement(
      'a',
      { href: '#', 'data-menuitem': 'public', onClick: handleViewMenu },
      'Public Skate Spots'
    )
  );
};

var SpotInfoBox = function SpotInfoBox(_ref2) {
  var spot = _ref2.spot,
      csrf = _ref2.csrf;

  return React.createElement(
    'div',
    null,
    React.createElement(
      'h2',
      null,
      spot.name
    ),
    React.createElement(
      'div',
      null,
      spot.description
    ),
    React.createElement(ReviewList, { spotId: spot._id, csrf: csrf })
  );
};

var NewAppRoot = function (_React$Component2) {
  _inherits(NewAppRoot, _React$Component2);

  function NewAppRoot(props) {
    _classCallCheck(this, NewAppRoot);

    var _this4 = _possibleConstructorReturn(this, (NewAppRoot.__proto__ || Object.getPrototypeOf(NewAppRoot)).call(this, props));

    _this4.state = {
      center: { lat: 59.95, lng: 30.33 },
      zoom: 11,
      sidebarState: 0, // 0 = Spots List, 1 = Spot Detail View, 2 = Make Spot Form, 3 = Profile menu
      currentSpot: {}, // data of spot we last selcted
      spots: [] // New main spot list, have skatespotlist send state to this
    };
    return _this4;
  }

  _createClass(NewAppRoot, [{
    key: 'setSidebarState',
    value: function setSidebarState(state) {
      this.setState({ sidebarState: state });
    }
  }, {
    key: 'setSidebarInfo',
    value: function setSidebarInfo(spot) {
      this.setState({ center: { lat: spot.location[1], lng: spot.location[0] }, sidebarState: 1, currentSpot: spot });
    }
  }, {
    key: 'onFetchSpots',
    value: function onFetchSpots(newSpots) {
      this.setState({ spots: newSpots });
    }
  }, {
    key: 'render',
    value: function render() {
      var _this5 = this;

      return React.createElement(
        'div',
        null,
        React.createElement(
          'div',
          { style: { height: '90%', width: '30%', float: 'left' } },
          this.state.sidebarState == 0 && React.createElement(
            'div',
            null,
            React.createElement(
              'div',
              { onClick: function onClick() {
                  return _this5.setSidebarState(2);
                } },
              'Add New Skatespot'
            ),
            React.createElement(SkateSpotList, { spots: this.state.spots, url: currentDomoList,
              selectFunc: this.setSidebarInfo.bind(this), onFetchSpots: this.onFetchSpots.bind(this) })
          ),
          this.state.sidebarState == 1 && React.createElement(
            'div',
            null,
            React.createElement(
              'div',
              { onClick: function onClick() {
                  return _this5.setSidebarState(0);
                } },
              'Back'
            ),
            React.createElement(SpotInfoBox, { spot: this.state.currentSpot, csrf: this.props.csrf })
          ),
          this.state.sidebarState == 2 && React.createElement(
            'div',
            null,
            React.createElement(
              'div',
              { onClick: function onClick() {
                  return _this5.setSidebarState(0);
                } },
              'Back'
            ),
            React.createElement(SpotForm, { csrf: this.props.csrf })
          ),
          this.state.sidebarState == 3 && React.createElement(
            'div',
            null,
            React.createElement(
              'div',
              { onClick: function onClick() {
                  return _this5.setSidebarState(0);
                } },
              'Back'
            ),
            React.createElement(AccountMenu, { csrf: this.props.csrf })
          )
        ),
        React.createElement(
          'div',
          { style: { height: '90%', width: '70%', float: 'right' } },
          React.createElement(
            GoogleMapReact,
            {
              bootstrapURLKeys: { key: 'AIzaSyCLrWfeNtdjy7sTf9YKsqYn5ZUqYVbjhWo' },
              center: this.state.center,
              zoom: this.state.zoom
            },
            this.state.spots.map(function (spot) {
              console.log(spot);
              return React.createElement(SkateSpotMapIcon, { text: spot.name, lat: spot.location[1], lng: spot.location[0] });
            })
          )
        )
      );
    }
  }]);

  return NewAppRoot;
}(React.Component);

var setup = function setup(csrf) {
  ReactDOM.render(React.createElement(NewAppRoot, { csrf: csrf }), document.querySelector("#main"));
};

var getToken = function getToken() {
  sendAjax("GET", "/getToken", null, function (result) {
    console.log(result.csrfToken);
    setup(result.csrfToken);
  });
};

$(document).ready(function () {
  getToken();
});
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var usernameDisplay = function usernameDisplay(_ref) {
  var name = _ref.name;

  return React.createElement(
    "div",
    null,
    React.createElement(
      "h2",
      null,
      name
    )
  );
};

var ChangePasswordForm = function (_React$Component) {
  _inherits(ChangePasswordForm, _React$Component);

  function ChangePasswordForm(props) {
    _classCallCheck(this, ChangePasswordForm);

    var _this = _possibleConstructorReturn(this, (ChangePasswordForm.__proto__ || Object.getPrototypeOf(ChangePasswordForm)).call(this, props));

    _this.submitRequest = _this.submitRequest.bind(_this);
    return _this;
  }

  _createClass(ChangePasswordForm, [{
    key: "submitRequest",
    value: function submitRequest(e) {
      var _this2 = this;

      e.preventDefault();
      sendAjax('POST', $("#passwordForm").attr("action"), $("#passwordForm").serialize(), function () {
        _this2.props.onSuccess(true);
      });
    }
  }, {
    key: "render",
    value: function render() {
      return React.createElement(
        "form",
        { id: "passwordForm",
          name: "passwordForm",
          action: "/changePassword",
          method: "POST",
          onSubmit: this.submitRequest,
          className: "spotForm" },
        React.createElement(
          "label",
          { htmlFor: "oldPass" },
          "Old Password: "
        ),
        React.createElement("input", { id: "oldPass", type: "password", name: "oldPass", placeholder: "Old Password" }),
        React.createElement(
          "label",
          { htmlFor: "oldPass" },
          "New Password: "
        ),
        React.createElement("input", { id: "pass", type: "password", name: "pass", placeholder: "New Password" }),
        React.createElement(
          "label",
          { htmlFor: "oldPass" },
          "New Password (Re-Enter): "
        ),
        React.createElement("input", { id: "pass", type: "password", name: "pass2", placeholder: "New Password (Re-Enter)" }),
        React.createElement("input", { type: "hidden", name: "_csrf", value: this.props.csrf }),
        React.createElement("input", { className: "changePassSubmit", type: "submit", value: "Change Password" })
      );
    }
  }]);

  return ChangePasswordForm;
}(React.Component);

;

var AccountMenu = function (_React$Component2) {
  _inherits(AccountMenu, _React$Component2);

  function AccountMenu(props) {
    _classCallCheck(this, AccountMenu);

    var _this3 = _possibleConstructorReturn(this, (AccountMenu.__proto__ || Object.getPrototypeOf(AccountMenu)).call(this, props));

    _this3.state = { passwordChanged: false };
    return _this3;
  }

  _createClass(AccountMenu, [{
    key: "setPasswordNotification",
    value: function setPasswordNotification(isSuccessful) {
      this.setState({ passwordChanged: isSuccessful });
    }
  }, {
    key: "render",
    value: function render() {
      console.log(this.props.csrf);
      return React.createElement(
        "div",
        null,
        this.state.passwordChanged == true && React.createElement(
          "div",
          null,
          "Password Changed Successfully!"
        ),
        React.createElement(ChangePasswordForm, { csrf: this.props.csrf, onSuccess: this.setPasswordNotification.bind(this) })
      );
    }
  }]);

  return AccountMenu;
}(React.Component);

;
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ReviewForm = function ReviewForm(props) {
  return React.createElement(
    "div",
    null,
    React.createElement(
      "form",
      { id: "reviewForm ", action: "/addReview", method: "POST", onSubmit: props.submitAction },
      "Review Text: ",
      React.createElement("input", { type: "text", name: "reviewText" }),
      React.createElement("br", null),
      "Rating: ",
      React.createElement("input", { type: "text", name: "rating" }),
      React.createElement("br", null),
      React.createElement("input", { type: "hidden", name: "_csrf", value: props.csrf }),
      React.createElement("input", { type: "hidden", id: "reviewFormSpotID", name: "spot", value: props.spotId }),
      React.createElement("input", { type: "submit" })
    )
  );
};

var ReviewList = function (_React$Component) {
  _inherits(ReviewList, _React$Component);

  function ReviewList(props) {
    _classCallCheck(this, ReviewList);

    var _this = _possibleConstructorReturn(this, (ReviewList.__proto__ || Object.getPrototypeOf(ReviewList)).call(this, props));

    _this.state = {
      reviews: []
    };
    _this.updateReviews = _this.updateReviews.bind(_this);
    return _this;
  }

  _createClass(ReviewList, [{
    key: "updateReviews",
    value: function updateReviews(id) {
      var _this2 = this;

      $.ajax({
        method: 'GET',
        url: "/getReviews?spot=" + id
      }).done(function (data) {
        _this2.setState({ reviews: data.reviews });
      });
    }
  }, {
    key: "componentDidMount",
    value: function componentDidMount() {
      this.updateReviews(this.props.spotId);
    }
  }, {
    key: "submitReview",
    value: function submitReview(e) {
      var _this3 = this;

      e.preventDefault();
      $.ajax({
        cache: false,
        type: 'POST',
        url: '/addReview',
        data: $(e.target).serialize(),
        dataType: "json",
        error: function error(xhr, status, _error) {
          var messageObj = JSON.parse(xhr.responseText);
          console.log(messageObj);
        }
      }).done(function () {
        _this3.updateReviews(_this3.props.spotId);
      });
    }
  }, {
    key: "render",
    value: function render() {
      return React.createElement(
        "div",
        null,
        React.createElement(
          "div",
          null,
          "Reviews:"
        ),
        React.createElement(ReviewForm, { spotId: this.props.spotId, csrf: this.props.csrf, submitAction: this.submitReview.bind(this) }),
        this.state.reviews.map(function (review) {
          return React.createElement(
            "div",
            null,
            React.createElement(
              "div",
              null,
              "User: ",
              review.author,
              " | Rating:",
              review.rating,
              " | Review:",
              review.reviewText
            )
          );
        })
      );
    }
  }]);

  return ReviewList;
}(React.Component);

;
"use strict";

var handleError = function handleError(message) {
  $("#errorMessage").text(message);
  $("#domoMessage").animate({ width: 'toggle' }, 350);
};

var redirect = function redirect(response) {
  $("#domoMessage").animate({ width: 'hide' }, 350);
  window.location = response.redirect;
};

var sendAjax = function sendAjax(type, action, data, success) {
  $.ajax({
    cache: false,
    type: type,
    url: action,
    data: data,
    dataType: "json",
    success: success,
    error: function error(xhr, status, _error) {
      var messageObj = JSON.parse(xhr.responseText);
      handleError(messageObj.error);
    }
  });
};
