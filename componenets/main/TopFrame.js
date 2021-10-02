import React, {useState, useEffect, useRef} from 'react';
import { StyleSheet, Text, View, TextInput, Button, TouchableOpacity, Alert } from 'react-native';
import { Marker } from 'react-native-maps';
import { dbService, auth } from '../../firebaseConfig';

let bubbleIcon = require('../../assets/bubble_borderHD.png');

const LoginComponent = ({}) => {

    const onLogout = () => {
        auth.signOut();
    }

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Top Frame</Text>
            <TouchableOpacity
            style={styles.logout}
            >
                <Text>Logout</Text>
            </TouchableOpacity>
        </View>
    );
}

export default LoginComponent;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        width: "100%",
        flexDirection:"row"
    },
    header: {
        textAlign: "center",
        flex: 8
    },
    logout: {
        flex: 1
    }
});