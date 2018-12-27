import React from 'react';
import MagicallyDeliciousRouter from './BoringRouter';
import {withStyles} from '@material-ui/core/styles';

import Grid from '@material-ui/core/Grid';

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
    overflowY: 'auto',
  },
  container: {
    width: '100%',
  },
}))
class RootApp extends React.Component {

  render() {
    const {classes} = this.props;
    return (
      <Grid container className={classes.outerContainer} justify="center" spacing={0}>
        <MagicallyDeliciousRouter>
        </MagicallyDeliciousRouter>
      </Grid>

    );
  }
}

export default () => {
  return (
    <MuiThemeProvider theme={theme} sheetsManager={new Map()}>
      <RootApp />
    </MuiThemeProvider>
  );
};
