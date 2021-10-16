import React, {useState, useEffect, useRef} from 'react';
import { StyleSheet, Text, View, TextInput, Image, Button, TouchableOpacity, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { dbService, auth, storageService } from '../../firebaseConfig';
import { MaterialIcons } from '@expo/vector-icons'; 
import Modal from "react-native-modal";
import uuid from 'react-native-uuid';

let bubbleIcon = require('../../assets/bubble_borderHD.png');

const NewBubbleComponent = ({modalVisible, setModalVisible, userToken}) => {
    //회원 정보
    const [content, setContent] = useState("");

    const [selectedImage, setSelectedImage] = useState(null);
    const [docExist, setDocExist] = useState(false);
    const [Error, setError] = useState("");
    const [lon, setLon] = useState(0);
    const [lat, setLat] = useState(0);

    //이미지 픽커

    let openImagePickerAsync = async () => {
        let permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
        if (permissionResult.granted === false) {
            alert("Permission to access camera roll is required!");
            return;
        }
    
        let pickerResult = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images
        });
        if (pickerResult.cancelled === true) {
            return;
        }
      
        setSelectedImage({ localUri: pickerResult.uri });
    }
    
    useEffect(() => {
        //현재 좌표를 따옴
        dbService.collection("userProfile").doc(userToken.uid).get().then((doc) => {
            setLon(doc.data().lon);
            setLat(doc.data().lat);
        });
    }, []);

    //ㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡ

    const onBackgroundTouch = () => {
        setModalVisible(false);
    }

    const onSubmit = async () => {
        if(content !== "" || selectedImage !== null) {
            let attachURL = "";
            //업로드할 내용이 있음
            if(selectedImage !== null) {
                //그림이 있을 경우
                attachURL = await uploadImage(selectedImage.localUri, userToken.uid);
            }
            //업로드
            dbService.collection("bubbles").add({
                content,
                postedAt: Date.now(),
                lat: lat,
                long: lon,
                author: userToken.uid,
                Image: attachURL
            });
            setSelectedImage(null);
            setContent("");
            onBackgroundTouch();
        }
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


    // https://animate.style/
    return (
        <Modal isVisible={modalVisible}
        animationIn="bounceIn"
        animationOut="bounceOut"
        animationInTiming={600}
        animationOutTiming={600}
        backdropTransitionInTiming={600}
        backdropTransitionOutTiming={600}
        onBackdropPress={onBackgroundTouch}>
            <View style={styles.container}>
                <Text style={styles.header}>새 게시글</Text>
                <Text>lat : {lat}, lon : {lon}</Text>
                <View style={{flexDirection:"row"}}>
                    <TouchableOpacity style={styles.AddProfileContainer} onPress={openImagePickerAsync}>
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
                    </TouchableOpacity>
                    <TextInput
                        placeholder="Content"
                        style={styles.input}
                        value={content}
                        onChangeText={(val) => {setContent(val)}}
                    />
                </View>
                <TouchableOpacity style={styles.buttonDefault} onPress={onSubmit}>
                    <Text style={styles.btnText}>Post</Text>
                </TouchableOpacity>
            </View>
        </Modal>
    );
}

export default NewBubbleComponent;

const styles = StyleSheet.create({
    container: {
        justifyContent: "center",
        width: "90%",
        alignSelf: "center",
        backgroundColor:"white",
        paddingHorizontal: 20,
        paddingVertical: 50
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
        width: "70%",
    },
    buttonDefault: {
        marginTop: 20,
        paddingVertical: 7,
        width: "100%",
        borderWidth: 1,
        borderColor: "lightgray",
        borderRadius: 5
    },
    btnText: {
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
        borderRadius: 5,
        width:"30%"
    }
});