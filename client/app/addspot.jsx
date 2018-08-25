import React from 'react';
import { Button } from 'rmwc/Button';
import { TextField } from 'rmwc/TextField';
import { Typography } from 'rmwc/Typography';
import { Checkbox } from 'rmwc/Checkbox';
import { Snackbar } from 'rmwc/Snackbar';
import { Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';


class SpotForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      errorMessage: '',
      errorSnackbar: false,
      spotAdded: false,
    };
  }

  createSpot(e) {
    const { submitCallback } = this.props;
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
      },
    }).done(() => {
      submitCallback();
      this.setState({ spotAdded: true });
    });
  }

  render() {
    const { loc, csrf } = this.props;
    const { errorSnackbar, errorMessage, spotAdded } = this.state;
    return (
      <div className="spot_infobox">
        <form
          id="spotForm"
          onSubmit={this.createSpot.bind(this)}
          name="spotForm"
          action="/spots"
          method="POST"
          className="spotForm"
        >
          <Typography use="subheading2">Drag map to new spot position</Typography>
          <TextField className="spot_name" label="Spot Name" name="name" />
          <br />
          <TextField textarea fullwidth label="Spot Description" rows="4" name="description" />
          <Checkbox name="isSponsored">Sponsored Post</Checkbox>
          <br />
          <div>
            <Typography use="caption">
            Increase your visibility with a Sponsored Post.
            Sponsored Posts always show at the top of search listings, ensuring
            &ldquo;premium placement for a premium&trade;&rdquo;
            </Typography>
          </div>
          <br />
          <Button raised theme={['secondary-bg', 'text-primary-on-secondary']}>Submit</Button>

          <input id="spotLong" type="hidden" name="longitude" value={loc.lng} />
          <input id="spotLat" type="hidden" name="latitude" value={loc.lat} />
          <input type="hidden" name="_csrf" value={csrf} />
        </form>
        <Snackbar
          show={errorSnackbar}
          onHide={() => this.setState({ errorSnackbar: false })}
          message={errorMessage}
          actionText="Close"
          actionHandler={() => {}}
        />

        {spotAdded === true
        && <Redirect to="/" />
        }
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
};

export default SpotForm;
