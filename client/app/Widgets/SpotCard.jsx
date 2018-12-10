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
    pathname: `/mural/${spot._id}`,
    state: {
      spot,
    },
  };
  console.log(spot);
  const { artists, name, streetname } = spot;
  const spotname = name || '[invalid spotname]';
  const cardStyle = {
    position: 'absolute',
    bottom: '8px',
    zIndex: '2',
    left: '8px',
    right: '8px',
    maxWidth: '600px',
    margin: 'auto',
  };
  return (
    <Card style={cardStyle}>
      <CardPrimaryAction onClick={() => history.push(onClickLink)}>
        <div style={{ padding: '0 1rem 0rem 1rem' }}>
          <Typography use="headline6" tag="h2">
            {spotname}
          </Typography>
          <Typography
            use="subtitle2"
            tag="h3"
            theme="text-secondary-on-background"
            style={{ marginTop: '-1rem' }}
          >
            {artists[0].name}
          </Typography>
          <Typography
            use="subtitle2"
            tag="h3"
            theme="text-secondary-on-background"
            style={{ marginTop: '-1rem' }}
          >
            {streetname}
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
