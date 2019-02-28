import { handleActions } from 'redux-actions';
import {
  setModalSend,
  setModalReceive,
  setModalTxDetails,
  setShowSpinner,
  setModalSwitchContacts,
  goToOtherWindow,
  setDrawer,
} from '../actions';

export const initialModalsState = {
  isModalSend: false,
  isModalReceive: false,
  isModalSwitchContacts: '',
  txDetails: '',
  lastTxDetails: '',
  isShowSpinner: false,
  isGoToOtherWindow: false,
  isOpenDrawer: false,
};

// reducer
const reducer = handleActions(
  {
    [setModalSend](state, { payload }) {
      return {
        ...state,
        isModalSend: payload,
      };
    },
    [setModalReceive](state, { payload }) {
      return {
        ...state,
        isModalReceive: payload,
      };
    },
    [setModalTxDetails](state, { payload }) {
      return {
        ...state,
        txDetails: payload,
      };
    },
    [setShowSpinner](state, { payload }) {
      return {
        ...state,
        isShowSpinner: payload,
      };
    },
    [goToOtherWindow](state, { payload }) {
      return {
        ...state,
        isGoToOtherWindow: payload,
      };
    },
    [setModalSwitchContacts](state, { payload }) {
      return {
        ...state,
        isModalSwitchContacts: payload.address,
        lastTxDetails: payload.txDetails,
      };
    },
    [setDrawer](state, { payload }) {
      return {
        ...state,
        isOpenDrawer: payload,
      };
    },
  },
  initialModalsState,
);

export default reducer;
