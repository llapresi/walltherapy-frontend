export const handleError = (message) => {
  $("#errorMessage").text(message);
  $("#domoMessage").animate({width:'toggle'}, 350);
};

export const redirect = (response) => {
  $("#domoMessage").animate({width:'hide'},350);
  window.location = response.redirect;
};

export const sendAjax = (type, action, data, success) => {
  $.ajax({
    cache: false,
    type: type,
    url: action,
    data: data,
    dataType: "json",
    success: success,
    error: function(xhr, status, error) {
      var messageObj = JSON.parse(xhr.responseText);
      handleError(messageObj.error);
    }
  });
};

// (mean) radius of Earth (meters)
const R = 6371;
const PI_360 = Math.PI / 360;

export const distance = (a, b) => {
  const cLat = Math.cos((a.lat + b.lat) * PI_360);
  const dLat = (b.lat - a.lat) * PI_360;
  const dLng = (b.lng - a.lng) * PI_360;

  const f = dLat * dLat + cLat * cLat * dLng * dLng;
  const c = 2 * Math.atan2(Math.sqrt(f), Math.sqrt(1 - f));

  return R * c;
}