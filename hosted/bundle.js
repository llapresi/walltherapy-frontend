'use strict';

var loadDomosFromServer = function loadDomosFromServer() {
  var sort = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';

  sendAjax('GET', '/getDomos?sort=' + sort, null, function (data) {
    ReactDOM.render(React.createElement(DomoList, { domos: data.domos }), document.querySelector("#domos"));
  });
};

var handleDomo = function handleDomo(e) {
  e.preventDefault();

  $("#domoMessage").animate({ width: 'hide' }, 350);

  if ($("domoName").val() == '' || $('#domoAge').val() == '' || $("domoFavFood").val()) {
    handleError('RAWR! All fields are required');
    return false;
  }

  sendAjax('POST', $("#domoForm").attr("action"), $("#domoForm").serialize(), function () {
    loadDomosFromServer($('#sortSelector').val());
  });

  return false;
};

var sortSelect = function sortSelect(e) {
  console.log(e.target.value);
  loadDomosFromServer(e.target.value);
};

var DomoForm = function DomoForm(props) {
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
      { htmlFor: 'age' },
      'Age: '
    ),
    React.createElement('input', { id: 'domoAge', type: 'text', name: 'age', placeholder: 'Domo Age' }),
    React.createElement(
      'label',
      { htmlFor: 'favFood', id: 'domoFoodLabel' },
      'Favorite Food: '
    ),
    React.createElement('input', { id: 'domoFavFood', type: 'text', name: 'favFood', placeholder: 'Favorite Food' }),
    React.createElement('input', { type: 'hidden', name: '_csrf', value: props.csrf }),
    React.createElement('input', { className: 'makeDomoSubmit', type: 'submit', value: 'Make Domo' })
  );
};

var DomoList = function DomoList(props) {
  if (props.domos.length === 0) {
    return React.createElement(
      'div',
      { className: 'domoList' },
      React.createElement(
        'h3',
        { className: 'emptyDomo' },
        'No domos yet'
      )
    );
  }

  var domoNodes = props.domos.map(function (domo) {
    return React.createElement(
      'div',
      { key: domo._id, className: 'domo' },
      React.createElement('img', { src: '/assets/img/domoface.jpeg', alt: 'domo face', className: 'domoFace' }),
      React.createElement(
        'h3',
        { className: 'domoName' },
        'Name: ',
        domo.name,
        ' '
      ),
      React.createElement(
        'h3',
        { className: 'domoAge' },
        'Age: ',
        domo.age,
        ' '
      ),
      React.createElement(
        'h3',
        { className: 'domoFavFood' },
        'Favorite Food: ',
        domo.favFood,
        ' '
      )
    );
  });

  return React.createElement(
    'div',
    { className: 'domoList' },
    React.createElement(
      'select',
      { id: 'sortSelector', onChange: sortSelect },
      React.createElement(
        'option',
        { value: 'dateAscending' },
        'Most Recent (Ascending)'
      ),
      React.createElement(
        'option',
        { value: 'dateDescending' },
        'Most Recent (Desending)'
      ),
      React.createElement(
        'option',
        { value: 'nameAscending' },
        'Name (A-Z)'
      ),
      React.createElement(
        'option',
        { value: 'nameDescending' },
        'Name (Z-A)'
      ),
      React.createElement(
        'option',
        { value: 'foodAscending' },
        'Favorite Food (A-Z)'
      ),
      React.createElement(
        'option',
        { value: 'foodDescending' },
        'Favorite Food (Z-A)'
      ),
      React.createElement(
        'option',
        { value: 'ageAscending' },
        'Age (Ascending)'
      ),
      React.createElement(
        'option',
        { value: 'ageDescending' },
        'Age (Desending)'
      )
    ),
    domoNodes
  );
};

var setup = function setup(csrf) {
  ReactDOM.render(React.createElement(DomoForm, { csrf: csrf }), document.querySelector("#makeDomo"));

  ReactDOM.render(React.createElement(DomoList, { domos: [] }), document.querySelector("#domos"));

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
