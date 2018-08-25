import PropTypes from 'prop-types';

const ObjectPropTypes = {
  Spot: PropTypes.shape({
    _id: PropTypes.string,
    description: PropTypes.string,
    isSponsored: PropTypes.bool,
    location: PropTypes.array,
    name: PropTypes.string,
    owner: PropTypes.string,
  }),
  Review: PropTypes.shape({
    _id: PropTypes.string,
    author: PropTypes.string,
    createdData: PropTypes.string,
    rating: PropTypes.number,
    reviewText: PropTypes.string,
    spot: PropTypes.string,
  }),
};

export default ObjectPropTypes;
