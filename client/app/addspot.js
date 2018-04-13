class SpotForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      errorMessage: ''
    };
  }

  createSpot(e) {
    e.preventDefault();
    $.ajax({
      cache: false,
      type: 'POST',
      url: '/maker',
      data: $(e.target).serialize(),
      dataType: "json",
      error: function(xhr, status, error) {
        var messageObj = JSON.parse(xhr.responseText);
        this.setState({errorMessage: messageObj.error})
      }.bind(this),
    }).done(() => {
      this.props.submitCallback();
    });
  }

  render() {
    return(
      <div>
        <form id="spotForm"
        onSubmit={this.createSpot.bind(this)}
        name="spotForm"
        action="/maker"
        method="POST"
        className="spotForm">
          <label htmlFor="name">Name: </label>
          <input id="spotName" type="text" name="name" placeholder="Domo Name" />
          <label htmlFor="longitude">Longitude: </label> 
          <input id="spotLong" type="text" name="longitude" placeholder="Longitude:" />
          <label htmlFor="latitude">Latitude: </label> 
          <input id="spotLat" type="text" name="latitude" placeholder="Latitude:" />

          <label htmlFor="description" id="domoFoodLabel">Description: </label> 
          <input id="spotDescription" type="text" name="description" placeholder="description" />
          <input type="hidden" name="_csrf" value={this.props.csrf} />
          <input className="addSpotSubmit" type="submit" value="Add New Spot" />
        </form>
        <div>{this.state.errorMessage}</div>
      </div>
    );
  }
};