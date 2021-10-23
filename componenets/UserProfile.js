import React, {useState, useEffect, useCallback} from 'react';
import { StyleSheet, Text, View, Image, TouchableWithoutFeedback, ScrollView } from 'react-native';
import { dbService } from '../firebaseConfig';
import uuid from 'react-native-uuid';

import { userToken } from '../state';
import { useRecoilValue } from 'recoil';
import ArticleItem from './profileItems/ArticleItem';

//타인의 프로필을 열람하기 위한 컴포넌트

const UserProfile = ({navigation, route, profileUID = "-1"}) => {
    const [userName, setName] = useState("");
    const [bio, setBio] = useState("");
    const [uid, setUID] = useState("");
    const [profileURL, setProfileURL] = useState("");

    const [Articles, setArticles] = useState([]);

    const user = useRecoilValue(userToken);

    /* 열람할 유저정보를 받기 위한 부분 */
    useEffect(() => {
        if(route) {
            profileUID = route.params.profileUID;
        }
    }, [])

    useEffect(() => {
        if(userName !== "") {
            navigation.setOptions({
                headerShown:true,
                title: userName
            });
        }
    }, [userName])
    /* 이 부분 반드시 살릴 것 */


    useEffect(() => {
        if(profileUID == -1) {
            setUID(user);
        } else {
            //타인의 프로필을 볼 때
            setUID(profileUID);
        }
    }, [profileUID]);

    useEffect(() => {
        initUserInfo();
    }, [uid]);

    //ㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡ

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
        initUserInfo();
        setRefreshing(true);
        wait(2000).then(() => setRefreshing(false));
    }, []);
    const wait = (timeout) => {
        return new Promise(resolve => setTimeout(resolve, timeout));
    }

    return (
        <View style={styles.container}>
            <TouchableWithoutFeedback>
                <ScrollView style={{flex:1}} >
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
                            <Text style={styles.userName}>{userName}</Text>
                            <Text numberOfLines={4} style={styles.userBio}>{bio}</Text>
                        </View>
                    </View>
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
        </View>
    );
}

export default UserProfile;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: "100%",
        justifyContent: "center",
        alignSelf:"center",
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