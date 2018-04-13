const ReviewForm = (props) => {
  return(
    <div>
      <form id="reviewForm "action="/addReview" method="POST" onSubmit={props.submitAction}>
        Review Text: <input type="text" name="reviewText" />
        <br />
        Rating: <input type="text" name="rating" />
        <br />
        <input type="hidden" name="_csrf" value={props.csrf} />
        <input type="hidden" id="reviewFormSpotID" name="spot" value={props.spotId} />
        <input type="submit" />
      </form>
    </div>
  );
};

class ReviewList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      reviews: []
    };
    this.updateReviews = this.updateReviews.bind(this);
  }

  updateReviews (id) {
    $.ajax({
      method: 'GET',
      url: `/getReviews?spot=${id}`
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
      url: '/addReview',
      data: $(e.target).serialize(),
      dataType: "json",
      error: function(xhr, status, error) {
        var messageObj = JSON.parse(xhr.responseText);
        console.log(messageObj);
      }
    }).done(() => {
      this.updateReviews(this.props.spotId);
    });
  }

  render() {
    return(
      <div>
        <div>Reviews:</div>
        <ReviewForm spotId={this.props.spotId} csrf={this.props.csrf} submitAction={this.submitReview.bind(this)} />
        {this.state.reviews.map(function(review) {
          return(
            <div>
              <div>User: {review.author} | Rating:{review.rating} | Review:{review.reviewText}</div>
            </div>
          );
        })}
      </div>
    );
  }
};
