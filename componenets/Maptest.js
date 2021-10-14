import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Dimensions, Image, Alert, TouchableOpacity, ImageBackground } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import MarkerItem from './mapItems/MarkerItem';
import * as Location from 'expo-location';
import { dbService, auth } from '../firebaseConfig';
import Modal from "react-native-modal";
import NewBubbleComponent from './mapItems/NewBubbleComponent';

let bubbleIcon = require('../assets/bubble_borderHD.png');


export default function Maptest({userToken}) {
    const [Lon, setLon] = useState(0);
    const [Lat, setLat] = useState(0);
    const [isLoaded, setIsLoaded] = useState(false);
    const [profile, setProfile] = useState("");
    const postFilter = Date.now() - 86400000; // 날짜 최소컷
    const [mapObject, setMapObject] = useState(null);
    const [selfMarker, setSelfMarker] = useState(null);


    //위치정보 받아오기
    geoLocation = async(userToken) => {
        try {
            //userToken이 있을 경우 DB에서 마지막 좌표를 받아옴
            if(userToken != null) {
                dbService.collection("userProfile").doc(userToken.uid).get().then((doc) => {
                    //console.log(typeof(doc.data().displayName));
                    if(doc.exists) {
                        if(doc.data().lat != null) {
                            setLat(doc.data().lat);
                        }
                        if(doc.data().lon != null) {
                            setLon(doc.data().lon);
                        }
                    } else { // userProfile 데이터가 없는 유저의 경우
                    }
                });
            }
            const responseForeground = await Location.requestForegroundPermissionsAsync();
            //const responseBackground = await Location.requestBackgroundPermissionsAsync();
            const location = await Location.getCurrentPositionAsync();
            setLon(location.coords.longitude);
            setLat(location.coords.latitude);
            if(userToken != null) {
                dbService.collection("userProfile").doc(userToken.uid).update({
                    lat: location.coords.latitude,
                    lon: location.coords.longitude,
                });
            }
            setIsLoaded(true);
        } catch(err) {
            console.log(err);
            Alert.alert(err);
        }
    }
    
    //onPageInit
    useEffect(() => {
        if(!isLoaded) {
            if(userToken != null) {
                geoLocation(userToken);
            }
        } else {
            initMap();
        }
        if(profile == "" && userToken != null) {
            dbService.collection("userProfile").doc(userToken.uid).get().then((doc) => {
                if(doc.data().profileURL !== "") setProfile(doc.data().profileURL);
            })
        }
    }, [userToken]);

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
                    if(change.doc.data().postedAt < postFilter) {
                        let index = bubbleArray.push({
                            id: change.doc.id,
                            ...change.doc.data()
                        });
                        setBubbles(bubbleArray);
                        //console.log("snapshot.change.added", bubbleArray);
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
                    if(change.doc.data().author === userToken.uid) {
                        
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
            <View style={styles.headerContainer}>
                <Text>
                    Google Maps API Test Page
                </Text>
                <Text>
                    Lat : {Lat}, Lon : {Lon}
                </Text>
                <Text>
                    Logged in With : {userToken !== null ? userToken.uid : ""}
                </Text>
            </View>
            <View style={styles.mapContainer}>
                {isLoaded ? (
                    <MapView
                    ref={(map) => { setMapObject(map); }}
                    style={styles.map}
                    initialRegion={{
                        latitude: Lat,
                        longitude: Lon,
                        latitudeDelta: 0.002,
                        longitudeDelta: 0.002,
                    }}
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
                        <Marker coordinate = {{latitude: Lat, longitude: Lon}} ref = {(marker) => {setSelfMarker(marker);}} onPress = {() => addNewBubble()}>
                            <View>
                                <ImageBackground source={profile !== ""? ({uri: profile}) : ({})} style={{
                                    width: Dimensions.get('window').width*0.10,
                                    height: Dimensions.get('window').width*0.10,
                                    borderRadius: 100,
                                    alignItems: "center",
                                    justifyContent: "center",
                                }} resizeMode="contain">
                                    <Image source={bubbleIcon}
                                        style={{width: Dimensions.get('window').width*0.105,
                                            height: Dimensions.get('window').width*0.105,
                                            borderRadius: 100
                                            }} resizeMode="contain"/>
                                </ImageBackground>
                            </View>
                        </Marker>
                    </MapView>
                ) : (
                    <Text style={styles.buttonText}>Loading..</Text>
                )}
            </View>
            <TouchableOpacity style={styles.buttonDefault} onPress={onLogout}><Text style={styles.buttonText}>dd</Text></TouchableOpacity>
            {userToken !== null && <NewBubbleComponent modalVisible={modalVisible} setModalVisible = {setModalVisible} userToken = {userToken}/> }
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
    headerContainer: {
        width: "100%",
        paddingHorizontal: 10,
        paddingVertical: 5
    },
    mapContainer: {
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').width,
        borderWidth: 1,
        borderColor: 'lightgray',
        justifyContent: "center"
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
  