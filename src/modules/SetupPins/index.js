// @flow
import { createStackNavigator } from 'react-navigation';
// $FlowFixMe
import { fadeIn } from 'react-navigation-transitions';
import SetPins from './components/SetPins';
import ConfirmPins from './components/ConfirmPins';

export default createStackNavigator(
  {
    SetPins,
    ConfirmPins,
  },
  {
    // tabBarVisible: true,
    transitionConfig: () => fadeIn(),
    headerMode: 'none',
  },
);
