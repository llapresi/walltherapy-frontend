import React from 'react';
import { TextField } from 'rmwc/TextField';

class NewSearchbox extends React.Component {
  constructor(props) {
    super(props);
    this.onFocus = this.onFocus.bind(this);
    this.onBlur = this.onBlur.bind(this);
  }

  onFocus() {
    const { onFocus } = this.props;
    onFocus();
  }

  onBlur() {
    const { onBlur } = this.props;
    onBlur();
  }

  render() {
    const { updateSpotList } = this.props;
    return (
      <TextField
        onBlur={this.onBlur}
        onFocus={this.onFocus}
        onChange={updateSpotList}
        className="gmap-searchbox"
        label="Search"
        box
        withLeadingIcon="search"
      />
    );
  }
}

export default NewSearchbox;
