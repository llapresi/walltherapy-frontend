import React from 'react';
import { List, SimpleListItem } from 'rmwc/List';
import { TextField, TextFieldIcon, TextFieldHelperText } from 'rmwc/TextField';
import { Select } from 'rmwc/Select';
import { Button } from 'rmwc/Button';
import Folder from './folder.js';


export const ReviewForm = (props) => {
  return(
    <div>
      <form id="reviewForm" className="reviewForm" action="/reviews" method="POST" onSubmit={props.submitAction}>
        <TextField label="Rating" name="rating" />
        <TextField textarea fullwidth label="Write review here..." rows="4" name="reviewText"  />
        <input type="hidden" name="_csrf" value={props.csrf} />
        <input type="hidden" id="reviewFormSpotID" name="spot" value={props.spotId} />
        <Button raised>Add Review</Button>
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
  render() {
    return(
      <div className='review_section'>
        <span>{this.state.errorMsg}</span>
        <h3 className='reviews-header'>Reviews:</h3>
        <Folder folderName="Add Review">
          <ReviewForm spotId={this.props.spotId} csrf={this.props.csrf} submitAction={this.submitReview.bind(this)} />
        </Folder>
        <List twoLine="true" nonInteractive="true">
          {this.state.reviews.map(function(review) {
            return(
              <ReviewListItem
                id={review.author}
                rating={review.rating}
                reviewText={review.reviewText} />
            );
          })}
        </List>
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
    const reviewText = this.props.reviewText;
    const usernameRating = `${this.state.username} - ${this.props.rating}`;
    return(
      <SimpleListItem text={this.props.reviewText} secondaryText={usernameRating} />
    );
  }
}