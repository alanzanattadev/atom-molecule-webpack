'use babel'

import {combineReducers} from 'redux';
import diagnostics from "./diagnostics";
import configs from "./configs";
import build from './build';

export default combineReducers({
  diagnostics,
  configs,
  build
});
