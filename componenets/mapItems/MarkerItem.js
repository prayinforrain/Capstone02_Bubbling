import React, {useState, useEffect, useRef} from 'react';
import { StyleSheet, Text, View, Dimensions, Image, Animated, ImageBackground } from 'react-native';
import { Marker } from 'react-native-maps';

let bubbleIcon = require('../../assets/bubble_borderHD.png');
let noAttach = require('../../assets/empty.png');


const MarkerItem = ({markerData}) => {
    //lat, lon, msg, id, Image
    const [clicked, setClicked] = useState(false);
    const scaleValue = useRef(new Animated.Value(0)).current;
    const bubbleObj = useRef();
    const [isRemoved, setIsRemoved] = useState(false);

    

    const clickEvent = () => {
        setClicked(true);
        return;
    }

    useEffect(() => {
        if(clicked) {
            Animated.timing(
                scaleValue, {
                    toValue: 1,
                    duration: 200,
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
        Animated.timing(
            scaleValue, {
                toValue: 2,
                duration: 200,
                useNativeDriver: false
            }
        ).start(() => {
            setIsRemoved(true);
        });
    }

    if(isRemoved) return (<></>);

    return (
        <Marker coordinate = {{latitude: Number(markerData.lat), longitude: Number(markerData.long)}}
        onPress={() => clickEvent()}
        >
            {clicked ? (
                <Animated.View 
                ref={bubbleObj}
                style={{
                    opacity: scaleValue.interpolate({
                        inputRange: [0, 1, 2],
                        outputRange: [0, 1, 0],
                    }),
                    transform: [
                    {
                        scaleX: scaleValue
                    },
                    {
                        scaleY: scaleValue
                    },
                    {
                        translateY: scaleValue.interpolate({
                            inputRange: [0, 1, 2],
                            outputRange: [0, -10, -20]
                        })
                    }
                    ]
                }}>
                    <View style={styles.ballonContainer}>
                        {markerData.Image !== "" && (
                            <View style={styles.imgContainer}>
                                <Image source={{uri:markerData.Image}} style={styles.imgAttach}/>
                            </View>
                        )}
                        <Text style={styles.bubbleText}>{markerData.content}</Text>
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
        borderRadius: 5,
        borderColor: "grey",
        paddingHorizontal: 10,
        paddingVertical: 8,
        backgroundColor:"white",
    },
    imgContainer: {
        width: "50%",
        marginBottom: 6,
    },
    imgAttach: {
        flex:1,
        aspectRatio:1
    },
    bubbleText: {
        paddingVertical: 6,
        textAlign:"center"
    }
});