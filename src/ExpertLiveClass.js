import React, { Component } from 'react'
import { Text,Alert, View, TouchableOpacity, SafeAreaView, Dimensions, FlatList, StatusBar, Image, ScrollView, BackHandler, StyleSheet,NativeEventEmitter,PermissionsAndroid,Platform } from 'react-native'
import { config, Otpprovider,notification, Mapprovider, apifuntion, Colors, Font, validation, mobileH, mobileW, SocialLogin, Cameragallery, mediaprovider, localStorage, Lang_chg, consolepro, msgProvider, msgTitle, msgText, Currentltlg } from './Providers/utilslib/Utils'
import { localimag } from './Providers/Localimageprovider/Localimage'
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

// import RNZoomUsBridge, {RNZoomUsBridgeEventEmitter} from '@mokriya/react-native-zoom-us-bridge';
// const meetingEventEmitter = new NativeEventEmitter(RNZoomUsBridgeEventEmitter);

import ZoomUs,{ ZoomEmitter } from 'react-native-zoom-us';
  const zoomEmitter = new NativeEventEmitter(ZoomEmitter);
import Footerr from './Providers/Footerr';

const ZOOM_APP_KEY = "oc1OTAxoNljYnC1kxR911EoZ1DDQ0WudDUpY";
const ZOOM_APP_SECRET = "CzEiM5kAYI50VO4ptj9FSC4gm4FY4XFHgeTU";
const ZOOM_JWT_APP_KEY = "xOjErDodQMW5_GxN8b0uCg";
const ZOOM_JWT_APP_SECRET = "6BcZDbMj4dkusQkZYGt5nLKTSDc5YtISGiQ4";

export default class ExpertLiveClass extends Component {
    constructor(props) {
        super(props)
        this.state = {
            class_id : this.props.route.params.class_id,
            starCount: 4,
            class_details_arr: 'NA',
            payment_arr: 'NA',
            speciality_name: '',
            topic_description: '',
            title: '',
            expert_name: '',
            about_me: '',
            rating: '',
            image: '',
            session_arr: 'NA',
            footer_image: null,
            meetingId: '',
            meetingPassword: '',
            meetingTitle: '',
            userName: '',
            userEmail: '',
            userId: '',
            accessToken: '',
            expirestatus:0,
            userZoomAccessToken: '',
        }

        this.initializeZoomSDK();

       zoomEmitter.addListener('MeetingEvent', (meetingEvent) => {
            console.log('himanshu meeting',meetingEvent);
            var count_me = 0;
            if(meetingEvent.event == 'meetingNotExist')
            {
                console.log('himanshu')

                Alert.alert(
             'Information',
               'Invalid meeting id',
                [
                    // {
                    //     text: msgTitle.cancel[0],
                    // },
                    {
                        text: 'Ok',
                        onPress: () => {
                            console.log('ok done')
                        }

                    },
                ],
                { cancelable: false },
            );
            }
        });
    }
    backpress = () => {
        this.props.navigation.goBack();
    }

    componentDidMount = async () => {
        this.props.navigation.addListener('focus', () => {
            this.createAccessToken();
            this.getClassDetails();
        });
    }
  createAccessToken = async () => {
        console.log("pk")
        if (config.device_type == 'ios') {
            // to talk to ZOOM API you will need access token
            if (!ZOOM_JWT_APP_KEY || !ZOOM_JWT_APP_SECRET) return false;
            var user_arr = await localStorage.getItemObject('user_arr');
            let url = config.baseURL + 'zoomLibrary/getJwtToken.php';
            consolepro.consolelog(url)
            apifuntion.getApi(url, 1).then((obj) => {
                consolepro.consolelog('obj pk', obj)
                var accessToken = obj.token
                // console.log(`createAccessToken ${accessToken}`);

                this.setState({ accessToken: accessToken });
            }).catch((error) => {
                consolepro.consolelog("-------- error ------- " + error);
            });
        } else {
            // to talk to ZOOM API you will need access token
            if (!ZOOM_JWT_APP_KEY || !ZOOM_JWT_APP_SECRET) return false;
            const accessToken = await RNZoomUsBridge.createJWT(
                ZOOM_JWT_APP_KEY,
                ZOOM_JWT_APP_SECRET
            ).then().catch((err) => console.log(err));

            console.log(`createAccessToken ${accessToken}`);

            if (accessToken) this.setState({ accessToken: accessToken });
        }


    }
    // createAccessToken = async () => {
    //     consolepro.consolelog("himanshu token")
    //     // to talk to ZOOM API you will need access token
    //     if (!ZOOM_JWT_APP_KEY || !ZOOM_JWT_APP_SECRET) return false;
    //     const accessToken = await RNZoomUsBridge.createJWT(
    //       ZOOM_JWT_APP_KEY,
    //       ZOOM_JWT_APP_SECRET
    //     ).then().catch((err) => console.log(err));
    
    //     console.log(`createAccessToken ${accessToken}`);
    
    //     if (accessToken) this.setState({accessToken:accessToken});
    
    // }
      initializeZoomSDK = () => {

        if (!ZOOM_APP_KEY || !ZOOM_APP_SECRET) return false;

        if (config.device_type == 'ios') {
            // init sdk
            ZoomUs.initialize({
                clientKey: ZOOM_APP_KEY,
                clientSecret: ZOOM_APP_SECRET,
                domain: 'zoom.us'
            }, {
                disableShowVideoPreviewWhenJoinMeeting: true,
                //   enableCustomizedMeetingUI: true
            })

        } else {
            // init sdk
            RNZoomUsBridge.initialize(
                ZOOM_APP_KEY,
                ZOOM_APP_SECRET,
            ).then().catch((err) => {
                console.warn(err);
                Alert.alert('error!', err.message)
            });
        }

    }

    // initializeZoomSDK = () => {

    //     if (!ZOOM_APP_KEY || !ZOOM_APP_SECRET) return false;
    
    //     // init sdk
    //     RNZoomUsBridge.initialize(
    //       ZOOM_APP_KEY,
    //       ZOOM_APP_SECRET,
    //     ).then().catch((err) => {
    //       console.warn(err);
    //       Alert.alert('error!', err.message)
    //     });
    // }
    getUserID = async (userEmail, accessToken) => {
        

        const fetchURL = `https://api.zoom.us/v2/users/${userEmail}`
        const userResult = await fetch(fetchURL, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          }
        }).then((response) => response.json())
        .then((json) => {
          return json;
        })
        .catch((error) => {
          console.error(error);
        });
    
        console.log('userResult', userResult);
    
    
        if (userResult && userResult.code === 429) {
          // rate error try again later
          Alert.alert('API Rate error try again in a few seconds');
        }
    
        if (userResult && userResult.id && userResult.status === 'active') {
          // set user id
          const { id: userId } = userResult;
    
          this.setState({userId:userId});
    
          return userId;
        }
    
        return false;
      }
    
      createUserZAK = async (userId, accessToken) => {
    
        const fetchURL = `https://api.zoom.us/v2/users/${userId}/token?type=zak`
        const userZAKResult = await fetch(fetchURL, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          }
        }).then((response) => response.json())
        .then((json) => {
          return json;
        })
        .catch((error) => {
          console.error(error);
        });
    
        console.log('userZAKResult', userZAKResult);
    
        if (userZAKResult && userZAKResult.code === 429) {
          // rate error try again later
          Alert.alert('API Rate error try again in a few seconds');
        }
    
        if (userZAKResult && userZAKResult.token) {
          // set user id
          const { token } = userZAKResult;
    
          this.setState({
            userZoomAccessToken: token,
          });
    
          return token;
    
        }
    
        return false;
      }
    
      createMeeting = async () => {
        consolepro.consolelog('I am in create meeting')
        const { accessToken, userEmail, meetingTitle } = this.state;

        consolepro.consolelog({ accessToken, userEmail, meetingTitle })
        if (!accessToken || !meetingTitle || !userEmail) return false;

        // user ID is pulled from jwt end point using the email address
         const userId = await this.getUserID(userEmail, accessToken);
       // const userId = 10
       
        await this.createUserZAK(userId, accessToken);
        consolepro.consolelog('I am in create meeting 198')
        if (userId) {
            // use api to create meeting

            const fetchURL = `https://api.zoom.us/v2/users/${userId}/meetings`
            const createMeetingResult = await fetch(fetchURL, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    topic: meetingTitle,
                    type: 1,
                    duration: 30,
                    password: "123456", // set your own password is possible
                    settings: {
                        waiting_room: false,
                        registrants_confirmation_email: false,
                        audio: 'voip',
                    }
                }),
            }).then((response) => response.json())
                .then((json) => {
                    return json;
                })
                .catch((error) => {
                    console.error(error);
                });


            console.log('createMeetingResult', createMeetingResult);



            if (createMeetingResult && createMeetingResult.code === 429) {
                // rate error try again later
                Alert.alert('API Rate error try again in a few seconds');
            }

            if (createMeetingResult && createMeetingResult.id) {
                const { id, password } = createMeetingResult;
                this.setState({
                    meetingId: id,
                    meetingPassword: password,
                });

                this.updateMeetingId(id, password)
               

                if (config.device_type == 'ios') {
                    setTimeout(() => {
                        this.startMeeting()
                    }, 2000);
                } else {
                    this.startMeeting()
                }
            }
        }
    }
    
  startMeeting = async () => {
        console.log("startMeeting");

        if (config.device_type == 'ios') {
            const {
                meetingId,
                userId,
                userName,
                userZoomAccessToken,
            } = this.state;

            // console.log("meetingId",meetingId);
            // console.log("userId",userId);
            // console.log("userName",userName);
            // console.log("userZoomAccessToken",userZoomAccessToken);

            // if (!meetingId || !userId || !userZoomAccessToken) return false;

        await  ZoomUs.startMeeting({
                userName: userName.toString(),
                meetingNumber: meetingId.toString(),
                userId: userId.toString(),
                zoomAccessToken: userZoomAccessToken.toString(),
            })

           // console.log("check_join", check_join)
        } else {
            const {
                meetingId,
                userId,
                userName,
                userZoomAccessToken,
            } = this.state;

            if (!meetingId || !userId || !userZoomAccessToken) return false;

            await RNZoomUsBridge.startMeeting(
                String(meetingId),
                userName,
                userId,
                userZoomAccessToken,
            );
        }
    }






      // startMeeting = async () => {
      //     consolepro.consolelog("startMeeting");
      //   const {
      //     meetingId,
      //     userId,
      //     userName,
      //     userZoomAccessToken,
      //   } = this.state;
    
      //   if (!meetingId || !userId || !userZoomAccessToken) return false;
    
      //   await RNZoomUsBridge.startMeeting(
      //     String(meetingId),
      //     userName,
      //     userId,
      //     userZoomAccessToken,
      //   );
    
      // }

      recordingStart = async () => {
        let url = 'https://mommymingle.co/zoomLibrary/recordingStart.php?meeting_number='+this.state.meetingId;
        consolepro.consolelog("url",url);
        apifuntion.getNoLodingApi(url).then((obj) => {
        // this.setState({loading:false})
        consolepro.consolelog('obj', obj);
       
        }).catch(err => {
        // this.setState({loading:false})
        if (err == "noNetwork") {
        msgProvider.alert(Lang_chg.msgTitleNoNetwork[config.language], Lang_chg.noNetwork[config.language], false);
        } else {
        msgProvider.alert(Lang_chg.msgTitleServerNotRespond[config.language], Lang_chg.serverNotRespond[config.language], false);
        }
        console.log('err', err);
        });
    }

    startpermission=async(type)=>{

        if(Platform.OS === 'ios')
        {
           this.createMeeting();
            // if(this.state.user_type == 1)
            // {
            //     this.props.navigation.navigate('SubscriberJoin',{sessionId:sessionId,token:token,course_id:this.state.course_id,user_id:this.state.user_id})
            // }else{
            //     this.props.navigation.navigate('End_class_tree',{sessionId:sessionId,token:token,course_id:this.state.course_id,user_id:this.state.user_id})
            // }
        }
        else{
        try {
          const granted = await PermissionsAndroid.requestMultiple([
            PermissionsAndroid.PERMISSIONS.CAMERA,
            PermissionsAndroid.PERMISSIONS.RECORD_AUDIO
          ]);
          if (
            granted["android.permission.RECORD_AUDIO"] ===
            PermissionsAndroid.RESULTS.GRANTED &&
            granted["android.permission.CAMERA"] ===
            PermissionsAndroid.RESULTS.GRANTED
          ) {
            // this.props.navigation.navigate('Vedio')
            // this.setState({loading:false})
            if(type == 'sub')
            {
                // this.props.navigation.navigate('SubscriberJoin',{sessionId:sessionId,token:token,course_id:this.state.course_id,user_id:this.state.user_id})
                // RNZoomUsBridge.joinMeeting(
                //     sessionId.toString(), //Meeting id
                //     name.toString(),//UserName 
                //     meeting_password.toString(), //Password
                // );

            }else{
                // alert('himanshu')
                this.createMeeting();
                // this.props.navigation.navigate('End_class_tree',{sessionId:sessionId,token:token,course_id:this.state.course_id,user_id:this.state.user_id})

            }
            

            
          } else {
            console.log("Permission denied");
          }
        } catch (err) {
          console.warn(err);
        }
    }
    }

    updateMeetingId = async(meeting_id,meeting_password)=>{
        var user_arr = await localStorage.getItemObject('user_arr');
        var user_id = user_arr.user_id;
        this.setState({user_id:user_id});
        consolepro.consolelog("user_id",user_id);
        let url = config.baseURL+'updateMeetingId.php?user_id='+user_id+'&class_id='+this.state.class_id+'&meeting_id='+meeting_id+'&meeting_password='+meeting_password;
        consolepro.consolelog("url",url);
        apifuntion.getNoLodingApi(url).then((obj) => {
            // this.setState({loading:false})
            consolepro.consolelog('obj', obj);
            if (obj.success == 'true') {
                if (obj.notification_arr != 'NA') {
                    notification.notification_arr(obj.notification_arr)
                }

            } else {
               
              //  msgProvider.alert(Lang_chg.information[config.language], 'Not update', false);
             
                return false;
            }
        }).catch(err => {
            // this.setState({loading:false})
            if (err == "noNetwork") {
                msgProvider.alert(Lang_chg.msgTitleNoNetwork[config.language], Lang_chg.noNetwork[config.language], false);
            } else {
                msgProvider.alert(Lang_chg.msgTitleServerNotRespond[config.language], Lang_chg.serverNotRespond[config.language], false);
            }
            console.log('err', err);
        });
    }

    //---------------------------------------------------------//

    getClassDetails = async () => {
        consolepro.consolelog('getClassDetails');
        let user_details = await localStorage.getItemObject('user_arr');
        this.setState({ footer_image: user_details.image,userEmail:user_details.email,userName:user_details.name })
        let class_id = this.state.class_id;
        this.setState({ class_id: class_id })
        consolepro.consolelog('class_id', class_id);
        consolepro.consolelog('user_details_ba', user_details);
        let url = config.baseURL + "getClassesDetails.php?user_id=" + user_details.user_id + "&class_id=" + this.state.class_id;
        consolepro.consolelog(url)
        apifuntion.getApi(url).then((obj) => {
            consolepro.consolelog('obj', obj)
            if (obj.success == "true") {
                this.setState({expirestatus:obj.expired_status,
                    class_details_arr: obj.class_details_arr, speciality_name:obj.class_details_arr.speciality_name,topic_description: obj.class_details_arr.topic_description, title: obj.class_details_arr.title,expert_name: obj.class_details_arr.name, image: obj.class_details_arr.image,rating: obj.class_details_arr.rating, about_me: obj.class_details_arr.about_me,meetingTitle:obj.class_details_arr.title
                })
                consolepro.consolelog('class_details_arr', obj.class_details_arr);
                this.setState({ session_arr: obj.session_arr })
                this.setState({ payment_status: obj.session_arr.payment_status })
                consolepro.consolelog('payment_arr', obj.payment_arr);
                consolepro.consolelog('session_arr', obj.session_arr);
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

    //---------------------------------------------------------------//
    render() {
        return (
            <View style={{ flex: 1, }}>
                <SafeAreaView style={{ flex: 0, backgroundColor: Colors.theme_color }} />
                <StatusBar backgroundColor={Colors.theme_color} barStyle='default' hidden={false} translucent={false}
                    networkActivityIndicatorVisible={true} />
                <View style={styles.setingsHeader}>
                    <TouchableOpacity activeOpacity={0.9} onPress={() => { this.backpress() }}>
                        <Image resizeMode="contain" style={{ width: 25, height: 30 }} source={localimag.back}></Image>
                    </TouchableOpacity>
                    <Text style={styles.OrderHistoryTitle}></Text>
                    <Text></Text>
                </View>
                <ScrollView contentContainerStyle={{ paddingBottom: 80 }}>
                    <View style={{ paddingBottom: mobileW * 10 / 100, }}>
                        <View style={{ width: mobileW * 90 / 100, alignSelf: 'center', }}>
                            <View style={{ justifyContent: 'center', alignItems: 'flex-start', paddingTop: mobileW * 3 / 100 }}>
                                <Text style={{ fontSize: mobileW * 4 / 100, fontFamily: Font.bold }}>{this.state.speciality_name}</Text>
                                <Text style={{ fontSize: mobileW * 5.5 / 100, fontFamily: Font.medium }}>{this.state.title}</Text>
                                <Text style={{ fontSize: mobileW * 4.5 / 100, fontFamily: Font.medium }}>{this.state.topic_description}</Text>
                            </View>
                        </View>
                        <View style={{ marginTop: mobileW * 2 / 100 }}>
                            <Text style={{ fontSize: mobileW * 4 / 100, fontFamily: 'Roboto-Bold', paddingLeft: 20 }}>Sections</Text>
                            {this.state.session_arr == 'NA' && <View style={{ alignItems: 'center', justifyContent: 'center', height: '100%' }}><Image resizeMode="contain" style={{ width: '50%', height: '50%', }} source={localimag.nodataFound}></Image></View>}
                            {this.state.session_arr != 'NA' &&
                                <FlatList
                                    data={this.state.session_arr}
                                    showsVerticalScrollIndicator={false}
                                    renderItem={({ item, index }) => {
                                        return (
                                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', borderBottomWidth: 1, paddingVertical: 25, paddingHorizontal: 20 }}>
                                                <Text style={{ fontFamily: 'Roboto-Medium', fontSize: mobileW * 3.5 / 100 }}>{item.session_date}</Text>
                                                <Text style={{ fontFamily: 'Roboto-Medium', fontSize: mobileW * 3.5 / 100 }}>{item.session_start_time}</Text>
                                                {item.status == 0 && <Text style={{ fontFamily: 'Roboto-Medium', color: Colors.darkred, fontSize: mobileW * 3.5 / 100 }}>Not Started</Text>}
                                                {item.status == 1 && <Text style={{ fontFamily: 'Roboto-Medium', color: Colors.green, fontSize: mobileW * 3.5 / 100 }}>Live Now</Text>}
                                                {item.status == 2 && <Text style={{ fontFamily: 'Roboto-Medium', color: Colors.blue, fontSize: mobileW * 3.5 / 100 }}>Solved</Text>}
                                            </View>
                                        )
                                    }}
                                    keyExtractor={(item, index) => index.toString()}>
                                </FlatList>}
                        </View>
                        {this.state.expirestatus==0 &&
                        <TouchableOpacity onPress={() => { this.startpermission('expert') }} style={{ width: mobileW * 84 / 100, height: mobileH * 18 / 100, alignItems: 'center', justifyContent: 'center', alignSelf: 'center' }}>
                            <View 
                                style={{ width: mobileW * 84 / 100, height: mobileH * 7 / 100, backgroundColor: Colors.theme_color, borderRadius: 25, alignItems: 'center', justifyContent: 'center', alignSelf: 'center' }}>
                                <Text style={{ fontSize: mobileW * 4.2 / 100, fontFamily: Font.bold, color: Colors.purewhite }}>Start Class</Text>
                            </View>
                        </TouchableOpacity>}
                    </View>
                </ScrollView>
                <Footerr
                    activepage='AssignClasses'
                    usertype={1}
                    footerpage={[
                        { name: 'ExpertHome', countshow: false, image: localimag.home, activeimage: localimag.homdash, round: 'no' },

                        { name: 'AssignClasses', countshow: false, image: localimag.classes, activeimage: localimag.classes, round: 'no' },

                        { name: 'Notification', countshow: false, image: (this.state.count_noti > 0) ? localimag.bell_red : localimag.bell1, activeimage: (this.state.count_noti > 0) ? localimag.bell_red : localimag.bell1 },
                        { name: 'RatingReview', countshow: false, image: localimag.person1, activeimage: localimag.person1, round: 'no' },
                        { name: 'ExpertProfile', countshow: false, image: this.state.footer_image == null ? localimag.default : { uri: config.img_url3 + this.state.footer_image }, activeimage: this.state.footer_image == null ? localimag.default : { uri: config.img_url3 + this.state.footer_image }, round: 'yes' },
                    ]}
                    navigation={this.props.navigation}
                    imagestyle1={{ width: 32, height: 40, backgroundColor: '#FFFFFF', countcolor: 'red', countbackground: 'white', resizeMode: 'contain' }}
                />
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
        fontFamily: Font.bold,
        fontSize: windowWidth * 5.2 / 100,
        letterSpacing: 0.5
    },
});


