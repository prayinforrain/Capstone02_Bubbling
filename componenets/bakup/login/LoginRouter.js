import React, {useState, useEffect} from 'react';
import { auth } from '../../firebaseConfig';
import { StyleSheet, Text, View, Dimensions, Image } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginComponent from './LoginComponent';
import RegisterComponent from './RegisterComponent';
import Profile from './Profile';

//let bubbleIcon = require('../assets/bubble_borderHD.png');
const StackNav = createNativeStackNavigator();

const LoginRouter = ({userToken}) => {
    const [isLoggedIn, setLoggedIn] = useState(false);
    

    return (
        <StackNav.Navigator screenOptions={{
            headerShown:false
        }}>
            {userToken != null ? (
                <>
                <StackNav.Screen name="Profile" component={Profile} routerObject = {StackNav}/>
                </>
            ) : (
                <>
                <StackNav.Screen name="LoginMain" component={LoginComponent} routerObject = {StackNav} isLoggedIn = {isLoggedIn} setLoggedIn={setLoggedIn}/>
                <StackNav.Screen name="Register" component={RegisterComponent} routerObject = {StackNav}/>
                </>
            )}
        </StackNav.Navigator>
    );
}

export default LoginRouter;

const styles = StyleSheet.create({
});
  