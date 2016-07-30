'use babel'

import { fromJS } from "immutable";

export default function(state = [], action) {
  switch(action.type) {
    case "WEBPACK_CONFIG_FOUND":
      return fromJS(state).update(
        configs => {
          if (configs.find(config => config.get('path') == action.payload.path)) {
            return configs;
          } else {
            return configs.push({path: action.payload.path});
          }
        }
      ).toJS();
      break;
    case "WEBPACK_CONFIG_SELECTED":
      return fromJS(state)
              .map(config => config
                              .set('selected', action.payload.path == config.get('path'))
              )
              .toJS();
      break;
    default:
      return state;
  }
};
