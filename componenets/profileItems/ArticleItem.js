import { Ionicons } from '@expo/vector-icons';
import React, {useState, useEffect, useRef} from 'react';
import { StyleSheet, Text, View, Dimensions, Image, Animated, ImageBackground, TouchableWithoutFeedback, TouchableOpacity } from 'react-native';
import { useRecoilValue } from 'recoil';
import { dbService } from '../../firebaseConfig';
import { Entypo } from '@expo/vector-icons'; 

import { userToken } from '../../state';
import SelectDropdown from 'react-native-select-dropdown';

let noAttach = require('../../assets/empty.png');

const ArticleItem = ({ArticleData, refreshing}) => {
    const attach = ArticleData.attach ? ArticleData.attach : "";
    const content = ArticleData.content;
    const authorUid = ArticleData.author;
    const createdAt = ArticleData.createdAt;
    let likes = ArticleData.likes;
    const [authorName, setAuthorName] = useState("");
    const [authorProfile, setAuthorProfile] = useState("");
    const uid = ArticleData.id;

    const user = useRecoilValue(userToken);

    

    Date.prototype.showDate = function() {
        var mm = this.getMonth() + 1; // getMonth() is zero-based
        var dd = this.getDate();
        var hh = this.getHours();
        var min = this.getMinutes();
      
        return [this.getFullYear() + '-',
                (mm>9 ? '' : '0') + mm + '-',
                (dd>9 ? '' : '0') + dd + ' ',
                (hh>9 ? '' : '0') + hh + ':',
                (min>9 ? '' : '0') + min
               ].join('');
    };

    useEffect(() => {
        fetchUserData();
        checkLike();
    }, [refreshing])

    const [likeColor, setLikeColor] = useState("red");
    const likeColorStyle = {
        color: likeColor,
        fontSize: 15
    };
    const checkLike = () => {
        let likeIndex = likes.indexOf(user);
        if(likeIndex === -1) {
            setLikeColor("black");
            //styles.like.color="black";
        } else {
            setLikeColor("red");
            //styles.like.color="red";
        }
    }

    const doLike = async() => {
        let likeIndex = likes.indexOf(user);
        if(likeIndex === -1) {
            likes.push(user);
        } else {
            likes.splice(likeIndex, 1);
        }
        await dbService.doc(`articles/${uid}`).update({
            likes: likes
        });
        checkLike();
    }

    const fetchUserData = async () => {
        const res = await dbService.collection("userProfile").doc(authorUid).get();
        setAuthorProfile(res.data().profileURL);
        setAuthorName(res.data().displayName);
    }

    //드롭다운 메뉴
    const dropDowns = ["삭제"];

    return (
        <View style={styles.container}>
            <TouchableWithoutFeedback>
                <View style={styles.authorConatiner}>
                    <View style={styles.authorTag}>
                        {authorProfile !== "" ? (
                            <Image source={{uri:authorProfile}} style={styles.profileImg} />
                        ) : (
                            <Image source={noAttach} style={styles.profileImg}/>
                        )}
                        <Text numberOfLines={1} style={styles.profileName}>{authorName}</Text>
                        {authorUid == user && (
                            <SelectDropdown buttonStyle={{width:50}}
                            data={dropDowns}
                            onSelect={(Item, idx) => {
                                if(idx == 0) {
                                    dbService.doc(`articles/${uid}`).delete();
                                }
                            }}
                            buttonTextAfterSelection={(item, idx) => {
                                return <Entypo name="dots-three-vertical" size={20} style={{opacity:0.7, paddingHorizontal:10,}}/>
                            }}
                            defaultButtonText={<Entypo name="dots-three-vertical" size={20} style={{opacity:0.7, paddingHorizontal:10,}}/>}
                            >
                                <Entypo name="dots-three-vertical" size={20} style={{opacity:0.7, paddingHorizontal:10,}}/>
                            </SelectDropdown>
                        )}
                    </View>
                </View>
            </TouchableWithoutFeedback>
            {attach !== "" && (
                <View style={styles.articleImgContainer}>
                    <Image source={{uri:attach}} style={styles.articleImg}/>
                </View>
            )}
            <View style={styles.contentContainer}>
                <Text style={styles.article}>
                    {content}
                </Text>
            </View>
            <View ><Text style={styles.date}>{new Date(createdAt).showDate()}</Text></View>
            <View style={styles.footerContainer}>
                <TouchableOpacity onPress={doLike} style={[styles.like, likeColorStyle]}><Ionicons name="heart" style={likeColorStyle}/><Text style={likeColorStyle}> {likes.length}</Text></TouchableOpacity>
            </View>
        </View>
    );
}

export default ArticleItem;

const styles = StyleSheet.create({
    blankflexible: {
        flex:5
    }, 
    container: {
        width:"100%",
        marginVertical: 15,
        borderWidth: 1,
        borderColor:"gray"
    },
    authorConatiner: {
        flex:1,
        justifyContent:"space-between",
        alignItems:"flex-start",
        backgroundColor:"#eee",
        paddingVertical:7,
    },
    authorTag: {
        flex:1,
        flexDirection:"row",
        alignItems:"center",
        justifyContent:"flex-start",
        alignSelf:"baseline",
    },
    profileImg: {
        flex:1,
        aspectRatio:1,
        resizeMode: "cover",
        borderRadius: 99999,
        overflow:"hidden",
        marginLeft: 10,
        marginRight: 15,
    },
    profileName: {
        flex:8,
        fontSize:16,
        textAlign:"left",
    },
    articleImgContainer: {
        width: "100%",
        aspectRatio: 1,
    },
    articleImg: {
        flex: 1,
        aspectRatio: 1
    },
    contentContainer: {
        flex: 7,
    },
    article: {
        paddingVertical: 15,
        paddingHorizontal: 20,
        fontSize: 16
    },
    date: {
        textAlign:"right",
        marginRight:10,
        opacity:0.7,
        fontSize: 12,
        marginVertical: 7,
    },  
    footerContainer: {

    },
    like: {
        flexDirection:"row",
        fontSize: 18,
        paddingVertical: 5,
        alignContent:"center",
        alignItems:"center",
        backgroundColor:"#eee",
        paddingLeft: 7,
    }
});