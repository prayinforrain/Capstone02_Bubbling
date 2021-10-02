import React, {useState, useEffect, useRef} from 'react';
import { StyleSheet, Text, View, Dimensions, Image, Animated } from 'react-native';
import { Marker } from 'react-native-maps';

let bubbleIcon = require('../../assets/bubble_borderHD.png');

const MarkerItem = ({lat, lon, msg, id}) => {
    const [clicked, setClicked] = useState(false);
    const opacityValue = useRef(new Animated.Value(0)).current;

    const styles = StyleSheet.create({
        marker: {
            width: Dimensions.get('window').width*0.1,
            height: Dimensions.get('window').width*0.1
        },
    });

    const clickEvent = () => {
        setClicked(true);
        return;
    }

    useEffect(() => {
        if(clicked) {
            Animated.timing(
                opacityValue, {
                    toValue: 1,
                    duration: 2000,
            }).start();
        }
    }, [clicked])

    return (
        <Marker coordinate = {{latitude: Number(lat), longitude: Number(lon)}}
        onPress={() => clickEvent()}
        >
            {clicked ? (
                <Animated.View style={{
                    opacity: opacityValue
                }}>
                    <Text>{msg}</Text>
                </Animated.View>
            ) : 
                <Image source={bubbleIcon} style={styles.marker} resizeMode="contain"/>
            }
        </Marker>
    );
}

export default MarkerItem;