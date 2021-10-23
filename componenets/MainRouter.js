import React from 'react';
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { auth, dbService } from '../firebaseConfig';
import { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import * as Location from 'expo-location';

import {userToken, isLoggedIn, userLon, userLat} from '../state';
import { useRecoilState } from 'recoil';
import LoginRouter from './login/LoginRouter';
import Newsfeed from './main/Newsfeed';
import Profile from './Profile';
import HomeRouter from './main/HomeRouter';
import Splash from './main/Splash';
import SearchRouter from './main/SearchRouter';
import { SafeAreaProvider } from 'react-native-safe-area-context';

const TabNav = createBottomTabNavigator();

const MainRouter = () => {
    const [user, setUser] = useRecoilState(userToken);
    const [isLogged, setIsLoggedIn] = useRecoilState(isLoggedIn);
    const [lon, setLon] = useRecoilState(userLon);
    const [lat, setLat] = useRecoilState(userLat);

    auth.onAuthStateChanged((u) => {
        if(u) {
            setIsLoggedIn(1);
            if(u.uid == user) return;
            else {
                setUser(u.uid);
            }
        }
        else {
            setIsLoggedIn(-1);
            setUser(null);
        }
    });

    useEffect(() => {
        if(user) geoLocation(user);
    }, [user]);

    const geoLocation = async(user) => {
        try {
            //userToken이 있을 경우 DB에서 마지막 좌표를 받아옴
            if(user) {
                dbService.collection("userProfile").doc(user).get().then((doc) => {
                    if(doc.exists) {
                        if(doc.data().lat != null) {
                            setLat(doc.data().lat);
                        }
                        if(doc.data().lon != null) {
                            setLon(doc.data().lon);
                        }
                    } else { // userProfile 데이터가 없는 유저의 경우
                    }
                });
            }
            const responseForeground = await Location.requestForegroundPermissionsAsync();
            //const responseBackground = await Location.requestBackgroundPermissionsAsync();
            const location = await Location.getCurrentPositionAsync();
            setLon(location.coords.longitude);
            setLat(location.coords.latitude);
            dbService.collection("userProfile").doc(user).update({
                lat: location.coords.latitude,
                lon: location.coords.longitude,
            });
        } catch(err) {
            console.log(err);
        }
    }

    //Test Method
    const onLogOut = () => {
        //로그아웃 핸들러
        auth.signOut();
    }

    if(isLogged == 0) {
        return (
            <Splash/>
        )
    }

    return (
        <>
        <SafeAreaProvider>
                <NavigationContainer>
            {isLogged == -1 ? (
                <LoginRouter/>
            ) : (
                <>
                    <StatusBar/>
                    <TabNav.Navigator
                    initialRouteName="Home"
                    screenOptions= {{
                        headerShown: false,
                        title: "Bubbling",
                    }}>
                        <TabNav.Screen
                        name="Home"
                        children={({navigation}) => <HomeRouter navigation = {navigation}/>}
                        options={{
                            tabBarLabel: 'Home',
                            tabBarIcon: ({color, size}) => (
                            <Ionicons name="home" color={color} size={size}/>
                            ),
                        }}
                        />
                        <TabNav.Screen
                        name="SearchRouter"
                        children={({navigation}) => <SearchRouter navigation = {navigation}/>}
                        options={{
                            tabBarLabel: 'Search',
                            tabBarIcon: ({color, size}) => (
                            <Ionicons name="search-outline" color={color} size={size}/>
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
            </NavigationContainer>
        </SafeAreaProvider>
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