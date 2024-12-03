import React, { Component, createRef } from 'react'
import { Text, View, SafeAreaView, StatusBar, TouchableOpacity, Image, KeyboardAvoidingView, TextInput, Modal, ImageBackground, Dimensions, ScrollView, BackHandler, Alert, FlatList, Keyboard, StyleSheet } from 'react-native'
import { config, Otpprovider, Mapprovider, apifuntion, Colors, Font, validation, mobileH, mobileW, SocialLogin, Cameragallery, mediaprovider, localStorage, Lang_chg, consolepro, msgProvider, msgTitle, msgText, Currentltlg } from './Providers/utilslib/Utils'
import { localimag } from './Providers/Localimageprovider/Localimage'
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

import Footer from './Providers/Footer';
import Footerr from './Providers/Footerr';
import HideWithKeyboard from 'react-native-hide-with-keyboard';

export default class ChangePassword extends Component {
    constructor(props) {
        super(props)
        this.state = {
            password_old: '',
            password_new: '',
            password_con: '',
            securepasswordold: true,
            securepasswordnew: true,
            securepasswordconfirm: true,
            footer_image: null,
            user_type: 1,
        }
        this.setUserType();
    }
    successMessage = () => {
        Alert.alert(
            "Information Message",
            "Your password has been changed successfully",
            [
                { text: "OK", onPress: () => { { this.props.navigation.navigate("Setting"); } } }
            ],
            { cancelable: false }
        );
    }

    setUserType = async () => {
        let result = await localStorage.getItemObject('user_arr')
        if (result != null) {
            this.setState({
                user_type: result.user_type,
                login_type: result.login_type,
                footer_image: result.image
            })
        }
    }


    //-----------------------------------------//
    ChangePassword = async () => {
        consolepro.consolelog('ChangePassword');
        let user_details = await localStorage.getItemObject('user_arr');
        consolepro.consolelog('user_details_ba', user_details);
        if (user_details != null) {
            this.setState({
                user_type: user_details.user_type,
            })
        }
        let password_new = this.state.password_new;
        let password_old = this.state.password_old;
        let password_con = this.state.password_con;
        if (password_old.length == 0) {
            msgProvider.toast(msgText.emptyOldPassword[config.language], 'top')
            return false;
        }
        if (password_old.length < 6) {
            msgProvider.toast(msgText.lengthPassword[config.language], 'top')
            return false;
        }
        if (password_new.length == 0) {
            msgProvider.toast(msgText.emptyNewPassword[config.language], 'top')
            return false;
        }
        if (password_new.length < 6) {
            msgProvider.toast(msgText.lengthPassword[config.language], 'top')
            return false;
        }
        if (password_con.length == 0) {
            msgProvider.toast(msgText.emptyconfirmPassword[config.language], 'top')
            return false;
        }
        if (password_con.length < 6) {
            msgProvider.toast(msgText.lengthPassword[config.language], 'top')
            return false;
        }
        if (password_new != password_con) {
            msgProvider.toast(msgText.passwordNotMatch[config.language], 'top')
            return false;
        }
        let url = config.baseURL + "change_password.php";
        consolepro.consolelog('url', url)
        let data = new FormData();
        data.append('user_id', user_details.user_id)
        data.append('password_old', password_old)
        data.append('password_new', password_new)
        apifuntion.postApi(url, data).then((obj) => {
            if (obj.success == 'true') {
                localStorage.setItemObject('password', password_new)
                this.successMessage();
            } else {
                consolepro.consolelog('false')
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
                <TouchableOpacity activeOpacity={1} onPress={() => { Keyboard.dismiss() }} style={{ height: windowHeight * 100 / 100 }}>
                    <View style={styles.setingsHeader}>
                        <TouchableOpacity activeOpacity={0.9} onPress={() => { this.props.navigation.navigate('Setting') }}>
                            <Image resizeMode="contain" style={{ width: 25, height: 30 }} source={localimag.back}></Image>
                        </TouchableOpacity>
                        <Text style={styles.OrderHistoryTitle}>Change Password</Text>
                        <Text></Text>
                    </View>
                    <View style={{ height: windowHeight * 84 / 100, width: windowWidth * 100 / 100, alignSelf: 'center', alignItems: 'center', justifyContent: 'flex-start', }}>
                        <View style={{ width: windowWidth * 86 / 100, height: windowHeight * 92 / 100 }}>
                            <View style={{ flexDirection: 'row', marginTop: windowHeight * 3 / 100, height: windowHeight * 7 / 100, borderRadius: 5, alignItems: 'center', backgroundColor: Colors.purewhite, borderWidth: 2, borderColor: Colors.theme_color }}>
                                <Image source={localimag.lock}
                                    style={{ marginLeft: windowHeight * 1.5 / 100, height: windowWidth * 6 / 100, width: windowWidth * 5.5 / 100, resizeMode: 'contain', marginBottom: 4 }}>
                                </Image>
                                <TextInput
                                    placeholder={'Old password'}
                                    ref={input => { this.password_old = input }}
                                    onChangeText={(txt) => { this.setState({ password_old: txt }) }}
                                    value={"" + this.state.password_old + ""}
                                    maxLength={50}
                                    returnType="done"
                                    returnKeyType="done"
                                    onSubmitEditing={() => { Keyboard.dismiss() }}
                                    placeholderTextColor={Colors.textColor}
                                    secureTextEntry={this.state.securepasswordold}
                                    style={{ marginLeft: windowWidth * 3 / 100, fontFamily: Font.regular, color: Colors.textColor, fontSize: windowWidth * 3.9 / 100, height: windowHeight * 6 / 100, width: windowWidth * 60 / 100, padding: 2 }}>
                                </TextInput>
                                <TouchableOpacity activeOpacity={1}
                                    onPress={() => { this.setState({ securepasswordold: !this.state.securepasswordold }) }} style={{ width: mobileW * 12 / 100, alignItems: 'center', justifyContent: 'center' }}>
                                    {this.state.securepasswordold ?
                                        <Text style={{ fontFamily: Font.bold, color: Colors.theme_color }}>Show</Text> : <Text style={{ fontFamily: Font.bold, color: Colors.theme_color }}>Hide</Text>}
                                </TouchableOpacity>
                            </View>
                            <View style={{ flexDirection: 'row', marginTop: windowHeight * 3 / 100, height: windowHeight * 7 / 100, borderRadius: 5, alignItems: 'center', backgroundColor: Colors.purewhite, borderWidth: 2, borderColor: Colors.theme_color }}>
                                <Image source={localimag.lock}
                                    style={{ marginLeft: windowHeight * 1.5 / 100, height: windowWidth * 6 / 100, width: windowWidth * 5.5 / 100, resizeMode: 'contain', marginBottom: 4 }}>
                                </Image>
                                <TextInput
                                    placeholder={'New password'}
                                    ref={input => { this.password_new = input }}
                                    onChangeText={(txt) => { this.setState({ password_new: txt }) }}
                                    value={"" + this.state.password_new + ""}
                                    maxLength={50}
                                    returnType="done"
                                    returnKeyType="done"
                                    onSubmitEditing={() => { Keyboard.dismiss() }}
                                    placeholderTextColor={Colors.textColor}
                                    secureTextEntry={this.state.securepasswordnew}
                                    style={{ padding: 2, marginLeft: windowWidth * 3 / 100, fontFamily: Font.regular, color: Colors.textColor, fontSize: windowWidth * 3.9 / 100, height: windowHeight * 6 / 100, width: windowWidth * 60 / 100 }}>
                                </TextInput>
                                <TouchableOpacity activeOpacity={1}
                                    onPress={() => { this.setState({ securepasswordnew: !this.state.securepasswordnew }) }} style={{ width: mobileW * 12 / 100, alignItems: 'center', justifyContent: 'center' }}>
                                    {this.state.securepasswordnew ?
                                        <Text style={{ fontFamily: Font.bold, color: Colors.theme_color }}>Show</Text> : <Text style={{ fontFamily: Font.bold, color: Colors.theme_color }}>Hide</Text>}
                                </TouchableOpacity>
                            </View>
                            <View style={{ flexDirection: 'row', marginTop: windowHeight * 3 / 100, height: windowHeight * 7 / 100, borderRadius: 5, alignItems: 'center', backgroundColor: Colors.purewhite, borderWidth: 2, borderColor: Colors.theme_color }}>
                                <Image source={localimag.lock}
                                    style={{ marginLeft: windowHeight * 1.5 / 100, height: windowWidth * 6 / 100, width: windowWidth * 5.5 / 100, resizeMode: 'contain', marginBottom: 4 }}>
                                </Image>
                                <TextInput
                                    placeholder={'Confirm new password'}
                                    ref={input => { this.password_con = input }}
                                    onChangeText={(txt) => { this.setState({ password_con: txt }) }}
                                    value={"" + this.state.password_con + ""}
                                    maxLength={50}
                                    returnType="done"
                                    returnKeyType="done"
                                    onSubmitEditing={() => { Keyboard.dismiss() }}
                                    placeholderTextColor={Colors.textColor}
                                    secureTextEntry={this.state.securepasswordconfirm}
                                    style={{ padding: 2, marginLeft: windowWidth * 3 / 100, fontFamily: Font.regular, color: Colors.textColor, fontSize: windowWidth * 4 / 100, height: windowHeight * 6 / 100, width: windowWidth * 60 / 100 }}>
                                </TextInput>
                                <TouchableOpacity activeOpacity={1}
                                    onPress={() => { this.setState({ securepasswordconfirm: !this.state.securepasswordconfirm }) }} style={{ width: mobileW * 12 / 100, alignItems: 'center', justifyContent: 'center' }}>
                                    {this.state.securepasswordconfirm ?
                                        <Text style={{ fontFamily: Font.bold, color: Colors.theme_color }}>Show</Text> : <Text style={{ fontFamily: Font.bold, color: Colors.theme_color }}>Hide</Text>}
                                </TouchableOpacity>
                            </View>

                            <TouchableOpacity activeOpacity={1} onPress={() => { this.ChangePassword() }} style={{ marginTop: windowHeight * 6 / 100, height: windowHeight * 7 / 100, borderRadius: 25, alignItems: 'center', justifyContent: 'center', backgroundColor: Colors.theme_color }}>
                                <Text style={{ fontFamily: Font.bold, color: Colors.white_color, fontSize: windowWidth * 4.5 / 100 }}>Submit</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </TouchableOpacity>

                {parseInt(this.state.user_type) == 1 && <View style={{ backgroundColor: '#FFFFFF', elevation: 4, height: mobileH * 6 / 100, position: 'absolute', bottom: 0, width: mobileW * 100 / 100, alignSelf: 'center', shadowColor: '#000000', shadowOffset: { width: 2, height: 2, }, shadowOpacity: 0.30 }}>
                    <Footer
                        activepage='Profile'
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
                    //   count_inbox={count_inbox}
                    />
                </View>}
                {parseInt(this.state.user_type) == 2 && <View style={{ backgroundColor: '#FFFFFF', elevation: 4, height: mobileH * 6 / 100, position: 'absolute', bottom: 0, width: mobileW * 100 / 100, alignSelf: 'center', shadowColor: '#000000', shadowOffset: { width: 2, height: 2, }, shadowOpacity: 0.30 }}>
                    <Footerr
                        activepage='ExpertProfile'
                        usertype={1}
                        footerpage={[
                            { name: 'ExpertHome', countshow: false, image: localimag.home, activeimage: localimag.home, round: 'no' },

                            { name: 'AssignClasses', countshow: false, image: localimag.classes, activeimage: localimag.classes, round: 'no' },

                            { name: 'Notification', countshow: false, image: (this.state.count_noti > 0) ? localimag.bell_red : localimag.bell1, activeimage: (this.state.count_noti > 0) ? localimag.bell_red : localimag.bell1 },
                            { name: 'RatingReview', countshow: false, image: localimag.person1, activeimage: localimag.person1, round: 'no' },

                            { name: 'ExpertProfile', countshow: false, image: this.state.footer_image == null ? localimag.default : { uri: config.img_url3 + this.state.footer_image }, activeimage: this.state.footer_image == null ? localimag.default : { uri: config.img_url3 + this.state.footer_image }, round: 'yes' },
                        ]}
                        navigation={this.props.navigation}
                        imagestyle1={{ width: 32, height: 32, backgroundColor: '#FFFFFF', countcolor: 'red', countbackground: 'white', resizeMode: 'contain' }}
                    //   count_inbox={count_inbox}
                    />

                </View>}

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
        fontFamily: Font.medium,
        fontSize: windowWidth * 5.2 / 100,
        letterSpacing: 0.5
    },
});

