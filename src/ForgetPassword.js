import React, { Component, createRef } from 'react'
import { Text, View, SafeAreaView, StatusBar, TouchableOpacity, Image, KeyboardAvoidingView, TextInput, Modal, ImageBackground, Dimensions, ScrollView, BackHandler, Alert, FlatList, Keyboard, StyleSheet, Platform } from 'react-native'
import { config, Otpprovider, Mapprovider, apifuntion, Colors, Font, validation, mobileH, mobileW, SocialLogin, Cameragallery, mediaprovider, localStorage, Lang_chg, consolepro, msgProvider, msgTitle, msgText, Currentltlg } from './Providers/utilslib/Utils'
import { localimag } from './Providers/Localimageprovider/Localimage'
export default class ForgetPassword extends Component {
    constructor(props) {
        super(props)
        this.state = {
            email: '',
        }
    }
    successMessage = () => {
        Alert.alert(
            "Information Message",
            "A link has been sent on your mail id. Please check your mail",
            [
                { text: "OK", onPress: () => { { this.props.navigation.navigate("Login"); } } }
            ],
            { cancelable: false }
        );
    }
    //---------------------************-------------------------//
    ForgetPassword = async () => {
        consolepro.consolelog('ForgetPassword');
        let email = this.state.email;
        if (email.length <= 0) {
            msgProvider.toast(msgText.emptyEmail[config.language], 'top')
            return false;
        }
        const regg = /^([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;
        if (regg.test(email) !== true) {
            msgProvider.toast(msgText.validEmail[config.language], 'top')
            return false;
        }
        let url = config.baseURL + "forget_password.php";
        consolepro.consolelog('url', url)
        let data = new FormData();
        data.append('email', email)
        apifuntion.postApi(url, data).then((obj) => {
            if (obj.success == 'true') {
                localStorage.setItemObject('user_arr', obj.user_details);
                this.successMessage();
            } else {
                consolepro.consolelog('false')
                if (obj.active_status == 'deactivate') {
                    this.props.navigation.navigate('Login');
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
                    <TouchableOpacity onPress={() => { this.props.navigation.navigate('Login') }} style={{ alignItems: 'flex-start', alignSelf: 'center', justifyContent: 'center', height: mobileH * 8 / 100, width: mobileW * 88 / 100 }}>
                        <Image style={{ width: mobileH * 5 / 100 }} resizeMode={'contain'} source={localimag.back}></Image>
                    </TouchableOpacity>
                    <View style={{ alignItems: 'center', justifyContent: 'flex-start', height: mobileH * 25 / 100, }}>
                        <Image style={styles.splash} resizeMode={'contain'} source={localimag.logo}></Image>
                    </View>
                    <View style={{ alignItems: 'center', justifyContent: 'flex-start', height: mobileH * 75 / 100 }}>
                        <View style={{ height: mobileH * 65 / 100, width: mobileW * 84 / 100, }}>
                            <View style={{ height: mobileH * 10 / 100, alignItems: 'center', justifyContent: 'flex-start' }}>
                                <Text style={{ fontSize: mobileW * 6 / 100, fontFamily: Font.bold, }}>Forgot Password?</Text>
                            </View>
                            <View style={{ width: mobileW * 84 / 100, height: mobileH * 10 / 100, alignSelf: 'center', alignItems: 'center' }}>
                                <Text style={{ fontFamily: Font.regular, fontSize: mobileW * 4 / 100 }}>Forgot your password type in your email address and we'll send you a link to reset it.</Text>
                            </View>
                            <View style={{ height: mobileH * 8 / 100, alignItems: 'center', justifyContent: 'flex-start' }}>
                                <View style={{ borderWidth: 2, borderColor: Colors.line_color, width: mobileW * 84 / 100, height: mobileH * 7 / 100, borderRadius: 12, alignSelf: 'center', justifyContent: 'center', }}>
                                    <TextInput
                                        onChangeText={text => { this.setState({ email: text }) }}
                                        value={"" + this.state.email + ""}
                                        maxLength={50}
                                        returnType="done"
                                        returnKeyType="done"
                                        style={{ fontFamily: Font.regular, marginLeft: 10, width: mobileW * 80 / 100, fontSize: mobileW * 3.8 / 100, padding: 6, fontWeight: 'bold' }}
                                        placeholder="Enter your email"
                                        keyboardType={'default'}
                                        placeholderTextColor={'#000000'}
                                        onSubmitEditing={() => { Keyboard.dismiss() }}
                                    />
                                </View>
                            </View>
                            <View style={{ width: mobileW * 72 / 100, height: mobileH * 9 / 100, borderRadius: 15, alignItems: 'center', justifyContent: 'center', alignSelf: 'center', }}>
                                <TouchableOpacity activeOpacity={1} style={{ width: mobileW * 84 / 100, height: mobileH * 7 / 100, backgroundColor: Colors.theme_color, borderRadius: 35, alignItems: 'center', justifyContent: 'center', alignSelf: 'center' }}
                                    onPress={() => { this.ForgetPassword() }}>
                                    <Text style={{ fontSize: mobileW * 4 / 100, fontFamily: Font.bold, color: Colors.purewhite }}>Reset Password</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                    <View style={{ height: mobileH * 5 / 100, justifyContent: 'flex-start', alignSelf: 'center', alignItems: 'center' }}>
                        <Text style={{ fontSize: mobileW * 3 / 100, fontFamily: Font.regular }}>You dont't have an account? <Text style={{ fontSize: mobileW * 3.2 / 100, fontFamily: Font.regular, color: Colors.theme_color }}>Sign up</Text></Text>
                    </View>
                </TouchableOpacity>
            </View>
        )
    }
}
const styles = StyleSheet.create({
    splash: {
        width: mobileW * 50 / 100,
        height: mobileH * 22 / 100,
    },
});


