import React, {useState, useEffect} from 'react';
import { StyleSheet, Text, View, TextInput, Image, TouchableOpacity } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { dbService, storageService } from '../../firebaseConfig';
import { MaterialIcons } from '@expo/vector-icons'; 
import Modal from "react-native-modal";
import uuid from 'react-native-uuid';

const NewPostComponent = ({modalVisible, setModalVisible, setNewPostText, userToken}) => {
    //회원 정보
    const [content, setContent] = useState("");

    const [selectedImage, setSelectedImage] = useState(null);
    const [Error, setError] = useState("");

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

    //ㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡ

    const onBackgroundTouch = (ClearModal) => {
        if(ClearModal == true) setNewPostText("");
        else setNewPostText(content);
        setModalVisible(false);
    }

    const onSubmit = async () => {
        if(content !== "" || selectedImage !== null) {
            let attachURL = "";
            //업로드할 내용이 있음
            if(selectedImage !== null) {
                //그림이 있을 경우
                attachURL = await uploadImage(selectedImage.localUri, userToken);
            }
            //업로드
            dbService.collection("articles").add({
                content,
                createdAt: Date.now(),
                author: userToken,
                attach: attachURL,
                likes: []
            });
            setSelectedImage(null);
            setContent("");
            onBackgroundTouch(true);
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
                <View style={{flex:1}}>
                    {selectedImage !== null ? (
                        <TouchableOpacity style={styles.AddProfileContainer_Img} onPress={openImagePickerAsync}>
                            <View style={styles.ImageConatiner}>
                                <Image
                                    source={{uri: selectedImage.localUri}}
                                    style={styles.Thumbnail}
                                    />
                            </View>
                        </TouchableOpacity>
                    ) : (
                        <TouchableOpacity style={styles.AddProfileContainer_Btn} onPress={openImagePickerAsync}>
                            <MaterialIcons name="add-a-photo" size={24} color="black" />
                        </TouchableOpacity>
                    )}
                    <TextInput
                        placeholder="무슨 생각을 하고 있나요?"
                        style={styles.input}
                        value={content}
                        onChangeText={(val) => {setContent(val)}}
                        placeholderTextColor = "lightgrey"
                        multiline={true}
                    />
                </View>
                <TouchableOpacity style={styles.buttonDefault} onPress={onSubmit}>
                    <Text style={styles.btnText}>Post</Text>
                </TouchableOpacity>
            </View>
        </Modal>
    );
}

export default NewPostComponent;

const styles = StyleSheet.create({
    container: {
        justifyContent: "center",
        width: "90%",
        alignSelf: "center",
        backgroundColor:"white",
        paddingHorizontal: 20,
        paddingVertical: 50,
        flex:1,
        marginVertical:100
    },
    header: {
        textAlign: "center",
    },
    input: {
        backgroundColor: "white",
        paddingVertical: 15,
        paddingHorizontal: 10,
        marginTop: 20,
        fontSize: 18,
        borderColor: "lightgrey",
        borderStyle: "solid",
        borderWidth: 2,
        flex:1,
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
    Thumbnail: {
        flex: 1,
        aspectRatio:1,
        resizeMode: "contain",
    },
    ImageConatiner: {
        flex:1,
        aspectRatio:1,
        justifyContent: "center",
        alignItems: "center",
    },
    AddProfileContainer_Img: {
        marginTop: 20,
        borderWidth: 1,
        borderColor: "lightgray",
        borderRadius: 5,
        flex:1,
        alignItems:"center"
    },
    AddProfileContainer_Btn: {
        marginTop: 20,
        paddingVertical:7,
        borderWidth: 1,
        borderColor: "lightgray",
        borderRadius: 5,
        alignItems:"center"
    }
});