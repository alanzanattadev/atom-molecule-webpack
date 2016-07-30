'use babel'
import {React} from 'react-for-atom';
import WebpackDiagnosticsTable from "./WebpackDiagnosticsTable";
import path from 'path';

export default ({infos, config}) => (
  <div className="molecule-webpack-diagnostics-pane">
    <WebpackDiagnosticsTable
      infos={infos}
      onDiagnosticClick={(diagnostic) => atom.workspace.open(path.join(path.dirname(config.path), diagnostic.file.path), {
        initialLine: parseInt(diagnostic.file.line.split(':')[0]) - 1,
        initialColumn: parseInt(diagnostic.file.line.match(/\:(\d*)\-/)[1]) - 1
      })}
    />
  </div>
)
