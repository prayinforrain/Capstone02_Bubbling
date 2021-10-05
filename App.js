import React from 'react';
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { auth } from './firebaseConfig';
import { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import HomeComponent from './componenets/main/HomeComponent';
import LoginComponent from './componenets/login/LoginComponent';


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

  return (
      <NavigationContainer>
        <TabNav.Navigator
        initialRouteName="Home"
        screenOptions= {{
          title: "AppName",
          headerLeft: function() {
            return (
              <TouchableOpacity style={styles.headerButtons}>
                <Ionicons name="person-circle" size={32}/>
              </TouchableOpacity>
            )
          },
          headerRight: function() {
            return(
              <TouchableOpacity style={styles.headerButtons}>
                <Ionicons name="add-circle" size={32}/>
              </TouchableOpacity>
            )
          }
        }}>
          <TabNav.Screen
          name="Home"
          component={HomeComponent}
          options={{
              tabBarLabel: 'Home',
              tabBarIcon: ({color, size}) => (
                <Ionicons name="home" color={color} size={size}/>
              ),
          }}/>
          <TabNav.Screen
          name="Login"
          component={LoginComponent}
          options={{
              tabBarLabel: 'Login',
              tabBarIcon: ({color, size}) => (
                <Ionicons name="add-circle" color={color} size={size}/>
              ),
          }}/>
        </TabNav.Navigator>
      </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  headerButtons: {
    marginHorizontal: 15,
  }
});
