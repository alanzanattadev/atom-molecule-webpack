'use babel'

import {fromJS} from 'immutable';

function getDiagnosticFromInfoString(info) {
  let regex = /\@\s([^\s]*)\s(\d*):(\d*)-(\d*)/;
  let result = info.match(regex);
  return {
    description: info,
    file: {
      path: result[1],
      line: `${result[2]}:${result[3]}-${result[4]}`,
      debutColumn: result[3],
      endColumn: result[4]
    }
  }
}

export default function(state = [], action) {
  switch(action.type) {
    case "WEBPACK_STATUS_UPDATE":
      return fromJS([])
              .concat(fromJS(action.payload.warnings).map(w => fromJS(getDiagnosticFromInfoString(w)).set('type', 'warning')))
              .concat(fromJS(action.payload.errors).map(e => fromJS(getDiagnosticFromInfoString(e)).set('type', 'error')))
              .toJS();
      break;
    case "BUILD_PROGRESS_UPDATED":
      return action.payload.progress == 0 ? [] : state;
      break;
    default:
      return state;
  }
};
