import React from 'react';
import {
  Card,
  CardPrimaryAction,
  CardAction,
  CardActions,
  CardActionButtons,
  CardMedia,
} from '@rmwc/card';
import { Typography } from '@rmwc/typography';
import ObjectPropTypes from '../ObjectShapes';
import history from '../History';

// Card that displays on artist pages. Fetches images and is formatted for
// CSS grid
const ArtistCard = ({ spot }) => {
  const onClickLink = {
    pathname: `/mural/${spot._id}`,
    state: {
      spot,
    },
  };
  const { artists, name, streetname } = spot;
  const spotname = name || '[invalid spotname]';
  let cardImage = '';
  // If we don't check to see if the image array is not undefined we crash
  if (spot.images !== undefined) {
    let cardURL = spot.images[0].url;
    const lastIndex = spot.images[0].url.lastIndexOf('/upload/');
    // Get thumbnail of the image
    cardURL = `${cardURL.slice(0, lastIndex + 8)}/w_300,c_fit,ar_16:9/${cardURL.slice(lastIndex + 8, cardURL.length)}`;
    cardImage = (
      <CardMedia
        sixteenByNine
        style={{
          backgroundImage: `url(${cardURL})`,
        }}
      />
    );
  }
  return (
    <Card>
      <CardPrimaryAction onClick={() => history.push(onClickLink)}>
        {cardImage}
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

ArtistCard.propTypes = {
  spot: ObjectPropTypes.Spot.isRequired,
};

export default ArtistCard;
