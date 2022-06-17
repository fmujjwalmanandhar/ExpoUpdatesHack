import React,{useEffect,useState,useRef} from 'react';
import { StatusBar,StyleSheet,Pressable,AppState,Alert, Text, View } from 'react-native';

import * as Updates from 'expo-updates';

export default function App() {
  const appState = useRef(AppState.currentState);
  const [appStateVisible, setAppStateVisible] = useState(appState.current);
  const [bannerVisible, setBannerVisible] = useState(false);

const _handleUpdate=async()=>{
    try {
      const fetchedUpdateResult = await Updates.fetchUpdateAsync();
      console.log('fetchedUpdateResult: ', fetchedUpdateResult);
      if (fetchedUpdateResult.isNew) {
        await Updates.reloadAsync();
      } else {
        Alert.alert(
          'No Update Available',
          `Your app is up-to-date with the current version: v${Updates.runtimeVersion}.`
        );
      }
    } catch (error) {
      console.log('Error downloading update: ', error);
  }
}

 // Check for app updates when app is foregrounded
 useEffect(() => {
  const checkForUpdates = async () => {
    try {
      const updateCheckResult = await Updates.checkForUpdateAsync();
      console.log('updateCheckResult: ', updateCheckResult);
      setBannerVisible(updateCheckResult.isAvailable);
    } catch (error) {
      console.log('Error checking for app updates: ', error);
    }
  };
  const subscription = AppState.addEventListener('change', (nextAppState) => {
    if (
      appState.current.match(/inactive|background/) &&
      nextAppState === 'active'
    ) {
      // App state is active
      checkForUpdates();
    }

    appState.current = nextAppState;
    setAppStateVisible(appState.current);
  });

  return () => {
    subscription.remove();
  };
}, []);
  
  return (
    <View style={styles.container}>
      <Text>checking new OTA updates UpdateId 23: {Updates.updateId}</Text>
      <StatusBar barStyle={"dark-content"} />
          {
            bannerVisible &&
            <Pressable
              style={styles.showBanner}
            >
            <Text style={styles.showBannerText}>
            There is an update available for this app, click to update the app
            </Text>
          </Pressable>
      }
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  showBanner: {
    alignItems: 'center',
    backgroundColor: 'royalblue',
    justifyContent: 'center',
    padding: 16,
    width: '75%',
  },
  showBannerText: {
    color: 'black',
    fontWeight: 'bold',
  },
});
