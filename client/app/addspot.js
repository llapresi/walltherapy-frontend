import React from 'react';
import { Button, ButtonIcon } from 'rmwc/Button';
import { TextField, TextFieldIcon, TextFieldHelperText } from 'rmwc/TextField';

class SpotForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      errorMessage: ''
    };
  }

  createSpot(e) {
    e.preventDefault();
    $.ajax({
      cache: false,
      type: 'POST',
      url: '/spots',
      data: $(e.target).serialize(),
      dataType: "json",
      error: function(xhr, status, error) {
        var messageObj = JSON.parse(xhr.responseText);
        this.setState({errorMessage: messageObj.error})
      }.bind(this),
    }).done(() => {
      this.props.submitCallback();
    });
  }

  render() {
    return(
      <div className="addSpotParent">
        <form id="spotForm"
        onSubmit={this.createSpot.bind(this)}
        name="spotForm"
        action="/spots"
        method="POST"
        className="spotForm">
          <TextField label="Name" name="name"/>
          <br />
          <TextField label="Description" name="description"/>
          <br />
          <Button raised>Submit</Button>
          <div>Click point on map to set new spot position</div>

          <input id="spotLong" type="hidden" name="longitude" value={this.props.loc[1]} />
          <input id="spotLat" type="hidden" name="latitude" value={this.props.loc[0]} />
          <input type="hidden" name="_csrf" value={this.props.csrf} />
        </form>
        <div>{this.state.errorMessage}</div>
      </div>
    );
  }
};

export default SpotForm;