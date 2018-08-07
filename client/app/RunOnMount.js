import React from 'react';

export class RunOnMount extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.props.func();
  }

  render() {
    return(null);
  }
};

export default RunOnMount;