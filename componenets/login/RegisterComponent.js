import React, {useState, useEffect, useRef} from 'react';
import { StyleSheet, Text, View, TextInput, Image, Button, TouchableOpacity, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { dbService, auth, storageService } from '../../firebaseConfig';
import { MaterialIcons } from '@expo/vector-icons'; 
import uuid from 'react-native-uuid';

let bubbleIcon = require('../../assets/bubble_borderHD.png');

const RegisterComponent = ({navigation}) => {
    //회원 정보
    const [ID, setID] = useState("");
    const [Password, setPassword] = useState("");
    const [pwConfirm, setPwConfirm] = useState("");
    const [userName, setUserName] = useState("");
    const [profileURL, setProfileURL] = useState();
    const [userProfileID, setUserProfileID] = useState("");

    const [selectedImage, setSelectedImage] = useState(null);
    const [docExist, setDocExist] = useState(false);
    const [Error, setError] = useState("");

    //이미지 픽커

    let openImagePickerAsync = async () => {
        let permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
        if (permissionResult.granted === false) {
            alert("Permission to access camera roll is required!");
            return;
        }
    
        let pickerResult = await ImagePicker.launchImageLibraryAsync();
        if (pickerResult.cancelled === true) {
            return;
        }
      
        setSelectedImage({ localUri: pickerResult.uri });
        setProfileURL(pickerResult.uri);
    }
    
    const uploadImage = async (uri, uid) => {
        const response = await fetch(uri);
        const blob = await response.blob();
    
        try {
            const ref = storageService.ref().child(`${uid}/${uuid.v4()}`);
            const res = await ref.put(blob);
            return await res.ref.getDownloadURL();
        } catch (error) {
            console.log("업로드 에러");
            console.log(error);
            return "";
        }
    }

    //ㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡ

    const checkID = () => {
        let temp = false;
        if(userProfileID !== "") {
            dbService.collection("userProfile").where("userID", "==", userProfileID)
            .get().then(res => {
                res.forEach((doc) => {
                    temp = true;
                    setDocExist(true);
                })
                if(temp) {
                    setError("Your Name already exists");
                } else {
                    if(error === "Your Name already exists") {
                        setError("");
                    }
                    setDocExist(false);
                }
            }).catch(err => {
                    setError(err.message);
            });
        }
    }

    const onRegister = async (event) => {
        event.preventDefault();
        if(!docExist) {
            if(Password === pwConfirm) {
                if(ID !== "" && Password !== "" && userName !== "" && userProfileID !== "") {
                    try {
                        if(!docExist) {
                            var resURL = "https://firebasestorage.googleapis.com/v0/b/capstone-c19b7.appspot.com/o/image.png?alt=media&token=8942ae6a-661c-454c-a513-0c85833d3791";
                            const userCredential = await auth.createUserWithEmailAndPassword(ID, Password)
                            var user = userCredential.user;
                            if(profileURL !== "" && typeof(profileURL) !== "undefined") {
                                resURL = await uploadImage(profileURL, user.uid);
                            }
                            await dbService.collection("userProfile").doc(user.uid).set({
                                displayName: userName,
                                bio : "",
                                profileURL: resURL,
                                userID: userProfileID,
                                lat: 0.0,
                                lon: 0.0,
                            });
                            //window.location.href("/");
                            history.push('/');
                        }
                    } catch (error) {
                        setError(error.message);
                    }
                } else {
                    setError("All the fields are required.")
                }
            } else {
                //Password Confirm
                setError("Password should be same as Confirm Password.")
            }
        } else setError("Your Name already exists");
    }

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Register Component</Text>
            <TextInput
                placeholder="ID"
                style={styles.input}
                value={ID}
                onChangeText={val => setID(val)}
            />
            <TextInput
                placeholder="Password"
                style={styles.input}
                value={Password}
                onChangeText={val => setPassword(val)}
                secureTextEntry={true}
            />
            <TextInput
                placeholder="Confirm Password"
                style={styles.input}
                value={pwConfirm}
                onChangeText={val => setPwConfirm(val)}
                secureTextEntry={true}
            />
            <TextInput
                placeholder="Profile ID"
                style={styles.input}
                value={userProfileID}
                onChangeText={val => setUserProfileID(val)}
                onBlur={checkID}
            />
            <TextInput
                placeholder="Name"
                style={styles.input}
                value={userName}
                onChangeText={val => setUserName(val)}
            />
            <View style={styles.AddProfileContainer}>
                <View style={styles.ImageConatiner}>
                    {selectedImage !== null ? (
                        <Image
                        source={{uri: selectedImage.localUri}}
                        style={styles.Thumbnail}
                        />
                    ) : (
                        <MaterialIcons name="add-a-photo" size={24} color="black" />
                    )}
                </View>
                
                <TouchableOpacity onPress={openImagePickerAsync} style={styles.Imagebutton}>
                    <Text style={styles.loginText}>Pick a photo</Text>
                </TouchableOpacity>
            </View>
            
            <TouchableOpacity
            style={styles.loginButton}
            onPress = {onRegister}
            >
                <Text style={styles.loginText}>Register</Text>
            </TouchableOpacity>
            <Text>{Error}</Text>
        </View>
    );
}

export default RegisterComponent;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        width: "80%",
        alignSelf: "center"
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
    },
    Imagebutton: {
        paddingVertical: 7,
        width: "100%",
        borderWidth: 1,
        borderColor: "lightgray",
        borderRadius: 5
    },
    Thumbnail: {
        width: 300,
        height: 150,
        resizeMode: "contain",
    },
    ImageConatiner: {
        width: "100%",
        minHeight: 100,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "white"
    },
    AddProfileContainer: {
        marginTop: 20,
        borderWidth: 1,
        borderColor: "lightgray",
        borderRadius: 5
    }
});