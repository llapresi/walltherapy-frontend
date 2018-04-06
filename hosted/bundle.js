'use strict';

var loadDomosFromServer = function loadDomosFromServer() {
  var sort = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';

  sendAjax('GET', '/getProfileSpots', null, function (data) {
    ReactDOM.render(React.createElement(DomoList, { spots: data.spots }), document.querySelector("#domos"));
  });
};

var loadPublicSpots = function loadPublicSpots() {
  var name = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
  var location = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
  var description = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '';

  sendAjax('GET', '/getSpots?location=' + location + '&name=' + name + '&description=' + description, null, function (data) {
    ReactDOM.render(React.createElement(DomoList, { spots: data.spots, renderLocationInput: true }), document.querySelector("#domos"));
  });
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

var DomoList = function DomoList(props) {
  // if(props.spots.length === 0) {
  //   return(
  //     <div className="domoList">
  //       <h3 className="emptyDomo">No domos yet</h3>
  //     </div>
  //   );
  // }

  var domoNodes = props.spots.map(function (spot) {
    return React.createElement(
      'div',
      { key: spot._id, className: 'domo' },
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
      )
    );
  });

  var updatePublicView = function updatePublicView() {
    loadPublicSpots($('#spotName').val(), $('#spotLoc').val(), $('#spotDesc').val());
  };

  return React.createElement(
    'div',
    { className: 'domoList' },
    props.renderLocationInput && React.createElement(
      'div',
      null,
      React.createElement('input', { id: 'spotName', type: 'text', name: 'name', placeholder: 'Spot Name', onChange: updatePublicView }),
      React.createElement('input', { id: 'spotLoc', type: 'text', name: 'location', placeholder: 'Spot Location', onChange: updatePublicView }),
      React.createElement('input', { id: 'spotDesc', type: 'text', name: 'description', placeholder: 'Spot Description', onChange: updatePublicView })
    ),
    domoNodes
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

  ReactDOM.render(React.createElement(DomoList, { spots: [], renderLocationInput: true }), document.querySelector("#domos"));

  loadDomosFromServer();
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
