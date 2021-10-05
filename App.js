import React from 'react';
import { SafeAreaView, StyleSheet, Text, View } from 'react-native';
import LoginComponent from './componenets/login/LoginComponent';
import Maptest from './componenets/Maptest';
import TopFrame from './componenets/main/TopFrame';
import { auth } from './firebaseConfig';
import { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';


function HomeScreen() {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Home Screen</Text>
    </View>
  );
}

const StackNav = createNativeStackNavigator();
const TabNav = createBottomTabNavigator();


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

  /*
    <SafeAreaView style={styles.container}>
      {isLoggedIn ?
        <View>
          <View style={styles.topFrame}>
            <TopFrame/>
          </View>
          <View style={styles.mainContent}>
            <Maptest/>
          </View>
          <View style={styles.bottomFrame}>
          </View>
        </View> :
        <LoginComponent/>
      }
    </SafeAreaView>
  */
  return (
      <NavigationContainer>
        <TabNav.Navigator
        initialRouteName="Home"
        screenOptions= {{
          title: "AppName",
          headerLeft: function() {
            return (
              <Text>Left</Text>
            )
          },
          headerRight: function() {
            return(
              <Text>Right</Text>
            )
          }
        }}>
          <TabNav.Screen name="Home" component={Maptest}/>
        </TabNav.Navigator>
      </NavigationContainer>
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
    flex: 2,
    backgroundColor: "blue"
  },
  bottomFrame: {
    flex: 2
  }
});
