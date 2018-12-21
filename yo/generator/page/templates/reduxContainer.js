import React from 'react';
import {withStyles} from '@material-ui/core/styles';
import {connect} from 'react-redux';
import Grid from '@material-ui/core/Grid';

@connect(
  state => ({
    msg: state.message.msg,
  }),
  dispatch => ({
    update: (name) => update(name, dispatch)
  })
)
@withStyles(theme => ({
  container: {
    margin: '30px',
  },
}))
class <%= className %>Container extends React.Component {

  static path = '<%= path %>';

  componentDidMount() {
    this.props.update('<%= personName %>');
  }

  render() {
    const classes = this.props.classes;
    return (
      <Grid container className={classes.container}>
          {this.props.msg}
      </Grid>
    )
  }
}

function update(name, dispatch) {

  fetch('<%= path %>data.json', {
    method: 'POST',
    body: JSON.stringify({name}),
    headers: {'Content-Type': 'application/json; charset=utf-8'},
  }).then(response => response.json())
    .then(data => dispatch({
      type: 'updateMsg',
      msg: data.msg
    }))
    .catch(function(err) {
      console.log('Fetch Error :-S', err);
    });

}


export default <%= className %>Container;