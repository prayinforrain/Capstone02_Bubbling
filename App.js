import React from 'react';
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { auth } from './firebaseConfig';
import { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { RecoilRoot } from 'recoil';
import MainRouter from './componenets/MainRouter';

const TabNav = createBottomTabNavigator(); // to be deleted

export default function App() {
    return (
        <SafeAreaProvider>
            <RecoilRoot>
                <MainRouter/>
            </RecoilRoot>
        </SafeAreaProvider>
    );
}

const styles = StyleSheet.create({
    headerButtons: {
        marginHorizontal: 15,
    }
});
