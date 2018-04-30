import React from 'react';
import { Button, ButtonIcon } from 'rmwc/Button';
import { TextField, TextFieldIcon, TextFieldHelperText } from 'rmwc/TextField';
import { Typography } from 'rmwc/Typography';
import { Checkbox } from 'rmwc/Checkbox';
import { sendAjax } from '../helper/helper.js'
import { Snackbar } from 'rmwc/Snackbar';

export class ChangePasswordForm extends React.Component {
  constructor(props) {
    super(props);
    this.submitRequest = this.submitRequest.bind(this);
  }

  submitRequest(e) {
    e.preventDefault();
    $.ajax({
      cache: false,
      type: 'POST',
      url: '/changePassword',
      data: $("#passwordForm").serialize(),
      dataType: "json",
      error: function(xhr, status, error) {
        this.props.passwordCallback(xhr.responseText);
      }.bind(this),
    }).done(() => {
      this.props.passwordCallback("Password Changed Successfully");
    });
  }

  render() {
    return(
      <form id="passwordForm"
      name="passwordForm"
      action="/changePassword"
      method="POST"
      onSubmit={this.submitRequest}
      className="spot_infobox">
        <h2><Typography use="display2">Change Password</Typography></h2>
        <br />
        <TextField type='password' className="oldpass" label="Old Password" name="oldPass"/>
        <br />
        <TextField type='password' className="pass" label="New Password" name="pass"/>
        <br />
        <TextField type='password' className="pass2" label="New Password (Re-Enter):" name="pass2"/>
        <br />

        <input type="hidden" name="_csrf" value={this.props.csrf} />
        <Button raised theme={['secondary-bg', 'text-primary-on-secondary']}>Change Password</Button>
      </form>
    );
  }
};

export class AccountMenu extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showSnackbar: false,
      snackbarMsg: '',
    };
  }

  setPasswordNotification(message) {
    this.setState({showSnackbar: true, snackbarMsg: message});
  }

  render() {
    return(
      <div>
        {this.state.passwordChanged == true &&
          <div>Password Changed Successfully!</div>
        }
        <ChangePasswordForm csrf={this.props.csrf} passwordCallback={this.setPasswordNotification.bind(this)} />
        <Snackbar
          show={this.state.showSnackbar}
          onHide={evt => this.setState({showSnackbar: false})}
          message={this.state.snackbarMsg}
          actionText="Close"
          actionHandler={() => {}}
        />
      </div>
    );
  }
};