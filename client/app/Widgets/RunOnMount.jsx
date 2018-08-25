import React from 'react';
import PropTypes from 'prop-types';

export default class RunOnMount extends React.Component {
  componentDidMount() {
    const { func } = this.props;
    func();
  }

  render() {
    return (null);
  }
}
RunOnMount.propTypes = {
  func: PropTypes.func.isRequired,
};
