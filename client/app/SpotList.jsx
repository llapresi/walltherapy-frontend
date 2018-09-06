import React from 'react';
import { List, SimpleListItem } from 'rmwc/List';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { TextField } from 'rmwc/TextField';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

export const SkateSpotListParent = ({ spots, updatePublicView }) => (
  <div className="skateSpotListParent">
    <TextField id="spotName" className="search_field" box withLeadingIcon="filter_list" label="Filter" onChange={updatePublicView} />
    <SkateSpotList spots={spots} />
  </div>
);
SkateSpotListParent.propTypes = {
  spots: PropTypes.arrayOf(PropTypes.object).isRequired,
  updatePublicView: PropTypes.func.isRequired,
};


export const SkateSpotList = ({ spots }) => (
  <List twoLine className="spotList">
    <TransitionGroup className="spotList-anim" component={null}>
      {spots.map((spot) => {
        let classNameString = '';
        let descriptionAppend = '';
        if (spot.isSponsored === true) {
          classNameString += 'spot__sponsored';
          descriptionAppend += 'Sponsored: ';
        }
        return (
          <CSSTransition
            key={spot._id}
            timeout={200}
            classNames="spotAnim"
          >
            <Link className="remove-link-styling force-block" to={{ pathname: `/spot/${spot._id}`, state: { spot } }}>
              <SimpleListItem className={classNameString} text={spot.name} secondaryText={descriptionAppend + spot.description} meta="info" />
            </Link>
          </CSSTransition>
        );
      })}
    </TransitionGroup>
  </List>
);
SkateSpotList.propTypes = {
  spots: PropTypes.arrayOf(PropTypes.object).isRequired,
};
