import React, {useState, useEffect, useRef} from 'react';
import { StyleSheet, Text, View, Dimensions, Image, Animated, ImageBackground } from 'react-native';
import { Marker } from 'react-native-maps';

let bubbleIcon = require('../../assets/bubble_borderHD.png');
let noAttach = require('../../assets/empty.png');


const MarkerItem = ({markerData}) => {
    //lat, lon, msg, id, Image
    const [clicked, setClicked] = useState(false);
    const opacityValue = useRef(new Animated.Value(0)).current;
    const bubbleObj = useRef();

    

    const clickEvent = () => {
        setClicked(true);
        return;
    }

    useEffect(() => {
        if(clicked) {
            Animated.timing(
                opacityValue, {
                    toValue: 1,
                    duration: 500,
                    useNativeDriver: false
                },
            ).start(() => {
                console.log("Animation DONE");
                wait(2000).then(() => {
                    bubbleFadeout();
                })
            });
        }
    }, [clicked])

    const wait = (timeout) => {
        return new Promise(resolve => setTimeout(resolve, timeout));
    }

    const bubbleFadeout = () => {
        bubbleObj.current.
        Animated.timing(
            opacityValue, {
                toValue: 0,
                duration: 500,
                useNativeDriver: false
            }
        ).start(() => {
            console.log("끝");
        });
    }

    return (
        <Marker coordinate = {{latitude: Number(markerData.lat), longitude: Number(markerData.long)}}
        onPress={() => clickEvent()}
        >
            {clicked ? (
                <Animated.View 
                ref={bubbleObj}
                style={{
                    opacity: opacityValue,
                    transform: [{
                        scaleX: opacityValue.interpolate({
                            inputRange:[0, 1],
                            outputRange:[0, 1]
                        }),
                    },
                    {
                        scaleY: opacityValue.interpolate({
                            inputRange:[0, 1],
                            outputRange:[0, 1]
                        })
                    },
                    {
                        translateY: opacityValue.interpolate({
                            inputRange:[0, 1],
                            outputRange:[0, -10]
                        })
                    }]
                }}>
                    <View style={styles.ballonContainer}>
                        <Text>{markerData.content}</Text>
                    </View>
                </Animated.View>
            ) : 
                <ImageBackground source={markerData.Image !== "" ? ({uri: markerData.Image}) : ({noAttach})}
                style={styles.markerAttach} resizeMode="cover">
                    <Image source={bubbleIcon} style={styles.marker} resizeMode="contain"/>
                </ImageBackground>
            }
        </Marker>
    );
}

export default MarkerItem;

const styles = StyleSheet.create({
    marker: {
        width: Dimensions.get('window').width*0.1,
        height: Dimensions.get('window').width*0.1
    },
    markerAttach: {
        width: Dimensions.get('window').width*0.09,
        height: Dimensions.get('window').width*0.09,
        borderRadius: 100,
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden'
    },
    ballonContainer: {
        borderStyle:'solid',
        borderWidth:1,
        paddingHorizontal: 10,
        paddingVertical: 8,
    },
});