import React from 'react';
import { auth } from '../../firebaseConfig';
import { StyleSheet, Text, View, Dimensions, Image } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Maptest from '../Maptest';

//let bubbleIcon = require('../assets/bubble_borderHD.png');
const StackNav = createNativeStackNavigator();

export default class HomeComponent extends React.Component {
    render() {
        return (
            <StackNav.Navigator screenOptions={{
                headerShown:false
            }}>
                <StackNav.Screen name="Home-" component={Maptest}/>
            </StackNav.Navigator>
        );
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    map: {
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').width
    },
    marker: {
        width: Dimensions.get('window').width*0.1,
        height: Dimensions.get('window').width*0.1
    },
});
  