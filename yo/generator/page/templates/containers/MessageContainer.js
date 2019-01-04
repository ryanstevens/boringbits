/* eslint-disable */
import React from 'react';
import {connect} from 'react-redux';
import {Grid, Button} from '@material-ui/core';
import {withStyles} from '@material-ui/core/styles';
import { getRootComponents } from 'boringbits/react';
import fetch from 'cross-fetch';
import { push } from 'connected-react-router'

const {
  AppChrome
} = getRootComponents().decorators;


@AppChrome
@connect(
  state => ({
    msg: state.message.msg,
  }),
  dispatch => ({
    update: (greeting) => update(greeting, dispatch),
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

  componentDidMount() {
    this.props.update('this message is rendered client side');
  }

  render() {
    const classes = this.props.classes;
    return (
      <Grid container className={classes.container}>
        <Grid item xs={12}>
          {this.props.msg}
        </Grid>
        <Grid item xs={12} className={classes.navButton}>
          <Button color="primary" onClick={() => this.props.nav('/demo/cats')} variant="contained" size="large">See Cats</Button>
        </Grid>
      </Grid>
    )
  }
}

function update(greeting, dispatch) {

  fetch('<%= path %>/data.json', {
    method: 'POST',
    body: JSON.stringify({greeting}),
    headers: {'Content-Type': 'application/json; charset=utf-8'},
  }).then(response => response.json())
    .then(data => dispatch({
      type: 'updateMsg',
      msg: data.msg
    }))
    .catch(function(err) {
      console.log('Fetch Error :{', err);
    });

}


export default <%= className %>;