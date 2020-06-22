import React from 'react';

import Typography from '@material-ui/core/Typography';

interface Props {
  update: Date;
}

const Header = (props: Props) => {
  return <Typography>Last updated: {props.update.toLocaleString()}</Typography>;
};

export default Header;
