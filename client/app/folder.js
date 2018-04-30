// This isn't actually a folder anymore, just a self-contained class for a dialog
import React from 'react';
import { Button, ButtonIcon } from 'rmwc/Button';
import { Elevation } from 'rmwc/Elevation';
import { SimpleDialog } from 'rmwc/Dialog';


class Folder extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showContent: false,
    };
  }

  render() {
    return(
      <React.Fragment>
        <Button onClick={() => this.setState({showContent: true})}>{this.props.folderName}</Button>
        <SimpleDialog
          title={this.props.folderName}
          body={this.props.children}
          open={this.state.showContent}
          onClose={evt => this.setState({showContent: false})}
          onAccept={evt => this.props.acceptCallback()}
          acceptLabel="Submit"
        />
      </React.Fragment>
    );
  }
}

export default Folder;