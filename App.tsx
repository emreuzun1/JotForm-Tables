import React, {useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {Provider} from 'react-redux';
import {PersistGate} from 'redux-persist/integration/react';
import {navigationRef} from './src/Navigation/RootNavigation';
import Toast from 'react-native-toast-message';

import MainNavigator from './src/Navigation/MainNavigator';
import {store, persistor} from './src/redux/store';
import {setAppKey} from './src/lib/axios';

const App = () => {
  const [loggedIn, setLoggedIn] = useState<boolean>(false);

  const onBeforeLift = () => {
    const {auth} = store.getState();
    if (auth.appKey) {
      setLoggedIn(true);
      setAppKey(auth.appKey);
    }
  };

  return (
    <Provider store={store}>
      <PersistGate
        onBeforeLift={onBeforeLift}
        loading={null}
        persistor={persistor}>
        <NavigationContainer ref={navigationRef}>
          <MainNavigator loggedIn={loggedIn} />
          <Toast ref={ref => Toast.setRef(ref)} />
        </NavigationContainer>
      </PersistGate>
    </Provider>
  );
};

export default App;
