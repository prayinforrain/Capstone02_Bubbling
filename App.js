import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import LoginComponent from './componenets/login/LoginComponent';
import Maptest from './componenets/Maptest';
import TopFrame from './componenets/main/TopFrame';
import { auth } from './firebaseConfig';
import { useState, useEffect } from 'react';

export default function App() {
  const [init, setInit] = useState(false);
  const [isLoggedIn, setLoggedIn] = useState(false);
  const [userToken, setUserToken] = useState(null);
  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if(user) {
        setLoggedIn(true);
        setUserToken(user);
      } else {
        setLoggedIn(false);
      }
      setInit(true);
    });
  }, [])

  return (
    <View style={styles.container}>
      {isLoggedIn ?
      <View>
        <TopFrame style={styles.topFrame}/>
        <View style={styles.mainContent}>
          <Maptest/>
        </View>
        
      </View> :
      <LoginComponent/>}
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
  mainContent: {
    flex: 10
  },
  topFrame: {
    flex: 2
  }
});
