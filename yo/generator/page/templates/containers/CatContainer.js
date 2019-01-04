/* eslint-disable */
import React from 'react';
import {withStyles} from '@material-ui/core/styles';
import {connect} from 'react-redux';
import {Grid, Button} from '@material-ui/core';
import { getRootComponents } from 'boringbits/react';
import { push } from 'connected-react-router'


const {
  AppChrome
} = getRootComponents().decorators;


@AppChrome
@connect(
  null,
  dispatch => ({
    nav: (page) => dispatch(push(page)),
  })
)
@withStyles(theme => ({
  container: {
    margin: '30px',
  },
  navButton: {
    marginTop: '20px',
  }
}))
class <%= className %> extends React.Component {

  static path = '<%= path %>';

  render() {
    const classes = this.props.classes;
    return (
      <Grid container className={classes.container}>
        <Grid item xs={12}>
          Cats
        </Grid>
        <Grid item xs={12} className={classes.navButton}>
          <Button color="primary" onClick={() => this.props.nav('/demo')} variant="contained" size="large">See Message</Button>
        </Grid>
      </Grid>
    )
  }
}


export default <%= className %>;