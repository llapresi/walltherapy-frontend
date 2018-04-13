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
          <input id="spotName" type="text" name="name" placeholder="Spot Name" />

          <input id="spotLong" type="hidden" name="longitude" value={this.props.loc[1]} />
          <input id="spotLat" type="hidden" name="latitude" value={this.props.loc[0]} />
          <br />
          <label htmlFor="description" id="domoFoodLabel">Description: </label> 
          <br />
          <textarea id="spotDescription" name="description" cols="35" rows ="10" placeholder="description"></textarea>
          <br />
          <input type="hidden" name="_csrf" value={this.props.csrf} />
          <div>Click point on map to set new spot position</div>
          <input className="addSpotSubmit" type="submit" value="Add New Spot" />
        </form>
        <div>{this.state.errorMessage}</div>
      </div>
    );
  }
};