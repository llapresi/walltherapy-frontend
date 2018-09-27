import React from 'react';
import { Button } from '@rmwc/button';
import { TextField } from '@rmwc/textfield';
import { Typography } from '@rmwc/typography';
import PropTypes from 'prop-types';

class ChangePasswordForm extends React.Component {
  constructor(props) {
    super(props);
    this.submitRequest = this.submitRequest.bind(this);
  }

  submitRequest(e) {
    const { passwordCallback } = this.props;
    e.preventDefault();
    $.ajax({
      cache: false,
      type: 'POST',
      url: '/changePassword',
      data: $('#passwordForm').serialize(),
      dataType: 'json',
      error: (xhr) => {
        passwordCallback(xhr.responseText);
      },
    }).done(() => {
      passwordCallback('Password Changed Successfully');
    });
  }

  render() {
    const { csrf } = this.props;
    return (
      <form
        id="passwordForm"
        name="passwordForm"
        action="/changePassword"
        method="POST"
        onSubmit={this.submitRequest}
        className="spot_infobox"
      >
        <h2><Typography use="display2">Change Password</Typography></h2>
        <br />
        <TextField type="password" className="oldpass" label="Old Password" name="oldPass" />
        <br />
        <TextField type="password" className="pass" label="New Password" name="pass" />
        <br />
        <TextField type="password" className="pass2" label="New Password (Re-Enter):" name="pass2" />
        <br />

        <input type="hidden" name="_csrf" value={csrf} />
        <Button raised theme={['secondary-bg', 'text-primary-on-secondary']}>Change Password</Button>
      </form>
    );
  }
}
ChangePasswordForm.propTypes = {
  csrf: PropTypes.string.isRequired,
  passwordCallback: PropTypes.func.isRequired,
};

export default ChangePasswordForm;
