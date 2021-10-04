import React from 'react';
import { StyleSheet, Text, View, Dimensions, Image } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import MapView from 'react-native-maps';
import { render } from 'react-dom';
import { Marker } from 'react-native-maps';
import MarkerItem from './mapItems/MarkerItem';

//let bubbleIcon = require('../assets/bubble_borderHD.png');

export default class Maptest extends React.Component {
    render() {
        return (
            <View style={styles.container}>
                <Text>
                    Google Maps API Test Page
                </Text>
                <MapView
                style={styles.map}
                initialRegion={{
                    latitude: 52.5,
                    longitude: 19.2,
                    latitudeDelta: 8.5,
                    longitudeDelta: 8.5,
                }}
                >
                <MarkerItem
                lat="52.1"
                lon="18.4"
                msg="테스트메시지 하나"
                id="1"
                />
                <MarkerItem
                lat="52.61"
                lon="18.72"
                msg="두번쨰 메시지"
                id="1"
                />
                <MarkerItem
                lat="51.76"
                lon="18.96"
                msg="테스트 세번째 메시지"
                id="1"
                />
                    
                </MapView>
            </View>
        );
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    map: {
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').width
    },
    marker: {
        width: Dimensions.get('window').width*0.1,
        height: Dimensions.get('window').width*0.1
    },
});
  