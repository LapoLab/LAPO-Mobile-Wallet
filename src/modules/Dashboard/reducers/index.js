import { handleActions } from 'redux-actions';
import {
  setIsReady,
  setAnalitycLoadBlock,
  getInfoAboutWallet,
} from '../actions';

export const initialDashboardState = {
  isReady: false,
  countBlock: 0,
  maxBlock: 0,
  isStartGetInfo: false,
};

// reducer
const reducer = handleActions(
  {
    [setIsReady](state, { payload }) {
      return {
        ...state,
        isReady: payload,
      };
    },
    [getInfoAboutWallet](state) {
      return {
        ...state,
        isStartGetInfo: true,
      };
    },
    [setAnalitycLoadBlock](state, { payload }) {
      return {
        ...state,
        countBlock: payload.countBlock,
        maxBlock: payload.maxBlock,
      };
    },

  },
  initialDashboardState,
);

export default reducer;
