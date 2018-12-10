import React from 'react';
import { sendAjax } from '../helper/helper';
import ArtistCard from './Widgets/ArtistCard';

const ArtistView = ({
  artist,
}) => {
  let spotCards = '';
  if (artist.mural !== undefined) {
    spotCards = artist.mural.map(mural => <ArtistCard spot={mural} key={mural.id} />);
  }
  return (
    <article className="spot_infobox">
      <h2>{artist.name}</h2>
      <div style={{ paddingTop: '24px', paddingBottom: '24px', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(270px, 1fr))', gridGap: '12px' }}>
        {spotCards}
      </div>
      <div
        className="spotDescription"
        dangerouslySetInnerHTML={{ __html: artist.description }}
      />
    </article>
  );
};


class ArtistViewParent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      artist: {},
    };
  }

  componentDidMount() {
    const { match } = this.props;
    // Fetching new artist data
    sendAjax('GET', `/artists/${match.params.id}`, null, (data) => {
      this.setState({ artist: data });
      this.onNewSpotData(data);
    });
  }

  onNewSpotData(spot) {
    const { onOpen } = this.props;
    onOpen(spot.name);
  }

  render() {
    const { artist } = this.state;
    return (
      <ArtistView
        artist={artist}
      />
    );
  }
}

export default ArtistViewParent;
