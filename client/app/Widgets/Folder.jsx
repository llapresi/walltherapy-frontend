// This isn't actually a folder anymore, just a self-contained class for a dialog
import React from 'react';
import { Fab } from 'rmwc/Fab';
import { SimpleDialog } from 'rmwc/Dialog';
import PropTypes from 'prop-types';


class Folder extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showContent: false,
    };
  }

  render() {
    const { folderName, children, acceptCallback } = this.props;
    const { showContent } = this.state;
    return (
      <React.Fragment>
        <Fab
          icon="add"
          className="fab__review"
          label={folderName}
          onClick={() => this.setState({ showContent: true })}
        />
        <SimpleDialog
          title={folderName}
          body={children}
          open={showContent}
          onClose={() => this.setState({ showContent: false })}
          onAccept={acceptCallback}
          acceptLabel="Submit"
        />
      </React.Fragment>
    );
  }
}
Folder.propTypes = {
  folderName: PropTypes.string.isRequired,
  children: PropTypes.element.isRequired,
  acceptCallback: PropTypes.func.isRequired,
};

export default Folder;
