import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Dimensions, Image, Alert } from 'react-native';
import MapView from 'react-native-maps';
import MarkerItem from './mapItems/MarkerItem';
import * as Location from 'expo-location';

//let bubbleIcon = require('../assets/bubble_borderHD.png');


export default function Maptest() {
    const [Lon, setLon] = useState(0);
    const [Lat, setLat] = useState(0);
    const [isLoading, setIsLoading] = useState(false);

    geoLocation = async() => {
        try {
            const responseForeground = await Location.requestForegroundPermissionsAsync();
            //const responseBackground = await Location.requestBackgroundPermissionsAsync();
            const location = await Location.getCurrentPositionAsync();
            setLon(location.coords.longitude);
            setLat(location.coords.latitude);
            setIsLoading(true);
        } catch(err) {
            console.log(err);
            Alert.alert(err);
        }
    }

    useEffect(() => {
        if(!isLoading) {
            geoLocation();
        }
    }, [isLoading]);
    
    return (
        <View style={styles.container}>
            {isLoading ? (
                <>
                <Text>
                    Google Maps API Test Page : {isLoading? "true" : "false"}
                </Text>
                <Text>
                    Lat : {Lat}, Lon : {Lon}
                </Text>
                <MapView
                style={styles.map}
                initialRegion={{
                    latitude: Lat,
                    longitude: Lon,
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
                </>
            ) : (
                <Text>Loading..</Text>
            )}
        </View>
    );
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
  