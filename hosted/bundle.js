'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var currentDomoList = '/getProfileSpots';

var loadDomosFromServer = function loadDomosFromServer() {
  var sort = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';

  currentDomoList = '/getProfileSpots';
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

  sendAjax('POST', $("#domoForm").attr("action"), $("#domoForm").serialize(), function () {
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
    { id: 'domoForm',
      onSubmit: handleDomo,
      name: 'domoForm',
      action: '/maker',
      method: 'POST',
      className: 'domoForm' },
    React.createElement(
      'label',
      { htmlFor: 'name' },
      'Name: '
    ),
    React.createElement('input', { id: 'domoName', type: 'text', name: 'name', placeholder: 'Domo Name' }),
    React.createElement(
      'label',
      { htmlFor: 'location' },
      'Location: '
    ),
    React.createElement('input', { id: 'spotLocation', type: 'text', name: 'location', placeholder: 'Location' }),
    React.createElement(
      'label',
      { htmlFor: 'description', id: 'domoFoodLabel' },
      'Description: '
    ),
    React.createElement('input', { id: 'spotDescription', type: 'text', name: 'description', placeholder: 'description' }),
    React.createElement('input', { type: 'hidden', name: '_csrf', value: props.csrf }),
    React.createElement('input', { className: 'makeDomoSubmit', type: 'submit', value: 'Make Domo' })
  );
};

var openSpotView = function openSpotView(e) {
  console.log(e);
  $('#reviewFormSpotID').val(e);
};

var ReviewForm = function ReviewForm(props) {
  return React.createElement(
    'div',
    null,
    React.createElement(
      'form',
      { action: '/addReview', method: 'POST' },
      'Review Text: ',
      React.createElement('input', { type: 'text', name: 'reviewText' }),
      React.createElement('br', null),
      'Rating: ',
      React.createElement('input', { type: 'text', name: 'rating' }),
      React.createElement('br', null),
      'Spot ID: ',
      React.createElement('input', { id: 'reviewFormSpotID', type: 'text', name: 'spot' }),
      React.createElement('input', { type: 'hidden', name: '_csrf', value: props.csrf }),
      React.createElement('input', { type: 'submit' })
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
    return _this;
  }

  _createClass(ReviewList, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      var _this2 = this;

      $.ajax({
        method: 'GET',
        url: '/getReviews?spot=' + this.props.spot._id
      }).done(function (data) {
        _this2.setState({ reviews: data.reviews });
      });
    }
  }, {
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      var _this3 = this;

      $.ajax({
        method: 'GET',
        url: '/getReviews?spot=' + nextProps.spot._id
      }).done(function (data) {
        _this3.setState({ reviews: data.reviews });
      });
    }
  }, {
    key: 'render',
    value: function render() {
      return React.createElement(
        'div',
        null,
        React.createElement(
          'h3',
          null,
          this.props.spot._id
        ),
        React.createElement(
          'div',
          null,
          'Reviews:'
        ),
        this.state.reviews.map(function (review) {
          return React.createElement(
            'div',
            null,
            React.createElement(
              'div',
              null,
              'User: ',
              review.author,
              ' | Rating:',
              review.rating,
              ' | Review:',
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

var DomoList = function (_React$Component2) {
  _inherits(DomoList, _React$Component2);

  function DomoList(props) {
    _classCallCheck(this, DomoList);

    var _this4 = _possibleConstructorReturn(this, (DomoList.__proto__ || Object.getPrototypeOf(DomoList)).call(this, props));

    _this4.state = {
      spots: []
    };
    _this4.updatePublicView = _this4.updatePublicView.bind(_this4);
    return _this4;
  }

  _createClass(DomoList, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      var _this5 = this;

      sendAjax('GET', this.props.url, null, function (data) {
        _this5.setState({ spots: data.spots });
        console.log(_this5.state.spots);
      });
    }
  }, {
    key: 'updatePublicView',
    value: function updatePublicView() {
      var _this6 = this;

      var toFetch = makePublicSpotsURL($('#spotName').val(), $('#spotLoc').val(), $('#spotDesc').val());
      sendAjax('GET', toFetch, null, function (data) {
        _this6.setState({ spots: data.spots });
        console.log(_this6.state.spots);
      });
    }
  }, {
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      var _this7 = this;

      sendAjax('GET', nextProps.url, null, function (data) {
        _this7.setState({ spots: data.spots });
        console.log(_this7.state.spots);
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
        React.createElement(DomoListDisplay, { spots: this.state.spots })
      );
    }
  }]);

  return DomoList;
}(React.Component);

;

var DomoListDisplay = function DomoListDisplay(props) {
  return React.createElement(
    'div',
    null,
    props.spots.map(function (spot) {
      return React.createElement(
        'span',
        null,
        React.createElement(
          'div',
          { key: spot._id, className: 'domo', onClick: function onClick() {
              return openSpotView(spot._id);
            } },
          React.createElement('img', { src: '/assets/img/domoface.jpeg', alt: 'domo face', className: 'domoFace' }),
          React.createElement(
            'h3',
            { className: 'domoName' },
            'Name: ',
            spot.name,
            ' '
          ),
          React.createElement(
            'h3',
            { className: 'domoAge' },
            'Location: ',
            spot.location,
            ' '
          ),
          React.createElement(
            'h3',
            { className: 'domoFavFood' },
            'Description: ',
            spot.description,
            ' '
          ),
          React.createElement(
            'h3',
            null,
            spot._id
          )
        ),
        React.createElement(
          'div',
          null,
          React.createElement(ReviewList, { spot: spot })
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

var setup = function setup(csrf) {
  ReactDOM.render(React.createElement(SpotForm, { csrf: csrf }), document.querySelector("#makeDomo"));

  ReactDOM.render(React.createElement(ViewMenu, null), document.querySelector("#viewMenu"));

  ReactDOM.render(React.createElement(DomoList, { url: currentDomoList }), document.querySelector("#domos"));

  ReactDOM.render(React.createElement(ReviewForm, { csrf: csrf }), document.querySelector("#reviewForm"));
};

var getToken = function getToken() {
  sendAjax("GET", "/getToken", null, function (result) {
    setup(result.csrfToken);
  });
};

$(document).ready(function () {
  getToken();
});
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
