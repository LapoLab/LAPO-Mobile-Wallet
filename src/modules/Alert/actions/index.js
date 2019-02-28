// @flow
import { createActions } from 'redux-actions';

export const { showAlert, hideAlert } = createActions({
  SHOW_ALERT: (title = '', content = '', buttons = [], config) => ({
    title,
    content,
    buttons,
    config,
  }),
  HIDE_ALERT: (data = '') => data,
});
