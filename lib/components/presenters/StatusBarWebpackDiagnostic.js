'use babel'
import {React} from 'react-for-atom';

export default ({errors, warnings}) => (
  <div className="webpack-diagnostics">
    <span style={{color: "#ff6347", margin: "0px 0px 0px 5px"}}>
      <span className="icon icon-issue-opened"></span>
      <span>{errors.length}</span>
    </span>
    <span style={{color: "#e2c08d", margin: "0px 5px 0px 5px"}}>
      <span className="icon icon-alert"></span>
      <span>{warnings.length}</span>
    </span>
  </div>
);
