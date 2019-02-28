import { handleActions } from 'redux-actions';
import { showAlert, hideAlert } from '../actions';

export const initialAlertState = {
  title: '',
  content: '',
  buttons: [],
  isShow: false,
};

// reducer
const reducer = handleActions(
  {
    [showAlert](
      state,
      {
        payload: { title, content, buttons },
      },
    ) {
      return {
        ...state,
        title,
        content,
        isShow: true,
        buttons,
      };
    },
    [hideAlert](
      state,
    ) {
      return {
        ...state,
        isShow: false,
      };
    },
  },
  initialAlertState,
);

export default reducer;
