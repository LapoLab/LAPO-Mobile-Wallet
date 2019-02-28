import { handleActions } from 'redux-actions';
import {
  setVisibleNotify,
  setTimeNotify,
  setTimePushNotify,
} from '../actions';


export const initialNotifyState = {
  isVisibleNotify: false,
  timeLast: 0,
  timeLastPush: 0,
};

// reducer
const reducer = handleActions(
  {
    [setVisibleNotify](state, { payload }) {
      return {
        ...state,
        isVisibleNotify: payload,
      };
    },
    [setTimeNotify](state, { payload }) {
      return {
        ...state,
        timeLast: payload,
      };
    },
    [setTimePushNotify](state, { payload }) {
      return {
        ...state,
        timeLastPush: payload,
      };
    },
  },
  initialNotifyState,
);

export default reducer;
