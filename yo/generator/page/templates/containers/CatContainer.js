/* eslint-disable */
import React from 'react';
import {withStyles} from '@material-ui/core/styles';
import {connect} from 'react-redux';
import {Grid, Button} from '@material-ui/core';
import { getComponents } from 'boringbits/react';

const decorators = getComponents().decorators;

const {
  AppChrome,
  withNav,
} = decorators


@AppChrome
@withNav
@withStyles(theme => ({
  container: {
    margin: '30px',
  },
  navButton: {
    marginTop: '20px',
  },
  imgFrame: {
    width: '250px',
    height: '200px',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: '-25px -20px'
  }
}))
class <%= className %> extends React.Component {

  static path = '<%= path %>';

  componentWillMount() {
    this.setState({
      cats: [
        'cat1.jpg',
        'cat2.jpg',
        'cat3.jpg',
        'cat4.jpg',
      ]
    });
  }

  render() {
    const classes = this.props.classes;
    return (
      <Grid container className={classes.container}>
        <Grid item xs={12}>
          {
            this.state.cats.map(catSrc => {
              const imgUrl = require('./' + catSrc);
              return <div className={classes.imgFrame} style={{ backgroundImage: `url(${imgUrl})`}} key={imgUrl} />
            })
          }
        </Grid>
        <Grid item xs={12} className={classes.navButton}>
          <Button color="primary" onClick={() => this.props.navPush('/demo')} variant="contained" size="large">See Message</Button>
        </Grid>
      </Grid>
    )
  }
}


export default <%= className %>;