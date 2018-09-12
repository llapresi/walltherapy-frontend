import React from 'react';
import {
  Card,
} from 'rmwc/Card';
import { Typography } from 'rmwc/Typography';
import ObjectPropTypes from '../ObjectShapes';

const SpotCard = ({ spot }) => (
  <Card style={{
    position: 'absolute',
    bottom: '8px',
    zIndex: '2',
    left: '8px',
    right: '8px',
  }}
  >
    <div style={{ padding: '0 1rem 1rem 1rem' }}>
      <Typography use="headline6" tag="h2">
        {spot.name}
      </Typography>
      <Typography
        use="subtitle2"
        tag="h3"
        theme="text-secondary-on-background"
        style={{ marginTop: '-1rem' }}
      >
        <span>Owner | Rating</span>
      </Typography>
      <Typography style={{ textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }} use="body1" tag="div" theme="text-secondary-on-background">
        {spot.description}
      </Typography>
    </div>
  </Card>
);

SpotCard.propTypes = {
  spot: ObjectPropTypes.Spot.isRequired,
};

export default SpotCard;
