import React, { Component } from 'react'
import { Text, View, TouchableOpacity, SafeAreaView, Dimensions, Alert, StatusBar, Image, ScrollView, BackHandler, StyleSheet } from 'react-native'
import { config, Otpprovider, Mapprovider, apifuntion, Colors, Font, validation, mobileH, mobileW, SocialLogin, Cameragallery, mediaprovider, localStorage, Lang_chg, consolepro, msgProvider, msgTitle, msgText, Currentltlg } from './Providers/utilslib/Utils'
import { localimag } from './Providers/Localimageprovider/Localimage'
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
export default class AccountApprovedPage extends Component {
    _didFocusSubscription;
    _willBlurSubscription;
    constructor(props) {
        super(props)
        this.state = {
            content_2: '',
        }
        this._didFocusSubscription = props.navigation.addListener('focus', payload =>
            BackHandler.addEventListener('hardwareBackPress', this.handleBackPress)
        );
    }

    backpress = () => {
        this.props.navigation.goBack();
    }

    //...................................................//

    componentDidMount = () => {
        this._willBlurSubscription = this.props.navigation.addListener('blur', payload =>
            BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress)
        );
    }

    //....................................................//

    handleBackPress = () => {
        Alert.alert(
            'Exit App ',
            'Do you want to exit the App', [{
                text: 'No',
                onPress: () => consolepro.consolelog('Cancel button Pressed'),
                style: 'cancel'
            }, {
                text: 'Yes',
                onPress: () => {
                    {
                        this.props.navigation.navigate('Login');
                        //BackHandler.exitApp();
                    }
                }
            }], {
            cancelable: false
        }
        ); // works best when the goBack is async
        return true;
    };

    //....................................................//

    render() {
        return (
            <View style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
                <SafeAreaView style={{ flex: 0, backgroundColor: Colors.theme_color }} />
                <StatusBar backgroundColor={Colors.theme_color} barStyle='default' hidden={false} translucent={false}
                    networkActivityIndicatorVisible={true} />
                <View style={{ flex: 1, alignSelf: 'center', alignItems: 'center', justifyContent: 'center' }}>
                    <View style={{ height: mobileH * 38 / 100, width: mobileW * 96 / 100, elevation: 4, backgroundColor: Colors.purewhite, alignItems: 'center', borderRadius: 15, shadowColor: '#000000', shadowOffset: { width: 2, height: 2, }, shadowOpacity: 0.30 }}>
                        <Image resizeMode="contain" style={{ width: 85, height: 90, marginTop: 30 }} source={localimag.userr}></Image>
                        <Text style={{ fontFamily: Font.medium, fontSize: mobileW * 5 / 100, textAlign: 'center' }}>Your account will be approved by Admin within 24 hours</Text>
                        <TouchableOpacity activeOpacity={1} onPress={() => { this.props.navigation.navigate('Login') }}
                            style={{ width: mobileW * 76 / 100, height: mobileH * 7 / 100, backgroundColor: Colors.theme_color, borderRadius: 32, alignItems: 'center', justifyContent: 'center', alignSelf: 'center', marginTop: 20 }}>
                            <Text style={{ fontSize: mobileW * 5 / 100, fontFamily: Font.bold, color: Colors.purewhite }}>Continue</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        )
    }
}
const styles = StyleSheet.create({});


