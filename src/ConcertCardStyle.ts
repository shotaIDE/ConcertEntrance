import { Theme } from '@material-ui/core';
import lightGreen from '@material-ui/core/colors/lightGreen';
import { createStyles, makeStyles } from '@material-ui/core/styles';

const ConcertCardStyle = makeStyles((theme: Theme) =>
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

export default ConcertCardStyle;
