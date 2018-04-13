const usernameDisplay = ({name}) => {
  return(
    <div>
      <h2>{name}</h2>
    </div>
  )
};

class ChangePasswordForm extends React.Component {
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
      className="spotForm">
        <label htmlFor="oldPass">Old Password: </label>
        <input id="oldPass" type="password" name="oldPass" placeholder="Old Password" />

        <label htmlFor="oldPass">New Password: </label>
        <input id="pass" type="password" name="pass" placeholder="New Password" />

        <label htmlFor="oldPass">New Password (Re-Enter): </label>
        <input id="pass" type="password" name="pass2" placeholder="New Password (Re-Enter)" />

        <input type="hidden" name="_csrf" value={this.props.csrf} />
        <input className="changePassSubmit" type="submit" value="Change Password" />
      </form>
    );
  }
};

class AccountMenu extends React.Component {
  constructor(props) {
    super(props);
    this.state = { passwordChanged: false };
  }

  setPasswordNotification(isSuccessful) {
    this.setState( {passwordChanged: isSuccessful} );
  }

  render() {
    console.log(this.props.csrf);
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