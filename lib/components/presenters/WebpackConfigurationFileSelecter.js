'use babel'
import {React} from 'react-for-atom';

export default ({files, onChange, value}) => (
  <select onChange={e => onChange(e.target.value)} value={value}>
    {files.map(file => (
      <option key={file.path} value={file.path}>{file.path}</option>
    ))}
  </select>
)
