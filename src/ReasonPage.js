import React, { Component } from 'react'
import { Text, View, TouchableOpacity, SafeAreaView, TextInput, Alert, Dimensions, StatusBar, Image, ScrollView, BackHandler, StyleSheet } from 'react-native'
import { config, Otpprovider, Mapprovider, apifuntion, Colors, Font, validation, mobileH, mobileW, SocialLogin, Cameragallery, mediaprovider, localStorage, Lang_chg, consolepro, msgProvider, msgTitle, msgText, Currentltlg } from './Providers/utilslib/Utils'
import { localimag } from './Providers/Localimageprovider/Localimage'
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
export default class ReasonPage extends Component {
    constructor(props) {
        super(props)
        this.state = {
            subscription: '',
            amount: '',
            bom: '',
            eom: '',
        }
    }
    backpress = () => {
        this.props.navigation.goBack();
    }
    // componentDidMount = () => {
    //     this.get_term_condition();
    // }

    //--------------------************-----------------//
    render() {
        return (
            <View style={{ flex: 1,backgroundColor: '#FFFFFF' }}>
                <SafeAreaView style={{ flex: 0, backgroundColor: Colors.theme_color }} />
                <StatusBar backgroundColor={Colors.theme_color} barStyle='default' hidden={false} translucent={false}
                    networkActivityIndicatorVisible={true} />
                <View style={styles.setingsHeader}>
                    <TouchableOpacity activeOpacity={0.9} onPress={() => { this.props.navigation.goBack(); }}>
                        <Image resizeMode="contain" style={{ width: 35, height: 40 }} source={localimag.back}></Image>
                    </TouchableOpacity>
                    <Text style={styles.OrderHistoryTitle}>Reasons of cancel</Text>
                    <Text style={{ width: 20 }}> </Text>
                </View>
                <View style={{ height: mobileH * 30 / 100, alignItems: 'center', justifyContent: 'center', paddingTop: 20 }}>
                    <View style={{ flexDirection: 'row', borderBottomWidth: 0.6, alignItems: 'center', borderColor: Colors.font_color, width: mobileW * 90 / 100, height: mobileH * 5.2 / 100, alignSelf: 'center', justifyContent: 'space-between', }}>
                        <Text style={{ fontSize: mobileW * 4 / 100, fontFamily: Font.bold }}>I dont want to do</Text>
                    </View>
                    <View style={{ flexDirection: 'row', borderBottomWidth: 0.6, alignItems: 'center', borderColor: Colors.font_color, width: mobileW * 90 / 100, height: mobileH * 5.2 / 100, alignSelf: 'center', justifyContent: 'space-between', marginTop: 18 }}>
                        <Text style={{ fontSize: mobileW * 4 / 100, fontFamily: Font.bold }}>Want other subscription</Text>
                    </View>
                    <View style={{ flexDirection: 'row', borderBottomWidth: 0.6, alignItems: 'center', borderColor: Colors.font_color, width: mobileW * 90 / 100, height: mobileH * 5.2 / 100, alignSelf: 'center', justifyContent: 'space-between', marginTop: 18 }}>
                        <Text style={{ fontSize: mobileW * 4 / 100, fontFamily: Font.bold }}>Other reason</Text>
                    </View>
                </View>
                <View style={{ width: mobileW * 72 / 100, height: mobileH * 8 / 100, borderRadius: 15, alignItems: 'center', justifyContent: 'center', alignSelf: 'center', }}>
                    <TouchableOpacity activeOpacity={1} style={{ width: mobileW * 90 / 100, height: mobileH * 7 / 100, backgroundColor: Colors.theme_color, borderRadius: 25, alignItems: 'center', justifyContent: 'center', alignSelf: 'center', }}>
                        <Text style={{ fontSize: mobileW * 4 / 100, fontFamily: Font.medium, color: Colors.purewhite }}>Cancel</Text>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }
}
const styles = StyleSheet.create({
    setingsHeader: {
        flexDirection: 'row',
        backgroundColor: Colors.purewhite,
        justifyContent: 'space-between',
        paddingLeft: 20,
        paddingRight: 20,
        paddingTop: 5,
        paddingBottom: 25,
        alignItems: 'center',
        elevation: 4,
        shadowColor: '#000000', 
        shadowOffset: { width: 2, height: 2, }, 
        shadowOpacity: 0.30
    },
    OrderHistoryTitle: {
        color: Colors.font_color,
        fontFamily: Font.bold,
        fontSize: windowWidth * 5.2 / 100,
        letterSpacing: 0.5,
    },
});


