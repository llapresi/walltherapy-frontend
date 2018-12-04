import PropTypes from 'prop-types';

const ObjectPropTypes = {
  Spot: PropTypes.shape({
    _id: PropTypes.string,
    description: PropTypes.string,
    location: PropTypes.object,
    name: PropTypes.string,
    owner: PropTypes.object,
    artist: PropTypes.string,
  }),
  Review: PropTypes.shape({
    _id: PropTypes.string,
    author: PropTypes.object,
    createdData: PropTypes.string,
    rating: PropTypes.number,
    reviewText: PropTypes.string,
    spot: PropTypes.string,
  }),
  Transition: PropTypes.shape({
    transition: PropTypes.string,
    duration: PropTypes.number,
  }),
};

export default ObjectPropTypes;
