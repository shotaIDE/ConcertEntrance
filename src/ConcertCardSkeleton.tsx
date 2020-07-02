import React from 'react';

import { Typography } from '@material-ui/core';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Skeleton from '@material-ui/lab/Skeleton';

import useStyles from './ConcertCardStyle';

interface Props {}

const ConcertCardSkeleton = (props: Props) => {
  const classes = useStyles(props);

  const seed = new Array(3).fill(0);
  const content = seed.map((_, index) => {
    return (
      <Card key={index} className={classes.card}>
        <CardContent className={classes.content}>
          <Typography variant="h1">
            <Skeleton variant="text" />
          </Typography>
          <Typography variant="h4">
            <Skeleton variant="text" />
          </Typography>
          <Typography variant="body1">
            <Skeleton variant="text" />
            <Skeleton variant="text" />
            <Skeleton variant="text" />
          </Typography>
        </CardContent>
      </Card>
    );
  });

  return <div>{content}</div>;
};

export default ConcertCardSkeleton;
