import { handleActions } from 'redux-actions';
import {
  setPathDb, setIsRecovery, setAvatar, setUserName,
} from '../actions';

export const initialSettingsState = {
  pathDB: '',
  isRecovery: false,
  username: '',
  avatar: { uri: '' },
};

// reducer
const reducer = handleActions(
  {
    [setPathDb](state, { payload }) {
      return {
        ...state,
        pathDB: payload,
      };
    },
    [setIsRecovery](state, { payload }) {
      return {
        ...state,
        isRecovery: payload,
      };
    },
    [setUserName](state, { payload }) {
      return {
        ...state,
        username: payload,
      };
    },
    [setAvatar](state, { payload }) {
      return {
        ...state,
        avatar: payload,
      };
    },
  },
  initialSettingsState,
);

export default reducer;
