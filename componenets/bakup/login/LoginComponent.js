import React, {useState, useEffect, useRef} from 'react';
import { StyleSheet, Text, View, TextInput, Button, TouchableOpacity, Alert } from 'react-native';
import { Marker } from 'react-native-maps';
import { dbService, auth } from '../../firebaseConfig';
import RegisterComponent from './RegisterComponent';

let bubbleIcon = require('../../assets/bubble_borderHD.png');

const LoginComponent = ({navigation, isLoggedIn, setLoggedIn}) => {
    const [test, setTest] = useState();

    const [ID, setID] = useState("");
    const [Password, setPassword] = useState("");
    const [Error, setError] = useState("");
    const onChangeID = (val) => setID(val);
    const onChangePW = (val) => setPassword(val);

    const onLoginHandler = async (e) => {
        e.preventDefault();
        try {
            let data = await auth.signInWithEmailAndPassword(ID, Password);
            //if(data.user !== null) setLoggedIn(true);
        } catch (error) {
            setError(error.message);
        }
    }
    const gotoRegister = () => {
        if(navigation) navigation.navigate("Register");
    }

    return (
        <View style={styles.container}>
            <Text>isLoggedIn = {isLoggedIn? (<Text>true</Text>) : <Text>false</Text>}</Text>
            <Text style={styles.header}>Login Component</Text>
            <TextInput
                placeholder="ID"
                style={styles.input}
                value={ID}
                onChangeText={onChangeID}
            />
            <TextInput
                placeholder="Password"
                style={styles.input}
                value={Password}
                onChangeText={onChangePW}
                secureTextEntry={true}
            />
            <TouchableOpacity
            style={styles.loginButton}
            onPress = {onLoginHandler}
            >
                <Text style={styles.loginText}>Login</Text>
            </TouchableOpacity>
            <TouchableOpacity
            style={styles.loginButton}
            onPress = {gotoRegister}
            >
                <Text style={styles.loginText}>Register</Text>
            </TouchableOpacity>
            <Text>{Error}</Text>
        </View>
    );
}

export default LoginComponent;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        width: "80%",
        alignSelf:"center"
    },
    header: {
        textAlign: "center",
    },
    input: {
        backgroundColor: "white",
        paddingVertical: 7,
        paddingHorizontal: 20,
        borderRadius: 30,
        marginTop: 20,
        fontSize: 18,
        borderColor: "lightgrey",
        borderStyle: "solid",
        borderBottomWidth: 2,
        borderRadius: 5,
        width: "100%",
    },
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