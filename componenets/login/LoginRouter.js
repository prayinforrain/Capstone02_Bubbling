import React, {useState, useEffect} from 'react';
import { auth } from '../../firebaseConfig';
import { StyleSheet, Text, View, Dimensions, Image } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginComponent from './LoginComponent';
import RegisterComponent from './RegisterComponent';

import { isLoggedIn, userToken } from '../../state';
import { useRecoilState } from 'recoil';
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';

//let bubbleIcon = require('../assets/bubble_borderHD.png');
const StackNav = createNativeStackNavigator();

const LoginRouter = () => {
    return (
        <>
            <StatusBar style="auto"/>
            <StackNav.Navigator screenOptions={{
                headerShown:false
            }}>
                <StackNav.Screen name="LoginMain" component={LoginComponent} routerObject = {StackNav}/>
                <StackNav.Screen name="Register" component={RegisterComponent} routerObject = {StackNav}/>
            </StackNav.Navigator>
        </>
    );
}

export default LoginRouter;

const styles = StyleSheet.create({
});