import React from 'react';
import { auth } from '../../firebaseConfig';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Maptest from '../Maptest';
import { Ionicons } from '@expo/vector-icons';
import LoginComponent from '../login/LoginComponent';
import RegisterComponent from '../login/RegisterComponent';

//let bubbleIcon = require('../assets/bubble_borderHD.png');
const StackNav = createNativeStackNavigator();

const HomeComponent = ({navigation, userToken}) => {
  if(userToken == null) {
    
  }
    return (
        <StackNav.Navigator screenOptions={{
            headerShown:true,
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
            {userToken !== null ? (
              <>
              <StackNav.Screen name="Home-"
              children={({navigation}) => <Maptest navigation = {navigation} userToken = {userToken} />}/>
              </>
            ) : (
              <>
              <StackNav.Screen name="LoginMain" component={LoginComponent} routerObject = {StackNav}/>
              <StackNav.Screen name="Register" component={RegisterComponent} routerObject = {StackNav}/>
              </>
            )}
        </StackNav.Navigator>
    );
}

export default HomeComponent;
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
});
  