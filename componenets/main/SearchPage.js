import React, {useState, useEffect} from 'react';
import { dbService, auth } from '../../firebaseConfig';
import { StyleSheet, Text, View, Dimensions, Image, TouchableOpacity, Keyboard, TouchableWithoutFeedback } from 'react-native';


import { TextInput } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';


const SearchPage = ({navigation}) => {
    const [keyword, setKeyword] = useState("");
    const [result, setResult] = useState(null);
    const [uid, setUID] = useState("");
    const [error, setError] = useState("");
    

    const onSubmit = () => {
        if(keyword == "") {
            setResult(null);
            setUID("");
            setError("검색할 ID를 입력해주세요.")
            return;
        }
        dbService.collection("userProfile").where("userID", "==", keyword).get().then((res) => {
            if(res.empty) {
                setResult(null);
                setUID("");
                setError("해당 ID를 찾을 수 없습니다.")
                return;
            };
            setResult(res.docs[0].data());
            setUID(res.docs[0].id);
        })
    }

    useEffect(() => {
        if(result !== null) {
            //console.log(result);
        }
    }, [result])

    const onShowProfile = () => {
        if(uid !== "") {
            navigation.navigate("Profile", {profileUID : uid});
        } else {
            setError("올바르지 않은 접근입니다.");
        }
    }

    return (
        <SafeAreaView style={{flex: 1}}>
            <TouchableWithoutFeedback
        onPress={() => {Keyboard.dismiss()}}>
            <View style={styles.container}>
                <View style={styles.inputContainer}>
                    <Ionicons name="search-outline" size={32} color="grey" style={styles.inputIcon}/>
                    <TextInput
                    placeholder="프로필 ID로 친구 찾기"
                    style={styles.input}
                    onChangeText={(val) => {setKeyword(val)}}
                    value={keyword}
                    underlineColor="transparent"
                    />
                </View>
                <TouchableOpacity style={styles.BtnDeafult} onPress={onSubmit}>
                    <Text style={styles.BtnTextDefault}>Search</Text>
                </TouchableOpacity>
                <View style={styles.resultContainer}>
                    {result !== null && (
                        <TouchableOpacity style={styles.userInfoContainer} onPress={onShowProfile}>
                            <Image source={{uri:result.profileURL}} style={styles.userInfoImage}/>
                            <View style={styles.userInfoContent}>
                                <Text style={styles.userName}>{result.displayName}</Text>
                                <Text style={styles.userID}>@{result.userID}</Text>
                            </View>
                        </TouchableOpacity>
                    )}
                    {error !== "" && (
                        <Text style={styles.errorText}>{error}</Text>
                    )}
                </View>
            </View>
        </TouchableWithoutFeedback>
        </SafeAreaView>
    )
}

export default SearchPage;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: "90%",
        alignSelf:"center"
    },
    header: {
        textAlign: "center",
    },
    inputContainer: {
        flexDirection:"row",
        backgroundColor: "white",
        paddingVertical: 2,
        paddingHorizontal: 20,
        borderRadius: 30,
        marginTop: 10,
        fontSize: 18,
        borderColor: "lightgrey",
        borderStyle: "solid",
        borderBottomWidth: 2,
        borderRadius: 5,
        width: "100%",
    },
    input: {
        backgroundColor: "white",
        paddingVertical: 4,
        paddingHorizontal: 20,
        fontSize: 18,
        width: "94%",
        height: 40,
        overflow: 'hidden'
    },
    inputIcon: {
        alignSelf:"center"
    },
    BtnDeafult: {
        marginTop: 10,
        paddingVertical: 7,
        width: "100%",
        borderWidth: 1,
        borderColor: "lightgray",
        borderRadius: 5,

    },
    BtnTextDefault: {
        fontSize: 18,
        textAlign: "center"
    },
    errorText: {
        fontSize: 16,
        textAlign:"center",
        marginVertical: 10,
    },
    resultContainer: {
        flex: 1,
        marginVertical: 25
    },
    userInfoContainer: {
        backgroundColor: "white",
        flexDirection: "row",
        paddingVertical: 10,
        minHeight: 80,
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 1,
        borderColor: "lightgrey"
    },
    userInfoImage: {
        flex: 1,
        height: "100%",
        marginHorizontal: 10,
        resizeMode: "contain"
    },
    userInfoContent: {
        flex: 4,
        height: "100%",
    },
    userName: {
        fontSize: 18,
        fontWeight: "bold"
    },
    userID: {
        opacity:0.7,
        fontSize: 12,
    }
});