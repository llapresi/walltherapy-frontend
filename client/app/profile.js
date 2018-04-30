import React from 'react';
import { Button, ButtonIcon } from 'rmwc/Button';
import { TextField, TextFieldIcon, TextFieldHelperText } from 'rmwc/TextField';
import { Typography } from 'rmwc/Typography';
import { Checkbox } from 'rmwc/Checkbox';
import { sendAjax } from '../helper/helper.js'

export class ChangePasswordForm extends React.Component {
  constructor(props) {
    super(props);
    this.submitRequest = this.submitRequest.bind(this);
  }

  submitRequest(e) {
    e.preventDefault();
    sendAjax('POST', $("#passwordForm").attr("action"), $("#passwordForm").serialize(), () => {
      this.props.onSuccess(true);
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
        <Button raised>Change Password</Button>
      </form>
    );
  }
};

export class AccountMenu extends React.Component {
  constructor(props) {
    super(props);
    this.state = { passwordChanged: false };
  }

  setPasswordNotification(isSuccessful) {
    this.setState( {passwordChanged: isSuccessful} );
  }

  render() {
    return(
      <div>
        {this.state.passwordChanged == true &&
          <div>Password Changed Successfully!</div>
        }
        <ChangePasswordForm csrf={this.props.csrf} onSuccess={this.setPasswordNotification.bind(this)} />
      </div>
    );
  }
};