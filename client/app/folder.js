import React from 'react';
import { Button, ButtonIcon } from 'rmwc/Button';
import { Elevation } from 'rmwc/Elevation';

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
      <div className={addReviewClasses}>
        <Button onClick={this.toggleContent}>{headerString}</Button>
        {showContent === true &&
          <Elevation z="9">{this.props.children}</Elevation>
        }
      </div>
    );
  }
}

export default Folder;