import React, { Component, createRef } from 'react'
import { Text, View, SafeAreaView, StatusBar, TouchableOpacity, Image, KeyboardAvoidingView, TextInput, Modal, ImageBackground, Dimensions, ScrollView, BackHandler, Alert, FlatList, Keyboard, StyleSheet, Platform } from 'react-native'
import { config, Otpprovider, Mapprovider, apifuntion, Colors, Font, validation, mobileH, mobileW, SocialLogin, Cameragallery, mediaprovider, localStorage, Lang_chg, consolepro, msgProvider, msgTitle, msgText, Currentltlg } from './Providers/utilslib/Utils'
import { localimag } from './Providers/Localimageprovider/Localimage'
import { firebaseprovider } from './Providers/FirebaseProvider';
import Footer from './Providers/Footer';
import Footerr from './Providers/Footerr';
import HideWithKeyboard from 'react-native-hide-with-keyboard';
global.doLogin = '';
export default class Login extends Component {
    _didFocusSubscription;
    _willBlurSubscription;
    constructor(props) {
        super(props)
        this.state = {
            modalVisible2: false,
            englishstaus: false,
            arebicstaus: false,
            isLogin: '',
            email: '',
            password: '',
            securepassword: true,
            timer: null,
            minutes_Counter: '01',
            seconds_Counter: '59',
            startDisable: true,
            startDisable: false,
            user_type: 0,
            footer_image: null,
        }
        this._didFocusSubscription = props.navigation.addListener('focus', payload =>
            BackHandler.addEventListener('hardwareBackPress', this.handleBackPress)
        );
    }

    facebookLogin() {
        consolepro.consolelog('facebookLogin')
        SocialLogin.Socialfunction(this.props.navigation, 'facebook')
    }
    googleLogin() {
        consolepro.consolelog('googleLogin')
        SocialLogin.Socialfunction(this.props.navigation, 'google')
    }

    componentDidMount() {
        this.props.navigation.addListener('focus', () => {
            doLogin = " ";
            this.showLoginDetails();
            this.checkSocsialData();
        });
        this._willBlurSubscription = this.props.navigation.addListener('blur', payload =>
            BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress)
        );
    }

    checkSocsialData = async () => {
        var socialdata = await localStorage.getItemObject('socialdata');
        if (socialdata != null) {
            consolepro.consolelog('social--', socialdata);
            let social_type = socialdata.social_type;
            config.AppLogoutSplash(this.props.navigation, social_type)
        }
    }


    showLoginDetails = async () => {
        let email_remember = await localStorage.getItemString('email');
        let password_remember = await localStorage.getItemString('password');
        let remember_me = await localStorage.getItemString('remember_me');

        consolepro.consolelog('email_remember', email_remember)
        consolepro.consolelog('password_remember', password_remember)

        if (remember_me == 'yes') {
            this.setState({ email: email_remember, password: password_remember, englishstaus: true });
        } else {
            this.setState({ email: '', password: '' })
        }
    }

    successMessage = () => {
        Alert.alert(
            "Information Message",
            "Your account will be approved by the admin in 24 hours",
            [
                { text: "OK", onPress: () => { { this.props.navigation.navigate("Login"); } } }
            ],
            { cancelable: false }
        );
    }

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
                        BackHandler.exitApp();
                    }
                }
            }], {
            cancelable: false
        }
        );
        return true;
    };

    //-----------------*******Timer*******---------------//

    onButtonStart = () => {
        let timer = setInterval(() => {
            if (this.state.minutes_Counter == '00' && this.state.seconds_Counter == '01') {
                this.onButtonStop()
            }
            var num = (Number(this.state.seconds_Counter) - 1).toString(),
                count = this.state.minutes_Counter;
            if ((this.state.seconds_Counter) == '00') {
                count = (Number(this.state.minutes_Counter) - 1).toString();
                num = 59
            }
            if (count != -1) {
                this.setState({
                    minutes_Counter: count.length == 1 ? '0' + count : count,
                    seconds_Counter: num.length == 1 ? '0' + num : num
                });
            } else {
                this.onButtonStop()
            }
        }, 1000);
        this.setState({ timer });
        this.setState({ startDisable: true })
    }

    onButtonStop = () => {
        clearInterval(this.state.timer);
        this.setState({ startDisable: false })
    }

    //--------------------************--------------------//

    resendOTP = async () => {
        consolepro.consolelog('resendOTP');
        let user_id = await localStorage.getItemString('user_id');

        let otp = this.state.otp;
        clearInterval(this.state.timer);
        this.setState({
            minutes_Counter: '01',
            seconds_Counter: '59',
        })
        let url = config.baseURL + "resend_otp.php";
        consolepro.consolelog(url)
        let data = new FormData();
        data.append('user_id', user_id)
        apifuntion.postApi(url, data).then((obj) => {
            consolepro.consolelog('obj', obj)
            if (obj.success == "true") {
                this.onButtonStart();
                consolepro.consolelog('true')
                localStorage.setItemObject('isLogin', true);
            } else {
                consolepro.consolelog('false')
                msgProvider.alert(msgTitle.information[config.language], obj.msg[config.language], false);
                if (obj.active_status == 'deactivate') {
                    config.checkUserDeactivate(this.props.navigation);
                    return false;
                }
                return false;
            }
        }).catch((error) => {
            consolepro.consolelog("-------- error ------- " + error);
        });
    }

    //---------------------************----------------------//

    otpVerify = async () => {
        consolepro.consolelog('otpVerify');
        let user_id = await localStorage.getItemString('user_id');
        let otp = this.state.otp;
        if (otp.length <= 0) {
            msgProvider.toast(msgText.message_OTP[config.language], 'top')
            return false;
        }
        if (otp.length < 4) {
            msgProvider.toast(msgText.full_OTP[config.language], 'top')
            return false;
        }
        let url = config.baseURL + "otp_verify.php";
        consolepro.consolelog(url)
        let data = new FormData();
        data.append('user_id', user_id)
        data.append('otp', otp)
        data.append('signup_step', 0)
        apifuntion.postApi(url, data).then((obj) => {
            consolepro.consolelog('obj', obj);
            if (obj.success == "true") {
                consolepro.consolelog('true')
                localStorage.setItemObject('isLogin', true);
                localStorage.setItemString('user_id', obj.user_details.user_id.toString());
                if (obj.user_details.user_type == 1) {
                    setTimeout(() => {
                        this.setState({ modalVisible2: false })
                        this.props.navigation.navigate('SubscriptionPlan', { plan_type: 1 });
                    }, 1000);
                } else {
                    setTimeout(() => {
                        this.setState({ modalVisible2: false })
                        this.props.navigation.navigate('UploadDocNext');
                    }, 1000);
                }
            } else {
                consolepro.consolelog('false')
                msgProvider.alert(msgTitle.information[config.language], obj.msg[config.language], false);
                if (obj.active_status == 'deactivate') {
                    config.checkUserDeactivate(this.props.navigation);
                    return false;
                }
                return false;
            }
        }).catch((error) => {
            consolepro.consolelog("-------- error ------- " + error);
        });
    }

    //---------------------************-------------------------//

    Login = async () => {
        consolepro.consolelog('Login');
        let email = this.state.email;
        let password = this.state.password;
        if (email.length <= 0) {
            msgProvider.toast(msgText.emptyEmail[config.language], 'top')
            return false;
        }
        const regg = /^([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;
        if (regg.test(email) !== true) {
            msgProvider.toast(msgText.validEmail[config.language], 'top')
            return false;
        }
        if (password.length == 0) {
            msgProvider.toast(msgText.emptyPassword[config.language], 'top')
            return false;
        }
        if (password.length < 6) {
            msgProvider.toast(msgText.lengthPassword[config.language], 'top')
            return false;
        }
        let url = config.baseURL + "login.php";
        consolepro.consolelog('url', url)
        let data = new FormData();
        data.append('action', 'normal_login')
        data.append('email', email)
        data.append('password', password)
        data.append("device_type", config.device_type)
        data.append("player_id",player_id_me1)
        data.append("app_type", config.app_type)
        apifuntion.postApi(url, data).then((obj) => {
            consolepro.consolelog('obj', obj)
            if (obj.success == 'true') {
                localStorage.setItemString('email', email);
                localStorage.setItemString('password', password);
                doLogin = false
                localStorage.setItemString('user_id', obj.user_details.user_id.toString());
                localStorage.setItemObject('user_arr', obj.user_details);
                consolepro.consolelog('yahaaa', obj.user_details.otp_verify)
                if (obj.user_details.user_type == '1') {
                    if(obj.user_details.sms_otp_show_hide=='hide')
                    {
                        localStorage.setItemString('guest_user', 'no');
                      
                        this.props.navigation.navigate('Home');
                    }
                    else{
                    if (obj.user_details.otp_verify != '0') {
                        localStorage.setItemString('password', password);
                        localStorage.setItemString('email', email);

                        localStorage.setItemObject('isLogin', true);
                        if (this.state.englishstaus == true) {
                            localStorage.setItemString('remember_me', 'yes');
                        } else {
                            localStorage.setItemString('remember_me', 'no');
                            this.setState({ email: '' });
                            this.setState({ password: '' });
                        }
                        if (obj.user_details.signup_step == '0') {
                            setTimeout(() => {
                                this.props.navigation.navigate('SubscriptionPlan', { plan_type: 1 });
                            }, 2000);
                        }
                        if (obj.user_details.signup_step == '1') {
                            setTimeout(() => {
                                this.props.navigation.navigate('SubscriptionPlan', { plan_type: 1 });
                            }, 2000);
                        }
                        if (obj.user_details.signup_step == '2') {
                            setTimeout(() => {
                                console.log("himanshu user");
                                
                                localStorage.setItemString('guest_user', 'no');
                                localStorage.setItemObject('user_arr', obj.user_details);

                                firebaseprovider.firebaseUserCreate();
                                firebaseprovider.getMyInboxAllData();

                                this.props.navigation.navigate('Home');
                            }, 2000);
                        }
                    } else {
                        localStorage.setItemString('password', password);

                        localStorage.setItemString('user_id', obj.user_details.user_id.toString());
                        this.onButtonStart();
                        this.setState({ modalVisible2: true });
                    }
                }
                } else {
                    if (obj.user_details.otp_verify != '0') {
                        localStorage.setItemObject('isLogin', true);
                        localStorage.setItemString('password', password);

                        localStorage.setItemString('user_id', obj.user_details.user_id.toString());
                        if (this.state.englishstaus == true) {
                            localStorage.setItemString('remember_me', 'yes');
                        } else {
                            localStorage.setItemString('remember_me', 'no');
                            localStorage.removeItem('email_remember');
                            localStorage.removeItem('password_remember');
                            this.setState({ email: '' });
                            this.setState({ password: '' });
                        }
                        if (obj.user_details.signup_step == '0') {
                            setTimeout(() => {
                                this.props.navigation.navigate('UploadDocNext');
                            }, 2000);
                        }
                        if (obj.user_details.signup_step == '3') {
                            setTimeout(() => {
                                this.props.navigation.navigate('UploadPic');
                            }, 2000);
                        }
                        if (obj.user_details.signup_step == '4') {
                            setTimeout(() => {
                                this.props.navigation.navigate('SetWorkingHours');
                            }, 2000);
                        }
                        if (obj.user_details.signup_step == '5') {
                            if (obj.user_details.approved_unapproved == '1') {
                                setTimeout(() => {
                                    
                                    localStorage.setItemString('guest_user', 'no');
                                    localStorage.setItemObject('user_arr', obj.user_details);

                                    firebaseprovider.firebaseUserCreate();
                                    firebaseprovider.getMyInboxAllData();
                                    
                                    this.props.navigation.navigate('ExpertHome');
                                }, 2000);
                            } else {
                                this.successMessage();
                            }
                        }
                    } else {
                        localStorage.setItemString('user_id', obj.user_details.user_id.toString());
                        localStorage.setItemObject('password', password);
                        this.onButtonStart();
                        if(obj.user_details.sms_otp_show_hide=='hide')
                        {
                            this.props.navigation.navigate('UploadDocNext');
                        }
                        else{
                            this.setState({ modalVisible2: true });
                        }
                     
                    }
                }
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
    goToHome() {
        localStorage.setItemString('guest_user', 'yes');
        doLogin = true;
        setTimeout(() => {
            this.props.navigation.navigate('Home');
        }, 600);
    }
    //------------------------------------------------------------//
    render() {
        return (
            <View style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
                <SafeAreaView style={{ flex: 0, backgroundColor: Colors.purewhite }} />
                <StatusBar backgroundColor={Colors.purewhite} barStyle="dark-content" hidden={false} translucent={false}
                    networkActivityIndicatorVisible={true} />
                <Modal
                    animationType="slide"
                    transparent
                    visible={this.state.modalVisible2}
                    onRequestClose={() => {
                        consolepro.consolelog('Modal has been closed.');
                    }}>
                    <View style={{ flex: 1, backgroundColor: '#00000090', alignItems: 'center', justifyContent: 'center', borderRadius: 0, }}>
                        <View style={styles.signupPopupotp}>
                            <View style={{ alignItems: 'center', marginTop: mobileW * 2 / 100 }}>
                                <Text style={styles.TopSignUpTitle}>Verification</Text>
                                <Text style={styles.optTxt}>Please type the verification code sent to</Text>
                                <Text onPress={() => { this.setState({ modalVisible2: false }) }} style={styles.otpEdit}><Text style={styles.otpNumber}>{this.state.email}</Text> Edit</Text>
                            </View>
                            <View style={styles.OtpInput}>
                                <TextInput
                                    ref={input => { this.otp = input }}
                                    onChangeText={(txt) => { this.setState({ otp: txt }) }}
                                    //value={"" + this.state.otp + ""}
                                    maxLength={4}
                                    returnType="done"
                                    returnKeyType="done"
                                    style={styles.otpInpoutType}
                                    keyboardType='number-pad'
                                    placeholder="OTP"
                                    placeholderTextColor={Colors.font_color}>{this.state.otp}
                                </TextInput>
                            </View>
                            <View style={styles.verifyBox}>
                                <View style={styles.verifyBox50}>
                                    {this.state.startDisable == false && <TouchableOpacity activeOpacity={0.9} onPress={() => { this.resendOTP(); }}>
                                        <Text style={styles.OTpLeftResend}>Resend</Text>
                                    </TouchableOpacity>}
                                    {this.state.startDisable == true && <Text style={styles.OTpLeftResend}>{this.state.minutes_Counter}: {this.state.seconds_Counter}</Text>}
                                </View>
                                <View style={styles.verifyBoxve}>
                                    <TouchableOpacity onPress={() => { this.otpVerify() }} activeOpacity={0.9}>
                                        <Text style={styles.OTpLeftverify}>Verify</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    </View>
                </Modal>
                <ScrollView contentContainerStyle={{ paddingBottom: 80 }}>
                    <TouchableOpacity activeOpacity={1} onPress={() => { Keyboard.dismiss() }}>
                        <View style={{ width: mobileW * 90 / 100, justifyContent: 'space-between', alignSelf: 'center', alignItems: 'center', flexDirection: 'row', }}>
                            <Text></Text>
                            <TouchableOpacity style={{ padding: 5, }} activeOpacity={1} onPress={() => { this.goToHome() }}>
                                <Text style={{ fontFamily: Font.regular, fontSize: mobileW * 4.5 / 100, color: Colors.theme_color }}>Skip</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={{ alignItems: 'center', height: mobileH * 22 / 100, justifyContent: 'center' }}>
                            <Image style={styles.splash} source={localimag.logo}></Image>
                        </View>
                        <View style={{ alignItems: 'center', justifyContent: 'flex-start', height: mobileH * 72 / 100 }}>
                            <View style={{ height: mobileH * 64 / 100, width: mobileW * 84 / 100, }}>
                                <View style={{ height: mobileH * 6 / 100, alignItems: 'flex-start', justifyContent: 'center' }}>
                                    <Text style={{ fontSize: mobileW * 6.2 / 100, fontFamily: Font.bold, }}>Login</Text>
                                    <Text style={{ fontSize: mobileW * 4.5 / 100, fontFamily: Font.regular, marginTop: -4 }}>Please enter your email</Text>
                                </View>
                                <View style={{ height: mobileH * 23 / 100, alignItems: 'center', justifyContent: 'flex-end' }}>
                                    <View style={{ borderWidth: 2, borderColor: Colors.line_color, width: mobileW * 84 / 100, height: mobileH * 7 / 100, borderRadius: 12, alignSelf: 'center', justifyContent: 'center', }}>
                                        <TextInput
                                            onChangeText={text => { this.setState({ email: text }) }}
                                            value={this.state.email}
                                            maxLength={50}
                                            returnType="done"
                                            returnKeyType="done"
                                            style={{ fontFamily: Font.regular, marginLeft: 10, width: mobileW * 80 / 100, fontSize: mobileW * 4.4 / 100, padding: 6, fontWeight: 'bold' }}
                                            placeholder="Email"
                                            keyboardType={'email-address'}
                                            placeholderTextColor={Colors.font_color}
                                            onSubmitEditing={() => { Keyboard.dismiss() }}
                                        />
                                    </View>
                                    <View style={{ flexDirection: 'row', borderWidth: 2, borderColor: Colors.line_color, width: mobileW * 84 / 100, height: mobileH * 7 / 100, borderRadius: 12, justifyContent: 'flex-start', alignSelf: 'center', marginTop: 18 }}>
                                        <TextInput
                                            onChangeText={text => { this.setState({ password: text }) }}
                                            value={this.state.password}
                                            secureTextEntry={this.state.securepassword}
                                            maxLength={20}
                                            returnType="done"
                                            returnKeyType="done"
                                            onSubmitEditing={() => { Keyboard.dismiss() }}
                                            style={{ padding: 6, fontFamily: Font.regular, marginLeft: 10, width: mobileW * 68 / 100, fontSize: mobileW * 4.4 / 100, fontWeight: 'bold' }}
                                            placeholder="Password"
                                            keyboardType={'default'}
                                            placeholderTextColor={Colors.font_color}
                                        />
                                        <TouchableOpacity activeOpacity={1}
                                            onPress={() => { this.setState({ securepassword: !this.state.securepassword }) }} style={{ width: mobileW * 12 / 100, alignItems: 'center', justifyContent: 'center' }}>
                                            {this.state.securepassword ?
                                                <Text style={{ fontFamily: Font.bold, color: Colors.theme_color }}>Show</Text> : <Text style={{ fontFamily: Font.bold, color: Colors.theme_color }}>Hide</Text>}
                                        </TouchableOpacity>
                                    </View>
                                </View>
                                <View style={{ width: mobileW * 84 / 100, paddingVertical:mobileW*1/100, alignItems: 'flex-end', justifyContent: 'flex-start', }}>
                                    <Text style={{ color: Colors.font_color, fontFamily: Font.regular, fontSize: mobileW * 4.4 / 100, padding: 1 }}
                                        onPress={() => { this.props.navigation.navigate('ForgetPassword') }}>Forgot Password?</Text>
                                </View>
                                <View style={{ width: mobileW * 84 / 100,paddingVertical:mobileW*1/100, alignItems: 'flex-start', justifyContent: 'flex-start' }}>
                                    <View style={{ paddingBottom: 15, paddingLeft: 0, paddingRight: 20, alignItems: 'center' }}>
                                        <TouchableOpacity onPress={() => { this.setState({ englishstaus: !this.state.englishstaus, arebicstaus: false }) }} activeOpacity={0.9}>
                                            <View style={{ flexDirection: 'row', alignItems: 'center', alignItems: 'center', justifyContent: 'center' }}>
                                                {this.state.englishstaus == true && <View style={{ height: mobileH * 2.5 / 100, width: mobileW * 4.7 / 100, alignItems: 'center', justifyContent: 'center', }}>
                                                    <Image style={{ width: mobileW * 5.2 / 100, height: mobileW * 5.2 / 100, resizeMode: 'contain' }} source={localimag.check}></Image>
                                                </View>}
                                                {this.state.englishstaus == false && <View style={{ height: mobileW * 4.7 / 100, width: mobileW * 4.7 / 100, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: Colors.theme_color }}>
                                                    <Image style={{ width: mobileW * 5 / 100, height: mobileH * 3.2 / 100, resizeMode: 'contain' }} source={localimag.check2}></Image>
                                                </View>}
                                                <Text style={{ marginLeft: 10, color: '#000', fontSize: mobileW * 4.4 / 100, fontFamily: "Roboto-Regular" }}>Remember me</Text>
                                            </View>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                                <View style={{ width: mobileW * 72 / 100, height: mobileH * 12 / 100, borderRadius: 15, alignItems: 'center', justifyContent: 'center', alignSelf: 'center', }}>
                                    <TouchableOpacity activeOpacity={1} style={{ width: mobileW * 84 / 100, height: mobileH * 7 / 100, backgroundColor: Colors.theme_color, borderRadius: 35, alignItems: 'center', justifyContent: 'center', alignSelf: 'center' }}
                                        onPress={() => { this.Login(); }}>
                                        <Text style={{ fontSize: mobileW * 4.4 / 100, fontFamily: Font.bold, color: Colors.purewhite }}>Login</Text>
                                    </TouchableOpacity>
                                </View>
                                <View style={{ flexDirection: 'row', alignItems: 'center', alignSelf: 'center', justifyContent: 'center', width: mobileW * 84 / 100, }}>
                                    <View style={{ width: mobileW * 20 / 100, borderWidth: 0.6, marginTop: 4, borderColor: 'gray' }}></View>
                                    <Text style={{ fontSize: mobileW * 4.2 / 100, fontWeight: 'bold' }}>  or  </Text>
                                    <View style={{ width: mobileW * 20 / 100, borderWidth: 0.6, marginTop: 4, borderColor: 'gray' }}></View>
                                </View>
                                {/* <View style={{ flexDirection: 'row', alignSelf: 'center', alignItems: 'center', justifyContent: 'center', height: mobileH * 12 / 100 }}>
                                    <TouchableOpacity onPress={() => { this.facebookLogin() }}>
                                        <Image
                                            style={{ width: mobileW * 8 / 100, height: mobileH * 6 / 100, }}
                                            resizeMode={'contain'}
                                            source={localimag.fb}></Image>
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => { this.googleLogin() }}>
                                        <Image
                                            style={{ width: mobileW * 14 / 100, marginLeft: 6, height: mobileH * 8 / 100 }}
                                            resizeMode={'contain'}
                                            source={localimag.google}>
                                        </Image>
                                    </TouchableOpacity>
                                </View> */}
                            </View>
                            <View style={{ width: mobileW * 84 / 100, height: mobileH * 10 / 100, borderRadius: 15, alignItems: 'center', justifyContent: 'flex-start', alignSelf: 'center' }}>
                                <TouchableOpacity activeOpacity={1} onPress={() => { this.props.navigation.navigate('SignupExpert') }}
                                    style={{ width: mobileW * 84 / 100, height: mobileH * 7 / 100, backgroundColor: Colors.theme_color, borderRadius: 12, alignItems: 'center', justifyContent: 'center', alignSelf: 'center' }}>
                                    <Text style={{ fontSize: mobileW * 4.4 / 100, fontFamily: Font.bold, color: Colors.purewhite }}>Become Expert</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                        <View style={{ height: mobileH * 4 / 100, justifyContent: 'center', alignSelf: 'center', alignItems: 'center' }}>
                            <Text style={{ fontSize: mobileW * 3 / 100, fontFamily: Font.regular, color: Colors.textColor }}>You Dont't have an account?
                                <Text onPress={() => { this.props.navigation.navigate('Signup') }} style={{ fontSize: mobileW * 3.2 / 100, fontFamily: Font.regular, color: '#22A7F2' }}> Sign up</Text>
                            </Text>
                        </View>
                    </TouchableOpacity>
                </ScrollView>
                <HideWithKeyboard>
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
                </HideWithKeyboard>
            </View>
        )
    }
}
const styles = StyleSheet.create({
    splash: {
        width: mobileW * 48 / 100,
        height: mobileW * 48 / 100,
    },
    //OTP Popup
    TopSignUpTitle: {
        fontFamily: Font.bold,
        fontSize: mobileW * 5.5 / 100,
        textAlign: 'center',
    },
    optTxt: {
        fontFamily: Font.bold,
        fontSize: mobileW * 3.2 / 100,
        color: '#A7A5A5',
        marginTop: 2
    },
    otpEdit: {
        textDecorationStyle: "solid",
        textDecorationColor: "#000",
        color: '#00aff0',
        fontSize: mobileW * 3.2 / 100
    },
    otpNumber: {
        fontFamily: Font.bold,
        fontSize: mobileW * 3.2 / 100,
        textAlign: 'center',
        color: '#A7A5A5'
    },
    OtpInput: {
        borderWidth: 1,
        borderColor: "#6FC0F2",
        width: '85%',
        height: 35,
        marginTop: 20,
    },
    otpInpoutType: {
        height: 36,
        textAlign: 'center',
        fontFamily: Font.bold,
        fontSize: mobileW * 3.2 / 100
    },
    verifyBox: {
        flexDirection: 'row',
        width: '100%',
        marginTop: 10,
        borderTopWidth: 1,
        borderColor: "#6FC0F2",
        marginTop: 20,
        height: 50,
    },
    OTpLeftResend: {
        fontFamily: Font.bold,
        fontSize: mobileW * 3.8 / 100,
        color: 'red',
        lineHeight: 50,
    },
    OTpLeftverify: {
        fontFamily: Font.bold,
        fontSize: mobileW * 3.8 / 100,
        color: Colors.theme_color,
        lineHeight: 50,
    },
    verifyBox50: {
        width: '50%',
        alignItems: 'center',
    },
    verifyBoxve: {
        width: '50%',
        alignItems: 'center',
        borderLeftWidth: 1,
        borderColor: "#ccc",
    },
    signupPopupotp: {
        paddingVertical: 10,
        borderRadius: 0,
        paddingTop: 25,
        backgroundColor: '#fff',
        borderRadius: 15,
        width: '80%',
        paddingBottom: 0,
        textAlign: 'center',
        alignItems: 'center',
    }
});