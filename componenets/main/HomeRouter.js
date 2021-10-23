import React from 'react';
import { Alert, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { auth } from '../../firebaseConfig';
import { useState, useEffect } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';

import {userToken, isLoggedIn} from '../../state';
import { useRecoilState } from 'recoil';
import LoginRouter from '../login/LoginRouter';
import Profile from '../Profile';
import HomeIndex from './HomeIndex';

const TabNav = createNativeStackNavigator();

const HomeRouter = ({loadModal = false}) => {
    const [user, setUser] = useRecoilState(userToken);
    const [isLogged, setIsLoggedIn] = useRecoilState(isLoggedIn);

    //Test Method
    const onLogOut = () => {
        //로그아웃 핸들러
        auth.signOut();
    }

    const ConfirmLogout = () => {
        Alert.alert(
            "Alert title",
            "Alert content",
            [
                {
                    text: "Cancel",
                    onPress: () => console.log("cancel"),
                    style: "cancel"
                },
                {
                    text: "OK",
                    onPress: () => console.log("OK"),
                }
            ]
        );
    }

    return (
        <>
        {user == null ? (
            <LoginRouter/>
        ) : (
            <>
                <StatusBar/>
                <TabNav.Navigator
                initialRouteName="Home"
                screenOptions= {{
                    headerShown: true,
                    title: "Bubbling",
                    headerLeft: function() {
                        if(isLogged !== 1) return null;
                        return (
                            <TouchableOpacity style={styles.headerButtons} onPress={ConfirmLogout}>
                            <Ionicons name="exit-outline" size={32}/>
                            </TouchableOpacity>
                        )
                    },
                }}>
                    <TabNav.Screen
                    name="NewsFeed"
                    children={({navigation}) => <HomeIndex navigation = {navigation} loadModal = {loadModal}/>}
                    options={{
                        tabBarLabel: 'Home',
                        tabBarIcon: ({color, size}) => (
                        <Ionicons name="home" color={color} size={size}/>
                        ),
                    }}
                    />
                    <TabNav.Screen
                    name="Profile"
                    children={({navigation}) => <Profile navigation={navigation} />}
                    options={{
                        tabBarLabel: 'Profile',
                        tabBarIcon: ({color, size}) => (
                          <Ionicons name="person" color={color} size={size}/>
                        ),
                    }}
                    />
                </TabNav.Navigator>
            </>
        )}
        </>
    )
}

export default HomeRouter;

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