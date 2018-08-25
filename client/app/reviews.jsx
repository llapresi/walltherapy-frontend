import React from 'react';
import { List } from 'rmwc/List';
import { TextField } from 'rmwc/TextField';
import { Snackbar } from 'rmwc/Snackbar';
import StarRatingComponent from 'react-star-rating-component';
import { CSSTransition } from 'react-transition-group';
import PropTypes from 'prop-types';
import Folder from './Widgets/Folder';
import ReviewListItem from './ReviewListItem';


export const ReviewForm = ({ submitAction, csrf, spotId }) => (
  <div>
    <form id="reviewForm" className="reviewForm" action="/reviews" method="POST" onSubmit={submitAction}>
      <div className="reviewform-rating">
        Rating:
        <StarRatingComponent name="rating" starCount={5} emptyStarColor="rgba(0,0,0,.54)" />
      </div>
      <TextField textarea fullwidth label="Write review here..." rows="4" name="reviewText" required />
      <input type="hidden" name="_csrf" value={csrf} />
      <input type="hidden" id="reviewFormSpotID" name="spot" value={spotId} />
    </form>
  </div>
);
ReviewForm.propTypes = {
  submitAction: PropTypes.func.isRequired,
  csrf: PropTypes.string.isRequired,
  spotId: PropTypes.string.isRequired,
};

export class ReviewList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      reviews: [],
      showSnackbar: false,
      snackbarMsg: '',
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
    const { spotId } = this.props;
    $.ajax({
      cache: false,
      type: 'POST',
      url: '/reviews',
      data: $('#reviewForm').serialize(),
      dataType: 'json',
      error: (xhr) => {
        const messageObj = JSON.parse(xhr.responseText);
        this.setState({ snackbarMsg: messageObj.error, showSnackbar: true });
      },
    }).done(() => {
      this.updateReviews(spotId);
      this.setState({ snackbarMsg: 'Review Submitted', showSnackbar: true });
    });
  }

  render() {
    const {
      reviewListAnim, reviews, showSnackbar, snackbarMsg,
    } = this.state;
    const { spotId, csrf } = this.props;
    return (
      <React.Fragment>
        <div className="review_section">
          <h3 className="reviews-header">Reviews:</h3>
          <Folder folderName="Add Review" acceptCallback={this.submitReview}>
            <ReviewForm spotId={spotId} csrf={csrf} />
          </Folder>
          <CSSTransition in={reviewListAnim} classNames="transition__show_reviewlist" timeout={350}>
            <List twoLine="true" nonInteractive="true">
              {reviews.map(review => (
                <ReviewListItem review={review} key={review._id} />
              ))}
            </List>
          </CSSTransition>
        </div>
        <Snackbar
          show={showSnackbar}
          onHide={() => this.setState({ showSnackbar: false })}
          message={snackbarMsg}
          actionText="Close"
          actionHandler={() => {}}
        />
      </React.Fragment>
    );
  }
}
ReviewList.propTypes = {
  spotId: PropTypes.string.isRequired,
  csrf: PropTypes.string.isRequired,
};
