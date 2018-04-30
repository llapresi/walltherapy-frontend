import React from 'react';
import ReactDOM from 'react-dom';

export default class SearchBox extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="mdc-text-field mdc-text-field--box mdc-text-field--with-leading-icon gmap-searchbox">
        <i className="material-icons mdc-text-field__icon" tabIndex="0" role="button">search</i>
        <input type="text" ref="input" className="mdc-text-field__input mapsearch__input" placeholder="Search map" />
        <div className="mdc-text-field__bottom-line"></div>
      </div>
    );
  }

  onPlacesChanged() {
    let searchLocation = this.searchBox.getPlaces()[0].geometry.location;
    this.props.searchCallback({lat: searchLocation.lat(), lng: searchLocation.lng()});
  }
  componentDidMount() {
    var input = ReactDOM.findDOMNode(this.refs.input);
    this.searchBox = new google.maps.places.SearchBox(input);
    this.searchBox.addListener('places_changed', this.onPlacesChanged.bind(this));
  }
  componentWillUnmount() {
    // https://developers.google.com/maps/documentation/javascript/events#removing
    google.maps.event.clearInstanceListeners(this.searchBox);
  }
}