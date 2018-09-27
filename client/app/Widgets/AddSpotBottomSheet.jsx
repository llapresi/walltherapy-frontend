import React from 'react';
import { Button } from '@rmwc/button';
import { Typography } from '@rmwc/typography';
import PropTypes from 'prop-types';

const AddSpotBottomSheet = ({ callback }) => (
  <div className="addspot__bottombar">
    <Typography use="body1" style={{ paddingTop: '5px' }}>Drag map to new spot position</Typography>
    <Button className="addspot__bottombar-next-button" onClick={callback}>Next</Button>
  </div>
);
AddSpotBottomSheet.propTypes = {
  callback: PropTypes.func.isRequired,
};

module.exports = AddSpotBottomSheet;
