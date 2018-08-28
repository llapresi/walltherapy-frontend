import React from 'react';
import PropTypes from 'prop-types';

export default class SearchBox extends React.Component {
  componentDidMount() {
    const { google } = window;
    const input = this.inputTextbox;
    this.searchBox = new google.maps.places.SearchBox(input);
    this.searchBox.addListener('places_changed', this.onPlacesChanged.bind(this));
  }

  componentWillUnmount() {
    // https://developers.google.com/maps/documentation/javascript/events#removing
    const { google } = window;
    google.maps.event.clearInstanceListeners(this.searchBox);
  }

  onPlacesChanged() {
    const { searchCallback } = this.props;
    const searchLocation = this.searchBox.getPlaces()[0].geometry.location;
    searchCallback({ lat: searchLocation.lat(), lng: searchLocation.lng() });
  }

  render() {
    return (
      <div className="mdc-text-field mdc-text-field--box mdc-text-field--with-leading-icon gmap-searchbox mdc-elevation--z1 mdc-elevation-transition" style={{ zIndex: 1 }}>
        <i className="material-icons mdc-text-field__icon" tabIndex="0" role="button">search</i>
        <input type="text" ref={(c) => { this.inputTextbox = c; }} className="mdc-text-field__input mapsearch__input" placeholder="Search map" />
        <div className="mdc-text-field__bottom-line" />
      </div>
    );
  }
}
SearchBox.propTypes = {
  searchCallback: PropTypes.func.isRequired,
};
