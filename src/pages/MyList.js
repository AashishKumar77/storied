import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';

// Components
import Button from "../components/Button";
import Loader from "../components/Loader";
import Typography from "../components/Typography";

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    height: 500,
    overflowY: 'scroll',
    overflowX: 'hidden',
    backgroundColor: theme.palette.background.paper,
  },
}));

const MyList = ({ data, loading, handleViewTree }) => {
  const classes = useStyles();

  if(loading) {
    return <Loader />
  }else if(data && data.length > 0) {
    return (
      <List className={classes.root}>
        {
          data.map((row, idx) => 
            <ListItem key={idx}>
              <ListItemAvatar>
                <Avatar>
                  {idx+1}
                </Avatar>
              </ListItemAvatar>
              <ListItemText primary={row.treeName} secondary={row.creationDate} />
              <Button
                type="default"
                size="medium"
                title="View Tree"
                handleClick={()=>handleViewTree(row.treeId, row.homePersonId)}
              />
            </ListItem>
          )
        }
      </List>
    );
  }else{
    return (
      <div>
        <Typography
            text="secondary"
            weight="medium"
            size={16}
        >
          No Trees Found.
        </Typography>
      </div>
    )
  }
}

export default MyList;