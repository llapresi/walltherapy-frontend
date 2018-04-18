import React from 'react';
import ReactDOM from 'react-dom';

export const ReviewForm = (props) => {
  return(
    <div>
      <form id="reviewForm "action="/reviews" method="POST" onSubmit={props.submitAction}>
        <div className='review-text'>
          Rating: <input type="number" placeholder="3" step="0.5" min="1" max="5" size="1" name="rating" />
        </div>
        <div className='review-text'>
          Review Text:
          <br /><input type="text" name="reviewText" />
        </div> 
        <input type="hidden" name="_csrf" value={props.csrf} />
        <input type="hidden" id="reviewFormSpotID" name="spot" value={props.spotId} />
        <input type="submit" value="Add Review" />
      </form>
    </div>
  );
};

export class ReviewList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      reviews: [],
      errorMsg: '',
      showReviewForm: false,
    };
    this.updateReviews = this.updateReviews.bind(this);
  }

  updateReviews (id) {
    $.ajax({
      method: 'GET',
      url: `/reviews?spot=${id}`
    }).done((data) => {
      this.setState({reviews: data.reviews});
    });
  }
  
  componentDidMount() {
    this.updateReviews(this.props.spotId);
  }

  submitReview(e) {
    e.preventDefault();
    $.ajax({
      cache: false,
      type: 'POST',
      url: '/reviews',
      data: $(e.target).serialize(),
      dataType: "json",
      error: function(xhr, status, error) {
        var messageObj = JSON.parse(xhr.responseText);
        this.setState({errorMsg: messageObj.error});
      }.bind(this),
    }).done(() => {
      this.updateReviews(this.props.spotId);
    });
  }
  
  toggleReviewForm() {
    this.setState({showReviewForm: !this.state.showReviewForm});
  }

  render() {
    let addReviewClasses = 'review-item add-review';
    if(this.state.showReviewForm) {
      addReviewClasses = `${addReviewClasses} review-item-open`;
    }
    return(
      <div className='review_section'>
        <span>{this.state.errorMsg}</span>
        <h3 className='reviews-header'>Reviews:</h3>

        <div className={addReviewClasses}>
          <div className='review-author' onClick={this.toggleReviewForm.bind(this)}>{this.state.showReviewForm ? '- Add Review' : '+ Add Review'}</div>
          {this.state.showReviewForm === true &&
            <ReviewForm spotId={this.props.spotId} csrf={this.props.csrf} submitAction={this.submitReview.bind(this)} />
          }
        </div>
        {this.state.reviews.map(function(review) {
          return(
            <ReviewListItem
              id={review.author}
              rating={review.rating}
              reviewText={review.reviewText} />
          );
        })}
      </div>
    );
  }
};

export class ReviewListItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '(username)',
    }
  }

  componentDidMount() {
    $.ajax({
      method: 'GET',
      url: `/getUsernameForId?id=${this.props.id}`
    }).done((data) => {
      this.setState({username: data.username});
    });
  }
  
  render() {
    return(
      <div className='review-item'>
        <div className='review-author'>{this.state.username}</div>
        <div className='review-rating'>{this.props.rating} / 5</div>
        <div className='review-text'>{this.props.reviewText}</div>
      </div>
    );
  }
}