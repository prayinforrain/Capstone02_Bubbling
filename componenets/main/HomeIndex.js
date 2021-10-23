import React, { useCallback, useEffect, useLayoutEffect, useState } from 'react';
import { StyleSheet, Text, View, Dimensions, Alert, TouchableOpacity, ScrollView, RefreshControl } from 'react-native';
import * as Location from 'expo-location';
import { dbService, auth } from '../../firebaseConfig';
import NewBubbleComponent from '../mapItems/NewBubbleComponent';
import { Ionicons } from '@expo/vector-icons';

import {  useRecoilValue } from 'recoil';
import {userLat, userLon, userToken} from '../../state';
import Newsfeed from './Newsfeed';
import RecentBubbleList from '../mapItems/RecentBubbleList';

let bubbleIcon = require('../../assets/bubble_borderHD.png');


export default function HomeIndex({navigation, loadModal = false}) {
    const Lon = useRecoilValue(userLon);
    const Lat = useRecoilValue(userLat);
    
    const user = useRecoilValue(userToken);

    const onLogout = () => {
        auth.signOut();
    }

    useLayoutEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <TouchableOpacity style={styles.headerButtons} onPress={() => setModalVisible(true)}>
                    <Ionicons name="add-circle" size={32}/>
                </TouchableOpacity>
            )
        });
    }, [navigation])


    //새 게시글 추가 함수
    const [modalVisible, setModalVisible] = useState(loadModal);
    const addNewBubble = () => {
        setModalVisible(true);
    }

    //새로고침
    const [refreshing, setRefreshing] = useState(false);
    const onRefresh = useCallback(() => {
        setRefreshing(true);
        wait(2000).then(() => setRefreshing(false));
    }, []);
    const wait = (timeout) => {
        return new Promise(resolve => setTimeout(resolve, timeout));
    }

    //ㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡ

    return (
        <View style={styles.container}>
            <View>
                <View style={styles.mapContainer}>
                    <Newsfeed/>
                </View>
                <View style={{flex:1}}>
                    <View style={styles.RecentPostHeader}>
                        <Text style={{fontSize: 15}}>내 최근 생각들</Text>
                    </View>
                    <ScrollView style={styles.RecentPostContainer} refreshControl={
                        <RefreshControl refreshing={refreshing}
                        onRefresh={onRefresh}
                        />
                    }>
                        <RecentBubbleList/>
                    </ScrollView>
                </View>
                {user !== null && <NewBubbleComponent modalVisible={modalVisible} setModalVisible = {setModalVisible} userToken = {user}/> }
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
    headerContainer: {
        width: "100%",
        paddingHorizontal: 10,
        paddingVertical: 5,
    },
    mapContainer: {
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').width,
        borderWidth: 1,
        borderColor: 'lightgray',
        justifyContent: "center",
        alignItems: "center"
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
    },
    RecentPostHeader: {
        marginHorizontal: 15,
        marginTop: 20,
        paddingBottom: 10,
        borderBottomWidth:1
    },
    RecentPostContainer: {
        
    }
});
  