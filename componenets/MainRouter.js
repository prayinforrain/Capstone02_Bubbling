import React from 'react';
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { auth } from '../firebaseConfig';
import { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';

import {userToken, isLoggedIn} from '../state';
import { useRecoilState } from 'recoil';
import LoginRouter from './login/LoginRouter';

const TabNav = createBottomTabNavigator();

const MainRouter = () => {
    const [user, setUser] = useRecoilState(userToken);
    const [isLogged, setIsLoggedIn] = useRecoilState(isLoggedIn);

    auth.onAuthStateChanged((u) => {
        if(u) {
            setIsLoggedIn(true);
            setUser(u.uid);
        }
        else {
            setIsLoggedIn(false);
            setUser(null);
        }
    });

    //Test Method
    const onLogOut = () => {
        //로그아웃 핸들러
        auth.signOut();
    }

    return (
        <>
        {user == null ? (
            <LoginRouter/>
        ) : (
            <View>
                <Text>
                    Logged in!
                </Text>
                <Text>uid : {user}</Text>
                <TouchableOpacity
                style={styles.loginButton}
                onPress = {onLogOut}
                >
                    <Text style={styles.loginText}>(Test)Signout </Text>
                </TouchableOpacity>
            </View>
        )}
        </>
    )
}

export default MainRouter;

const styles = StyleSheet.create({
    loginButton: {
        marginTop: 20,
        paddingVertical: 7,
        width: "100%",
        borderWidth: 1,
        borderColor: "lightgray",
        borderRadius: 5
    },
    loginText: {
        fontSize: 18,
        textAlign: "center"
    }
});