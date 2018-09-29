import React from 'react';
import { MenuSurface, MenuSurfaceAnchor, MenuItem } from '@rmwc/menu';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import {
  TopAppBarActionItem,
} from '@rmwc/top-app-bar';
import ReactRouterPropTypes from 'react-router-prop-types';
import NoTransition from '../Transitions/NoTransition';

class ToolbarMenuParent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showMenu: false,
    };
    this.closeMenu = this.closeMenu.bind(this);
    this.showMenu = this.showMenu.bind(this);
  }

  closeMenu() {
    this.setState({ showMenu: false });
  }

  showMenu() {
    this.setState({ showMenu: true });
  }

  render() {
    const { userAuthed, username } = this.props;
    const { showMenu } = this.state;
    let toolbarMenu = (
      <ToolbarLink to={{ pathname: '/login', state: NoTransition }}>
        <MenuItem onClick={this.closeMenu}>Log-in / Sign-up</MenuItem>
      </ToolbarLink>
    );
    if (userAuthed) {
      toolbarMenu = (
        <React.Fragment>
          <ToolbarHeader>{username}</ToolbarHeader>
          <ToolbarLink to="/profile">
            <MenuItem onClick={this.closeMenu}>Change Password</MenuItem>
          </ToolbarLink>
          <ToolbarLink to="/logout">
            <MenuItem onClick={this.closeMenu}>Log out</MenuItem>
          </ToolbarLink>
        </React.Fragment>
      );
    }
    return (
      <ToolbarMenu
        isMenuVisible={showMenu}
        closeMenuFunc={this.closeMenu}
        showMenuFunc={this.showMenu}
      >
        {toolbarMenu}
      </ToolbarMenu>
    );
  }
}

ToolbarMenuParent.propTypes = {
  userAuthed: PropTypes.bool.isRequired,
  username: PropTypes.string.isRequired,
};

const ToolbarMenu = ({
  isMenuVisible,
  closeMenuFunc,
  showMenuFunc,
  children,
}) => (
  <MenuSurfaceAnchor>
    <MenuSurface
      open={isMenuVisible}
      onClose={closeMenuFunc}
      style={{ width: '10rem' }}
    >
      {children}
    </MenuSurface>
    <TopAppBarActionItem icon="account_circle" onClick={showMenuFunc} />
  </MenuSurfaceAnchor>
);

ToolbarMenu.propTypes = {
  isMenuVisible: PropTypes.bool.isRequired,
  closeMenuFunc: PropTypes.func.isRequired,
  showMenuFunc: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
};

const ToolbarLink = ({ to, children }) => (
  <Link
    style={{
      textDecoration: 'none', color: '#29302E',
    }}
    to={to}
  >
    {children}
  </Link>
);

ToolbarLink.propTypes = {
  to: ReactRouterPropTypes.location.isRequired,
  children: PropTypes.node.isRequired,
};

const ToolbarHeader = ({ children }) => (
  <div style={{
    borderBottom: '1px solid #BBBBBB',
    marginBottom: '1rem',
    marginTop: '1rem',
    height: '2rem',
    paddingLeft: '1rem',
  }}
  >
    {children}
  </div>
);

ToolbarHeader.propTypes = {
  children: PropTypes.node.isRequired,
};

export default ToolbarMenuParent;
