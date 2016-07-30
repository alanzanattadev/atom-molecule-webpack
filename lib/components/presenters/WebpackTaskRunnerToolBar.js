'use babel'
import WebpackConfigurationFileSelecter from "./WebpackConfigurationFileSelecter";
import WebpackCommandSelecter from "./WebpackCommandSelecter";
import WebpackStopTaskButton from "./WebpackStopTaskButton";
import WebpackRunTaskButton from "./WebpackRunTaskButton";

import {React} from 'react-for-atom';

export default class WebpackTaskRunnerToolBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.configs != this.configs && this.props.configFile === undefined) {
      this.props.onConfigSelected({path: nextProps.configs[0].path});
    }
  }

  render() {
    return (
      <div className="molecule-webpack-task-runner-tool-bar">
        <WebpackConfigurationFileSelecter files={this.props.configs} onChange={(file) => this.onConfigSelected({path: file})} value={this.props.configFile}/>
        <WebpackCommandSelecter/>
        <WebpackRunTaskButton onClick={() => this.props.onRun(this.props.configFile)}/>
        <WebpackStopTaskButton/>
      </div>
    );
  }
};
