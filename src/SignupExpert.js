import React, { Component, createRef } from 'react'
import { Text, View, SafeAreaView, StatusBar, TouchableOpacity, Image, KeyboardAvoidingView, TextInput, Modal, ImageBackground, Dimensions, ScrollView, BackHandler, Alert, FlatList, Keyboard, StyleSheet, Platform } from 'react-native'
import { config, Otpprovider,notification, Mapprovider, apifuntion, Colors, Font, validation, mobileH, mobileW, SocialLogin, Cameragallery, mediaprovider, localStorage, Lang_chg, consolepro, msgProvider, msgTitle, msgText, Currentltlg } from './Providers/utilslib/Utils'
import { localimag } from './Providers/Localimageprovider/Localimage'
import Footer from './Providers/Footer';
import Footerr from './Providers/Footerr';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import HideWithKeyboard from 'react-native-hide-with-keyboard';
export default class SignupExpert extends Component {
    _didFocusSubscription;
    _willBlurSubscription;
    constructor(props) {
        super(props)
        this.state = {
            modalVisible2: false,
            englishstaus: false,
            arebicstaus: false,
            isLogin: '',
            fname: '',
            lname: '',
            mobile: '',
            email: '',
            password: '',
            confirm_password: '',
            otp: '',
            securepassword: true,
            confirmsecurepassword: true,
            specialist: false,
            timer: null,
            minutes_Counter: '01',
            seconds_Counter: '59',
            startDisable: true,
            startDisable: false,
            speciality_id: '',
            speciality_name: 'Select Your Speciality',
            speciality_arr: 'NA',
            speciality_arr1: 'NA',
            speciality_id_arr: [],
            speciality_name_arr: [],
            speciality_name_string: 'Select Your Speciality',
            onCross: false,
            showSearch: false,
            txtsrch: '',
            showImage: false,
            login_type: 0,
            showPassword: false,
            footer_image: null,
        }
        this._didFocusSubscription = props.navigation.addListener('focus', payload =>
            BackHandler.addEventListener('hardwareBackPress', this.handleBackPress)
        );
    }
    // facebookLogin(){
    //     consolepro.consolelog('facebookLogin')
    //     SocialLogin.Socialfunction(this.props.navigation,'facebook')
    // }
    // googleLogin(){
    //     consolepro.consolelog('googleLogin')
    //     SocialLogin.Socialfunction(this.props.navigation,'google')
    // }
    // appleLogin(){
    //     consolepro.consolelog('appleLogin')
    //     SocialLogin.Socialfunction(this.props.navigation,'apple')
    // }
    componentDidMount() {
        this.props.navigation.addListener('focus', () => {
            this.get_Speciality();
            this.getSocailData();
        });
        this.onButtonStart();
        this._willBlurSubscription = this.props.navigation.addListener('blur', payload =>
            BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress)
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
                        //    this.afterShow();
                    }
                }
            }], {
            cancelable: false
        }
        ); // works best when the goBack is async
        return true;
    };

    //--------------------------------------------------//

    getSocailData = async () => {
        consolepro.consolelog('getSocailData')
        let socialdata = await localStorage.getItemObject('socialdata');
        if (socialdata != 'NA' && socialdata != null) {
            consolepro.consolelog('socialdata12', socialdata)
            let login_type = socialdata.logintype;
            let fname = socialdata.social_first_name;
            let lname = socialdata.social_last_name;
            let email = socialdata.social_email;
            if (email != null && email != ' ') {
                this.setState({ email: email });
                consolepro.consolelog('email1', email)
            } else {
                this.setState({ email: '' });
                consolepro.consolelog('email2', email)
            }
            if (login_type == 'app') {
                this.setState({ login_type: 0 });
            } else {
                this.setState({ login_type: 1 });
            }
            this.setState({ fname: fname, lname: lname });
        }
    }

    //--------------------------------------------------//

    addItem = async (item, index) => {
        console.log('addItem')
        let data = this.state.speciality_arr
        console.log('addItem2', data)
        let data2 = this.state.speciality_id_arr
        let data3 = this.state.speciality_name_arr
        console.log('addItem3', data2)
        data[index].status = !data[index].status
        console.log('addItem4')
        let findindex = data2.indexOf(item.speciality_id);
        if (data[index].status == true) {
            data2.splice(index, 0, item.speciality_id);
            data3.splice(index, 0, item.name)
        } else {
            data2.splice(findindex, 1)
            data3.splice(findindex, 1)
        }
        this.setState({ speciality_arr: data, speciality_id_arr: data2, speciality_name_arr: data3 })
        let speciality_name_string = this.state.speciality_name_arr.join(",")
        this.setState({ speciality_name_string: speciality_name_string })
    }

    //--------------*******Timer*******---------------//

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
            }
            else {
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

    SearchFilterFunction = (text) => {
        consolepro.consolelog('SearchFilterFunction')
        if (this.state.onCross == false) {
            this.setState({ txtsrch: text })
            //passing the inserted text in textinput
            consolepro.consolelog('test1', this.state.speciality_arr)
            let data1 = this.state.speciality_arr1
            if (data1 != 'NA') {
                consolepro.consolelog('test2')
                const newData = data1.filter(function (item) {
                    consolepro.consolelog('myitem', item)
                    //applying filter for the inserted text in search bar
                    const itemData = item.name ? item.name.toUpperCase() : ''.toUpperCase();
                    const textData = text.toUpperCase();
                    return itemData.indexOf(textData) > -1;
                });
                consolepro.consolelog('new data', newData)
                if (newData.length > 0) {
                    this.setState({ speciality_arr: newData })
                } else if (newData.length <= 0) {
                    this.setState({ speciality_arr: 'NA' })
                }
            }
        } else {
            this.search.clear();
            this.setState({ speciality_arr: this.state.speciality_arr1, onCross: false });
        }
    }
    cross_click = async () => {
        await this.SearchFilterFunction('');
        this.setState({ showSearch: false })
    }

    //---------------------***********--------------------------//
    get_Speciality = async () => {
        consolepro.consolelog('get_Speciality');
        let user_details = await localStorage.getItemObject('user_arr');
        consolepro.consolelog('user_details_ba', user_details);
        let url = config.baseURL + "getSpecialityList.php?user_id=" + 0;
        consolepro.consolelog(url)
        setTimeout(() => {
            apifuntion.getApi(url,1).then((obj) => {
                consolepro.consolelog('obj', obj)
                if (obj.success == "true") {
                    this.setState({ speciality_arr: obj.speciality_arr, speciality_arr1: obj.speciality_arr })
                    localStorage.setItemObject('speciality_arr', obj.speciality_arr);
                    consolepro.consolelog('speciality_arr', this.state.speciality_arr)
                    consolepro.consolelog('speciality_arr1', this.state.speciality_arr1)
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
        }, 300);
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
                // this.setState({ otp: obj.otp });
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
    //---------------------************------------------------//
    otpVerify = async () => {
        consolepro.consolelog('otpVerify');
        let user_id = await localStorage.getItemString('user_id');
        consolepro.consolelog('user_id_otp', user_id);
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
        data.append('signup_step', '0')
        apifuntion.postApi(url, data).then((obj) => {
            consolepro.consolelog('obj', obj);
            if (obj.success == "true") {
                consolepro.consolelog('true')
                localStorage.setItemObject('isLogin', true);
                localStorage.setItemString('user_id', obj.user_details.user_id.toString());
                setTimeout(() => {
                    this.setState({ modalVisible2: false })
                    this.props.navigation.navigate('UploadDocNext');
                }, 1000);
                // this.setState({ modalVisible2: false });
                // if(obj.notification_arr!='NA')
                // {
                //     consolepro.consolelog('This is notification ', obj.notification_arr)
                //     notification.notificationfunction(obj.notification_arr[config.language],obj.notification_arr[config.language].action_json,obj.notification_arr[config.language].player_id,obj.notification_arr[config.language].title)
                // }
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
    //---------------------************-------------------------//
    SignUp = async () => {
        consolepro.consolelog('ExpertSignUp');
        let fname = this.state.fname;
        let lname = this.state.lname;
        let mobile = this.state.mobile;
        let email = this.state.email;
        let speciality_id = this.state.speciality_id_arr;
        let password = this.state.password;
        let confirm_password = this.state.confirm_password;
        clearInterval(this.state.timer);
        this.setState({
            minutes_Counter: '01',
            seconds_Counter: '59',
        })
        consolepro.consolelog('data')
        if (fname.length <= 0) {
            msgProvider.toast(msgText.emptyFirstName[config.language], 'top')
            return false;
        }
        if (lname.length <= 0) {
            msgProvider.toast(msgText.emptyLastName[config.language], 'top')
            return false;
        }
        if (mobile.length <= 0) {
            msgProvider.toast(msgText.emptyPhone[config.language], 'top')
            return false;
        }
        if (mobile.length < 6) {
            msgProvider.toast(msgText.minimumPhoneLength[config.language], 'top')
            return false;
        }
        if (mobile.length > 16) {
            msgProvider.toast(msgText.maximumPhoneLength[config.language], 'top')
            return false;
        }
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
        if (confirm_password.length == 0) {
            msgProvider.toast(msgText.emptyconfirmPassword[config.language], 'top')
            return false;
        }
        if (confirm_password.length < 6) {
            msgProvider.toast(msgText.lengthPassword[config.language], 'top')
            return false;
        }
        if (password != confirm_password) {
            msgProvider.toast(msgText.passwordNotMatch[config.language], 'top')
            return false;
        }
        if (speciality_id == 0) {
            msgProvider.toast(msgText.emptySpeciality[config.language], 'top')
            return false;
        }
        if (this.state.englishstaus == false) {
            msgProvider.toast(msgText.emptyCheck[config.language], 'top')
            return false;
        }
        let url = config.baseURL + "expertsignup.php";
        consolepro.consolelog('url', url)
        let data = new FormData();
        data.append('f_name', fname)
        data.append('l_name', lname)
        data.append('mobile', mobile)
        data.append('email', email)
        data.append('password', password)
        data.append('speciality_id', JSON.stringify(speciality_id))
        data.append("device_type", config.device_type)
        data.append("player_id",player_id_me1)
        data.append("app_type", config.app_type)
        apifuntion.postApi(url, data).then((obj) => {
            if (obj.success == 'true') {
                consolepro.consolelog('obj',obj.user_details)
             
                localStorage.setItemString('remember_me', 'no');
                if(obj.user_details.sms_otp_show_hide=='hide')
                {
                    this.props.navigation.navigate('UploadDocNext');
                }
                else{
                    setTimeout(() => {
                        this.setState({ modalVisible2: true });
                    }, 1000);
                }
             
                this.onButtonStart();
                localStorage.setItemObject('password', password)

                localStorage.setItemString('user_id', obj.user_details.user_id.toString());
                localStorage.setItemObject('user_arr', obj.user_details);
             
             
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

    //---------------------------Social Signup--------------------//

    socialsignUp = async () => {
        console.log('socialsignUp');
        let socialdata = await localStorage.getItemObject('socialdata');
        console.log('socialdata.social_type;', socialdata);
        let name = socialdata.social_name;
        let fname = socialdata.social_first_name;
        let lname = socialdata.social_last_name;
        let mobile = this.state.mobile;
        let email = socialdata.social_email;
        let speciality_id = this.state.speciality_id_arr;
        let social_id = socialdata.social_id;
        let login_type = socialdata.social_type;
        console.log('name', name);
        console.log('email', email);
        console.log('mobile', mobile);
        console.log('social_id', social_id);
        console.log('login_type', login_type);
        console.log('data')
        if (name.length <= 0) {
            msgProvider.toast(msgText.emptyName[config.language], 'top')
            return false;
        }
        if (fname.length <= 0) {
            msgProvider.toast(msgText.emptyFirstName[config.language], 'top')
            return false;
        }
        if (lname.length <= 0) {
            msgProvider.toast(msgText.emptyLastName[config.language], 'top')
            return false;
        }
        if (email.length <= 0) {
            msgProvider.toast(msgText.emptyEmail[config.language], 'top')
            return false;
        }
        const regg = /^([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;
        if (regg.test(email) !== true) {
            msgProvider.toast(msgText.validEmail[config.language], 'top')
            return false;
        }
        if (mobile.length <= 0) {
            msgProvider.toast(msgText.emptyPhone[config.language], 'top')
            return false;
        }
        if (mobile.length < 6) {
            msgProvider.toast(msgText.minimumPhoneLength[config.language], 'top')
            return false;
        }
        if (mobile.length > 16) {
            msgProvider.toast(msgText.maximumPhoneLength[config.language], 'top')
            return false;
        }
        if (social_id.length <= 0) {
            msgProvider.toast(msgText.emptysocial_id[config.language], 'top')
            return false;
        }
        if (speciality_id == 0) {
            msgProvider.toast(msgText.emptySpeciality[config.language], 'top')
            return false;
        }
        if (this.state.englishstaus == false) {
            msgProvider.toast(msgText.emptyCheck[config.language], 'top')
            return false;
        }

        let url = config.baseURL + "expertSocialSignup.php";
        console.log('url', url)
        let data = new FormData();
        data.append('name', name)
        data.append('f_name', fname)
        data.append('l_name', lname)
        data.append('user_type', 2)
        data.append('email', email)
        data.append('mobile', mobile)
        data.append('speciality_id', JSON.stringify(speciality_id))
        data.append('social_id', social_id)
        data.append('login_type', login_type)
        data.append("device_type", config.device_type)
        data.append("player_id", config.player_id)
        data.append("app_type", config.app_type)
        console.log('data', data)
        apifuntion.postApi(url, data).then((obj) => {
            if (obj.success == 'true') {
                localStorage.setItemString('remember_me', 'no');         
                 localStorage.setItemObject('user_arr', obj.user_details);
                consolepro.consolelog('Hii', obj)
                // localStorage.setItemObject('user_arr', obj.user_details);
                localStorage.setItemString('user_id', obj.user_details.user_id.toString());
                this.props.navigation.navigate('UploadDocNext');
            } else {
                console.log('false')
                msgProvider.alert(msgTitle.information[config.language], obj.msg[config.language], false);
                if (obj.active_status == 'deactivate') {
                    BackHandler.exitApp();
                    localStorage.clear();
                }
                return false;
            }
        }).catch((error) => {
            console.log("-------- error ------- " + error);
        });
    }

    //------------------------------------------------------------//
    render() {
        return (
            <View style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
                <SafeAreaView style={{ flex: 0, backgroundColor: Colors.theme_color }} />
                <StatusBar backgroundColor={Colors.theme_color} barStyle='default' hidden={false} translucent={false}
                    networkActivityIndicatorVisible={true} />
                <Modal
                    animationType="slide"
                    transparent
                    visible={this.state.modalVisible2}
                    onRequestClose={() => {
                        consolepro.consolelog('Modal has been closed.');
                    }}>
                    <View
                        style={{
                            flex: 1,
                            backgroundColor: '#00000090',
                            alignItems: 'center',
                            justifyContent: 'center',
                            borderRadius: 0,
                        }}>
                        <View style={styles.signupPopupotp}>
                            <View style={{ alignItems: 'center' }}>
                                <Text style={styles.TopSignUpTitle}>Verification</Text>
                                <Text style={styles.optTxt}>Please type the verification code sent to</Text>
                                <Text onPress={() => { this.setState({ modalVisible2: false,otp:'' }) }} style={styles.otpEdit}><Text style={styles.otpNumber}>{this.state.email}</Text> Edit</Text>
                            </View>
                            <View style={styles.OtpInput}>
                                <TextInput
                                    // ref={input => { this.otp = input }}
                                    onChangeText={(txt) => { this.setState({ otp: txt }) }}
                                    //value={"" + this.state.otp + ""}
                                    maxLength={4}
                                    returnType="done"
                                    returnKeyType="done"
                                    style={styles.otpInpoutType}
                                    keyboardType='number-pad'
                                    placeholder="OTP"
                                    placeholderTextColor={Colors.font_color}>

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

                <Modal
                    animationType="slide"
                    transparent
                    visible={this.state.specialist}
                    onRequestClose={() => {
                        consolepro.consolelog('Modal has been closed.');
                    }}>
                    <SafeAreaView style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
                        <View style={{ justifyContent: 'space-between', flexDirection: 'row', width: mobileW * 90 / 100, alignItems: 'center', height: mobileH * 10 / 100, alignSelf: 'center' }}>
                            <TouchableOpacity activeOpacity={1} onPress={() => { this.setState({ specialist: false }) }}>
                                <Image resizeMode="contain" style={{ width: 30, height: 30 }} source={localimag.back}></Image>
                            </TouchableOpacity>
                            <Text style={{ fontSize: mobileW * 5 / 100, fontFamily: Font.medium }}>Choose Your Specialities</Text>
                            <View style={{ justifyContent: 'center', marginTop: 5 }}>
                                <Text onPress={() => { this.setState({ specialist: false }); }} style={{ fontFamily: Font.bold, fontSize: mobileW * 3.8 / 100 }}>Done</Text>
                            </View>
                        </View>
                        <TouchableOpacity activeOpacity={1}
                            style={{ height: mobileH * 7 / 100, width: mobileW * 88 / 100, alignSelf: 'center', borderRadius: 10, borderWidth: 2, borderColor: Colors.theme_color, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', }}>
                            <View style={{ justifyContent: 'center', alignItems: 'center', marginLeft: 8 }}>
                                <Image source={localimag.blue_search} style={{ width: mobileW * 12 / 100, height: mobileW * 5 / 100, resizeMode: 'contain' }}></Image>
                            </View>
                            <TextInput
                              //  onChangeText={text => { this.setState({ txtsrch: text }) }}
                                value={"" + this.state.txtsrch + ""}
                                maxLength={250}
                                multiline={true}
                                returnType="done"
                                returnKeyType="done"
                                onChangeText={(text) => { this.SearchFilterFunction(text) }}
                                onSubmitEditing={() => { Keyboard.dismiss() }}
                                style={{ fontFamily: Font.regular, marginLeft: 2, width: mobileW * 75 / 100, fontSize: mobileW * 3.8 / 100, fontWeight: 'bold', height: mobileH * 6 / 100, }}
                                placeholder=""
                                keyboardType={'default'}
                                placeholderTextColor={Colors.text_color}
                            />
                            <TouchableOpacity onPress={() => { this.cross_click() }} style={{ width: 20, height: 20, justifyContent: 'center', alignSelf: 'center', position: 'absolute', right: 10 }}>
                                <Image resizeMode="contain" style={{ width: 25, height: 25, alignSelf: 'center', }} source={localimag.cancel}></Image>
                            </TouchableOpacity>
                        </TouchableOpacity>
                        <View style={{ marginTop: mobileW * 5 / 100 }}>
                            {this.state.speciality_arr == 'NA' && <Image resizeMode="contain" style={{ width: '100%', height: '60%', marginTop: 0 }} source={localimag.nodataFound}></Image>}
                            {this.state.speciality_arr != 'NA' &&
                                <FlatList
                                    data={this.state.speciality_arr}
                                    showsVerticalScrollIndicator={false}
                                    renderItem={({ item, index }) => {
                                        return (
                                            <TouchableOpacity onPress={() => { this.addItem(item, index); }} style={{ width: mobileW * 100 / 100, height: mobileH * 8 / 100, alignItems: 'center', justifyContent: 'flex-start', alignSelf: 'center', }}>
                                                <View style={{ width: mobileW * 90 / 100, alignItems: 'center', justifyContent: 'flex-start', borderBottomWidth: 1, borderBottomColor: '#EDEDED', flexDirection: 'row' }}>
                                                    <Image source={{ uri: config.img_url3 + item.image }} style={{ width: mobileW * 5 / 100, height: mobileW * 5 / 100, resizeMode: 'contain' }}></Image>
                                                    <View style={{ justifyContent: 'center', width: mobileW * 80 / 100 }}>
                                                        <Text style={{ fontFamily: Font.medium, fontSize: mobileW * 4 / 100, marginLeft: 6 }}> {item.name}</Text>
                                                    </View>
                                                    {item.status == false && <View style={{ borderColor: Colors.theme_color, borderWidth: 1, width: mobileW * 5 / 100, height: mobileW * 5 / 100, marginBottom: 4 }}></View>}
                                                    {item.status == true && <Image style={{ width: mobileW * 6 / 100, height: mobileW * 6 / 100, }} source={localimag.checksignup}></Image>}
                                                </View>
                                            </TouchableOpacity>)
                                    }}
                                    keyExtractor={(item, index) => index.toString()}>
                                </FlatList>}
                        </View>
                    </SafeAreaView>
                </Modal>

                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 80 }}>
                  <KeyboardAwareScrollView>
                  
                    <TouchableOpacity activeOpacity={1} onPress={() => { Keyboard.dismiss() }}  >
                        <View style={{ alignItems: 'center', justifyContent: 'flex-end', height: mobileH * 23 / 100, }}>
                            <Image style={styles.splash} resizeMode={'contain'} source={localimag.logo}></Image>
                        </View>
                        <View style={{ alignItems: 'center', justifyContent: 'flex-start', height: mobileH * 74 / 100 }}>
                            <View style={{ height: mobileH * 74 / 100, width: mobileW * 84 / 100, }}>
                                <View style={{ height: mobileH * 7 / 100, alignItems: 'flex-start', justifyContent: 'center', }}>
                                    <Text style={{ fontSize: mobileW * 6.2 / 100, fontFamily: Font.bold, height: mobileH * 4.6 / 100 }}>Signup</Text>
                                    <Text style={{ fontSize: mobileW * 4.4 / 100, fontFamily: Font.regular, height: mobileH * 4 / 100, marginTop: -4 }}>Please enter your details</Text>
                                </View>
                                <View style={{ height: mobileH * 68 / 100, alignItems: 'center', justifyContent: 'center' }}>
                                    <View style={{ flexDirection: 'row', borderWidth: 2, borderColor: Colors.line_color, width: mobileW * 84 / 100, height: mobileH * 7 / 100, borderRadius: 12, alignSelf: 'center', justifyContent: 'center', }}>
                                        <Image style={{ width: mobileW * 5 / 100, height: mobileH * 6.2 / 100, marginLeft: 12 }} resizeMode={'contain'} source={localimag.name}></Image>
                                        <TextInput
                                            onChangeText={text => { this.setState({ fname: text }) }}
                                            value={"" + this.state.fname + ""}
                                            maxLength={50}
                                            returnType="done"
                                            returnKeyType="done"
                                            style={{ fontFamily: Font.bold, marginLeft: 5, width: mobileW * 72 / 100, fontSize: mobileW * 4.2 / 100, padding: 6, }}
                                            placeholder="First Name"
                                            keyboardType={'default'}
                                            placeholderTextColor={Colors.font_color}
                                            onSubmitEditing={() => { Keyboard.dismiss() }} />
                                    </View>
                                    <View style={{ flexDirection: 'row', borderWidth: 2, borderColor: Colors.line_color, width: mobileW * 84 / 100, height: mobileH * 7 / 100, borderRadius: 12, alignSelf: 'center', justifyContent: 'center', marginTop: 12 }}>
                                        <Image style={{ width: mobileW * 5 / 100, height: mobileH * 6.2 / 100, marginLeft: 12 }} resizeMode={'contain'} source={localimag.name}></Image>
                                        <TextInput
                                            onChangeText={text => { this.setState({ lname: text }) }}
                                            value={"" + this.state.lname + ""}
                                            maxLength={50}
                                            returnType="done"
                                            returnKeyType="done"
                                            style={{ fontFamily: Font.bold, marginLeft: 5, width: mobileW * 72 / 100, fontSize: mobileW * 4.2 / 100, padding: 6, }}
                                            placeholder="Last Name"
                                            keyboardType={'default'}
                                            placeholderTextColor={Colors.font_color}
                                            onSubmitEditing={() => { Keyboard.dismiss() }} />
                                    </View>
                                    <View style={{ flexDirection: 'row', borderWidth: 2, borderColor: Colors.line_color, width: mobileW * 84 / 100, height: mobileH * 7 / 100, borderRadius: 12, alignSelf: 'center', justifyContent: 'center', marginTop: 12 }}>
                                        <Image style={{ width: mobileW * 5 / 100, height: mobileH * 6.2 / 100, marginLeft: 12 }} resizeMode={'contain'} source={localimag.phone}></Image>
                                        <TextInput
                                            onChangeText={text => { this.setState({ mobile: text }) }}
                                            value={"" + this.state.mobile + ""}
                                            maxLength={16}
                                            returnType="done"
                                            returnKeyType="done"
                                            style={{ fontFamily: Font.bold, marginLeft: 5, width: mobileW * 72 / 100, fontSize: mobileW * 4.2 / 100, padding: 6, fontWeight: 'bold' }}
                                            placeholder="Mobile Number"
                                            keyboardType={'numeric'}
                                            placeholderTextColor={Colors.font_color}
                                            onSubmitEditing={() => { Keyboard.dismiss() }} />
                                    </View>
                                    <View style={{ flexDirection: 'row', borderWidth: 2, borderColor: Colors.line_color, width: mobileW * 84 / 100, height: mobileH * 7 / 100, borderRadius: 12, alignSelf: 'center', justifyContent: 'center', marginTop: 12 }}>
                                        <Image style={{ width: mobileW * 5.5 / 100, height: mobileH * 6.2 / 100, marginLeft: 12 }} resizeMode={'contain'} source={localimag.email}></Image>
                                        {this.state.login_type == 0 && <TextInput
                                            onChangeText={text => { this.setState({ email: text }) }}
                                            value={"" + this.state.email + ""}
                                            maxLength={50}
                                            returnType="done"
                                            returnKeyType="done"
                                            style={{ fontFamily: Font.bold, marginLeft: 5, width: mobileW * 72 / 100, fontSize: mobileW * 4.2 / 100, padding: 6, fontWeight: 'bold' }}
                                            placeholder="Email"
                                         keyboardType={'email-address'}
                                            placeholderTextColor={Colors.font_color}
                                            onSubmitEditing={() => { Keyboard.dismiss() }} />}
                                        {this.state.login_type != 0 && <Text style={{ fontFamily: Font.bold, marginLeft: 5, width: mobileW * 72 / 100, fontSize: mobileW * 4.2 / 100, padding: 6, fontWeight: 'bold', marginTop: mobileW * 1 / 100 }}>{this.state.email}</Text>}
                                    </View>
                                    {this.state.login_type == 0 && <View style={{ flexDirection: 'row', borderWidth: 2, borderColor: Colors.line_color, width: mobileW * 84 / 100, height: mobileH * 7 / 100, borderRadius: 12, alignSelf: 'center', justifyContent: 'center', marginTop: 12 }}>
                                        <Image style={{ width: mobileW * 5.5 / 100, height: mobileH * 6.2 / 100, marginLeft: 12 }} resizeMode={'contain'} source={localimag.lock}></Image>
                                        <TextInput
                                            onChangeText={text => { this.setState({ password: text }) }}
                                            value={"" + this.state.password + ""}
                                            maxLength={20}
                                            returnType="done"
                                            returnKeyType="done"
                                            secureTextEntry={this.state.securepassword}
                                            style={{ fontFamily: Font.bold, marginLeft: 5, width: mobileW * 60 / 100, fontSize: mobileW * 4.2 / 100, padding: 6, }}
                                            placeholder="Password"
                                            keyboardType={'default'}
                                            placeholderTextColor={Colors.font_color}
                                            onSubmitEditing={() => { Keyboard.dismiss() }} />
                                        <TouchableOpacity activeOpacity={1}
                                            onPress={() => { this.setState({ securepassword: !this.state.securepassword }) }} style={{ width: mobileW * 12 / 100, alignItems: 'center', justifyContent: 'center' }}>
                                            {this.state.securepassword ?
                                                <Text style={{ fontFamily: Font.bold, color: Colors.theme_color }}>Show</Text> : <Text style={{ fontFamily: Font.bold, color: Colors.theme_color }}>Hide</Text>}
                                        </TouchableOpacity>
                                    </View>}
                                    {this.state.login_type == 0 && <View style={{ flexDirection: 'row', borderWidth: 2, borderColor: Colors.line_color, width: mobileW * 84 / 100, height: mobileH * 7 / 100, borderRadius: 12, alignSelf: 'center', justifyContent: 'center', marginTop: 12 }}>
                                        <Image style={{ width: mobileW * 5.5 / 100, height: mobileH * 6.2 / 100, marginLeft: 12 }} resizeMode={'contain'} source={localimag.lock}></Image>
                                        <TextInput
                                            onChangeText={text => { this.setState({ confirm_password: text }) }}
                                            value={"" + this.state.confirm_password + ""}
                                            maxLength={20}
                                            returnType="done"
                                            returnKeyType="done"
                                            secureTextEntry={this.state.confirmsecurepassword}
                                            style={{ fontFamily: Font.regular, marginLeft: 5, width: mobileW * 60 / 100, fontSize: mobileW * 4.2 / 100, padding: 6, fontWeight: 'bold' }}
                                            placeholder="Confirm Password"
                                            keyboardType={'default'}
                                            placeholderTextColor={Colors.font_color}
                                            onSubmitEditing={() => { Keyboard.dismiss() }} />
                                        <TouchableOpacity activeOpacity={1}
                                            onPress={() => { this.setState({ confirmsecurepassword: !this.state.confirmsecurepassword }) }} style={{ width: mobileW * 12 / 100, alignItems: 'center', justifyContent: 'center' }}>
                                            {this.state.confirmsecurepassword ?
                                                <Text style={{ fontFamily: Font.bold, color: Colors.theme_color }}>Show</Text> : <Text style={{ fontFamily: Font.bold, color: Colors.theme_color }}>Hide</Text>}
                                        </TouchableOpacity>
                                    </View>}
                                    <TouchableOpacity activeOpacity={1} onPress={() => { this.setState({ specialist: true }) }} style={{ flexDirection: 'row', borderWidth: 2, borderColor: Colors.line_color, width: mobileW * 84 / 100, height: mobileH * 7 / 100, borderRadius: 12, alignSelf: 'center', justifyContent: 'center', marginTop: 12, alignItems: 'center' }}>
                                        <Image style={{ width: mobileW * 5 / 100, height: mobileW * 5 / 100, marginLeft: 12, tintColor: Colors.theme_color }} resizeMode={'contain'} source={localimag.speciality}></Image>
                                        <Text numberOfLines={1} style={{ fontFamily: Font.bold, marginLeft: 5, width: mobileW * 64 / 100, fontSize: mobileW * 4.2 / 100, padding: 6, }}>{this.state.speciality_name_string == [] ? 'Select Your Speciality' : this.state.speciality_name_string}</Text>
                                        <View activeOpacity={1} style={{ width: mobileW * 8 / 100 }}>
                                            <Image style={{ width: mobileW * 5 / 100, height: mobileH * 6.2 / 100, }} resizeMode={'contain'} source={localimag.dropdown}></Image>
                                        </View>
                                    </TouchableOpacity>
                                    <View style={{ width: mobileW * 84 / 100, height: mobileH * 6 / 100, alignItems: 'flex-start', justifyContent: 'flex-end', }}>
                                        <View style={{ paddingLeft: 0, paddingRight: 20 }}>
                                            <TouchableOpacity onPress={() => { this.setState({ englishstaus: !this.state.englishstaus, arebicstaus: false }) }} activeOpacity={0.9}>
                                                <View style={{ flexDirection: 'row', }}>
                                                    {this.state.englishstaus == true && <View style={{ height: mobileH * 2.2 / 100, width: mobileW * 4.3 / 100, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: Colors.theme_color, marginTop: 2 }}>
                                                        <Image style={{ width: mobileW * 4.5 / 100, height: mobileH * 2.8 / 100, }} source={localimag.checksignup}></Image></View>
                                                    }
                                                    {this.state.englishstaus == false && <View style={{ height: mobileH * 2.2 / 100, width: mobileW * 4.3 / 100, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: Colors.theme_color, marginTop: 2 }}>
                                                        <Image style={{ width: mobileW * 5 / 100, height: mobileH * 2.8 / 100 }} resizeMode={'contain'} source={localimag.check2}></Image></View>
                                                    }
                                                    <View style={{ flexWrap: 'wrap', alignItems: 'center' }}>
                                                        <Text style={{ marginLeft: 10, color: Colors.font_color, fontSize: mobileW * 2.7 / 100, fontFamily: "Roboto-Bold", marginTop: 2 }}>Clicking to signup button accepting <Text onPress={() => { this.props.navigation.navigate('TermsConditions') }} style={{ color: Colors.font_color, fontSize: mobileW * 2.7 / 100, fontFamily: "Roboto-Bold", textDecorationLine: 'underline' }}>Terms & Conditions</Text></Text>
                                                        <Text style={{ color: Colors.font_color, fontSize: mobileW * 2.7 / 100, fontFamily: "Roboto-Bold", }}> and <Text onPress={() => { this.props.navigation.navigate('PrivacyPolicy') }} style={{ color: Colors.font_color, fontSize: mobileW * 2.7 / 100, fontFamily: "Roboto-Bold", textDecorationLine: 'underline' }}>Privacy Policy</Text></Text></View>
                                                </View>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                </View>
                            </View>
                        </View>
                        {this.state.login_type == 0 && <View style={{ width: mobileW * 72 / 100, height: mobileH * 8 / 100, borderRadius: 15, alignItems: 'center', justifyContent: 'flex-start', alignSelf: 'center', }}>
                            <TouchableOpacity activeOpacity={1} style={{ width: mobileW * 84 / 100, height: mobileH * 7 / 100, backgroundColor: Colors.theme_color, borderRadius: 35, alignItems: 'center', justifyContent: 'center', alignSelf: 'center' }}
                                onPress={() => { this.SignUp(); }}>
                                <Text style={{ fontSize: mobileW * 4 / 100, fontFamily: Font.bold, color: Colors.purewhite }}>Signup</Text>
                            </TouchableOpacity>
                        </View>}
                        {this.state.login_type != 0 && <View style={{ width: mobileW * 72 / 100, height: mobileH * 8 / 100, borderRadius: 15, alignItems: 'center', justifyContent: 'flex-start', alignSelf: 'center', }}>
                            <TouchableOpacity activeOpacity={1} style={{ width: mobileW * 84 / 100, height: mobileH * 7 / 100, backgroundColor: Colors.theme_color, borderRadius: 35, alignItems: 'center', justifyContent: 'center', alignSelf: 'center' }}
                                onPress={() => { this.socialsignUp(); }}>
                                <Text style={{ fontSize: mobileW * 4 / 100, fontFamily: Font.bold, color: Colors.purewhite }}>Signup</Text>
                            </TouchableOpacity>
                        </View>}
                        <View style={{ height: mobileH * 4 / 100, justifyContent: 'flex-start', alignSelf: 'center', alignItems: 'center' }}>
                            <Text style={{ fontSize: mobileW * 3.2 / 100, fontFamily: Font.regular, color: Colors.textColor }}>You have already an account?
                                <Text onPress={() => { this.props.navigation.navigate('Login') }} style={{ fontSize: mobileW * 3.2 / 100, fontFamily: Font.regular, color: '#22A7F2' }}> Login</Text></Text>
                        </View>
                    </TouchableOpacity>
                    </KeyboardAwareScrollView>
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
        width: mobileW * 42 / 100,
        height: mobileH * 24 / 100,
    },
    //OTP Popup
    TopSignUpTitle: {
        fontFamily: Font.bold,
        fontSize: mobileW * 5 / 100,
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
        justifyContent: 'center',
        alignItems: 'center'
    },
    otpInpoutType: {
        height: 36,
        textAlign: 'center',
        fontFamily: Font.bold,
        fontSize: mobileW * 3.2 / 100,
        width:'100%'
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
        fontSize: mobileW * 3.4 / 100,
        color: 'red',
        lineHeight: 50,
    },
    OTpLeftverify: {
        fontFamily: Font.bold,
        fontSize: mobileW * 3.4 / 100,
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
    },
    setingsHeader: {
        flexDirection: 'row',
        backgroundColor: Colors.purewhite,
        justifyContent: 'flex-start',
        // paddingLeft: 20,
        paddingRight: 20,
        paddingTop: 50,
        paddingBottom: 45,
        alignItems: 'flex-start',
        justifyContent: 'flex-start'
    },
    OrderHistoryTitle: {
        color: Colors.font_color,
        fontFamily: Font.medium,
        fontSize: mobileW * 5 / 100,
        letterSpacing: 0.5,
        marginLeft: mobileW * 5 / 100
    },
});


