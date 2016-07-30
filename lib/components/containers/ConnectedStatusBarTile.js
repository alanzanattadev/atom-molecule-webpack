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
      progress: store.getState().build.progress,
      errors: store.getState().diagnostics.filter(info => info.type == "error"),
      warnings: store.getState().diagnostics.filter(info => info.type == "warning"),
    };
  },
  render: function() {
    return (
      React.cloneElement(this.props.children, {
        progress: this.state.progress,
        errors: this.state.errors,
        warnings: this.state.warnings,
      })
    );
  }
});
