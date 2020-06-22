import React from 'react';

import Typography from '@material-ui/core/Typography';

interface Props {
  update: Date;
}

const Header = (props: Props) => {
  return <Typography>最終更新日時：{props.update.toLocaleString()}</Typography>;
};

export default Header;
