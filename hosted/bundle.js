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
          React.createElement('input', { id: 'spotName', type: 'text', name: 'name', placeholder: 'Spot Name' }),
          React.createElement('input', { id: 'spotLong', type: 'hidden', name: 'longitude', value: this.props.loc[1] }),
          React.createElement('input', { id: 'spotLat', type: 'hidden', name: 'latitude', value: this.props.loc[0] }),
          React.createElement('br', null),
          React.createElement(
            'label',
            { htmlFor: 'description', id: 'domoFoodLabel' },
            'Description: '
          ),
          React.createElement('br', null),
          React.createElement('textarea', { id: 'spotDescription', name: 'description', cols: '35', rows: '10', placeholder: 'description' }),
          React.createElement('br', null),
          React.createElement('input', { type: 'hidden', name: '_csrf', value: this.props.csrf }),
          React.createElement(
            'div',
            null,
            'Click point on map to set new spot position'
          ),
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
  var description = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';

  return '/getSpots?name=' + name + '&description=' + description;
};

var SkateSpotListParent = function SkateSpotListParent(props) {
  return React.createElement(
    'div',
    null,
    React.createElement(AddSkateSpotButton, { csrf: props.csrf, submitCallback: props.updatePublicView,
      toggleCallback: props.toggleAddSpotCallback, loc: props.newSpotLatLog }),
    React.createElement(
      'div',
      null,
      React.createElement('input', { id: 'spotName', type: 'text', name: 'name', placeholder: 'Filter by Spot Name', onChange: props.updatePublicView }),
      React.createElement('input', { id: 'spotDesc', type: 'text', name: 'description', placeholder: 'Filter by Spot Description', onChange: props.updatePublicView })
    ),
    React.createElement(SkateSpotList, { selectFunc: props.selectFunc, spots: props.spots })
  );
};

var SkateSpotMarker = function SkateSpotMarker(_ref) {
  var text = _ref.text;

  return React.createElement(
    'div',
    { className: 'mapMarker' },
    text
  );
};

var SkateSpotList = function SkateSpotList(props) {
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

var AddSkateSpotButton = function (_React$Component) {
  _inherits(AddSkateSpotButton, _React$Component);

  function AddSkateSpotButton(props) {
    _classCallCheck(this, AddSkateSpotButton);

    var _this = _possibleConstructorReturn(this, (AddSkateSpotButton.__proto__ || Object.getPrototypeOf(AddSkateSpotButton)).call(this, props));

    _this.state = {
      showForm: false
    };
    _this.onSubmit = _this.onSubmit.bind(_this);
    return _this;
  }

  _createClass(AddSkateSpotButton, [{
    key: 'onSubmit',
    value: function onSubmit() {
      this.setState({ showForm: false });
      this.props.toggleCallback(!this.state.showForm);
      this.props.submitCallback();
    }
  }, {
    key: 'toggle',
    value: function toggle() {
      this.setState({ showForm: !this.state.showForm });
      this.props.toggleCallback(this.state.showForm);
    }
  }, {
    key: 'render',
    value: function render() {
      var _this2 = this;

      var addReviewClasses = 'skatespot_list add-review';
      if (this.state.showForm) {
        addReviewClasses = addReviewClasses + ' skatespot_list-open';
      }
      return React.createElement(
        'div',
        { className: addReviewClasses },
        React.createElement(
          'h3',
          { className: 'spotName',
            onClick: function onClick() {
              return _this2.toggle();
            } },
          this.state.showForm ? '- Add Skatespot' : '+ Add Skatespot'
        ),
        this.state.showForm === true && React.createElement(SpotForm, { csrf: this.props.csrf, submitCallback: this.onSubmit, loc: this.props.loc })
      );
    }
  }]);

  return AddSkateSpotButton;
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
      center: { lat: 43.084727, lng: -77.674423 },
      zoom: 17,
      sidebarState: 0, // 0 = Spots List, 1 = Spot Detail View, 3 = Profile menu
      currentSpot: {}, // data of spot we last selcted
      spots: [], // New main spot list, have skatespotlist send state to this
      newSpotLatLog: [0.0, 0.0],
      addingNewSpot: false
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

      var toFetch = makePublicSpotsURL($('#spotName').val(), $('#spotDesc').val());
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
    key: 'setNewPointLatLong',
    value: function setNewPointLatLong(_ref3) {
      var x = _ref3.x,
          y = _ref3.y,
          lat = _ref3.lat,
          lng = _ref3.lng,
          event = _ref3.event;

      if (this.state.addingNewSpot === true) {
        this.setState({ newSpotLatLog: [lat, lng] });
      }
    }
  }, {
    key: 'render',
    value: function render() {
      var _this6 = this;

      var addingNewSpot = this.state.addingNewSpot;
      var newSpotMarker = addingNewSpot ? React.createElement(SkateSpotMarker, { text: 'New Spot', lat: this.state.newSpotLatLog[0], lng: this.state.newSpotLatLog[1] }) : React.createElement('span', null);
      return React.createElement(
        'div',
        null,
        React.createElement(
          'nav',
          { style: { height: '5%' } },
          React.createElement(
            'a',
            { href: '#', style: { float: 'left' }, onClick: function onClick() {
                return _this6.setSidebarState(3);
              },
              className: 'back-button' },
            'Profile'
          )
        ),
        React.createElement(
          'div',
          { style: { height: '94%', width: '30%', float: 'left' } },
          this.state.sidebarState == 0 && React.createElement(SkateSpotListParent, {
            spots: this.state.spots,
            csrf: this.props.csrf,
            url: defaultURL,
            selectFunc: this.setSidebarInfo.bind(this),
            onFetchSpots: this.onFetchSpots.bind(this),
            updatePublicView: this.updatePublicView.bind(this),
            toggleAddSpotCallback: function toggleAddSpotCallback(newState) {
              return _this6.setState({ addingNewSpot: !newState });
            },
            newSpotLatLog: this.state.newSpotLatLog
          }),
          this.state.sidebarState == 1 && React.createElement(
            'div',
            null,
            React.createElement(
              'div',
              { onClick: function onClick() {
                  return _this6.setSidebarState(0);
                }, className: 'back-button' },
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
                }, className: 'back-button' },
              'Back'
            ),
            React.createElement(AccountMenu, { csrf: this.props.csrf }),
            React.createElement('br', null),
            React.createElement(
              'a',
              { href: '/logout', className: 'back-button', style: { width: '300px' } },
              'Log out'
            )
          )
        ),
        React.createElement(
          'div',
          { style: { height: '95%', width: '70%', float: 'left' } },
          React.createElement(
            GoogleMapReact,
            {
              bootstrapURLKeys: { key: 'AIzaSyCLrWfeNtdjy7sTf9YKsqYn5ZUqYVbjhWo' },
              center: this.state.center,
              zoom: this.state.zoom,
              onClick: this.setNewPointLatLong.bind(this)
            },
            this.state.spots.map(function (spot) {
              return React.createElement(SkateSpotMarker, { text: spot.name, lat: spot.location[1], lng: spot.location[0] });
            }),
            newSpotMarker
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
          className: "skatespot_list skatespot_list-open" },
        React.createElement(
          "h3",
          { className: "spotName" },
          "Change Password"
        ),
        React.createElement(
          "label",
          { htmlFor: "oldPass" },
          "Old Password: "
        ),
        React.createElement("input", { id: "oldPass", type: "password", name: "oldPass", placeholder: "Old Password" }),
        React.createElement("br", null),
        React.createElement(
          "label",
          { htmlFor: "oldPass" },
          "New Password: "
        ),
        React.createElement("input", { id: "pass", type: "password", name: "pass", placeholder: "New Password" }),
        React.createElement("br", null),
        React.createElement(
          "label",
          { htmlFor: "oldPass" },
          "New Password (Re-Enter): "
        ),
        React.createElement("input", { id: "pass2", type: "password", name: "pass2", placeholder: "New Password (Re-Enter)" }),
        React.createElement("br", null),
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
      React.createElement("input", { type: "submit", value: "Add Review" })
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
          return React.createElement(ReviewListItem, {
            id: review.author,
            rating: review.rating,
            reviewText: review.reviewText });
        })
      );
    }
  }]);

  return ReviewList;
}(React.Component);

;

var ReviewListItem = function (_React$Component2) {
  _inherits(ReviewListItem, _React$Component2);

  function ReviewListItem(props) {
    _classCallCheck(this, ReviewListItem);

    var _this4 = _possibleConstructorReturn(this, (ReviewListItem.__proto__ || Object.getPrototypeOf(ReviewListItem)).call(this, props));

    _this4.state = {
      username: '(username)'
    };
    return _this4;
  }

  _createClass(ReviewListItem, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      var _this5 = this;

      $.ajax({
        method: 'GET',
        url: "/getUsernameForId?id=" + this.props.id
      }).done(function (data) {
        _this5.setState({ username: data.username });
      });
    }
  }, {
    key: "render",
    value: function render() {
      return React.createElement(
        "div",
        { className: "review-item" },
        React.createElement(
          "div",
          { className: "review-author" },
          this.state.username
        ),
        React.createElement(
          "div",
          { className: "review-rating" },
          this.props.rating,
          " / 5"
        ),
        React.createElement(
          "div",
          { className: "review-text" },
          this.props.reviewText
        )
      );
    }
  }]);

  return ReviewListItem;
}(React.Component);
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
