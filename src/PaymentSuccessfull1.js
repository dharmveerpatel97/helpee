import React, { Component, createRef } from 'react'
import { Text, View, SafeAreaView, StatusBar, TouchableOpacity, Image, KeyboardAvoidingView, TextInput, Modal, ImageBackground, Dimensions, ScrollView, BackHandler, Alert, FlatList, Keyboard, StyleSheet, Platform } from 'react-native'
import { config, Otpprovider, Mapprovider, apifuntion, Colors, Font, validation, mobileH, mobileW, SocialLogin, Cameragallery, mediaprovider, localStorage, Lang_chg, consolepro, msgProvider, msgTitle, msgText, Currentltlg } from './Providers/utilslib/Utils'
import { localimag } from './Providers/Localimageprovider/Localimage'
import Footer from './Providers/Footer';
import Footerr from './Providers/Footerr';
import HideWithKeyboard from 'react-native-hide-with-keyboard';
export default class PaymentSuccessfull1 extends Component {
    constructor(props) {
        super(props)
        this.state = {
            email: '',
            move: '',
            txn_date: 'NA',
            amount: '0',
            txn_number: 'NA',
        }
        this._didFocusSubscription = props.navigation.addListener('focus', payload =>
            BackHandler.addEventListener('hardwareBackPress', this.handleBackPress)
        );
    }

    handleBackPress = () => {
        return true;
    };

    componentDidMount = async () => {
        if (config.device_type = 'ios') {
            setTimeout(() => {
                this.getUserSubscriptionPlan();
            }, 800);
        } else {
            this.getUserSubscriptionPlan();
        }
        this._willBlurSubscription = this.props.navigation.addListener('blur', payload =>
            BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress)
        );
    }

    //-----------------***********--------------------//

    getUserSubscriptionPlan = async () => {
        consolepro.consolelog('getUserSubscriptionPlan');
        let user_details = await localStorage.getItemObject('user_arr');
        consolepro.consolelog('user_details', user_details);
        let user_subscription_id = await localStorage.getItemObject('user_subscription_id');
        consolepro.consolelog('user_subscription_id', user_subscription_id);
        let url = config.baseURL + "getUserSubscriptionPlan.php?user_id=" + user_details.user_id + "&user_subscription_id=" + user_subscription_id;
        consolepro.consolelog(url)
        apifuntion.getApi(url).then((obj) => {
            consolepro.consolelog('obj', obj)
            if (obj.success == "true") {
                consolepro.consolelog('onnnnn', obj.user_subscription_arr)
                this.setState({ txn_date: obj.user_subscription_arr.txn_date, txn_number: obj.user_subscription_arr.txn_id, amount: obj.user_subscription_arr.amount })
            } else {
                if (obj.active_status == 'deactivate') {
                    config.checkUserDeactivate(this.props.navigation);
                    return false;
                }
                msgProvider.alert(msgTitle.information[config.language], obj.msg[config.language], false);
                return false;
            }
        }).catch((error) => {
            consolepro.consolelog("-------- error ------- " + error);
        });
    }

    //------------------------------------------------------------//
    render() {
        return (
            <View style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
                <SafeAreaView style={{ flex: 0, backgroundColor: Colors.theme_color }} />
                <StatusBar backgroundColor={Colors.theme_color} barStyle='default' hidden={false} translucent={false}
                    networkActivityIndicatorVisible={true} />
                <TouchableOpacity activeOpacity={1} onPress={() => { Keyboard.dismiss() }} style={{ height: mobileH * 100 / 100 }}>
                    <View style={{ alignItems: 'center', justifyContent: 'flex-end', marginTop: 20 }}>
                        <Image style={{
                            width: mobileW * 0.5,
                            height: mobileW * 0.5,
                        }} resizeMode={'cover'} source={localimag.successfully}></Image>
                    </View>
                    <View style={{ alignItems: 'center', justifyContent: 'flex-start', }}>
                        <View style={{ width: mobileW * 80 / 100, }}>
                            <View style={{ alignItems: 'center', justifyContent: 'flex-start', borderBottomWidth: 0.5, marginBottom: mobileH * 0.023, paddingBottom: mobileH * 0.02 }}>
                                <Text style={{ fontSize: mobileW * 0.065, fontFamily: Font.bold, color: Colors.theme_color }}>Payment Successful</Text>
                                <Text style={{ fontSize: mobileW * 0.034, fontFamily: 'Roboto-Regular', color: Colors.theme_color }}>Thank you you have successfully paid</Text>
                            </View>
                            <View style={{ width: mobileW * 80 / 100, alignItems: 'flex-start', justifyContent: 'center', marginBottom: mobileH * 0.03, }}>
                                <Text style={{ fontSize: mobileW * 3 / 100, fontFamily: Font.bold, color: Colors.theme_color }}>Transaction Number:  <Text style={{ fontSize: mobileW * 3 / 100, color: Colors.theme_color }}>{this.state.txn_number}</Text></Text>
                            </View>
                            <View style={{ flexDirection: 'row', width: mobileW * 80 / 100, alignSelf: 'center', alignItems: 'flex-end', justifyContent: 'space-between', borderBottomWidth: 0.5, paddingBottom: 3, marginBottom: mobileH * 0.025, }}>
                                <Text style={{ fontSize: mobileW * 3.2 / 100, fontFamily: Font.bold, color: Colors.theme_color }}>TOTAL AMOUNT PAID</Text>
                                <Text style={{ fontSize: mobileW * 3.4 / 100, fontFamily: Font.bold, color: Colors.font_color }}>${this.state.amount}</Text>
                            </View>
                            <View style={{ marginTop: 15, flexDirection: 'row', width: mobileW * 80 / 100, alignSelf: 'center', alignItems: 'flex-end', justifyContent: 'space-between', borderBottomWidth: 0.5, paddingBottom: 3, marginBottom: mobileH * 0.025, }}>
                                <Text style={{ fontSize: mobileW * 3.2 / 100, fontFamily: Font.bold, color: Colors.theme_color }}>PAID BY</Text>
                                <Text style={{ fontSize: mobileW * 3.2 / 100, fontFamily: Font.bold, color: Colors.font_color }}>CREDIT CARD</Text>
                            </View>
                            <View style={{ marginTop: 15, flexDirection: 'row', width: mobileW * 80 / 100, alignSelf: 'center', alignItems: 'flex-end', justifyContent: 'space-between', borderBottomWidth: 0.5, paddingBottom: 3, marginBottom: mobileH * 0.025, }}>
                                <Text style={{ fontSize: mobileW * 3.2 / 100, fontFamily: Font.bold, color: Colors.theme_color }}>TRANSACTION DATE</Text>
                                <Text style={{ fontSize: mobileW * 3.4 / 100, fontFamily: Font.bold, color: Colors.font_color }}>{this.state.txn_date}</Text>
                            </View>
                            <View style={{ marginTop: 15, width: mobileW * 72 / 100, borderRadius: 15, alignItems: 'center', justifyContent: 'center', alignSelf: 'center', }}>
                                <TouchableOpacity activeOpacity={1} style={{ width: mobileW * 84 / 100, height: mobileH * 7 / 100, backgroundColor: Colors.theme_color, borderRadius: 35, alignItems: 'center', justifyContent: 'center', alignSelf: 'center' }}
                                    onPress={() => { this.Continue() }}>
                                    <Text style={{ fontSize: mobileW * 4 / 100, fontFamily: Font.bold, color: Colors.purewhite }}>Continue</Text>
                                </TouchableOpacity>
                                {/* {this.state.move == false &&<TouchableOpacity activeOpacity={1} style={{ width: mobileW * 84 / 100, height: mobileH * 7 / 100, backgroundColor: Colors.theme_color, borderRadius: 35, alignItems: 'center', justifyContent: 'center', alignSelf: 'center' }}
                                        onPress={() => { this.props.navigation.navigate('ExpertHome') }}>
                                        <Text style={{ fontSize: mobileW * 4.4 / 100, fontFamily: Font.bold, color: Colors.purewhite }}>Continue</Text>
                                    </TouchableOpacity>} */}
                            </View>
                        </View>
                    </View>
                </TouchableOpacity>
                {/* <HideWithKeyboard>
                    <Footer
                        usertype={1}
                        footerpage={[
                            { name: 'Home', countshow: false, image: localimag.home, activeimage: localimag.home },

                            { name: 'MyQuestion', countshow: false, image: (count_inbox > 0) ? localimag.messagered : localimag.message1, activeimage: (count_inbox > 0) ? localimag.messagered : localimag.message1 },

                            { name: 'Notification', countshow: false, image: (this.state.count_noti > 0) ? localimag.bell_red : localimag.bell1, activeimage: (this.state.count_noti > 0) ? localimag.bell_red : localimag.bell1 },

                            { name: 'Classes', countshow: false, image: localimag.classes, activeimage: localimag.classes },

                            { name: 'Profile', countshow: false, image: this.state.footer_image == null ? localimag.default : { uri: config.img_url3 + this.state.footer_image }, activeimage: this.state.footer_image == null ? localimag.default : { uri: config.img_url3 + this.state.footer_image }, round: 'yes' },
                        ]}
                        navigation={this.props.navigation}
                        imagestyle1={{ width: 32, height: 32, backgroundColor: '#FFFFFF', countcolor: 'red', countbackground: 'white', resizeMode: 'contain' }}
                    />
                </HideWithKeyboard> */}
            </View>
        )
    }
    async Continue() {
        localStorage.setItemString('guest_user', 'no');
        setTimeout(() => {
            this.props.navigation.navigate('ChooseExpert');
        }, 700);
    }
}
const styles = StyleSheet.create({
    splash: {
        width: mobileW * 58 / 100,
        height: mobileH * 26 / 100,
    },
    eyeChangep: {
        width: 16,
        height: 16,
        resizeMode: 'contain',
        marginTop: 2,
        marginRight: 5,
    },
    eyeChangep1: {
        width: 14,
        height: 12,
        resizeMode: 'contain',
        marginTop: 2,
        marginRight: 5,
    },
});


