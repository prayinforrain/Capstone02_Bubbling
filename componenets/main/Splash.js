import React from 'react';
import { StyleSheet, Text, View, Dimensions, Image } from 'react-native';

//let bubbleIcon = require('../assets/bubble_borderHD.png');
let splashImg = require('../../assets/adaptive-icon.png');

const Splash = () => {
    return (
        <View style={styles.container}>
            <Image source={splashImg} style={styles.appIcon}/>
        </View>
    );
}

export default Splash;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    }, 
    appIcon: {
        width: 200,
        height: 200
    }
});