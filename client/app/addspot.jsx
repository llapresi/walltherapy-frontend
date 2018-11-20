import React from 'react';
import { Button } from '@rmwc/button';
import { TextField } from '@rmwc/textfield';
import { Snackbar } from '@rmwc/snackbar';
import PropTypes from 'prop-types';
import history from './History';
import AddSpotBottomSheet from './Widgets/AddSpotBottomSheet';

class SpotForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      errorMessage: '',
      errorSnackbar: false,
      spotAdded: false,
      newSpotLocation: {},
      spotHasBeenSet: false,
    };
    this.setSpotLocation = this.setSpotLocation.bind(this);
  }

  componentWillUnmount() {
    const { submitCallback } = this.props;
    const { spotAdded } = this.state;
    if (spotAdded === true) {
      submitCallback();
    }
  }

  setSpotLocation() {
    const { loc, setSpotCallback } = this.props;
    this.setState({ spotHasBeenSet: true, newSpotLocation: loc });
    setSpotCallback(loc);
  }

  createSpot(e) {
    e.preventDefault();
    $.ajax({
      cache: false,
      type: 'POST',
      url: '/spots',
      data: $(e.target).serialize(),
      dataType: 'json',
      error: (xhr) => {
        const messageObj = JSON.parse(xhr.responseText);
        this.setState({ errorSnackbar: true, errorMessage: messageObj.error });
        console.log(`Review Error: ${messageObj}`);
      },
    }).done(() => {
      this.setState({ spotAdded: true }, () => {
        history.push('/');
      });
    });
  }

  render() {
    const { csrf } = this.props;
    const {
      errorSnackbar, errorMessage, spotHasBeenSet, newSpotLocation,
    } = this.state;
    let styleClasses = 'AddSpotBox';
    if (spotHasBeenSet) {
      styleClasses = `${styleClasses} extended horizontal__desktop desktop-400`;
    }
    return (
      <div className={styleClasses}>
        {spotHasBeenSet === false
        && <AddSpotBottomSheet callback={this.setSpotLocation} />
        }
        {spotHasBeenSet === true && (
        <form
          id="spotForm"
          onSubmit={this.createSpot.bind(this)}
          name="spotForm"
          action="/spots"
          method="POST"
          className="spotForm"
        >
          <TextField className="spot_artist" label="Spot Artist" name="artist" />
          <br />
          <TextField className="spot_name" label="Spot Name" name="name" />
          <br />
          <TextField textarea fullwidth label="Spot Description" rows="4" name="description" />
          <br />
          <Button raised theme={['secondary-bg', 'text-primary-on-secondary']}>Submit</Button>

          <input id="spotLong" type="hidden" name="longitude" value={newSpotLocation.lng} />
          <input id="spotLat" type="hidden" name="latitude" value={newSpotLocation.lat} />
          <input type="hidden" name="_csrf" value={csrf} />
        </form>
        )
        }
        <Snackbar
          show={errorSnackbar}
          onHide={() => this.setState({ errorSnackbar: false })}
          message={errorMessage}
          actionText="Close"
        />
      </div>
    );
  }
}
SpotForm.propTypes = {
  csrf: PropTypes.string.isRequired,
  loc: PropTypes.shape({
    lat: PropTypes.number,
    lng: PropTypes.number,
  }).isRequired,
  submitCallback: PropTypes.func.isRequired,
  setSpotCallback: PropTypes.func.isRequired,
};

export default SpotForm;
