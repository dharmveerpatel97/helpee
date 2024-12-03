import React, { Component } from 'react'
import { Text, View, TouchableOpacity, SafeAreaView, TextInput, Alert, Modal, Dimensions, StatusBar, Image, ScrollView, BackHandler, StyleSheet } from 'react-native'
import { config, Otpprovider, Mapprovider, apifuntion, Colors, Font, validation, mobileH, mobileW, SocialLogin, Cameragallery, mediaprovider, localStorage, Lang_chg, consolepro, msgProvider, msgTitle, msgText, Currentltlg } from './Providers/utilslib/Utils'
import { localimag } from './Providers/Localimageprovider/Localimage'
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
export default class UploadFiles extends Component {
    _didFocusSubscription;
    _willBlurSubscription;
    constructor(props) {
        super(props)
        this.state = {
            subscription: '',
            amount: '',
            bom: '',
            eom: '',
            modalVisible2: false,
        }
    }
    backpress = () => {
        this.props.navigation.navigate('Login');
    }
    // componentDidMount = () => {
    //     this.get_term_condition();
    // }

    //--------------------************--------------------------//
    render() {
        return (
            <View style={{ flex: 1, height: '100%', width: '100%', backgroundColor: '#FFFFFF' }}>
                <SafeAreaView style={{ flex: 0, backgroundColor: Colors.theme_color }} />
                <StatusBar backgroundColor={Colors.theme_color} barStyle='default' hidden={false} translucent={false}
                    networkActivityIndicatorVisible={true} />
                <View style={styles.setingsHeader}>
                    <TouchableOpacity activeOpacity={1} onPress={() => { this.props.navigation.navigate('SignupExpert') }}>
                        <Text style={styles.OrderHistoryTitle}>Cancel</Text>
                    </TouchableOpacity>
                    <View activeOpacity={0.9}>
                    </View>
                    <Text style={{ width: 20 }}> </Text>
                </View>
                <View style={{ alignItems: 'center' }}>
                    <View style={{ marginTop: mobileH * 12 / 100 }}>
                        <Text style={{ color: Colors.theme_color, fontFamily: Font.medium, fontSize: mobileW * 5.5 / 100 }}>UPLOAD FILES</Text>
                    </View>
                    <View style={{ marginTop: 25, alignItems: 'center', justifyContent: 'flex-end' }}>
                        <Image source={localimag.upload} style={{ width: mobileW * 25 / 100, height: mobileH * 15 / 100, resizeMode: 'contain' }}></Image>
                        <Text style={{ fontSize: mobileW * 4.2 / 100, fontFamily: Font.medium }}>Drag & Drop</Text>
                        <Text style={{ fontFamily: Font.medium, fontSize: mobileW * 3.9 / 100, color: Colors.textColor }}>Your files are here or browse to upload</Text>
                        <Text style={{ fontFamily: Font.medium, fontSize: mobileW * 4.2 / 100, color: Colors.theme_color }}>Only PDF files with max size of 15MB</Text>
                    </View>
                </View>
                <View style={{ width: mobileW * 72 / 100, height: mobileH * 12 / 100, borderRadius: 15, alignItems: 'center', justifyContent: 'center', alignSelf: 'center', }}>
                    <TouchableOpacity activeOpacity={1} style={{ width: mobileW * 70 / 100, height: mobileH * 5.5 / 100, backgroundColor: Colors.theme_color, borderRadius: 25, alignItems: 'center', justifyContent: 'center', alignSelf: 'center', marginTop: 50 }}
                        onPress={() => { this.props.navigation.navigate('UploadDoc') }}>
                        <Text style={{ fontSize: mobileW * 4 / 100, fontFamily: Font.medium, color: Colors.purewhite }}>Upload</Text>
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
        paddingLeft: 10,
        paddingRight: 20,
        paddingTop: 15,
        paddingBottom: 20,
        alignItems: 'center',
        elevation: 2,
        shadowColor: '#000000', 
        shadowOffset: { width: 2, height: 2, }, 
        shadowOpacity: 0.20
    },
    OrderHistoryTitle: {
        color: Colors.font_color,
        fontFamily: Font.bold,
        fontSize: windowWidth * 4.5 / 100,
        color: 'red'
    }
});


