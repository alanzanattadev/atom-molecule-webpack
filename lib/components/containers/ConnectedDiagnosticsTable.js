'use babel'

import {React} from 'react-for-atom';
import store from '../../redux/store';


export default React.createClass({
  getInitialState: function() {
    return this.getState();
  },
  componentDidMount: function() {
    this.unsubscribe = store.subscribe(this.onWebpackStateChanged);
  },
  componentWillUnmount: function() {
    this.unsubscribe();
  },
  onWebpackStateChanged: function() {
    this.setState(this.getState());
  },
  getState: function() {
    return {
      infos: store.getState().diagnostics,
      config: store.getState().configs.find(config => config.selected),
    };
  },
  render: function() {
    return (
      React.cloneElement(this.props.children, {
        infos: this.state.infos,
        config: this.state.config,
      })
    );
  }
});
