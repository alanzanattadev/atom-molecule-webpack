'use babel'
import {React} from 'react-for-atom';
import WebpackBuildingProgress from "./WebpackBuildingProgress";
import StatusBarWebpackDiagnostic from './StatusBarWebpackDiagnostic';
import StatusBarWebpackLogo from "./StatusBarWebpackLogo";

export default ({onClick, progress, errors, warnings}) => (
  <div className="molecule-webpack-status-bar-tile" onClick={onClick}>
    <StatusBarWebpackLogo/>
    <WebpackBuildingProgress progress={progress}/>
    <StatusBarWebpackDiagnostic errors={errors} warnings={warnings}/>
  </div>
)
