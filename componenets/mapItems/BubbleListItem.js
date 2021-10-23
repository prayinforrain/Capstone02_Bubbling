import React, {useState, useEffect, useRef} from 'react';
import { StyleSheet, Text, View, TextInput, Image, Animated } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { dbService, auth, storageService } from '../../firebaseConfig';
import { RectButton, Swipeable } from 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons';


const BubbleListItem = ({id, postData}) => {

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
    const onDelete = async () => {
        console.log("deleting " + id);
        const res = await dbService.doc(`bubbles/${id}`).delete();
    }

    return (
        <>
        <View style={styles.bubbleContainer}>
            <Swipeable childrenContainerStyle={{backgroundColor:"white"}} renderRightActions={(progress, dragX) => {
                const trans = dragX.interpolate({
                    inputRange: [-70, -40,  0],
                    outputRange: [0, 0 , 50],
                });
                return (
                    <RectButton onPress={onDelete} style={styles.delBtnContainer}>
                        <Animated.View
                        style={[
                            styles.delBtn,
                            {
                                transform: [{translateX: trans}]
                            },
                        ]}>
                            <Ionicons name="trash-outline" size={32} color="red"/>
                        </Animated.View>
                    </RectButton>
                )
            }}>
                <View style={styles.bubbleInner}>
                    <View style={styles.contentBox}>
                        <View style={styles.content}>
                            <Text style={{fontSize: 15}}>{postData.content}</Text>
                        </View>
                        <Text style={styles.date}>{new Date(postData.postedAt).showDate()}</Text>
                    </View>
                    {postData.Image !== "" && (
                        <View style={styles.imgContainer}>
                            <Image source={{uri:postData.Image}} style={styles.img} resizeMode="cover"/>
                        </View>
                    )}
                </View>
            </Swipeable>
            <View style={styles.borderLine}/>
        </View>
        </>
    )
}

export default BubbleListItem;

const styles = StyleSheet.create({
    bubbleContainer: {
        paddingHorizontal: 15,
        backgroundColor: "white",
    },
    bubbleInner: {
        flexDirection:"row",
        width: "100%",
        paddingVertical: 5,
        justifyContent: "space-between"
    },
    contentBox: {
        flex:4,
        justifyContent:'space-between',
    },
    content: {
        justifyContent:"center",
        marginLeft: 10,
        flex: 5,
        },
    date: {
        flex:1,
        fontSize: 12,
        textAlign: "right",
        color: "gray",
        marginRight: 10,
    },
    imgContainer: {
        flex:1,
        aspectRatio: 1 / 1,
        borderWidth: 1,
    },
    img: {
        width: "100%",
        height: "100%",
    }, 
    borderLine: {
        alignSelf: "center",
        width: "85%",
        marginTop: 10,
        marginBottom: 15,
        borderBottomWidth: 1,
        borderColor: "lightgrey"
    },
    delBtnContainer: {
        justifyContent:"center",
    },
    delBtn: {
        height: 45,
        width: 45,
        justifyContent:"center",
        alignItems:"center"
    },
});