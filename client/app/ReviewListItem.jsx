import React from 'react';
import { SimpleListItem } from '@rmwc/list';
import ObjectPropTypes from './ObjectShapes';

export default class ReviewListItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showFullText: false,
    };
  }

  toggleFullText() {
    const { showFullText } = this.state;
    this.setState({ showFullText: !showFullText });
  }

  render() {
    const { showFullText } = this.state;
    const { review } = this.props;
    let className = 'review-list-item';
    if (showFullText === true) {
      className += ' review-list-item__active';
    }

    const { author, rating: reviewRating, reviewText } = review;

    let username = '[invalid username]';
    if (author && author.username) {
      const { username: reviewUsername } = author;
      username = reviewUsername;
    }

    let reviewBody = '[invalid review text]';
    if (reviewText) {
      reviewBody = reviewText;
    }

    const rating = reviewRating || '[invalid rating]';

    const usernameRating = `${username} - ${rating}`;
    return (
      <SimpleListItem
        onClick={() => this.toggleFullText()}
        className={className}
        text={reviewBody}
        secondaryText={usernameRating}
      />
    );
  }
}
ReviewListItem.propTypes = {
  review: ObjectPropTypes.Review.isRequired,
};
