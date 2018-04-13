'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var SpotForm = function (_React$Component) {
  _inherits(SpotForm, _React$Component);

  function SpotForm(props) {
    _classCallCheck(this, SpotForm);

    var _this = _possibleConstructorReturn(this, (SpotForm.__proto__ || Object.getPrototypeOf(SpotForm)).call(this, props));

    _this.state = {
      errorMessage: ''
    };
    return _this;
  }

  _createClass(SpotForm, [{
    key: 'createSpot',
    value: function createSpot(e) {
      var _this2 = this;

      e.preventDefault();
      $.ajax({
        cache: false,
        type: 'POST',
        url: '/maker',
        data: $(e.target).serialize(),
        dataType: "json",
        error: function (xhr, status, error) {
          var messageObj = JSON.parse(xhr.responseText);
          this.setState({ errorMessage: messageObj.error });
        }.bind(this)
      }).done(function () {
        _this2.props.submitCallback();
      });
    }
  }, {
    key: 'render',
    value: function render() {
      return React.createElement(
        'div',
        null,
        React.createElement(
          'form',
          { id: 'spotForm',
            onSubmit: this.createSpot.bind(this),
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
          React.createElement('input', { type: 'hidden', name: '_csrf', value: this.props.csrf }),
          React.createElement('input', { className: 'addSpotSubmit', type: 'submit', value: 'Add New Spot' })
        ),
        React.createElement(
          'div',
          null,
          this.state.errorMessage
        )
      );
    }
  }]);

  return SpotForm;
}(React.Component);

;
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var defaultURL = '/getSpots';

var makePublicSpotsURL = function makePublicSpotsURL() {
  var name = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
  var location = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
  var description = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '';

  return '/getSpots?location=' + location + '&name=' + name + '&description=' + description;
};

var SkateSpotList = function SkateSpotList(props) {
  return React.createElement(
    'div',
    null,
    React.createElement(
      'div',
      null,
      React.createElement('input', { id: 'spotName', type: 'text', name: 'name', placeholder: 'Spot Name', onChange: props.updatePublicView }),
      React.createElement('input', { id: 'spotLoc', type: 'text', name: 'location', placeholder: 'Spot Location', onChange: props.updatePublicView }),
      React.createElement('input', { id: 'spotDesc', type: 'text', name: 'description', placeholder: 'Spot Description', onChange: props.updatePublicView })
    ),
    React.createElement(AddSkateSpotListItem, { csrf: props.csrf, submitCallback: props.updatePublicView }),
    React.createElement(SkateSpotDisplay, { selectFunc: props.selectFunc, spots: props.spots })
  );
};

var SkateSpotMapIcon = function SkateSpotMapIcon(_ref) {
  var text = _ref.text;

  return React.createElement(
    'div',
    { className: 'mapMarker' },
    text
  );
};

var SkateSpotDisplay = function SkateSpotDisplay(props) {
  return React.createElement(
    'div',
    { style: { height: '90%', overflowY: 'scroll' } },
    props.spots.map(function (spot) {
      return React.createElement(
        'div',
        { key: spot._id, className: 'skatespot_list', onClick: function onClick() {
            return props.selectFunc(spot);
          } },
        React.createElement(
          'h3',
          { className: 'spotName' },
          spot.name
        ),
        React.createElement(
          'div',
          { className: 'spotDescription' },
          spot.description
        )
      );
    })
  );
};

var AddSkateSpotListItem = function (_React$Component) {
  _inherits(AddSkateSpotListItem, _React$Component);

  function AddSkateSpotListItem(props) {
    _classCallCheck(this, AddSkateSpotListItem);

    var _this = _possibleConstructorReturn(this, (AddSkateSpotListItem.__proto__ || Object.getPrototypeOf(AddSkateSpotListItem)).call(this, props));

    _this.state = {
      showForm: false
    };
    _this.onSubmit = _this.onSubmit.bind(_this);
    return _this;
  }

  _createClass(AddSkateSpotListItem, [{
    key: 'onSubmit',
    value: function onSubmit() {
      this.setState({ showForm: false });
      this.props.submitCallback();
    }
  }, {
    key: 'render',
    value: function render() {
      var _this2 = this;

      return React.createElement(
        'div',
        { className: 'skatespot_list add-review' },
        React.createElement(
          'h3',
          { className: 'spotName',
            onClick: function onClick() {
              return _this2.setState({ showForm: !_this2.state.showForm });
            } },
          this.state.showForm ? '- Add Skatespot' : '+ Add Skatespot'
        ),
        this.state.showForm === true && React.createElement(SpotForm, { csrf: this.props.csrf, submitCallback: this.onSubmit })
      );
    }
  }]);

  return AddSkateSpotListItem;
}(React.Component);

var SpotInfoBox = function SpotInfoBox(_ref2) {
  var spot = _ref2.spot,
      csrf = _ref2.csrf;

  return React.createElement(
    'div',
    { className: 'spot_infobox' },
    React.createElement(
      'h3',
      { className: 'spotName' },
      spot.name
    ),
    React.createElement(
      'div',
      { className: 'spotDescription' },
      spot.description
    ),
    React.createElement(ReviewList, { spotId: spot._id, csrf: csrf })
  );
};

var SkatespotRoot = function (_React$Component2) {
  _inherits(SkatespotRoot, _React$Component2);

  function SkatespotRoot(props) {
    _classCallCheck(this, SkatespotRoot);

    var _this3 = _possibleConstructorReturn(this, (SkatespotRoot.__proto__ || Object.getPrototypeOf(SkatespotRoot)).call(this, props));

    _this3.state = {
      center: { lat: 59.95, lng: 30.33 },
      zoom: 17,
      sidebarState: 0, // 0 = Spots List, 1 = Spot Detail View, 3 = Profile menu
      currentSpot: {}, // data of spot we last selcted
      spots: [] // New main spot list, have skatespotlist send state to this
    };
    _this3.onFetchSpots = _this3.onFetchSpots.bind(_this3);
    _this3.setSidebarState = _this3.setSidebarState.bind(_this3);
    return _this3;
  }

  _createClass(SkatespotRoot, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      var _this4 = this;

      sendAjax('GET', '/getSpots', null, function (data) {
        console.log("fetching ajax spots");
        _this4.onFetchSpots(data.spots);
      });
    }
  }, {
    key: 'updatePublicView',
    value: function updatePublicView() {
      var _this5 = this;

      var toFetch = makePublicSpotsURL($('#spotName').val(), $('#spotLoc').val(), $('#spotDesc').val());
      sendAjax('GET', toFetch, null, function (data) {
        console.log("fetching ajax spots");
        _this5.onFetchSpots(data.spots);
      });
    }
  }, {
    key: 'setSidebarState',
    value: function setSidebarState(state) {
      this.setState({ sidebarState: state });
      if (this.state.sidebarState === 0) {
        this.updatePublicView();
      }
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
      var _this6 = this;

      return React.createElement(
        'div',
        null,
        React.createElement(
          'nav',
          null,
          React.createElement(
            'a',
            { href: '#', onClick: function onClick() {
                return _this6.setSidebarState(3);
              } },
            'Profile'
          ),
          React.createElement(
            'div',
            { className: 'navlink' },
            React.createElement(
              'a',
              { href: '/logout' },
              'Log out'
            )
          )
        ),
        React.createElement(
          'div',
          { style: { height: '100%', width: '30%', float: 'left' } },
          this.state.sidebarState == 0 && React.createElement(SkateSpotList, {
            spots: this.state.spots,
            csrf: this.props.csrf,
            url: defaultURL,
            selectFunc: this.setSidebarInfo.bind(this),
            onFetchSpots: this.onFetchSpots.bind(this),
            updatePublicView: this.updatePublicView.bind(this)
          }),
          this.state.sidebarState == 1 && React.createElement(
            'div',
            null,
            React.createElement(
              'div',
              { onClick: function onClick() {
                  return _this6.setSidebarState(0);
                } },
              'Back'
            ),
            React.createElement(SpotInfoBox, { spot: this.state.currentSpot, csrf: this.props.csrf })
          ),
          this.state.sidebarState == 3 && React.createElement(
            'div',
            null,
            React.createElement(
              'div',
              { onClick: function onClick() {
                  return _this6.setSidebarState(0);
                } },
              'Back'
            ),
            React.createElement(AccountMenu, { csrf: this.props.csrf })
          )
        ),
        React.createElement(
          'div',
          { style: { height: '100%', width: '70%', float: 'right' } },
          React.createElement(
            GoogleMapReact,
            {
              bootstrapURLKeys: { key: 'AIzaSyCLrWfeNtdjy7sTf9YKsqYn5ZUqYVbjhWo' },
              center: this.state.center,
              zoom: this.state.zoom
            },
            this.state.spots.map(function (spot) {
              return React.createElement(SkateSpotMapIcon, { text: spot.name, lat: spot.location[1], lng: spot.location[0] });
            })
          )
        )
      );
    }
  }]);

  return SkatespotRoot;
}(React.Component);

var setup = function setup(csrf) {
  ReactDOM.render(React.createElement(SkatespotRoot, { csrf: csrf }), document.querySelector("#main"));
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
        React.createElement("input", { id: "pass2", type: "password", name: "pass2", placeholder: "New Password (Re-Enter)" }),
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
      React.createElement(
        "div",
        { className: "review-text" },
        "Rating: ",
        React.createElement("input", { type: "number", placeholder: "3", step: "0.5", min: "1", max: "5", size: "1", name: "rating" })
      ),
      React.createElement(
        "div",
        { className: "review-text" },
        "Review Text:",
        React.createElement("br", null),
        React.createElement("input", { type: "text", name: "reviewText" })
      ),
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
      reviews: [],
      errorMsg: '',
      showReviewForm: false
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
        error: function (xhr, status, error) {
          var messageObj = JSON.parse(xhr.responseText);
          this.setState({ errorMsg: messageObj.error });
        }.bind(this)
      }).done(function () {
        _this3.updateReviews(_this3.props.spotId);
      });
    }
  }, {
    key: "toggleReviewForm",
    value: function toggleReviewForm() {
      this.setState({ showReviewForm: !this.state.showReviewForm });
    }
  }, {
    key: "render",
    value: function render() {
      var addReviewClasses = 'review-item add-review';
      if (this.state.showReviewForm) {
        addReviewClasses = addReviewClasses + " review-item-open";
      }
      return React.createElement(
        "div",
        { className: "review_section" },
        React.createElement(
          "span",
          null,
          this.state.errorMsg
        ),
        React.createElement(
          "h3",
          { className: "reviews-header" },
          "Reviews:"
        ),
        React.createElement(
          "div",
          { className: addReviewClasses },
          React.createElement(
            "div",
            { className: "review-author", onClick: this.toggleReviewForm.bind(this) },
            this.state.showReviewForm ? '- Add Review' : '+ Add Review'
          ),
          this.state.showReviewForm === true && React.createElement(ReviewForm, { spotId: this.props.spotId, csrf: this.props.csrf, submitAction: this.submitReview.bind(this) })
        ),
        this.state.reviews.map(function (review) {
          return React.createElement(
            "div",
            { className: "review-item" },
            React.createElement(
              "div",
              { className: "review-author" },
              review.author
            ),
            React.createElement(
              "div",
              { className: "review-rating" },
              review.rating,
              " / 5"
            ),
            React.createElement(
              "div",
              { className: "review-text" },
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
