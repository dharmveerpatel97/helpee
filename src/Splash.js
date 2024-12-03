import React, { Component } from 'react'
import { Text, View, Image, StyleSheet, StatusBar, SafeAreaView, BackHandler, Alert, Keyboard, ImageBackground } from 'react-native'
import { config, Otpprovider, Mapprovider, apifuntion, Colors, Font, validation, mobileH, mobileW, SocialLogin, Cameragallery, mediaprovider, localStorage, Lang_chg, consolepro, msgProvider, msgTitle, msgText, Currentltlg } from './Providers/utilslib/Utils'
import { localimag } from './Providers/Localimageprovider/Localimage'
import { firebaseprovider } from './Providers/FirebaseProvider';
import OneSignal from 'react-native-onesignal';
export default class Splash extends Component {
    constructor(props) {
        super(props)
        this.state = {
            isSubscribed:'',
            isConnected: false,
            player_id: 12345,
            main: true,
            login_type: 'app',
            location: ''
        }
        OneSignal.setAppId(config.onesignalappid);
        OneSignal.setLogLevel(6, 0);
        OneSignal.setRequiresUserPrivacyConsent(false);
        OneSignal.promptForPushNotificationsWithUserResponse(response => {
        
          console.log("Prompt response:", response);
        });
    }

    componentDidMount() {
        OneSignal.addEmailSubscriptionObserver((event) => {

            this.OSLog("OneSignal: email subscription changed: ", event);
           
            });
           
            OneSignal.addSubscriptionObserver(event => {
           
            this.OSLog("OneSignal: subscription changed:", event);
           
            this.setState({ isSubscribed: event.to.isSubscribed })
           
            });
           
            OneSignal.addPermissionObserver(event => {
           
            this.OSLog("OneSignal: permission changed:", event);
           
            });
           
            var interval = setInterval(async () => {
           
            await OneSignal.getDeviceState().then(state => {
           
           // consolepro.consolelog({ state })
           
           
            if (state.isSubscribed == true) {
           
            clearInterval(interval);
           
            }
           
            player_id_me1 = state.userId
           
            }).catch(error => {
           
            consolepro.consolelog({ error })
           
            })
           
            }, 500);


   

        setTimeout(() => {
            firebaseprovider.getAllUsers()
             this.loginType();
        }, 2000);
    }

    // async componentDidMount() {

    //     // OneSignal.setNotificationOpenedHandler(notification => {
    //     //     this.OSLog("OneSignal: notification opened:", notification);
    //     // });
    //     OneSignal.setInAppMessageClickHandler(event => {
    //         this.OSLog("OneSignal IAM clicked:", event);
    //     });
    //     OneSignal.addEmailSubscriptionObserver((event) => {
    //         this.OSLog("OneSignal: email subscription changed: ", event);
    //     });
    //     OneSignal.addSubscriptionObserver(event => {
    //         this.OSLog("OneSignal: subscription changed:", event);
    //         this.setState({ isSubscribed: event.to.isSubscribed })
    //     });
    //     OneSignal.addPermissionObserver(event => {
    //         this.OSLog("OneSignal: permission changed:", event);
    //     });
    //     const state = await OneSignal.getDeviceState();
    //     consolepro.consolelog({ state })
    //     consolepro.consolelog('hii player', state.userId)
    //     this.setState({
    //         isSubscribed: state.isSubscribed,
    //         player_id: state.userId
    
    //     });
    //     player_id_me1 = state.userId
       
    //  consolepro.consolelog('state.userId',state.userId)
    //     const timer = setTimeout(() => {
    //       //this.props.navigation.replace('Loginmain')
    //       firebaseprovider.getAllUsers()
    //               this.loginType();
    //     }, 2000);
    //     return () => clearTimeout(timer);
    //     //  }
    
    //   }


      OSLog = (message, optionalArg) => {
        consolepro.consolelog({ message })
        if (optionalArg) {
            message = message + JSON.stringify(optionalArg);
        }
    
        console.log(message.notificationId);
    
        let consoleValue;
    
        if (this.state.consoleValue) {
            consoleValue = this.state.consoleValue + "\n" + message
        } else {
            consoleValue = message;
        }
        this.setState({ consoleValue });
    }
    
    
    onIds(device) {
        console.log('Device info: ', device);
        config.player_id_me = device.userId;
        config.player_id = device.userId;
        config.player_id_me1 = device.userId;
        config.GetPlayeridfunctin(device.userId)
    }
    //----------------------------------------------------------------//
    loginType = async () => {
        consolepro.consolelog('loginType');
        let guest_user = await localStorage.getItemString('guest_user');
        let user_details = await localStorage.getItemObject('user_arr');
        consolepro.consolelog('user_details', user_details);
        let result = await localStorage.getItemObject('socialdataget');
        console.log('result', result)
        if (user_details != null && user_details != 'NA' && (guest_user == 'no' || guest_user == null)) {
            let login_type = user_details.login_type;
            let user_type = user_details.user_type;
            let otp_verify = user_details.otp_verify;
            consolepro.consolelog('user_type', user_type);
            consolepro.consolelog("login type =", login_type)
            consolepro.consolelog("otp_verify", otp_verify)
            if (otp_verify != 0) {
                if (login_type != 0) {
                    if (result != null ) {
                        console.log('result13', result)
                        let result1 = {
                            'social_email': result.social_email,
                            social_type: result.social_type,
                            'logintype': result.social_type,
                            'social_id': result.social_id,
                            'device_type': config.device_type,
                            'player_id': player_id_me1
                        }
                        SocialLogin.callsocailweb(result1, this.props.navigation);
                    } else {
                        consolepro.consolelog('loginType1');
                        if (user_type == 1) {
                            this.props.navigation.navigate('Home');
                            localStorage.setItemString('guest_user', 'no');
                        } else {
                            this.props.navigation.navigate('ExpertHome');
                            localStorage.setItemString('guest_user', 'no');
                        }
                    }
                } else {
                    this.login();
                }
            } else {
                consolepro.consolelog('loginTypey');
                this.props.navigation.navigate('Login')
            }
        } else {
            localStorage.setItemString('guest_user', 'yes');
            doLogin = true;
            this.props.navigation.navigate('Home');
        }
    }

    login = async () => {
        consolepro.consolelog('autologin');
        let user_details = await localStorage.getItemObject('user_arr');
        let password_get = await localStorage.getItemObject('password');
        consolepro.consolelog("check1", password_get);
        consolepro.consolelog('user_details_ba', user_details);
        let email = user_details.email;
        consolepro.consolelog('email_igo', email)
        let password = password_get;
        let url = config.baseURL + "login.php";
        consolepro.consolelog(url)
        let data = new FormData();
        data.append('email', user_details.email)
        data.append('password', password)
        data.append('action', "auto_login")
        data.append("device_type", config.device_type)
        data.append("player_id", player_id_me1)
        data.append("app_type", config.app_type)
        apifuntion.postNoLoadingApi(url, data).then((obj) => {
            if (obj.success == "true") {
                consolepro.consolelog('true yaha')
                consolepro.consolelog('obj.user_details.opt_verify', obj.user_details.opt_verify)
                if (obj.user_details.otp_verify == '1') {
                    consolepro.consolelog('true yahawww')
                    if (obj.user_details.user_type == '1') {
                        localStorage.setItemObject('user_arr', obj.user_details);
                        consolepro.consolelog('user_arr_i_got', obj.user_details)
                        if (obj.user_details.signup_step != 2) {
                            this.props.navigation.navigate('Login');
                        } else {
                            firebaseprovider.firebaseUserCreate();
                            firebaseprovider.getMyInboxAllData();
                            localStorage.setItemString('guest_user', 'no');
                            this.props.navigation.navigate('Home');
                        }
                    } else {
                        localStorage.setItemObject('user_arr', obj.user_details);
                        consolepro.consolelog('user_arr_i_got', obj.user_details)
                        if (obj.user_details.signup_step != 5) {
                            consolepro.consolelog('tata')
                            this.props.navigation.navigate('Login');
                        } else {
                            if (obj.user_details.approved_unapproved != 1) {
                                this.props.navigation.navigate('AccountApprovedPage');
                            } else {
                                consolepro.consolelog('tatatea')
                                firebaseprovider.firebaseUserCreate();
                                firebaseprovider.getMyInboxAllData();
                                localStorage.setItemString('guest_user', 'no');
                                this.props.navigation.navigate('ExpertHome');
                            }
                        }
                    }
                } else {
                    consolepro.consolelog('eeeeeewe')
                    this.props.navigation.navigate('Login');
                }
            } else {
                consolepro.consolelog('false')
                if (obj.active_status == 'deactivate') {
                    config.checkUserDeactivate(this.props.navigation);
                    return false;
                }
                this.props.navigation.navigate('Login');
                msgProvider.alert(msgTitle.information[config.language], obj.msg[config.language], false);
                return false;
            }
        }).catch((error) => {
            this.props.navigation.navigate('Login');
            consolepro.consolelog("-------- error ------- " + error);
        });
    }
    //----------------------**********------------------------//
    render() {
        return (
            <SafeAreaView style={{ flex: 1, backgroundColor: Colors.purewhite }}>
                <StatusBar hidden={true} translucent={false}
                    networkActivityIndicatorVisible={true} />
                <View style={{ width: '100%', height: '100%', }}>
                    <View style={{ justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                        <Image style={styles.splash} resizeMode={'contain'} source={localimag.logo}></Image>
                    </View>
                </View>
            </SafeAreaView>
        )
    }
}

const styles = StyleSheet.create({
    splash: {
        width: '50%',
        height: '50%',
    },
});