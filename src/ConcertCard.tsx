import clsx from 'clsx';
import React, { useState } from 'react';

import { Theme } from '@material-ui/core';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import Collapse from '@material-ui/core/Collapse';
import lightGreen from '@material-ui/core/colors/lightGreen';
import IconButton from '@material-ui/core/IconButton';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import OpenInBrowser from '@material-ui/icons/OpenInBrowser';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    card: {
      maxWidth: 860,
      margin: "auto",
      marginTop: 10,
      marginBottom: 10,
      textAlign: "left",
    },
    content: {
      paddingTop: 0,
      paddingBottom: 0,
      marginTop: 0,
      marginBottom: 0,
    },
    actions: {
      display: "flex",
      paddingTop: 0,
      marginTop: 0,
    },
    expand: {
      transform: "rotate(0deg)",
      transition: theme.transitions.create("transform", {
        duration: theme.transitions.duration.shortest,
      }),
    },
    expandOpen: {
      transform: "rotate(180deg)",
    },
    avatar: {
      backgroundColor: lightGreen[700],
    },
    lineWrap: {
      margin: 0,
    },
  })
);

export interface ConcertDetail {
  title: string;
  heldDatetime: string;
  program: string;
  onSaleDate: string;
  heldPlace: string;
  payment: string;
  srcUrl: string;
  description: string;
}

interface Props {
  key: string;
  detail: ConcertDetail;
}

const ConcertCard = (props: Props) => {
  const [expanded, setExpanded] = useState(false);
  const classes = useStyles(props);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const detail = props.detail;

  return (
    <Card className={classes.card}>
      <CardHeader title={detail.title} subheader={detail.heldDatetime} />
      <CardContent className={classes.content}>
        <Typography component="p">
          曲：{detail.program ? detail.program : "（未定）"}
        </Typography>
        <Typography component="p">前売開始日：{detail.onSaleDate}</Typography>
        <Typography component="p">開催場所：{detail.heldPlace}</Typography>
        <Typography component="p">
          料金：{detail.payment ? detail.payment : "（情報なし）"}
        </Typography>
      </CardContent>
      <CardActions className={classes.actions}>
        <IconButton
          aria-label="ブラウザで開く"
          href={detail.srcUrl}
          target="concert_detail"
        >
          <OpenInBrowser />
        </IconButton>
        <IconButton
          className={clsx(classes.expand, {
            [classes.expandOpen]: expanded,
          })}
          onClick={handleExpandClick}
          aria-expanded={expanded}
          aria-label="もっと見る"
        >
          <ExpandMoreIcon />
        </IconButton>
      </CardActions>
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <CardContent className={classes.content}>
          <Typography paragraph>{detail.description}</Typography>
        </CardContent>
      </Collapse>
    </Card>
  );
};

export default ConcertCard;
