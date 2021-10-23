import React from 'react';
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { auth } from '../../firebaseConfig';
import { useState, useEffect } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';

import {userToken, isLoggedIn} from '../../state';
import { useRecoilState } from 'recoil';
import LoginRouter from '../login/LoginRouter';
import UserProfile from '../UserProfile';
import SearchPage from './SearchPage';

const TabNav = createNativeStackNavigator();

const SearchRouter = () => {
    const [user, setUser] = useRecoilState(userToken);
    const [isLogged, setIsLoggedIn] = useRecoilState(isLoggedIn);

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
            <>
                <StatusBar/>
                <TabNav.Navigator
                initialRouteName="SearchMain"
                key="SearchRouter"
                screenOptions= {{
                    headerShown: false,
                    title: "Bubbling",
                }}>
                    <TabNav.Screen
                    name="SearchMain"
                    children={({navigation}) => <SearchPage navigation = {navigation}/>}
                    options={{
                        tabBarLabel: 'Search',
                        tabBarIcon: ({color, size}) => (
                        <Ionicons name="search-outline" color={color} size={size}/>
                        ),
                    }}
                    />
                    <TabNav.Screen
                    name="Profile"
                    children={({navigation, route}) => <UserProfile navigation={navigation} route={route}/>}
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

export default SearchRouter;

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