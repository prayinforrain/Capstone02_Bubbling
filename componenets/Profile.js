import React, {useState, useEffect, useCallback} from 'react';
import { StyleSheet, Text, View, Image, TextInput, Button, TouchableOpacity, TouchableWithoutFeedback, Keyboard, ScrollView, RefreshControl } from 'react-native';
import { dbService, storageService } from '../firebaseConfig';
import * as ImagePicker from 'expo-image-picker';
import uuid from 'react-native-uuid';
import { SafeAreaView } from 'react-native-safe-area-context';

import { userToken } from '../state';
import { useRecoilValue } from 'recoil';
import ArticleItem from './profileItems/ArticleItem';
import NewPostComponent from './profileItems/NewPostComponent';

const Profile = ({navigation, profileUID = -1}) => {
    const [isEditing, setIsEditing] = useState(false);
    const [userName, setName] = useState("");
    const [bio, setBio] = useState("");
    const [uid, setUID] = useState("");
    const [profileURL, setProfileURL] = useState("");
    const [attach, setAttach] = useState(null);
    
    const [Articles, setArticles] = useState([]);

    const user = useRecoilValue(userToken);


    useEffect(() => {
        if(profileUID === -1) {
            setUID(user);
        } else {
            //타인의 프로필을 볼 때
            setUID(profileUID);
        }
    }, [profileUID]);

    useEffect(() => {
        initUserInfo();
    }, [uid]);

    //이미지 픽커

    let openImagePickerAsync = async () => {
        if(!isEditing) return;
        let permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
        if (permissionResult.granted === false) {
            alert("Permission to access camera roll is required!");
            return;
        }
    
        let pickerResult = await ImagePicker.launchImageLibraryAsync();
        if (pickerResult.cancelled === true) {
            return;
        }
      
        setAttach({ localUri: pickerResult.uri });
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

    const onSubmit = async () => {
        var newProfileURI = "";
        if(attach !== null) {
            newProfileURI = await uploadImage(attach.localUri, user);
        }
        else {
            newProfileURI = profileURL;
        }
        dbService.collection("userProfile").doc(uid).update({
            displayName: userName,
            bio : bio,
            profileURL: newProfileURI,
            userID: userName,
        });
        //initUserInfo();
        onRefresh();
        setIsEditing(false);
    }


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
            
            dbService.collection("articles").where("author", "==", uid).orderBy("createdAt", "asc").onSnapshot((snapshot => {
                let tempArr = [];
                snapshot.docs.forEach((data) => {
                    tempArr.unshift({
                        id: data.id,
                        ...data.data()
                    });
                });
                setArticles(tempArr);
            }));
            
        }
    }

    //새로고침
    const [refreshing, setRefreshing] = useState(false);
    const onRefresh = useCallback(() => {
        setAttach(null);
        initUserInfo();
        setIsEditing(false);
        setRefreshing(true);
        wait(2000).then(() => setRefreshing(false));
    }, []);
    const wait = (timeout) => {
        return new Promise(resolve => setTimeout(resolve, timeout));
    }

    //bio 줄수 제한하기
    const onChangeBio = (val) => {
        const line = val.split("\n");
        if(line.length > 4) {
            return;
        }
        for(var i = 0; i < line.length; i++) {
            //console.log(i + "번째 줄 : " + line[i].length);
            //13개까지만 허용
            if(line[i].length > 13) return;
        }
        setBio(val);
    }

    //새 게시글 모달을 위한 설정
    const [modalVisible, setModalVisible] = useState(false);
    const [newPostText, setNewPostText] = useState("");
    const [newPostColor, setNewPostColor] = useState("gray");

    const newArticlePlaceholder = {
        color: newPostColor,
    }

    useEffect(() => {
        if(newPostText !== "") {
            if(newPostColor !== "black") setNewPostColor("black");
        } else {
            if(newPostColor !== "gray") setNewPostColor("gray");
        }
    }, [newPostText]);

    return (
        <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
            <TouchableWithoutFeedback onPress={()=>{
                Keyboard.dismiss();}} >
                <ScrollView style={{flex:1}} >
                    <View style={styles.ProfileConatiner}>
                        <View style={styles.ProfilePictureConatiner}>
                            <TouchableWithoutFeedback onPress={openImagePickerAsync}>
                                {attach ? (
                                    <Image
                                    source={{uri: attach.localUri}}
                                    style={styles.ProfilePicture}
                                    />
                                ) : (profileURL!==""? (
                                    <Image
                                    source={{uri: profileURL}}
                                    style={styles.ProfilePicture}
                                    />
                                ) : (
                                    <Image
                                    source={{uri: "https://firebasestorage.googleapis.com/v0/b/capstone-c19b7.appspot.com/o/image.png?alt=media&token=8942ae6a-661c-454c-a513-0c85833d3791"}}
                                    style={styles.ProfilePicture}
                                    />
                                ))}
                            </TouchableWithoutFeedback>
                        </View>
                        {!isEditing? (
                            <View style={styles.ProfileNameConatiner}>
                                <Text style={styles.userName}>{userName}</Text>
                                <Text numberOfLines={4} style={styles.userBio}>{bio}</Text>
                            </View>
                        ) : (
                            <View style={styles.ProfileNameConatiner}>
                                <TextInput placeholder="" onChangeText={(val) => setName(val)} value={userName} style={styles.userName}/>
                                <TextInput numberOfLines={4} placeholder="" onChangeText={(val) => onChangeBio(val)} value={bio} style={styles.userBio} multiline={true}/>
                            </View>
                        )}
                    </View>
                    <TouchableOpacity style={styles.BtnDeafult} onPress={()=>{
                        if(isEditing == true) onSubmit();
                        else setIsEditing(true);
                    }}>
                            <Text style={styles.BtnTextDefault}>{isEditing == true?("저장"):("프로필 편집")}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.newArticleContainer} onPress={() => setModalVisible(true)}>
                        <View>
                            <Text style={newArticlePlaceholder} numberOfLines={1}>{newPostText !== "" ? newPostText : "무슨 생각을 하고 있나요?"}</Text>
                        </View>
                    </TouchableOpacity>
                    <NewPostComponent modalVisible={modalVisible} setModalVisible = {setModalVisible} setNewPostText = {setNewPostText} userToken = {user}/>
                    <View style={styles.ArticlesContainer}>
                        {Articles.length > 0 ? (
                            Articles.map((i) => (
                                <ArticleItem key={i.id} ArticleData={i} refreshing={refreshing}/>
                            ))
                        ) : (
                            <View style={styles.emptyContainer}>
                                <Text style={styles.emptyText}>아직 게시글이 없습니다!</Text>
                            </View>
                        )}
                    </View>
                </ScrollView>
            </TouchableWithoutFeedback>
        </SafeAreaView>
    );
}

export default Profile;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: "100%",
        justifyContent: "center",
        alignSelf:"center",
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
    BtnDeafult: {
        marginVertical: 10,
        marginHorizontal:25,
        paddingVertical: 7,
        borderWidth: 1,
        borderColor: "lightgray",
        borderRadius: 5,
        height: 32,
    },
    BtnTextDefault: {
        fontSize: 14,
        textAlign: "center"
    },
    ProfileConatiner: {
        flex:2,
        flexDirection:"row",
        marginTop: 30,
        marginBottom: 20
    },
    ProfileNameConatiner: {
        flex:1,
        flexDirection: 'column',
        paddingHorizontal: 10,
    },
    ProfilePictureConatiner: {
        flex:1,
    },
    ProfilePicture: {
        width: "70%",
        aspectRatio: 1,
        borderRadius: 100,
        resizeMode: "cover",
        alignSelf: "center"
    },
    userName: {
        fontSize:27,
        fontWeight:"500",
        textAlign:"center",
        marginVertical:15,
        flex:2
    },
    userBio: {
        flex:4,
        height: 80,
        alignContent:"flex-start"
    },
    ArticlesContainer: {
        paddingHorizontal:10,
        paddingVertical:5,
    },
    newArticleContainer: {
        paddingVertical: 15,
        paddingHorizontal: 20,
        backgroundColor: "white",
        borderWidth: 1,
        borderColor: "lightgrey",
    },
    newArticlePlaceholder : {
        color: "gray",
    },
    emptyContainer: {
        backgroundColor:"#eee",
        flex:1,
        justifyContent:"center",
        alignItems:"center",
        paddingTop:50,
        paddingBottom:300,
    },
    emptyText: {
        color:"black",
        opacity: 0.4
    }
});