import React, {useState, useEffect} from 'react';
import { StyleSheet, Text, View, Image, TextInput, Button, TouchableOpacity, Alert } from 'react-native';
import { Marker } from 'react-native-maps';
import { dbService, auth } from '../../firebaseConfig';

let bubbleIcon = require('../../assets/bubble_borderHD.png');

const Profile = ({navigation, profileUID = -1}) => {
    const [isEditing, setIsEditing] = useState(false);
    const [userName, setName] = useState("");
    const [bio, setBio] = useState("");
    const [uid, setUID] = useState("");
    const [profileURL, setProfileURL] = useState("");
    const [attach, setAttach] = useState("");


    useEffect(() => {
        if(profileUID === -1) {
            setUID(auth.currentUser.uid);
        } else {
            //타인의 프로필을 볼 때
            setUID(profileUID);
        }
    }, [profileUID]);

    useEffect(() => {
        initUserInfo();
    }, [uid]);

    const initUserInfo = async() => {
        if(uid !== "") {
            dbService.collection("userProfile").doc(uid).get().then((doc) => {
                if(doc.exists) {
                    setName(doc.data().displayName);
                    setBio(doc.data().bio);
                    if(doc.data().profileURL !== "") setProfileURL(doc.data().profileURL);
                } else { // userProfile 데이터가 없는 유저의 경우
                    dbService.collection("userProfile").doc(uid).set({
                        displayName: userName,
                        bio : "",
                        profileURL: "https://firebasestorage.googleapis.com/v0/b/capstone-c19b7.appspot.com/o/image.png?alt=media&token=8942ae6a-661c-454c-a513-0c85833d3791",
                        userID: "",
                        lat: 0.0,
                        lon: 0.0,
                    });
                }
            });
            /*
            dbService.collection("articles").where("author", "==", uid).orderBy("createdAt", "asc").onSnapshot((snapshot => {
                tempArr = [];
                console.log(snapshot);
                snapshot.docs.forEach((data) => {
                    tempArr.unshift({
                        id: data.id,
                        ...data.data()
                    });
                });
                setArticles(tempArr);
            }));
            */
        }
    }

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Profile Component</Text>
            <View style={styles.ProfileConatiner}>
                <View style={styles.ProfilePictureConatiner}>
                    {profileURL!==""? (
                        <Image
                        source={{uri: profileURL}}
                        style={styles.ProfilePicture}
                        />
                    ) : (
                        <Image
                        source={{uri: "https://firebasestorage.googleapis.com/v0/b/capstone-c19b7.appspot.com/o/image.png?alt=media&token=8942ae6a-661c-454c-a513-0c85833d3791"}}
                        style={styles.ProfilePicture}
                        />
                    )}
                </View>
                <View style={styles.ProfileNameConatiner}>
                    <Text>userName : {userName}</Text>
                    <Text>bio : {bio}</Text>
                </View>
            </View>
            
        </View>
    );
}

export default Profile;

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
    ProfileConatiner: {
        flexDirection: "row",
    },
    ProfileNameConatiner: {
        width: "50%",
        height: "100%",
        flexDirection: 'column',
    },
    ProfilePictureConatiner: {
        width: "50%",
        height: "50%",
    },
    ProfilePicture: {
        width: "100%",
        height: "100%",
        resizeMode: "cover",
    }

});