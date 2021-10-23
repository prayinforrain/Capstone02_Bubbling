import React, {useState, useEffect, useRef} from 'react';
import { StyleSheet, Text, View, TextInput, Image, Button, TouchableOpacity, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { dbService, auth, storageService } from '../../firebaseConfig';
import { MaterialIcons } from '@expo/vector-icons'; 
import Modal from "react-native-modal";
import uuid from 'react-native-uuid';

import {userToken} from '../../state';
import { useRecoilValue } from 'recoil';
import BubbleListItem from './BubbleListItem';

let bubbleIcon = require('../../assets/bubble_borderHD.png');

const RecentBubbleList = ({}) => {
    //회원 정보
    const user = useRecoilValue(userToken);
    const [bubbles, setBubbles] = useState([]);

    useEffect(() => {
        fetchPosts();
    }, [])

    const fetchPosts = async () => {
        let BubbleList = [];
        dbService.collection("bubbles").where("author", "==", user).orderBy("postedAt", "desc").onSnapshot(snapshot => {
            BubbleList = [];
            if(snapshot.empty) {
                //표시할 글이 아무것도 없음
            } else {
                for(var idx=0; idx<snapshot.docs.length; idx++) {
                    BubbleList.push(snapshot.docs[idx]);
                }
            }
            setBubbles(BubbleList);
        })
    }
    
    return (
        <View style={styles.container}>
            {bubbles.map((i) => {
                return (
                    <BubbleListItem key={uuid.v4()} id={i.id} postData = {i.data()}/>
                )
            })}
        </View>
    );
}

export default RecentBubbleList;

const styles = StyleSheet.create({
    container: {
        width: "100%",
        alignSelf: "center",
        paddingVertical: 20,
        paddingHorizontal: 10,
    },
});