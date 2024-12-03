import React, { Component } from 'react'
import { Text, View, TouchableOpacity, SafeAreaView, Dimensions, StatusBar, Image, ScrollView, BackHandler, StyleSheet } from 'react-native'
import { config, Otpprovider, Mapprovider, apifuntion, Colors, Font, validation, mobileH, mobileW, SocialLogin, Cameragallery, mediaprovider, localStorage, Lang_chg, consolepro, msgProvider, msgTitle, msgText, Currentltlg } from './Providers/utilslib/Utils'
import { localimag } from './Providers/Localimageprovider/Localimage'
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
export default class UploadDoc extends Component {
    constructor(props) {
        super(props)
        this.state = {
        }
    }
    backpress = () => {
        this.props.navigation.navigate('Login');
    }
    //--------------------************------------------------------------//
    render() {
        return (
            <View style={{ flex: 1, height: '100%', width: '100%', backgroundColor: '#FFFFFF' }}>
                <SafeAreaView style={{ flex: 0, backgroundColor: Colors.theme_color }} />
                <StatusBar backgroundColor={Colors.theme_color} barStyle='default' hidden={false} translucent={false}
                    networkActivityIndicatorVisible={true} />
                <View style={styles.setingsHeader}>
                    <TouchableOpacity activeOpacity={0.9} onPress={() => { this.backpress() }}>
                        <Image resizeMode="contain" style={{ width: 25, height: 30 }} source={localimag.back}></Image>
                    </TouchableOpacity>
                    <Text style={styles.OrderHistoryTitle}>Upload Document</Text>
                    <Text></Text>
                </View>
                <View>
                    <Text style={{ fontSize: mobileW * 4 / 100, fontFamily: Font.bold, width: mobileW * 86 / 100, alignSelf: 'center', marginTop: mobileH * 4 / 100 }}>Upload Document</Text>
                    <TouchableOpacity activeOpacity={1} onPress={() => { this.props.navigation.navigate('UploadDocNext') }}
                        style={{ width: mobileW * 86 / 100, height: mobileH * 30 / 100, backgroundColor: Colors.purewhite, elevation: 10, alignSelf: 'center', borderRadius: 15, marginTop: 10, alignItems: 'center', justifyContent: 'center', shadowColor: '#000000', shadowOffset: { width: 2, height: 2, }, shadowOpacity: 0.20 }}>
                        <Image source={localimag.plus} style={{ width: mobileW * 8 / 100, height: mobileH * 4 / 100 }}></Image>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }
}
const styles = StyleSheet.create({
    setingsHeader: {
        flexDirection: 'row',
        backgroundColor: Colors.theme_color,
        justifyContent: 'space-between',
        paddingLeft: 20,
        paddingRight: 20,
        paddingTop: 15,
        paddingBottom: 15,
        alignItems: 'center'
    },
    OrderHistoryTitle: {
        color: Colors.white_color,
        fontFamily: Font.bold,
        fontSize: windowWidth * 5.2 / 100,
        letterSpacing: 0.5
    },
});


