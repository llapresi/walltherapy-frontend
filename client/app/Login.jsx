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
  }

  componentDidMount() {
    setTimeout(() => {
      this.setState({ dialogOpen: true });
    }, 50);
  }

  onDialogClose() {
    this.setState({ dialogOpen: false }, () => {
      history.push('/', { state: NoTransition });
    });
  }

  submitLogin() {
    const username = this.usernameRef.current.value;
    const password = this.passwordRef.current.value;
    console.log(`${username}, ${password}`);
  }

  render() {
    const { csrf } = this.props;
    const { dialogOpen } = this.state;
    return (
      // <Dialog
      //   title="Login"
      //   open={dialogOpen}
      //   onClose={this.onDialogClose}
      //   onAccept={this.submitLogin}
      //   onCancel={this.onDialogClose}
      // >
      //   <div style={{ padding: '12px', display: 'flex', flexDirection: 'column' }}>
      //     <TextField ref={this.usernameRef} label="Username" />
      //     <TextField type="password" ref={this.passwordRef} label="Password" />
      //   </div>
      // </Dialog>
      <Dialog
        open={dialogOpen}
        onClose={this.onDialogClose}
        onAccept={this.submitLogin}
        onCancel={this.onDialogClose}
      >
        <DialogSurface>
          <DialogHeader>
            <DialogHeaderTitle>Login</DialogHeaderTitle>
          </DialogHeader>
          <DialogBody>
            <div style={{ padding: '12px', display: 'flex', flexDirection: 'column' }}>
              <TextField ref={this.usernameRef} label="Username" />
              <TextField type="password" ref={this.passwordRef} label="Password" />
            </div>
          </DialogBody>
          <DialogFooter>
            <DialogFooterButton cancel>Cancel</DialogFooterButton>
            <DialogFooterButton>Sign Up</DialogFooterButton>
            <DialogFooterButton accept>Login</DialogFooterButton>
          </DialogFooter>
        </DialogSurface>
        <DialogBackdrop />
      </Dialog>
    );
  }
}

export default LoginWindow;
