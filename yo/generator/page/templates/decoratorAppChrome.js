import React from 'react';
import {withStyles} from '@material-ui/core/styles';

import Grid from '@material-ui/core/Grid';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import Typography from '@material-ui/core/Typography';
import {Helmet} from 'boringbits/client';


@withStyles(theme => ({
  outerContainer: {
    flexGrow: 1,
    height: '100%',
    backgroundColor: '#eee',
    overflowY: 'auto',
  },
  container: {
    width: '100%',
  },
  grow: {
    flexGrow: 1,
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20,
  },
}))
class AppChrome extends React.Component {

  render() {
    const {classes, Target, propsForTarget} = this.props;
    return (
      <Grid container className={classes.outerContainer} justify="center" spacing={0}>
        <Helmet>
          <title>Boring Bits Demo</title>

          <html style={{height:'100%'}}></html>
          <body style={{height:'100%'}}></body>

          <link href='https://fonts.googleapis.com/css?family=Roboto:300,400,500' type='text/css' rel='stylesheet'></link>
          <link href='https://fonts.googleapis.com/icon?family=Material+Icons' type='text/css' rel='stylesheet'></link>

        </Helmet>
        <Grid className={classes.container} item>
          <AppBar position="static">
            <Toolbar>
              <IconButton className={classes.menuButton} color="inherit" aria-label="Menu">
                <MenuIcon />
              </IconButton>
              <Typography variant="h6" color="inherit" className={classes.grow}>
                My App
              </Typography>
            </Toolbar>
          </AppBar>

          <Target {...propsForTarget} />
        </Grid>
      </Grid>

    );
  }
}

export default AppChrome;
