'use babel'
import {React} from 'react-for-atom';

export default ({onChange, value}) => (
  <select onChange={e => onChange(e.target.value)} value={value}>
    <option value="build">build</option>
    <option value="watch">watch</option>
  </select>
)
