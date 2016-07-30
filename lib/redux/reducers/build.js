'use babel'
import {fromJS} from 'immutable';

export default function(state = {
  progress: 0
}, action) {
  switch(action.type) {
    case "BUILD_PROGRESS_UPDATED":
      return fromJS(state).set('progress', action.payload.progress).toJS();
      break;
    default:
      return state;
  }
}
