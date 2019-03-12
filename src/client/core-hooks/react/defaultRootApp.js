import React from 'react';
import MagicallyDeliciousRouter from './BoringRouter';
import {withStyles} from '@material-ui/core/styles';
import defaultOuterContainer from './defaultOuterContainer';

import {
  MuiThemeProvider,
  createMuiTheme,
} from '@material-ui/core/styles';


@withStyles(theme => ({
  outerContainer: {
    ...defaultOuterContainer,
    ...(theme.outerContainer || {}),
  },
}))
class RootApp extends React.Component {

  render() {
    const {classes} = this.props;
    return (
      <div className={classes.outerContainer + ' boring_outerContainer'}>
        <MagicallyDeliciousRouter />
      </div>
    );
  }
}

export default (props={theme: {}}) => {

  // Create a theme instance.
  const theme = createMuiTheme(props.theme || {});

  return (
    <MuiThemeProvider theme={theme} sheetsManager={new Map()}>
      <RootApp />
    </MuiThemeProvider>
  );

};
