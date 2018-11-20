import React from 'react';
import {
  Card,
  CardPrimaryAction,
  CardAction,
  CardActions,
  CardActionButtons,
} from '@rmwc/card';
import { Typography } from '@rmwc/typography';
import ObjectPropTypes from '../ObjectShapes';
import history from '../History';

const SpotCard = ({ spot }) => {
  const onClickLink = {
    pathname: `/spot/${spot._id}`,
    state: {
      spot,
    },
  };
  const { artist, name, description } = spot;
  const spotname = name || '[invalid spotname]';
  const descriptionBody = description || '[invalid description]';

  return (
    <Card style={{
      position: 'absolute',
      bottom: '8px',
      zIndex: '2',
      left: '8px',
      right: '8px',
      maxWidth: '800px',
      margin: 'auto',
    }}
    >
      <CardPrimaryAction onClick={() => history.push(onClickLink)}>
        <div style={{ padding: '0 1rem 1rem 1rem' }}>
          <Typography use="headline6" tag="h2">
            {spotname}
          </Typography>
          <Typography
            use="subtitle2"
            tag="h3"
            theme="text-secondary-on-background"
            style={{ marginTop: '-1rem' }}
          >
            {artist}
          </Typography>
          <Typography style={{ textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }} use="body1" tag="div" theme="text-secondary-on-background">
            {descriptionBody}
          </Typography>
        </div>
      </CardPrimaryAction>
      <CardActions>
        <CardActionButtons>
          <CardAction onClick={() => history.push(onClickLink)}>Show</CardAction>
        </CardActionButtons>
      </CardActions>
    </Card>
  );
};

SpotCard.propTypes = {
  spot: ObjectPropTypes.Spot.isRequired,
};

export default SpotCard;
