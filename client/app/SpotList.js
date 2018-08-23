import React from 'react';
import { List, SimpleListItem } from 'rmwc/List';
import { CSSTransition, TransitionGroup, } from 'react-transition-group';
import { TextField, TextFieldIcon, TextFieldHelperText } from 'rmwc/TextField';
import { Link } from 'react-router-dom';

export const SkateSpotListParent = (props) => {
  return (
    <div>
      <TextField id="spotName" className="search_field" box withLeadingIcon="filter_list" label="Filter" onChange={props.updatePublicView} />
      <SkateSpotList spots={props.spots} />
    </div>
  );
};

export const SkateSpotList = (props) => {
  return(
    <List twoLine className="spotList">
      <TransitionGroup className="spotList-anim" enter={true}>
          {props.spots.map(function(spot) {
            let classNameString = "";
            let descriptionAppend = "";
            if(spot.isSponsored === true) {
              classNameString += "spot__sponsored";
              descriptionAppend += "Sponsored: "
            }
            return (
              <CSSTransition
                key={spot._id}
                timeout={200}
                classNames="spotAnim"
              >
                <Link className='remove-link-styling force-block' to={{pathname: '/spot/' + spot._id, state: {spot: spot}}} >
                  <SimpleListItem className={classNameString} text={spot.name} secondaryText={descriptionAppend +  spot.description} meta="info" />
                </Link>
              </CSSTransition>
            );
          })}
      </TransitionGroup>
    </List>
  );
}