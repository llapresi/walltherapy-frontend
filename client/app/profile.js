import React from 'react';
import ReactDOM from 'react-dom';

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
      className="skatespot_list skatespot_list-open">
        <h3 className="spotName">Change Password</h3>
        <label htmlFor="oldPass">Old Password: </label>
        <input id="oldPass" type="password" name="oldPass" placeholder="Old Password" />
        <br />

        <label htmlFor="oldPass">New Password: </label>
        <input id="pass" type="password" name="pass" placeholder="New Password" />
        <br />

        <label htmlFor="oldPass">New Password (Re-Enter): </label>
        <input id="pass2" type="password" name="pass2" placeholder="New Password (Re-Enter)" />
        <br />

        <input type="hidden" name="_csrf" value={this.props.csrf} />
        <input className="changePassSubmit" type="submit" value="Change Password" />
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