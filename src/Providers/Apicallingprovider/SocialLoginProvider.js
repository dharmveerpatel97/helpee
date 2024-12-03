import React, { Component } from 'react'
import { Alert, BackHandler } from 'react-native'
import { CommonActions } from '@react-navigation/native';
// import { appleAuth, AppleButton } from '@invertase/react-native-apple-authentication';
import { msgProvider, msgText, msgTitle, config, localStorage, apifuntion, Lang_chg } from '../utilslib/Utils'
import { GoogleSignin, GoogleSigninButton, statusCodes, } from 'react-native-google-signin';
import { LoginManager, AccessToken, GraphRequest, GraphRequestManager, } from 'react-native-fbsdk'
global.navigatefunction = '';
class SocialLoginProvider extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLogin: '',
    }
    GoogleSignin.configure({
      webClientId: '1057056581980-3b6ml1c6lv2gn89ndfavb7h9rvf8th8t.apps.googleusercontent.com',
    });
  }

  goHomePage = (navigation) => {
    localStorage.setItemString('guest_user', 'no');
    navigation.dispatch(
      CommonActions.reset({
        index: 1,
        routes: [
          { name: 'Home' },
        ],
      })
    );
  }

  //   successMessage = (navigation) => {

  // }

  socialsignUp = async (navigation) => {
    console.log('socialsignUp', navigation);
    let socialdata = await localStorage.getItemObject('socialdata');
    console.log('socialdata.social_type;', socialdata.social_type);
    let fname = socialdata.social_first_name;
    let lname = socialdata.social_last_name;
    let email = socialdata.social_email;
    let social_id = socialdata.social_id;
    let login_type = socialdata.social_type;
    console.log('fname', fname);
    console.log('lname', lname);
    console.log('email', email);
    console.log('social_id', social_id);
    console.log('login_type', login_type);
    console.log('data')
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
    if (social_id.length <= 0) {
      msgProvider.toast(msgText.emptysocial_id[config.language], 'top')
      return false;
    }
    if (login_type.length <= 0) {
      msgProvider.toast(msgText.emptylogintype[config.language], 'top')
      return false;
    }

    let url = config.baseURL + "socialSignup.php";
    console.log('url', url)
    let data = new FormData();
    data.append('f_name', fname)
    data.append('l_name', lname)
    data.append('user_type', 1)
    data.append('email', email)
    data.append('social_id', social_id)
    data.append('login_type', login_type)
    data.append("device_type", config.device_type)
    data.append("player_id", config.player_id)
    data.append("app_type", config.app_type)
    console.log('data', data)
    apifuntion.postApi(url, data,1).then((obj) => {
      if (obj.success == 'true') {
        localStorage.setItemObject('user_arr', obj.user_details);
        navigation.navigate('ChooseCategory')
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

  Socialfunction = (navigation, btn, type) => {
    if (type == 'normal') {
      var social_type = btn;
      var login_type = btn;
      var social_id = '001942.7f1a8d2b59354833977cc59e439459a3.0507';
      var social_name = 'UploadingApp';
      var social_first_name = 'UploadingApp';
      var social_middle_name = '';
      var social_last_name = 'YoungDecade';
      var social_email = 'uploadingapp.youngdecade@gmail.com';
      // var social_image_url = 'img/no_image_found.png';
      var social_image_url = 'https://www.gravatar.com/avatar/205e460b479e2e5b48aec07710c08d50?s=200';
      var result = {
        social_id: social_id,
        social_type: social_type,
        login_type: login_type,
        social_name: social_name,
        social_first_name: social_first_name,
        social_last_name: social_last_name,
        social_middle_name: social_middle_name,
        social_email: social_email,
        social_image: social_image_url,
      }
      this.callsocailweb(result, navigation)
    } else {
      if (btn == 'facebook') {
        this.FacebookLogin(navigation)
      } else if (btn == 'google') {
        this.GoogleLogin(navigation)
      } else if (btn == 'apple') {
        this.Applelogin(navigation)
      }
    }
  }

  FacebookLogin = async (navigation) => {
    navigatefunction = navigation;
    LoginManager.logInWithPermissions([
      'public_profile', "email"
    ]).then((result) => {
      if (result.isCancelled) {
        console.log('Login cancelled');
        // alert('login cancel')
      } else {
        AccessToken.getCurrentAccessToken().then(data => {
          const processRequest = new GraphRequest(
            '/me?fields=id,name,email,first_name,middle_name,last_name,picture.type(large)',
            null,
            this.get_Response_Info
          );
          new GraphRequestManager().addRequest(processRequest).start();
        });
      }
    })
  }
  get_Response_Info = (error, result) => {
    if (error) {
      Alert.alert('Error fetching data: ' + error.toString());
    } else {
      console.log('aa gya kya bhai')
      var socaildata = {
        'social_id': result.id,
        'social_name': result.name,
        'social_first_name': result.first_name,
        'social_last_name': result.last_name,
        'social_middle_name': '',
        'social_email': result.email,
        'social_image': result.picture.data.url,
        'social_type': 'facebook',
        'logintype': 'facebook',
      }
      this.callsocailweb(socaildata, navigatefunction)
    }
  };

  GoogleLogin = async (navigation) => {
    console.log('Yahaaa')
    //Prompts a modal to let the user sign in into your application.
    try {
      console.log('Yahaaa1')
      await GoogleSignin.hasPlayServices({
        showPlayServicesUpdateDialog: true,
      });
      const userInfo = await GoogleSignin.signIn();
      console.log('User Info --> ', userInfo);
      var result = {
        'social_name': userInfo.user.name,
        'social_first_name': userInfo.user.givenName,
        'social_last_name': userInfo.user.familyName,
        'social_email': userInfo.user.email,
        'social_image': userInfo.user.photo,
        social_type: 'google',
        'logintype': 'google',
        'social_id': userInfo.user.id
      }
      this.callsocailweb(result, navigation)
    } catch (error) {
      // alert('Message'+error.message)
      console.log('Message', error.message);
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        console.log('User Cancelled the Login Flow');
      } else if (error.code === statusCodes.IN_PROGRESS) {
        console.log('Signing In');
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        console.log('Play Services Not Available or Outdated');
      } else {
        console.log('Some Other Error Happened');
      }
    }
  };
  Applelogin = async (navigation) => {
    await appleAuth.performRequest({
      requestedOperation: appleAuth.Operation.LOGIN,
      requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME]
    })
      .then(
        res => {
          var result = {
            'social_name': res.fullName.familyName,
            'social_first_name': res.fullName.givenName,
            'social_last_name': res.fullName.familyName,
            'social_email': res.email,
            'social_image': 'NA',
            social_type: 'apple',
            'logintype': 'apple',
            'social_id': userInfo.user
          }
          this.callsocailweb(result, navigation)
        },
        error => {
          console.log(error);
        }
      );
    // TODO: Send the token to backend
  }
  callsocailweb = (result, navigation) => {
    console.log('result', result)
    console.log('result', navigation)
    var data = new FormData();
    data.append("social_email", result.social_email);
    data.append("social_id", result.social_id);
    data.append("device_type", config.device_type);
    data.append("player_id", player_id_me1);
    data.append("social_type", result.social_type);
    localStorage.setItemObject('socialdata', result);
    localStorage.setItemObject('socialdataget', result);
    var url = config.baseURL + 'social_login.php';
    console.log('home', data)
    console.log('url', url);

    apifuntion.postApi(url, data,1).then((obj) => {
      console.log(obj);
      if (obj.success == 'true') {
        if (obj.user_exist == 'yes') {
          localStorage.setItemObject('user_arr', obj.user_details)
          localStorage.setItemObject('isLogin', true);
          if (obj.user_details != 'NA') {
            if (obj.user_details.user_type == 1) {
              if (obj.user_details.signup_step == null) {
                navigation.navigate('SubscriptionPlan', { plan_type: 1 });
              }
              if (obj.user_details.signup_step == '1') {
                navigation.navigate('SubscriptionPlan', { plan_type: 1 });
              }
              if (obj.user_details.signup_step == '2') {
                navigation.navigate('Home');
                localStorage.setItemString('guest_user', 'no');
              }
            } else {
              if (obj.user_details.signup_step == null) {
                navigation.navigate('UploadDocNext');
              }
              if (obj.user_details.signup_step == '0') {
                navigation.navigate('UploadDocNext');
              }
              if (obj.user_details.signup_step == '3') {
                navigation.navigate('UploadPic');
              }
              if (obj.user_details.signup_step == '4') {
                navigation.navigate('SetWorkingHours');
              }
              if (obj.user_details.signup_step == '5') {
                if (obj.user_details.approved_unapproved == '1') {
                  navigation.navigate('ExpertHome');
                  localStorage.setItemString('guest_user', 'no');
                } else {
                  //this.successMessage();
                  Alert.alert(
                    "Information Message",
                    "Your account will be approved by the admin in 24 hours",
                    [
                      { text: "OK", onPress: () => { { navigation.navigate("Login"); } } }
                    ],
                    { cancelable: false }
                  );
                }
              }
            }
          } else {
            console.log('Here it came')
            navigation.navigate('SignupModal');
          }
        } else {
          navigation.navigate('SignupModal');
        }
      }
    }).catch((error) => {
      console.log("-------- error ------- " + error);
      msgProvider.alert(msgTitle.server[config.language], msgText.servermessage[config.language], false);
      this.setState({ loading: false })
    });
  }
}

export const SocialLogin = new SocialLoginProvider();
