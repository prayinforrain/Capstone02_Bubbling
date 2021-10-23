import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Dimensions, Image, Alert, TouchableOpacity, ImageBackground } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import MarkerItem from '../mapItems/MarkerItem';
import * as Location from 'expo-location';
import { dbService, auth } from '../../firebaseConfig';
import Modal from "react-native-modal";
import NewBubbleComponent from '../mapItems/NewBubbleComponent';

import { useRecoilValue, useRecoilState } from 'recoil';
import {userLat, userLon, userToken} from '../../state';

let bubbleIcon = require('../../assets/bubble_borderHD.png');


export default function Newsfeed() {
    const Lon = useRecoilValue(userLon);
    const Lat = useRecoilValue(userLat);
    const [isLoaded, setIsLoaded] = useState(false);
    const postFilter = Date.now() - 86400000; // 날짜 최소컷
    const [mapObject, setMapObject] = useState(null);
    const [selfMarker, setSelfMarker] = useState(null);
    
    const user = useRecoilValue(userToken);
    
    //onPageInit
    useEffect(() => {
        if(!isLoaded) {
            initMap();
        }
    }, [isLoaded]);

    useEffect(() => {
        if(Lon != 0 || Lat != 0) {
            if(mapObject !== null) {
                mapObject.animateToRegion({
                    latitude: Lat,
                    longitude: Lon,
                    latitudeDelta: 0.002,
                    longitudeDelta: 0.002,
                }, 500);
            }
        }
    }, [Lon, Lat]);

    const onLogout = () => {
        auth.signOut();
    }

    //최근 게시글 리스트를 불러오기 위한 함수
    const [bubbles, setBubbles] = useState([]);
    const initMap = () => {
        let bubbleArray = [];
        // snapshot의 변동사항에 대한 리스너
        dbService.collection("bubbles").orderBy("postedAt","desc").onSnapshot(snapshot => {
            snapshot.docChanges().forEach((change) => {
                if(change.type === "added") {
                    if(change.doc.data().postedAt > postFilter) {
                        let index = bubbleArray.push({
                            id: change.doc.id,
                            ...change.doc.data()
                        });
                        setBubbles(bubbleArray);
                        //console.log("snapshot.change.added", bubbleArray);
                    } else {
                        //표시기한이 지난 메시지
                    }
                }
                //ㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡ
                //수정되었을 때 리스너
                if(change.type === "modified") {
                    //유저가 브라우저에서 직접 수정한 것을 체크 후 반영할 것
                }
                //ㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡ
                //삭제되었을 때 리스너; 스스로가 삭제했을때만 실시간으로 반영할 것
                if(change.type === "removed") {
                    if(change.doc.data().author === user) {
                        
                    }
                }
            });
            
            const bubbleArray2 = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data()
            }));
            setBubbles(bubbleArray2);
        });
    }

    //새 게시글 추가 함수
    const [modalVisible, setModalVisible] = useState(false);
    const addNewBubble = () => {
        setModalVisible(true);
    }

    //ㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡ

    /*
    <MarkerItem
    lat="52.1"
    lon="18.4"
    msg="테스트메시지 하나"
    id="1"
    />
    */

    /*
    <TouchableOpacity
    style={styles.buttonDefault}
    onPress = {onLogout}
    >
        <Text style={styles.buttonText}>Logout</Text>
    </TouchableOpacity>
    */
    
    return (
        <View style={styles.container}>
            <View style={styles.mapContainer}>
                    <MapView
                    ref={(map) => { setMapObject(map); }}
                    style={styles.map}
                    initialRegion={{
                        latitude: Lat,
                        longitude: Lon,
                        latitudeDelta: 0.002,
                        longitudeDelta: 0.002,
                    }}
                    showsUserLocation={true}
                    scrollEnabled= {false}
                    zoomEnabled= {false}
                    showsMyLocationButton={false}
                    showsCompass={false}
                    showsIndoors={false}
                    toolbarEnabled={false}
                    >
                        {bubbles.length > 0 ? (
                            bubbles.map((i) => (
                                <MarkerItem
                                key = {i.id}
                                markerData = {i}
                                />
                            ))
                        ) : (
                            <></>
                        )}
                    </MapView>
            </View>
        </View>
    );
}
const styles = StyleSheet.create({
    container: {
        width: '100%',
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'flex-start',
    },
    mapContainer: {
        justifyContent: "center",
    },
    map: {
        width: Dimensions.get('window').width - 2,
        height: Dimensions.get('window').width - 2
    },
    marker: {
        width: Dimensions.get('window').width*0.1,
        height: Dimensions.get('window').width*0.1
    },
    buttonDefault: {
        marginTop: 20,
        paddingVertical: 7,
        width: "100%",
        borderWidth: 1,
        borderColor: "lightgray",
        borderRadius: 5
    },
    buttonText: {
        fontSize: 18,
        textAlign: "center"
    }
});
  