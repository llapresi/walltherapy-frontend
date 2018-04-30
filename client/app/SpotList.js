import React from 'react';
import { List, SimpleListItem } from 'rmwc/List';
import { CSSTransition, TransitionGroup, } from 'react-transition-group';
import { TextField, TextFieldIcon, TextFieldHelperText } from 'rmwc/TextField';

export const SkateSpotListParent = (props) => {
  return (
    <React.Fragment>
      <TextField id="spotName" className="search_field" box withLeadingIcon="filter_list" label="Name" onChange={props.updatePublicView} />
      <TextField id="spotDesc" className="search_field" box withLeadingIcon="filter_list" label="Description" onChange={props.updatePublicView} />
      <SkateSpotList selectFunc={props.selectFunc} spots={props.spots} />
    </React.Fragment>
  );
};

export const SkateSpotList = (props) => {
  return(
    <List twoLine className="spotList">
      <TransitionGroup className="spotList-anim" enter={true}>
          {props.spots.map(function(spot) {
            return (
              <CSSTransition
                key={spot._id}
                timeout={200}
                classNames="spotAnim"
              >
                <SimpleListItem key={spot._id} text={spot.name} secondaryText={spot.description} meta="info" onClick={() => props.selectFunc(spot)}/>
              </CSSTransition>
            );
          })}
      </TransitionGroup>
    </List>
  );
}