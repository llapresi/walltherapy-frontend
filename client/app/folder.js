import React from 'react';

class Folder extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showContent: false,
    };
    this.toggleContent = this.toggleContent.bind(this);
  }

  toggleContent() {
    this.setState({showContent: !this.state.showContent});
  }

  render() {
    const showContent = this.state.showContent;
    let headerString = '';
    if(showContent) {
      headerString = `- ${this.props.folderName}`;
    } else {
      headerString = `+ ${this.props.folderName}`;
    }

    let addReviewClasses = "add-review review-item";
    if(this.state.showContent) {
      addReviewClasses = `${addReviewClasses} review-item-open`;
    }
    
    return(
      <div className={addReviewClasses} onClick={this.toggleContent}>
        <div className="review-author">{headerString}</div>
        {showContent === true &&
          <div style={{fontSize : '20px'}}>{this.props.children}</div>
        }
      </div>
    );
  }
}

export default Folder;