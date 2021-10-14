import React from 'react';
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { auth } from './firebaseConfig';
import { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import HomeComponent from './componenets/main/HomeComponent';
import LoginComponent from './componenets/login/LoginComponent';
import LoginRouter from './componenets/login/LoginRouter';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';


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
        setUserToken(null);
      }
      setInit(true);
    });
  }, [])

  if(!isLoggedIn) return (
    <SafeAreaProvider>
      <StatusBar/>
      <NavigationContainer>
      <TabNav.Navigator
          initialRouteName="Home"
          screenOptions= {{
            headerShown: false,
            title: "AppName",
          }}>
            <TabNav.Screen
            name="Login"
            children={({navigation}) => <LoginRouter navigation = {navigation} userToken = {userToken} />}
            options={{
                tabBarLabel: 'Login',
                tabBarIcon: ({color, size}) => (
                  <Ionicons name="add-circle" color={color} size={size}/>
                ),
            }}
            />
        </TabNav.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );

  return (
    <>
      <SafeAreaProvider>
        <StatusBar/>
        <NavigationContainer>
          <TabNav.Navigator
          initialRouteName="Home"
          screenOptions= {{
            headerShown: false,
            title: "AppName",
            headerLeft: function() {
              if(!isLoggedIn) return null;
              return (
                <TouchableOpacity style={styles.headerButtons}>
                  <Ionicons name="person-circle" size={32}/>
                </TouchableOpacity>
              )
            },
            headerRight: function() {
              if(!isLoggedIn) return null;
              return(
                <TouchableOpacity style={styles.headerButtons}>
                  <Ionicons name="add-circle" size={32}/>
                </TouchableOpacity>
              )
            }
          }}>

            <TabNav.Screen
            name="Home"
            children={({navigation}) => <HomeComponent navigation = {navigation} userToken = {userToken} />}
            options={{
                tabBarLabel: 'Home',
                tabBarIcon: ({color, size}) => (
                  <Ionicons name="home" color={color} size={size}/>
                ),
            }}
            />
            <TabNav.Screen
            name="Login"
            children={({navigation}) => <LoginRouter navigation = {navigation} userToken = {userToken} />}
            options={{
                tabBarLabel: 'Login',
                tabBarIcon: ({color, size}) => (
                  <Ionicons name="add-circle" color={color} size={size}/>
                ),
            }}
            />
            
          </TabNav.Navigator>
        </NavigationContainer>
      </SafeAreaProvider>
    </>
  );
}

const styles = StyleSheet.create({
  headerButtons: {
    marginHorizontal: 15,
  }
});
