/* eslint-disable */
import React from 'react';
import {connect} from 'react-redux';
import {Grid, Button} from '@material-ui/core';
import {withStyles} from '@material-ui/core/styles';
import { getComponents } from 'boringbits/react';
import fetch from 'cross-fetch';
import Typography from '@material-ui/core/Typography';


const decorators = getComponents().decorators;

const {
  AppChrome,
  withNav,
} = decorators

@AppChrome
@withNav
@connect(
  state => ({
    msg: state.message.msg,
    color: state.message.color,
  }),
  dispatch => ({
    update: (greeting) => update(greeting, dispatch),
  })
)
@withStyles(theme => ({
  container: {
    margin: '30px',
  },
  navButton: {
    marginTop: '20px',
  },
  sphere: {
    display: 'inline-flex',
    borderRadius: '100%',
    height: '20px',
    width: '20px',
    margin: '0',
  }
}))
class <%= className %> extends React.Component {

  static path = '<%= path %>';

  componentDidMount() {
    setTimeout(() => {
      this.props.update('this message is rendered client side');
    }, 2000);
  }

  render() {
    const classes = this.props.classes;
    const color = this.props.color;

    return (
      <Grid container className={classes.container}>
        <Grid item xs={6}>
          <Grid container direction="row" alignItems="center">
            <Grid item xs={1}>
              <figure className={classes.sphere} style={{background: `radial-gradient(circle at 7px 7px, ${color}, #000)`}}></figure>
            </Grid>
            <Grid item xs={5}>
              <Typography variant="subtitle1" gutterBottom>
                {this.props.msg}
              </Typography>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12} className={classes.navButton}>
          <Button color="primary" onClick={() => this.props.navPush('/demo/cats')} variant="contained" size="large">See Cats</Button>
        </Grid>
      </Grid>
    )
  }
}

function update(greeting, dispatch) {

  dispatch({
    type: 'updateMsg',
    data: {
      msg: 'fetching updated msg from server',
      color: 'yellow',
    }
  })

  fetch('<%= path %>/data.json', {
    method: 'POST',
    body: JSON.stringify({greeting}),
    headers: {'Content-Type': 'application/json; charset=utf-8'},
  }).then(response => response.json())
    .then(data => dispatch({
      type: 'updateMsg',
      data
    }))
    .catch(function(err) {
      console.log('Fetch Error :{', err);
    });

}


export default <%= className %>;