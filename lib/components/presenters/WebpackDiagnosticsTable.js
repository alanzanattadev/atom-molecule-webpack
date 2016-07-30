'use babel'
import {React} from 'react-for-atom';
import classNames from 'classnames';

export default ({infos, onDiagnosticClick}) => (
  <table className="diagnostics-table">
    <tr>
      <th>description</th>
      <th>path</th>
      <th>line</th>
    </tr>
    {infos.map(info => (
      <tr
        key={info.description + info.file.path}
        className={classNames({warning: info.type == "warning", error: info.type == "error"})}
        onClick={() => onDiagnosticClick(info)}
      >
        <th className="description">{info.description}</th>
        <th className="path">{info.file.path}</th>
        <th>{info.file.line}</th>
      </tr>
    ))}
  </table>
)
