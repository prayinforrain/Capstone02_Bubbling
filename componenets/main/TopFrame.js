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
            <View style={styles.header}>
                <Text style={styles.headerText}>Logged in With : {auth.currentUser.email}</Text>
            </View>
            <TouchableOpacity
            style={styles.logout}
            onPress={onLogout}
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
        flexDirection:"row",
    },
    header: {
        flex: 8,
        justifyContent:"center",
    },
    headerText: {
        textAlign: "center",
    },
    logout: {
        flex: 2,
        justifyContent:"center",
    }
});