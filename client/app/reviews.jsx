import React from 'react';
import { List } from 'rmwc/List';
import { TextField } from 'rmwc/TextField';
import StarRatingComponent from 'react-star-rating-component';
import { CSSTransition } from 'react-transition-group';
import PropTypes from 'prop-types';
import Folder from './Widgets/Folder';
import ReviewListItem from './ReviewListItem';


export const ReviewForm = ({ csrf, spotId }) => (
  <div>
    <form id="reviewForm" className="reviewForm" action="/reviews" method="POST">
      <div className="reviewform-rating">
        <span>Rating:</span>
        <StarRatingComponent name="rating" starCount={5} emptyStarColor="rgba(0,0,0,.54)" />
      </div>
      <TextField textarea fullwidth label="Write review here..." rows="4" name="reviewText" required />
      <input type="hidden" name="_csrf" value={csrf} />
      <input type="hidden" id="reviewFormSpotID" name="spot" value={spotId} />
    </form>
  </div>
);
ReviewForm.propTypes = {
  csrf: PropTypes.string.isRequired,
  spotId: PropTypes.string.isRequired,
};

export class ReviewList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      reviews: [],
      reviewListAnim: false,
    };
    this.updateReviews = this.updateReviews.bind(this);
    this.submitReview = this.submitReview.bind(this);
  }

  componentDidMount() {
    const { spotId } = this.props;
    this.updateReviews(spotId);
  }

  updateReviews(id) {
    $.ajax({
      method: 'GET',
      url: `/reviews?spot=${id}`,
    }).done((data) => {
      this.setState({ reviews: data.reviews, reviewListAnim: true });
    });
  }

  submitReview() {
    const { spotId, onReviewAdd } = this.props;
    $.ajax({
      cache: false,
      type: 'POST',
      url: '/reviews',
      data: $('#reviewForm').serialize(),
      dataType: 'json',
      error: (xhr) => {
        onReviewAdd(xhr.responseText);
        console.log(xhr.responseText);
      },
    }).done(() => {
      this.updateReviews(spotId);
      onReviewAdd('Review Submitted');
    });
  }

  render() {
    const {
      reviewListAnim, reviews,
    } = this.state;
    const { spotId, csrf, userAuthed } = this.props;
    return (
      <React.Fragment>
        <h3 className="reviews-header">Reviews:</h3>
        <Folder folderName="Add Review" acceptCallback={this.submitReview} userAuthed={userAuthed}>
          <ReviewForm spotId={spotId} csrf={csrf} />
        </Folder>
        <div className="review_section">
          <CSSTransition in={reviewListAnim} classNames="transition__show_reviewlist" timeout={350}>
            <List className="reviewList" twoLine="true" nonInteractive="true">
              {reviews.map(review => (
                <ReviewListItem review={review} key={review._id} />
              ))}
            </List>
          </CSSTransition>
        </div>
      </React.Fragment>
    );
  }
}
ReviewList.propTypes = {
  spotId: PropTypes.string.isRequired,
  csrf: PropTypes.string.isRequired,
  onReviewAdd: PropTypes.func.isRequired,
};
