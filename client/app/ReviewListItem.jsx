import React from 'react';
import { SimpleListItem } from 'rmwc/List';
import ObjectPropTypes from './ObjectShapes';

export default class ReviewListItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '(username)',
      showFullText: false,
    };
  }

  componentDidMount() {
    const { review } = this.props;
    $.ajax({
      method: 'GET',
      url: `/getUsernameForId?id=${review.author}`,
    }).done((data) => {
      this.setState({ username: data.username });
    });
  }

  toggleFullText() {
    const { showFullText } = this.state;
    this.setState({ showFullText: !showFullText });
  }

  render() {
    const { showFullText, username } = this.state;
    const { review } = this.props;
    let className = 'review-list-item';
    if (showFullText === true) {
      className += ' review-list-item__active';
    }

    const usernameRating = `${username} - ${review.rating}`;
    return (
      <SimpleListItem
        onClick={() => this.toggleFullText()}
        className={className}
        text={review.reviewText}
        secondaryText={usernameRating}
      />
    );
  }
}
ReviewListItem.propTypes = {
  review: ObjectPropTypes.Review.isRequired,
};
