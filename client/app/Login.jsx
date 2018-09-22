import React from 'react';
import { TextField } from 'rmwc/TextField';
import { Button } from 'rmwc/Button';

const LoginWindow = ({ csrf }) => (
  <div className="skateSpotListParent desktop-400 horizontal__desktop">
    <div style={{ padding: '12px', display: 'flex', flexDirection: 'column' }}>
      <TextField label="Username" />
      <TextField label="Password" />
      <Button style={{ marginTop: '24px' }} raised theme="secondary-bg on-secondary">Login</Button>
    </div>
  </div>
);

export default LoginWindow;
