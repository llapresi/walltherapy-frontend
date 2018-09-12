import React from 'react';
import { List, SimpleListItem } from 'rmwc/List';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { TextField } from 'rmwc/TextField';

export const SkateSpotListParent = ({ spots, updateSpotList }) => (
  <div className="skateSpotListParent desktop-400 horizontal__desktop">
    <TextField className="newSearchBar" onChange={updateSpotList} label="Search" box withLeadingIcon="search" />
    <SkateSpotList spots={spots} />
  </div>
);
SkateSpotListParent.propTypes = {
  spots: PropTypes.arrayOf(PropTypes.object).isRequired,
  updateSpotList: PropTypes.func.isRequired,
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
