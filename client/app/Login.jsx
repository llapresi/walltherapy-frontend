import React from 'react';
import { TextField } from 'rmwc/TextField';
import {
  Dialog,
  DialogSurface,
  DialogHeader,
  DialogHeaderTitle,
  DialogBody,
  DialogFooter,
  DialogFooterButton,
  DialogBackdrop,
} from 'rmwc/Dialog';
import PropTypes from 'prop-types';
import history from './History';
import NoTransition from './Transitions/NoTransition';

class LoginWindow extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dialogOpen: false,
    };

    this.usernameRef = React.createRef();
    this.passwordRef = React.createRef();

    this.onDialogClose = this.onDialogClose.bind(this);
    this.submitLogin = this.submitLogin.bind(this);
    this.loginThenClose = this.loginThenClose.bind(this);
  }

  componentDidMount() {
    setTimeout(() => {
      this.setState({ dialogOpen: true });
    }, 100);
  }

  onDialogClose() {
    this.setState({ dialogOpen: false }, () => {
      setTimeout(() => {
        console.log('onDialogClose going back');
        history.goBack({ state: NoTransition });
      }, 100);
    });
  }

  loginThenClose() {
    this.submitLogin(() => {
      this.setState({ dialogOpen: false }, () => {
        console.log('loginThenClose going back');
        history.goBack({ state: NoTransition });
      });
    });
  }

  submitLogin(callback) {
    const { csrf, onLogin, onError } = this.props;
    const username = this.usernameRef.current.value;
    const password = this.passwordRef.current.value;
    const seralized = `username=${username}&pass=${password}&_csrf=${csrf}`;
    // replace this Jquery with something else eventually
    $.ajax({
      cache: false,
      type: 'POST',
      url: '/login',
      data: seralized,
      dataType: 'json',
      success: () => {
        console.log('logged in I guess');
        onLogin();
        if (callback) {
          callback();
        }
      },
      error: (xhr) => {
        const messageObj = JSON.parse(xhr.responseText);
        onError(`Login Error: ${messageObj.error}`);
      },
    });
  }

  render() {
    const { csrf } = this.props;
    const { dialogOpen } = this.state;
    return (
      <Dialog
        open={dialogOpen}
        onClose={this.onDialogClose}
        onAccept={this.submitLogin}
      >
        <DialogSurface>
          <DialogHeader>
            <DialogHeaderTitle>Login</DialogHeaderTitle>
          </DialogHeader>
          <DialogBody>
            <form
              id="loginForm"
              style={{ padding: '12px', display: 'flex', flexDirection: 'column' }}
              onSubmit={(e) => {
                e.preventDefault();
                this.loginThenClose();
              }}
            >
              <TextField ref={this.usernameRef} id="user" name="username" label="Username" />
              <TextField type="password" ref={this.passwordRef} name="pass" label="Password" />
              <input type="hidden" name="_csrf" value={csrf} />
              <input type="submit" style={{ display: 'none' }} />
            </form>
          </DialogBody>
          <DialogFooter>
            <DialogFooterButton cancel>Cancel</DialogFooterButton>
            <DialogFooterButton>Sign Up</DialogFooterButton>
            <DialogFooterButton onClick={this.loginThenClose}>Login</DialogFooterButton>
          </DialogFooter>
        </DialogSurface>
        <DialogBackdrop />
      </Dialog>
    );
  }
}

LoginWindow.propTypes = {
  csrf: PropTypes.string.isRequired,
  onLogin: PropTypes.func.isRequired,
  onError: PropTypes.func.isRequired,
};

export default LoginWindow;
