import React from 'react';
import {MagicallyDeliciousRouter} from 'boringbits/client';
import {withStyles} from '@material-ui/core/styles';

import Grid from '@material-ui/core/Grid';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import Typography from '@material-ui/core/Typography';

import {
  MuiThemeProvider,
  createMuiTheme,
} from '@material-ui/core/styles';


// Create a theme instance.
const theme = createMuiTheme({
  typography: {
    useNextVariants: true,
    // Use the system font instead of the default Roboto font.
    fontFamily: [
      'Roboto',
      '"Helvetica Neue"',
    ].join(','),
  },
});


@withStyles(theme => ({
  outerContainer: {
    flexGrow: 1,
    height: '100%',
    backgroundColor: '#eee',
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
    const {classes} = this.props;
    return (
      <Grid container className={classes.outerContainer} justify="center" spacing={0}>
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

          <MagicallyDeliciousRouter />
        </Grid>
      </Grid>

    );
  }
}

export default () => {
  return (
    <MuiThemeProvider theme={theme} sheetsManager={new Map()}>
      <AppChrome />
    </MuiThemeProvider>
  );
};
