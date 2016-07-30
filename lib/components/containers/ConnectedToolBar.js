'use babel'

import {React} from 'react-for-atom';
import store from '../../redux/store';
import actions from "../../redux/actions";
import { fromJS } from "immutable";

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
      configs: store.getState().configs,
      configFile: fromJS(store.getState())
                    .get("configs", fromJS([]))
                    .find(config => config.get('selected'), {}, fromJS({}))
                    .get('path')
    };
  },
  render: function() {
    return (
      React.cloneElement(this.props.children, {
        configs: this.state.configs,
        onRun: (file) => store.dispatch(actions.build({path: file})),
        onStop: () => store.dispatch(actions.stop()),
        onRunWatch: (file) => store.dispatch(actions.watch({path: file})),
        onOpened: () => store.dispatch(actions.findWebpackConfigs()),
        configFile: this.state.configFile,
        onConfigSelected: (config) => store.dispatch(actions.webpackConfigurationSelected(config)),
      })
    );
  }
});
