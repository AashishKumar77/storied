import React from 'react';
import Grid from '@material-ui/core/Grid';

const MyGrid = ({ children }) => {

  return (
    <div>
      <Grid container>
        <Grid item xs={12} md={3}>
          
        </Grid>
        <Grid item xs={12} md={6}>
          {children}
        </Grid>
        <Grid item xs={12} md={3}>
          
        </Grid>
      </Grid>
    </div>
  );
}

export default MyGrid;