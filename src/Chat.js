import React from 'react';
import { Text, View, Image,RefreshControl,Keyboard, Platform, Modal,NativeEventEmitter, BackHandler, Alert, StyleSheet, FlatList, TextInput, StatusBar, KeyboardAvoidingView, Dimensions, TouchableOpacity, SafeAreaView } from 'react-native'
import { config, Otpprovider, Mapprovider, apifuntion, Colors, Font, validation, mobileH, mobileW, SocialLogin, Cameragallery, mediaprovider, localStorage, Lang_chg, consolepro, msgProvider, msgTitle, msgText, Currentltlg, localimag } from './Providers/utilslib/Utils'
import firebase from './Config1';
import Firebase from 'firebase';
import ImageZoom from 'react-native-image-pan-zoom';
//import ImagePicker from 'react-native-image-picker';
import ImagePicker from 'react-native-image-crop-picker';
import { firebaseprovider } from './Providers/FirebaseProvider';
import { notification } from './Providers/NotificationProvider'
import OneSignal from 'react-native-onesignal';
import NetInfo from '@react-native-community/netinfo';
import StarRating from 'react-native-star-rating';
// import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
// import Loader from './Loader'
const BannerHieght = Dimensions.get('window').height;
const BannerWidth = Dimensions.get('window').width;
global.userChatIdGlobal = '';
global.blockinbox = 'no';
import ZoomUs,{ ZoomEmitter } from 'react-native-zoom-us';
const zoomEmitter = new NativeEventEmitter(ZoomEmitter);
const ZOOM_APP_KEY = "oc1OTAxoNljYnC1kxR911EoZ1DDQ0WudDUpY";
const ZOOM_APP_SECRET = "CzEiM5kAYI50VO4ptj9FSC4gm4FY4XFHgeTU";
const ZOOM_JWT_APP_KEY = "xOjErDodQMW5_GxN8b0uCg";
const ZOOM_JWT_APP_SECRET = "6BcZDbMj4dkusQkZYGt5nLKTSDc5YtISGiQ4";
global.messagedata = []
export default class Chat extends React.Component {
    _didFocusSubscription;
    _willBlurSubscription;
    constructor(props) {
        super(props)
        this.state = {
            modalVisible: false,
            optionmsg: '',
            data1: [],
            user_id: '',
            chatmsg: '',
            other_user_name: '',
            request_status:'',
            refresh: false,
            data: this.props.route.params.chatdata,
            data123: this.props.route.params.chatdata,
            pagekey: this.props.route.params.pagekey,
            name: '',
            meetingTitle:'Doubt class',
            message_type: 'text',
            filePath: {},
            messages: [],
            meetingId:'',
            meetingPassword:'',
            isVisible: false,
            modalVisible: false,
            mediamodal: false,
            cameraOn: false,
            image: 'NA',
            selectImage: 'NA',
            fileData: '',
            fileUri: '',
            user_image: '',
            imgBlob: '',
            status_fav:0,
            isConnected: true,
            loading: false,
            behavior: 'position',
            bottom: 0,
            matchfinal: '',
            self_image: 'NA',
            imageModal: false,
            image_path: '',
            onlineStatus: 2,
            block_status: 'ndfdo',
            other_block_status: 'ndfdo',
            question_id: 105,
            user_type: 0,
            question_status: 0,
            rating_status: 0,
            ratting_arr: 'NA',
            accept_status:0         //	0=pending ,1=send,2=accept,3=reject

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
        // OneSignal.init(config.onesignalappid, {
        //     kOSSettingsKeyAutoPrompt: true,
        // });

        // OneSignal.setLogLevel(6, 0);
        this.show_user_message_chat = this.show_user_message_chat.bind(this);
        this._didFocusSubscription = props.navigation.addListener('focus', payload =>
            BackHandler.addEventListener('hardwareBackPress', this.handleBackPress)
        );
    }

    _onRefresh = () => {
        this.setState({ refresh: true })
        this.getRatingStatus(1)
      }
      markFavUnfav = async (status) => {

        let guest_user = await localStorage.getItemString('guest_user');
        let user_details = await localStorage.getItemObject('user_arr');
      
        if (guest_user == 'yes') {
            this.props.navigation.navigate('Login');
        } else {

          
        
 
            let url = config.baseURL + "markExpertFavouriteUnFavourite.php";
            consolepro.consolelog(url)
            let data = new FormData();
            data.append('user_id', user_details.user_id)
            data.append('other_id', this.state.data.other_user_id)
            data.append('status', status)
            apifuntion.postApi(url, data).then((obj) => {
                consolepro.consolelog('obj', obj);
                if (obj.success == "true") {
                    consolepro.consolelog('true')
                    consolepro.consolelog('this is i got', obj)
                    var status = 0;
                    // alert(status)
                    //this.successMessage();
                    if (status == 1) {
                        status = 1
                    } 
                    if (status == 0) {
                        status = 0
                    }
                    // this.setState({status_fav:status})
                    consolepro.consolelog('tre')
                    // this.getStatus();
                } else {
                    consolepro.consolelog('false')
                    msgProvider.alert(msgTitle.information[config.language], obj.msg[config.language], false);
                    if (obj.active_status == 'deactivate') {
                        this.props.navigation.navigate('Login');
                        //BackHandler.exitApp();
                        localStorage.clear();
                    }
                    return false;
                }
            }).catch((error) => {
                consolepro.consolelog("-------- error ------- " + error);
            });
        }
    }
    componentDidMount() {

        consolepro.consolelog('data81818181', this.state.data)
        this.getmessagedata()
        this.updateChatroom12()
        this.createAccessToken()
        this.getRatingStatus();
        this.onReceived()
        this.focusListener = this.props.navigation.addListener('focus', () => {
        });

        NetInfo.fetch().then(state => {
            this.setState({ isConnected: state.isConnected })
        });
        //Subscribe to network state updates
        const unsubscribe = NetInfo.addEventListener(state => {
            this.setState({ isConnected: state.isConnected })
        });


        this._willBlurSubscription = this.props.navigation.addListener('blur', payload =>
            BackHandler.removeEventListener('hardwareBackPress', this.chatBackManage)
        );

    }
    componentWillUnmount() {

        this.props.navigation.removeListener('focus', () => {
            console.log('remove lister')
        });
    }

 initializeZoomSDK = () => {

        if (!ZOOM_APP_KEY || !ZOOM_APP_SECRET) return false;

        if (Platform.OS== 'ios') {
            // init sdk
         
            ZoomUs.initialize({
                clientKey: ZOOM_APP_KEY,
                clientSecret: ZOOM_APP_SECRET,
                domain: 'zoom.us'
            }, {
                disableShowVideoPreviewWhenJoinMeeting: true,
                //   enableCustomizedMeetingUI: true
            })
            console.log('check check', ZoomUs.initialize)

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
  updateMeetingId = async(meeting_id,meeting_password)=>{
        var user_arr = await localStorage.getItemObject('user_arr');
        var user_id = user_arr.user_id;
        var data = this.state.data
       var question_id = data.question_id;
        this.setState({user_id:user_id});
        consolepro.consolelog("user_id",user_id);
        let url = config.baseURL+'updatemeeting_singleclass.php?user_id='+user_id+'&class_id='+question_id+'&meeting_id='+meeting_id+'&meeting_password='+meeting_password+'&other_user_id='+this.state.data.other_user_id;
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
    startpermission=async(type)=>{


consolepro.consolelog('this.state.userName')
        if(Platform.OS === 'ios')
        {
             if (type == 'sub') {
                await ZoomUs.joinMeeting({
                    userName:this.state.userName,
                    meetingNumber:  this.state.meetingId.toString(),
                    password: this.state.meetingPassword.toString(),
                    noAudio: true,
                    noVideo: true,
                });
            } else {
                this.createMeeting();
            }
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
                RNZoomUsBridge.joinMeeting(
                    this.state.meetingId.toString(), //Meeting id
                    this.state.userName.toString(),//UserName 
                    this.state.meetingPassword.toString(), //Password
                );

            }else{
                alert('himanshu')
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

    async updateChatroom12() {
        let result = await localStorage.getItemObject('user_arr');
        var user_id_me = result.user_id
        this.chatRoomIdUpdate(user_id_me, user_id_me);
    }

    handleBackPress = async () => {
        let result = await localStorage.getItemObject('user_arr');
        var user_id_me = result.user_id
        this.chatRoomIdUpdate(user_id_me, 'no');
        this.props.navigation.goBack()
        return true;
    };

    async goBack() {
        let result = await localStorage.getItemObject('user_arr');
        var user_id_me = result.user_id
        this.chatRoomIdUpdate(user_id_me, 'no');
        this.props.navigation.goBack()
        return true;
    }

    chatBackManage = async () => {
        let matchfinal = await localStorage.getItemObject('matchfinal');

        if (matchfinal != null) {
            //this.setState({matchfinal:matchfinal.matchfinal})

            if (matchfinal == 'yes') {
                consolepro.consolelog('matchfinal.matchfinal', matchfinal)
                this.props.navigation.navigate('Inbox')
            }
            else {
                consolepro.consolelog('matchfinal.matchfinal not matching', 'match not matching')
                this.goBack()
            }
        }
        else {
            this.goBack()
        }

    }



    async getRatingStatus() {
        var userdata = await localStorage.getItemObject('user_arr');
        var data = this.state.data
        var user_id = userdata.user_id;
        var user_type = userdata.user_type;
        var question_id = data.question_id;
     this.setState({userEmail:userdata.email,userName:userdata.name })
        consolepro.consolelog('getQuestion');
        let user_details = await localStorage.getItemObject('user_arr');
        consolepro.consolelog('user_details_ba', user_details);
        let url = config.baseURL + "get_question_rating_status.php?question_id=" + question_id + "&user_id=" + user_id+'&other_id='+this.state.data.other_user_id;
        consolepro.consolelog(url)
        apifuntion.getApi(url).then((obj) => {
            consolepro.consolelog('obj', obj)
            if (obj.success == "true") {
                this.setState({ rating_status: obj.rating_status, ratting_arr: obj.rating_arr,request_status:obj.request_status,meetingId:obj.meeting_id,meetingPassword:obj.meeting_password,refresh:false,status_fav:obj.favstatus})
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


    async sendRequestcall() {
        var userdata = await localStorage.getItemObject('user_arr');
        var data = this.state.data
        var user_id = userdata.user_id;
        var user_type = userdata.user_type;
        var question_id = data.question_id;

        consolepro.consolelog('getQuestion');
        let user_details = await localStorage.getItemObject('user_arr');
        consolepro.consolelog('user_details_ba', user_details);
        let url = config.baseURL + "sendVideoCallRequest.php?question_id=" + question_id + "&user_id=" + user_id;
        consolepro.consolelog(url)
        apifuntion.getApi(url).then((obj) => {
            consolepro.consolelog('obj', obj)
            if (obj.success == "true") {
              this.setState({request_status:1})
               if (obj.notification_arr != 'NA') {
                    notification.notification_arr(obj.notification_arr)
                }
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
    async onReceived() {
        OneSignal.setNotificationWillShowInForegroundHandler(notification => {
           
            this.getRatingStatus(1)
        });
        }
    async Acceptrejectcall(status) {
        var userdata = await localStorage.getItemObject('user_arr');
        var data = this.state.data
        var user_id = userdata.user_id;
        var user_type = userdata.user_type;
        var question_id = data.question_id;

        consolepro.consolelog('getQuestion');
        let user_details = await localStorage.getItemObject('user_arr');
        consolepro.consolelog('user_details_ba', user_details);
        let url = config.baseURL + "sendVideoCallRequestAcceptReject.php?question_id=" + question_id + "&user_id=" + user_id+'&status='+status;
        consolepro.consolelog(url)
        apifuntion.getApi(url).then((obj) => {
            consolepro.consolelog('obj', obj)
            if (obj.success == "true") {
              this.setState({request_status:status})
               if (obj.notification_arr != 'NA') {
                    notification.notification_arr(obj.notification_arr)
                }
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

    getmessagedata = async () => {
        var userdata = await localStorage.getItemObject('user_arr');

        //consolepro.consolelog('getmessagedata')

        var data = this.state.data
        this.setState({
            user_id: userdata.user_id,
            user_type: userdata.user_type,
            self_image: userdata.image,
            question_id: data.question_id,
        })


        consolepro.consolelog('data12342', data)
        var question_id = data.question_id;
        var other_user_id = data.other_user_id
        // var item_id = data.item_id;
        consolepro.consolelog('other_user_id', other_user_id);
        consolepro.consolelog('FirebaseInboxJson154', FirebaseInboxJson);
        consolepro.consolelog('FirebaseUserJsonhhhhh', FirebaseUserJson);

        var user_data_other = FirebaseInboxJson.findIndex(x => x.question_id == question_id);
        consolepro.consolelog('user_data_other', user_data_other);
        if (user_data_other >= 0) {
            var jsonDataInbox = FirebaseInboxJson[user_data_other];
            consolepro.consolelog("jsonDataInbox_match_status", jsonDataInbox.match_status);
            consolepro.consolelog("jsonDataInbox.onlineStatus161", jsonDataInbox);
            // this.setState({ matchInbox: jsonDataInbox.match_status })
            var question_status = jsonDataInbox.question_status;
            if (question_status == 1 || question_status == '1') {
                question_status = 1
            }
            this.setState({ question_status: question_status })
            // alert(question_status)
        } else {
            // this.setState({ matchInbox: 'yes' })
        }

        // consolepro.consolelog('item_id',item_id);
        // consolepro.consolelog('firebaseprovider',FirebaseUserJson)
        var inbox_count = FirebaseUserJson.findIndex(x => x.user_id == other_user_id);
        consolepro.consolelog("chat name inbox count before", inbox_count);
        if (inbox_count >= 0) {
            consolepro.consolelog("chat name inbox count", inbox_count);
            var jsonData = FirebaseUserJson[inbox_count];
            consolepro.consolelog('jsonData175', jsonData);
            if (jsonData.name != 'NA') {
                var onlineStatus = jsonData.onlineStatus;


                consolepro.consolelog('onlineStatus365', onlineStatus)
                if (onlineStatus == true || onlineStatus == 'true') {
                    onlineStatus = 1
                }

                if (onlineStatus == false || onlineStatus == 'false') {
                    onlineStatus = 0
                }

                this.setState({ name: jsonData.name, onlineStatus: onlineStatus })
            } else {
                this.setState({ name: 'Chat' })
            }

        } else {
            this.setState({ name: 'Chat' })
        }
        this.show_user_message_chat()
    }



    sendmessagebtn = async () => {
        consolepro.consolelog('sendmessagebtn')
        let messageType = 'text';
        let message = this.state.chatmsg
        consolepro.consolelog('message', message)
        this.chatmsg.clear();
        this.setState({ chatmsg: '' })
        if (this.state.other_block_status == 'yes') {
            alert("You blocked by " + this.state.name + " so you can not send message to " + this.state.name)
            return false
        }
        if (message.length <= 0) {
            alert(Languageprovider.massege_validation[language_key])
            return false
        }
        this.sendmessagecallbtn(messageType, message)
    }



    sendmessagecallbtn = async (messageType, message) => {
        let userdata = await localStorage.getItemObject('user_arr')
        let data1 = this.state.data
        var user_id = userdata.user_id
        var other_user_id = data1.other_user_id
        var question_id = this.state.question_id
        var chat_type = 'Item_chat';

        var user_id_send = 'u_' + user_id;
        var other_user_id_send = 'u_' + other_user_id;

        var inbox_id_me = 'u_' + other_user_id;
        var inbox_id_other = 'u_' + user_id;



        var chat_type = 'q';
        if (question_id != 0) {
            inbox_id_me = chat_type + '_' + question_id + '__u_' + other_user_id;
            inbox_id_other = chat_type + '_' + question_id + '__u_' + user_id;
        }



        consolepro.consolelog('inbox_id', inbox_id_me)
        consolepro.consolelog('inbox_id_other', inbox_id_other)

        //---------------------- this code for create inbox in first time -----------
        consolepro.consolelog('FirebaseInboxJsonChck', FirebaseInboxJson);
        console.log('other_user_id', other_user_id)
        console.log('FirebaseInboxJsonChck', FirebaseInboxJson);
        console.log('Firebaseuserjson', FirebaseUserJson);

        if (FirebaseUserJson.length > 0) {
            var find_inbox_index2 = FirebaseUserJson.findIndex(x => x.user_id == other_user_id);
            console.log('find_inbox_index', find_inbox_index2)

            if (find_inbox_index2 != -1) {
                if ('myInbox' in FirebaseUserJson[find_inbox_index2]) {
                    let myinbox2 = FirebaseUserJson[find_inbox_index2].myInbox
                    if (myinbox2 != undefined) {
                        //  myinbox=myinbox.findIndex(x => x.user_id == other_user_id)
                        console.log('myinbox2', myinbox2)
                        if (inbox_id_other in myinbox2) {
                            let myinboxdata = myinbox2[inbox_id_other]

                            console.log('inbox_id_me', inbox_id_me)
                            console.log('inbox_id_other', inbox_id_other)
                            blockinbox = myinboxdata.block_status

                        }
                    }
                }
            }
        }



        var find_inbox_index = FirebaseInboxJson.findIndex(x => x.user_id == other_user_id);
        consolepro.consolelog('find_inbox_index chat', find_inbox_index);
        consolepro.consolelog('other_user_id chat', other_user_id);
        if (find_inbox_index == -1) {

            var jsonUserDataMe = {
                count: 0,
                lastMessageType: "",
                lastMsg: "",
                user_id: other_user_id,
                typing_status: 'no',
                block_status: 'no',
                lastMsgTime: Firebase.database.ServerValue.TIMESTAMP,
            };

            var jsonUserDataother = {
                count: 0,
                lastMessageType: "",
                lastMsg: "",
                user_id: user_id,
                typing_status: 'no',
                block_status: 'no',
                lastMsgTime: Firebase.database.ServerValue.TIMESTAMP,
            };



            if (question_id != 0) {
                jsonUserDataMe = {
                    count: 0,
                    lastMessageType: "",
                    lastMsg: "",
                    user_id: other_user_id,
                    typing_status: 'no',
                    block_status: 'no',
                    lastMsgTime: Firebase.database.ServerValue.TIMESTAMP,
                    chat_type: chat_type,
                    question_id: question_id,
                    question_status: 0,
                };

                jsonUserDataother = {
                    count: 0,
                    lastMessageType: "",
                    lastMsg: "",
                    user_id: user_id,
                    typing_status: 'no',
                    block_status: 'no',
                    lastMsgTime: Firebase.database.ServerValue.TIMESTAMP,
                    chat_type: chat_type,
                    question_id: question_id,
                    question_status: 0,
                };
            }




            firebaseprovider.UpdateUserInboxMe(user_id_send, inbox_id_me, jsonUserDataMe);
            if (blockinbox == 'no') {
                firebaseprovider.UpdateUserInboxOther(other_user_id_send, inbox_id_other, jsonUserDataother);
            }

            //  consolepro.consolelog('FirebaseUserJson',FirebaseUserJson);
        }
        //---------------------- this code for create inbox in first time end -----------

        //---------------------- this code for send message to both -----------
        var messageIdME = 'u_' + user_id + '__u_' + other_user_id;
        var messageIdOther = 'u_' + other_user_id + '__u_' + user_id;
        if (question_id != 0) {
            messageIdME = 'u_' + user_id + '__u_' + other_user_id + '__q_' + question_id + '__c_' + chat_type;
            messageIdOther = 'u_' + other_user_id + '__u_' + user_id + '__q_' + question_id + '__c_' + chat_type;
        }

        var senderId = user_id;
        var inputId = 'xyz'
        // var timestamp = new Date().getTime();
        var messageJson = {
            message: message,
            messageType: messageType,
            senderId: senderId,
            timestamp: Firebase.database.ServerValue.TIMESTAMP
        }

        this.chatmsg.clear();

        firebaseprovider.SendUserMessage(messageIdME, messageJson, messageType, inputId);
        if (this.state.data.blockstatus == 'no') {
            if (blockinbox == 'no') {
                firebaseprovider.SendUserMessage(messageIdOther, messageJson, messageType, inputId);
            }
        }
        //---------------------- this code for send message to both end -----------


        //----------------update user inbox----------------------------
        var jsonUserDataMe = {
            count: 0,
            lastMessageType: messageType,
            lastMsg: message,
            lastMsgTime: Firebase.database.ServerValue.TIMESTAMP
        };

        firebaseprovider.UpdateUserInboxMe(user_id_send, inbox_id_me, jsonUserDataMe);

        var user_id_me = userdata.user_id
        var chat_room_id = other_user_id;
        // this.chatRoomIdUpdate(user_id_me, chat_room_id);

        //------------------------- get other user inbox -------------------

        consolepro.consolelog('other_user_id_send', other_user_id_send);
        consolepro.consolelog('user_id_send', user_id_send);
        var count_new = 0;
        var query = firebase.database().ref('users/' + other_user_id_send + '/myInbox/' + inbox_id_other);
        query.once('value', (data) => {
            consolepro.consolelog("chat_data", data.toJSON());
            // consolepro.consolelog('user inbox data',data.val().count);
            var count_old = data.val() == null ? 0 : data.val().count;
            consolepro.consolelog('count_old_check', count_old);
            count_new = parseInt(count_old) + 1;

            var jsonUserDataOther = {
                count: count_new,
                lastMessageType: messageType,
                lastMsg: message,
                lastMsgTime: Firebase.database.ServerValue.TIMESTAMP
            };
            // alert("dddd");      
            // consolepro.consolelog('jsonUserDataOther',jsonUserDataOther);
            if (blockinbox == 'no') {
                firebaseprovider.UpdateUserInboxOther(other_user_id_send, inbox_id_other, jsonUserDataOther);
            }

        })
        //---------------------- send message notifications ----------------
        var title = 'Genius Genie';
        var message_send = message;
        var SenderName = userdata.name;
        if (messageType != 'text' && messageType != 'location') {
            message_send = SenderName + ' sent: ' + messageType;
        } else {
            message_send = SenderName + ' ' + message_send;
        }

        var other_user_id = chat_room_id;
        consolepro.consolelog('other_user_id_noti', other_user_id);
        var message_noti = message_send;
        var action_json = {
            user_id: user_id_me,
            other_user_id: other_user_id,
            chat_type: chat_type,

            action_id: user_id_me,
            action: 'chat_single',
            // action_id : user_id_me,
            SenderName: SenderName,
            image: config.img_url + userdata.image,
        };
        // alert(user_id_me);  
        this.sendNotificationSignle(title, message_noti, action_json, other_user_id);
        //---------------------- send message notifications end----------------

    }
    sendNotificationSignle = async (title, message, action_json, user_id_member) => {

        let userdata = await localStorage.getItemObject('user_arr')
        consolepro.consolelog('sendNotificationSignle action_json', action_json);
        consolepro.consolelog('sendNotificationSignle message', message);
        consolepro.consolelog('sendNotificationSignle user_id_member', user_id_member);

        consolepro.consolelog('update delete_flag', user_id_member);
        consolepro.consolelog("sendNotificationSignle FirebaseUserJson", FirebaseUserJson);
        var user_check_inbox = FirebaseUserJson.findIndex(x => x.user_id == user_id_member);
        consolepro.consolelog("user_check_inbox subuser", user_check_inbox);
        if (user_check_inbox >= 0) {
            consolepro.consolelog('FirebaseUserJson subuser', FirebaseUserJson[user_check_inbox]);
            var player_id_get = FirebaseUserJson[user_check_inbox].player_id;
            var chat_room_id_get = FirebaseUserJson[user_check_inbox].chat_room_id;
            var notification_status = FirebaseUserJson[user_check_inbox].notification_status;

            consolepro.consolelog('chat_room_id_get', chat_room_id_get + '//' + chat_room_id_get);
            consolepro.consolelog('player_id_get', user_id_member + '//' + player_id_get);
            consolepro.consolelog('notification_status', notification_status);

            if (notification_status == 1) {
                var user_id_me = userdata.user_id;
                consolepro.consolelog('chat_room_id_get', chat_room_id_get + '!=' + user_id_me);
                if (chat_room_id_get == 'no') {
                    if (player_id_get != 'no' && player_id_get != '123456') {
                        var player_id_arr = [];
                        player_id_arr.push(player_id_get);
                        consolepro.consolelog('player id 123123', player_id_arr);

                        if (player_id_arr.length > 0) {
                            consolepro.consolelog('notification send');
                            notification.notificationfunction(message, action_json, player_id_get, title);
                        }
                    }
                }
            }
        }
    }
    chatRoomIdUpdate = (user_id, other_user_id) => {
        consolepro.consolelog('chatRoomIdUpdate user_id', user_id);
        consolepro.consolelog('chatRoomIdUpdate other_user_id', other_user_id);
        var id = 'u_' + user_id;
        var jsonUserDataMe = {
            chat_room_id: other_user_id,
        };
        firebaseprovider.CreateUser(id, jsonUserDataMe);
    }
    myInboxCountZeroChat = () => {
        consolepro.consolelog('myInboxCountZeroChat');
        var data = this.state.data
        var user_id = this.state.user_id
        var other_user_id = data.other_user_id
        var question_id = data.question_id
        var user_id_send = 'u_' + user_id;
        var other_user_id_send = 'u_' + other_user_id;

        var inbox_id_me = 'q' + '_' + question_id + '__u_' + other_user_id;
        // var inbox_id_other = chat_type + '_' + question_id + '__u_' + user_id;

        var jsonUserDataOther = {
            count: 0,
            user_id: other_user_id,
        };
        firebaseprovider.UpdateUserInboxOther(user_id_send, inbox_id_me, jsonUserDataOther);
    }

    show_user_message_chat = () => {

        //  var messagedata=[]
        var other_user_id = this.state.data.other_user_id
        var find_inbox_index = FirebaseInboxJson.findIndex(x => x.user_id == other_user_id);
        // consolepro.consolelog('find_inbox_index chatshow_user_message_chat', find_inbox_index);
        // consolepro.consolelog('other_user_id chatshow_user_message_chat', other_user_id);
        if (find_inbox_index >= 0) {
            consolepro.consolelog('inboxfinguser')
            this.myInboxCountZeroChat()
        }

        consolepro.consolelog('show_user_message');

        // var userdata= await localStorage.getItemObject('user_arr');
        var data = this.state.data
        var user_id = this.state.user_id
        var other_user_id = data.other_user_id
        var question_id = this.state.question_id;
        // var item_id = data.item_id;
        var chat_type = 'Item_chat';


        var userChatId = 'u_' + user_id + '__u_' + other_user_id
        if (question_id != 0) {
            userChatId = 'u_' + user_id + '__u_' + other_user_id + '__q_' + question_id + '__c_q';
        }
        if (userChatIdGlobal == '') {
            userChatIdGlobal = userChatId;
        }
        consolepro.consolelog('userChatIdGlobal', userChatIdGlobal);
        var queryOff = firebase.database().ref('message/').child(userChatIdGlobal);
        queryOff.off('child_added');
        queryOff.off('child_changed');
        // alert('userChatId======'+userChatId);
        var image_index_me = 0;
        var image_index_other = 0;
        userChatIdGlobal = userChatId;
        var query = firebase.database().ref('message/' + userChatId).orderByChild("timestamp");
        query.on('child_added', (data) => {
            consolepro.consolelog('message child_added chat all data', data.toJSON());
            // LoadingEnd();

            var msgKey = data.key;
            var message = data.val().message;
            var messageType = data.val().messageType;
            var senderId = data.val().senderId;
            var timestamp = data.val().timestamp;
            var lastMsgTime = firebaseprovider.convertTimeAllFormat(timestamp, 'date_time_full');
            var messageDataShow = '';
            consolepro.consolelog('senderId', senderId);
            consolepro.consolelog('user_id', user_id);

            if (senderId == user_id) {
                consolepro.consolelog('senderId', senderId);

                if (messageType == 'text') {

                    var messageJson = {
                        'name': message,
                        'userid': senderId,
                        'messageType': messageType,
                        'time': lastMsgTime
                    }
                    consolepro.consolelog('messageJoson', messageJson)
                    let data6 = this.state.data1
                    data6.push(messageJson)
                    this.setState({ data1: data6 })
                } else if (messageType == 'location') {
                    var messageJson = {
                        'name': message,
                        'userid': senderId,
                        'messageType': messageType,
                        'time': lastMsgTime
                    }
                    consolepro.consolelog('messageJoson', messageJson)
                    let data6 = this.state.data1
                    data6.push(messageJson)
                    this.setState({ data1: data6 })
                }
                else if (messageType == 'image') {
                    var messageJson = {
                        'name': message,
                        'userid': senderId,
                        'messageType': messageType,
                        'time': lastMsgTime
                    }
                    consolepro.consolelog('messageJoson', messageJson)
                    let data6 = this.state.data1
                    data6.push(messageJson)
                    this.setState({ data1: data6 })

                }
            } else {
                if (messageType == 'text') {
                    var messageJson = {
                        'name': message,
                        'userid': senderId,
                        'messageType': messageType,
                        'time': lastMsgTime
                    }
                    consolepro.consolelog('messageJson', messageJson)
                    let data6 = this.state.data1
                    data6.push(messageJson)
                    this.setState({ data1: data6 })

                }
                else if (messageType == 'location') {
                    var messageJson = {
                        'name': message,
                        'userid': senderId,
                        'messageType': messageType,
                        'time': lastMsgTime
                    }
                    consolepro.consolelog('messageJson', messageJson)
                    let data6 = this.state.data1
                    data6.push(messageJson)
                    this.setState({ data1: data6 })
                }
                else if (messageType == 'image') {
                    var messageJson = {
                        'name': message,
                        'userid': senderId,
                        'messageType': messageType,
                        'time': lastMsgTime
                    }
                    consolepro.consolelog('messageJoson', messageJson)
                    let data6 = this.state.data1
                    data6.push(messageJson)
                    this.setState({ data1: data6 })

                }
            }
            consolepro.consolelog('this.state.data1 at 530', this.state.data1)
        });

        // for(let i=0; i<messagedata.length; i++)
        // {
        //   messagedata[i]=messagedata[(messagedata.length-1)-i];
        // }

        consolepro.consolelog('enndshowfunction')
    }
    senduserreport = async () => {
        let userdata = await localStorage.getItemObject('user_arr')
        consolepro.consolelog('userdata', userdata)
        let user_id = userdata.user_id
        let data = this.state.data
        var other_user_id = data.other_user_id
        var url = config.baseURL + 'report_submit.php?user_id=' + user_id + '&other_user_id=' + other_user_id + '&report_type=chat';
        consolepro.consolelog('url', url)
        this.setState({ loading: true, })
        fetch(url, {
            method: 'GET',
            headers: {
                'Cache-Control': 'no-cache, no-store, must-revalidate',
                'Pragma': 'no-cache',
                'Expires': 0,
                Accept: 'application/json',
                'Content-Type': 'multipart/form-data',
            },
        }).then((obj) => {
            this.setState({ loading: false });
            return obj.json();
        }).then((obj) => {
            consolepro.consolelog('obj', obj);

            if (obj.success == 'true') {
                msgProvider.alert('', obj.msg[config.language], false);
            }
            else {
                msgProvider.alert('', obj.msg[config.language], false);
                if (obj.active_status == "deactivate") {

                    this.props.navigation.navigate('Logout')
                }
                return false;
            }
        }).catch((error) => {
            this.setState({ loading: false });
            msgProvider.alert(msgTitle.server[config.language], msgText.servermessage[config.language], false);
        })
    }



    senduserreport = async () => {
        let userdata = await localStorage.getItemObject('user_arr')
        consolepro.consolelog('userdata', userdata)
        let user_id = userdata.user_id
        let data = this.state.data
        var other_user_id = data.other_user_id
        var url = config.baseURL + 'report_submit.php?user_id=' + user_id + '&other_user_id=' + other_user_id + '&report_type=1';
        consolepro.consolelog('url', url)
        this.setState({ loading: true, })
        fetch(url, {
            method: 'GET',
            headers: {
                'Cache-Control': 'no-cache, no-store, must-revalidate',
                'Pragma': 'no-cache',
                'Expires': 0,
                Accept: 'application/json',
                'Content-Type': 'multipart/form-data',
            },
        }).then((obj) => {
            this.setState({ loading: false });
            return obj.json();
        }).then((obj) => {
            consolepro.consolelog('obj', obj);

            if (obj.success == 'true') {
                msgProvider.alert(msgTitle.information[config.language], obj.msg[config.language], false);
            }
            else {

                msgProvider.alert(msgTitle.information[config.language], obj.msg[config.language], false);
                return false;
            }
        }).catch((error) => {
            this.setState({ loading: false });
            msgProvider.alert(msgTitle.server[config.language], msgText.servermessage[config.language], false);
        })
    }
    clearchatbtn = () => {
        Alert.alert(
            'Are you sure you want to clear chat ?',  // message
            '',
            [
                { text: 'No', onPress: () => consolepro.consolelog('Cancel Pressed'), style: 'cancel' },
                { text: 'Yes', onPress: () => { this.ClearChatConfirm() }, style: 'destructive' },
            ],
            { cancelable: false }
        )
    }
    ClearChatConfirm = async () => {
        let userdata = await localStorage.getItemObject('user_arr')
        consolepro.consolelog('userdata', userdata)
        let data = this.state.data
        var user_id = userdata.user_id
        var other_user_id = data.other_user_id
        var question_id = data.question_id
        // var item_id = data.item_id;
        var chat_type = 'q';

        // var messageIdME = 'u_' + user_id + '__u_' + other_user_id;
        var messageIdME = 'u_' + user_id + '__u_' + other_user_id + '__q_' + question_id + '__c_' + chat_type;
        var id = 'u_' + user_id;
        var otherid = 'u_' + other_user_id;
        let jsonUsesadsssfrData = {};

        firebase.database().ref().child('message' + '/' + messageIdME + '/').remove();
        // messagedata=[]
        this.setState({ data1: [], modalVisible: false })
        let jsonUserData = {};


        var jsonUserDataMe = {
            count: 0,
            lastMessageType: "",
            lastMsg: "",
            lastMsgTime: "",
            user_id: other_user_id,
        };
        var user_id_send = 'u_' + user_id;
        var other_user_id_send = 'u_' + other_user_id;
        var inbox_id_me = 'u_' + other_user_id;

        firebaseprovider.UpdateUserInboxMe(user_id_send, inbox_id_me, jsonUserDataMe);
        firebaseprovider.getMyInboxAllData();

    }
    btnOpneImageOption = (index) => {
        const options = {
            title: Lang_chg.ChooseMedia[config.language],
            takePhotoButtonTitle: Lang_chg.MediaCamera[config.language],
            chooseFromLibraryButtonTitle: Lang_chg.Mediagallery[config.language],
            cancelButtonTitle: Lang_chg.cancelmedia[config.language],
            storageOptions: {
                skipBackup: true,
                path: 'images',
            },
            maxWidth: 1000,
            maxHeight: 1000,
            quality: 0.8
        };

        ImagePicker.showImagePicker(options, (response) => {
            consolepro.consolelog('Response = ', response);

            if (response.didCancel) {
                consolepro.consolelog('User cancelled image picker');
            } else if (response.error) {
                consolepro.consolelog('ImagePicker Error: ', response.error);
            } else if (response.customButton) {
                consolepro.consolelog('User tapped custom button: ', response.customButton);
            } else {


                this.setState({
                    filePath: response,
                    fileData: response.data,
                    fileUri: response.uri,
                    imagedata: true,
                    camraon: true,
                    loading: true,
                    profileimagehide: true,
                    openDate: false
                });
                let user_id = this.state.user_id
                consolepro.consolelog('this.state.fileUri', response.uri)
                var url = config.baseURL + 'chat_file_upload.php';
                var data2 = new FormData();

                data2.append('user_id', user_id)
                data2.append('file_type', 'image')
                data2.append('image', {
                    uri: response.uri,
                    type: 'image/jpg', // or photo.type
                    name: 'image.jpg'
                });
                consolepro.consolelog('url', url)
                consolepro.consolelog('data', data2)
                // this.setState({loading:true,})
                fetch(url, {
                    method: 'POST',
                    headers: {
                        "Content-Type": "multipart/form-data"
                    },
                    body: data2,
                }).then((obj) => {
                    this.setState({ loading: false })
                    return obj.json();
                }).then((obj) => {
                    consolepro.consolelog('obj', obj);
                    if (obj.success == 'true') {
                        this.setState({ bottom: 0, loading: false })
                        this.sendmessagecallbtn('image', obj.file)
                    }
                    else {
                        this.setState({ loading: false });
                        msgProvider.alert(msgTitle.information[config.language], obj.msg[config.language], false);
                        return false;
                    }
                }).catch((error) => {
                    consolepro.consolelog('error', error)
                    msgProvider.alert(msgTitle.server[config.language], msgText.servermessage[config.language], false);
                })
            }
        });

    }
    permmissionsendreport = () => {
        this.setState({
            modalVisible: false
        }, () => {
            setTimeout(() => {
                Alert.alert(
                    //This is title
                    Lang_chg.Confirm[config.language],
                    //This is body text
                    Lang_chg.reportmessagepopup[config.language],
                    [
                        { text: Lang_chg.Yes[config.language], onPress: () => this.senduserreport() },
                        { text: Lang_chg.No[config.language], onPress: () => consolepro.consolelog('No Pressed'), style: 'cancel' },
                    ],
                    { cancelable: false }
                    //on clicking out side, Alert will not dismiss
                );
            }, 300);
        })
    }
    permmissionclearchat = () => {
        this.setState({
            modalVisible: false
        }, () => {
            setTimeout(() => {
                Alert.alert(
                    //This is title
                    Lang_chg.Confirm[config.language],
                    //This is body text
                    Lang_chg.chatclearpopup[config.language],
                    [
                        { text: Lang_chg.Yes[config.language], onPress: () => this.ClearChatConfirm() },
                        { text: Lang_chg.No[config.language], onPress: () => consolepro.consolelog('No Pressed'), style: 'cancel' },
                    ],
                    { cancelable: false }
                    //on clicking out side, Alert will not dismiss
                );
            }, 300);
        })

    }



    Camerapopen = async () => {
        var userdata = await localStorage.getItemObject('user_arr');
        var user_id = userdata.user_id;
        mediaprovider.launchCamera(false).then((obj) => {
            consolepro.consolelog('selectImage', obj.path)
            this.setState({
                selectImage: obj.path,
                cameraOn: true,
                mediamodal: false,
            })
            Keyboard.dismiss()
            this.setState({
                filePath: obj,
                fileData: obj,
                fileUri: obj.path,
                imagedata: true,
                camraon: true,
                loading: true,
                profileimagehide: true,
                openDate: false
            });

            consolepro.consolelog('this.state.fileUri', obj.path)
            var url = config.baseURL + 'chat_file_upload.php';
            var data2 = new FormData();

            data2.append('user_id', user_id)
            data2.append('file_type', 'image')
            data2.append('image', {
                uri: obj.path,
                type: 'image/jpg', // or photo.type
                name: 'image.jpg'
            });
            consolepro.consolelog('url', url)
            consolepro.consolelog('data', data2)
            // this.setState({loading:true,})
            fetch(url, {
                method: 'POST',
                headers: {
                    "Content-Type": "multipart/form-data"
                },
                body: data2,
            }).then((obj) => {
                this.setState({ loading: false })
                return obj.json();
            }).then((obj) => {
                consolepro.consolelog('obj', obj);
                if (obj.success == 'true') {
                    this.setState({ bottom: 0, loading: false })
                    this.sendmessagecallbtn('image', obj.file)
                }
                else {
                    this.setState({ loading: false });
                    msgProvider.alert(msgTitle.information[config.language], obj.msg[config.language], false);
                    return false;
                }
            }).catch((error) => {
                consolepro.consolelog('error', error)
                msgProvider.alert(msgTitle.server[config.language], msgText.servermessage[config.language], false);
            })

        }).catch((error) => {
            this.setState({ mediamodal: false })

        })
    }
    Galleryopen = async () => {
        var userdata = await localStorage.getItemObject('user_arr');
        var user_id = userdata.user_id;
        mediaprovider.launchGellery(false).then((obj) => {
            consolepro.consolelog('selectImage', obj.path)
            this.setState({
                selectImage: obj.path,
                cameraOn: true,
                mediamodal: false,
            })
            Keyboard.dismiss()
            this.setState({
                filePath: obj,
                fileData: obj,
                fileUri: obj.path,
                imagedata: true,
                camraon: true,
                loading: true,
                profileimagehide: true,
                openDate: false
            });
            // let user_id = this.state.user_id
            consolepro.consolelog('this.state.fileUri', obj.path)
            var url = config.baseURL + 'chat_file_upload.php';
            var data2 = new FormData();

            data2.append('user_id', user_id)
            data2.append('file_type', 'image')
            data2.append('image', {
                uri: obj.path,
                type: 'image/jpg', // or photo.type
                name: 'image.jpg'
            });
            consolepro.consolelog('url', url)
            consolepro.consolelog('data', data2)
            // this.setState({loading:true,})
            fetch(url, {
                method: 'POST',
                headers: {
                    "Content-Type": "multipart/form-data"
                },
                body: data2,
            }).then((obj) => {
                this.setState({ loading: false })
                return obj.json();
            }).then((obj) => {
                consolepro.consolelog('obj', obj);
                if (obj.success == 'true') {
                    this.setState({ bottom: 0, loading: false })
                    this.sendmessagecallbtn('image', obj.file)
                }
                else {
                    this.setState({ loading: false });
                    msgProvider.alert(msgTitle.information[config.language], obj.msg[config.language], false);
                    return false;
                }
            }).catch((error) => {
                consolepro.consolelog('error', error)
                msgProvider.alert(msgTitle.server[config.language], msgText.servermessage[config.language], false);
            })


        }).catch((error) => {
            this.setState({ mediamodal: false })

        })
    }




    questionSubmit = async () => {
        let user_details = await localStorage.getItemObject('user_arr');
        var user_id = user_details.user_id;
        var question_id = this.state.question_id;
        var other_user_id = this.state.data.other_user_id;
        consolepro.consolelog('user_details_ba', user_details);
        let url = config.baseURL + "changeQuetionStatus.php?user_id=" + user_details.user_id + '&quetion_id=' + this.state.question_id;
        consolepro.consolelog(url)
        apifuntion.getApi(url).then((obj) => {
            consolepro.consolelog('obj', obj)
            if (obj.success == "true") {
                var chat_type = 'q';
                var user_id_send = 'u_' + user_id;
                var other_user_id_send = 'u_' + other_user_id;
                var inbox_id_me = chat_type + '_' + question_id + '__u_' + other_user_id;
                var inbox_id_other = chat_type + '_' + question_id + '__u_' + user_id;


                var jsonUserDataMe = {
                    question_status: 1,
                };
                var jsonUserDataother = {
                    question_status: 1,
                };




                var onlineStatusRef = firebase.database().ref('users/' + user_id_send + '/myInbox/' + inbox_id_me).update(jsonUserDataMe);
                var queryOffinbox = firebase.database().ref('users/' + user_id_send + '/myInbox/');


                var onlineStatusRef = firebase.database().ref('users/' + other_user_id_send + '/myInbox/' + inbox_id_other).update(jsonUserDataother);
                var queryOffinbox = firebase.database().ref('users/' + other_user_id_send + '/myInbox/');

                var dsdsds = this.state.data;
                dsdsds.question_status = 3
                this.setState({ question_status: 1, bottom: 0, data: dsdsds })
            } else {
                msgProvider.alert(msgTitle.information[config.language], obj.msg[config.language], false);
                if (obj.active_status == 'deactivate') {
                    this.props.navigation.navigate('Login');
                    // BackHandler.exitApp();
                    localStorage.clear();
                }
                return false;
            }
        }).catch((error) => {
            consolepro.consolelog("-------- error ------- " + error);
        });
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



    render() {
 
        //consolepro.consolelog('this.state.data.other_user_name', this.state.data)
        if (Platform.OS === 'ios') {

            return (
                <KeyboardAvoidingView   style={styles.container} behavior='padding'>

                    <View style={styles.container}>
                        <View style={{ flex: 1 }}>
                            {/* <Loader loading={this.state.loading} /> */}
                            <StatusBar barStyle='light-content' backgroundColor={Colors.appColor} hidden={false} translucent={false}
                                networkActivityIndicatorVisible={true} />
                            <Modal
                                animationType="slide"
                                visible={this.state.imageModal}
                                onRequestClose={() => { this.setState({ imageModal: !this.state.imageModal }) }}
                            >
                                <View style={{ flex: 1 }}>
                                    <SafeAreaView style={{ flex: 0, backgroundColor: Colors.statusbarcolor }} />
                                    <StatusBar backgroundColor={Colors.statusbarcolor} barStyle='light-content' hidden={false} translucent={false}
                                        networkActivityIndicatorVisible={true} />
                                    <View style={{
                                        zIndex: 99999, flexDirection: "row", height: mobileH * 0.090,
                                        paddingHorizontal: mobileW * 0.06, backgroundColor: Colors.theme_color
                                    }}>
                                        <View style={{ flex: 1, justifyContent: "center" }}>
                                            <TouchableOpacity activeOpacity={1} style={{ flexDirection: "row", alignItems: "center" }}
                                                onPress={() => { this.setState({ imageModal: false }) }}
                                            >
                                                <View style={styles.leftHomeHeaderIconContainer12}>
                                                    <Image source={localimag.back} style={{ height: mobileW * 0.07, width: mobileW * 0.07 }} />
                                                </View>
                                            </TouchableOpacity>
                                        </View>
                                        <View style={{ flex: 2, justifyContent: "center", alignItems: 'center' }}>

                                        </View>
                                        <TouchableOpacity activeOpacity={0.7} style={{ flex: 1, alignItems: 'flex-end', justifyContent: 'center' }}>

                                        </TouchableOpacity>
                                    </View>
                                    <View style={{ flex: 1 }}>
                                        <ImageZoom style={{ justifyContent: "center", alignItems: 'center' }} cropWidth={Dimensions.get('window').width}
                                            cropHeight={mobileH * 0.95}
                                            imageWidth={mobileW * 1}
                                            imageHeight={mobileW * 1}>
                                            <Image style={{ width: mobileW * 1, height: mobileW * 1, marginTop: -mobileH * 0.06 }}
                                                source={{ uri: config.img_url3 + this.state.image_path }} resizeMode="contain" />
                                        </ImageZoom>
                                    </View>
                                </View>
                            </Modal>
                            <Modal
                                animationType="slide"
                                transparent={true}
                                visible={this.state.modalVisible}
                                onRequestClose={() => {
                                    this.setState({ modalVisible: false })
                                }}>

                                <View style={{ flex: 1, backgroundColor: '#00000030', alignItems: 'center' }}>
                                    <View style={{ position: 'absolute', bottom: 20, width: mobileW, }}>
                                        <View style={{ alignSelf: 'center', width: '94%', backgroundColor: '#ffffff', alignSelf: 'center', borderRadius: 10 }}>
                                            <TouchableOpacity style={{ width: '100%', alignSelf: 'center', justifyContent: 'center', alignItems: 'center', borderBottomColor: Colors.gray_medium, borderBottomWidth: 0.5 }} activeOpacity={1}>
                                                <View style={{ backgroundColor: Colors.mediabackground, borderRadius: 30, paddingVertical: mobileW * 3.5 / 100 }}>
                                                    <Text style={{ fontFamily: Font.FontBold, textAlign: 'center', fontSize: mobileW * 4 / 100, color: Colors.gray_medium }}>Select Option</Text>
                                                </View>
                                            </TouchableOpacity>
                                            <TouchableOpacity style={{ width: '100%', alignSelf: 'center', justifyContent: 'center', alignItems: 'center', borderBottomColor: Colors.gray_medium, borderBottomWidth: 0.5 }} activeOpacity={0.9} onPress={() => { this.permmissionclearchat() }}>
                                                <View style={{ backgroundColor: Colors.mediabackground, borderRadius: 30, paddingVertical: mobileW * 3.5 / 100 }}>
                                                    <Text style={{ fontFamily: Font.FontBold, textAlign: 'center', fontSize: mobileW * 4 / 100, color: Colors.pop_text_color }}>Clear Chat</Text>
                                                </View>
                                            </TouchableOpacity>



                                            <TouchableOpacity style={{ width: '100%', alignSelf: 'center', marginTop: 10, justifyContent: 'center', alignItems: 'center' }} onPress={() => { this.setState({ modalVisible: false }); this.permmissionsendreport() }}>
                                                <View style={{ backgroundColor: Colors.mediabackground, borderRadius: 30, paddingVertical: mobileW * 3.5 / 100 }}>
                                                    <Text style={{ fontFamily: Font.FontBold, textAlign: 'center', fontSize: mobileW * 4 / 100, color: Colors.pop_text_color }}>Report</Text>
                                                </View>
                                            </TouchableOpacity>
                                        </View>
                                        <View style={{ marginTop: 15, alignSelf: 'center', borderRadius: 10, backgroundColor: '#fff', width: '94%', justifyContent: 'center', alignItems: 'center', }}>
                                            <TouchableOpacity onPress={() => { this.setState({ modalVisible: false }) }} style={{ alignSelf: 'center', width: '94%', alignItems: 'center', justifyContent: 'center', paddingVertical: mobileW * 3.5 / 100 }}>
                                                <Text style={{ fontFamily: Font.FontBold, fontSize: mobileW * 4 / 100, color: "red" }}>{Lang_chg.cancelmedia[config.language]}</Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                </View>
                            </Modal>
                            <Cameragallery mediamodal={this.state.mediamodal} Camerapopen={() => { this.Camerapopen() }}
                                Galleryopen={() => { this.Galleryopen() }}
                                Canclemedia={() => { this.setState({ mediamodal: false }) }}
                            />

                            <View
                                style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                   
                                    height: (windowHeight * 10) / 100,
                                    width: windowWidth * 100 / 100,
                                    alignSelf: 'center',
                                    justifyContent:'center',
                                    backgroundColor:Colors.purewhite,
                                    borderBottomWidth:1,
                                    borderBottomColor:'#dbdbdb',
                                    marginBottom:10
                                }}>
                                <View style={{ flexDirection: 'row', alignItems: 'center', width: windowWidth * 95/100,alignSelf:'center'}}>
                                    
                                    <TouchableOpacity onPress={() => { this.goBack() }} style={{ justifyContent: 'center', height: windowHeight * 10 / 100, width: windowWidth * 8 / 100 }}>
                                        <Image source={localimag.back} resizeMode='contain' style={{ height: windowHeight * 8 / 100, width: windowWidth * 8 / 100, alignSelf: 'center' }} />
                                    </TouchableOpacity>

                                    <View style={{ alignSelf: 'center',marginLeft:mobileW*1/100}}>
                                        {
                                            (this.state.data.image != null && this.state.data.image != 'NA') ? <Image
                                                source={{ uri: config.img_url3 + this.state.data.image }}
                                                style={{
                                                    width: (windowWidth * 14) / 100,
                                                    height: (windowWidth * 14) / 100,
                                                    resizeMode: 'cover',
                                                    borderRadius: 100,
                                                    alignSelf: 'center'
                                                }}
                                            />
                                                :
                                                <Image
                                                    source={localimag.default}
                                                    style={{
                                                        width: (windowWidth * 14) / 100,
                                                        height: (windowWidth * 14) / 100,
                                                        resizeMode: 'cover',
                                                        borderRadius: 100,
                                                        alignSelf: 'center',
                                                       
                                                    }}
                                                />
                                        }

                                    </View>
                                    <View style={{ paddingLeft:5, width: windowWidth * 35 / 100, }} >
                                        <Text
                                            numberOfLines={1}
                                            style={{
                                              
                                                fontFamily: 'Roboto-Bold',
                                                fontSize: (windowWidth * 3.8) / 100,
                                              
                                            }}>
                                            {this.state.data.other_user_name}
                                        </Text>

                                        <Text
                                            numberOfLines={1}
                                            style={{
                                                fontFamily: Font.Lato_Bold,
                                                
                                                fontSize: (windowWidth * 3) / 100,
                                               
                                                color: (this.state.data.question_status == 1 || this.state.data.question_status == 0) ? "#07f70f" : Colors.theme_color
                                            }}>
                                            {(this.state.data.question_status == 1 || this.state.data.question_status == 0) ? 'Accepted' : 'Solved'}
                                        </Text>

                                    </View>
                                 {
                                    (this.state.user_type == 1 && this.state.data.question_status != 3) ?
                                    <TouchableOpacity
                                        onPress={() => { this.questionSubmit() }}
                                        style={{ alignItems: 'center', justifyContent: "center",width:mobileW*22/100}}>
                                        <Text style={{ color: Colors.theme_color,fontSize:mobileW*3/100 }}>Question Solved</Text>
                                    </TouchableOpacity>:
                                      <TouchableOpacity activeOpacity={0.8}
                                        
                                        style={{ alignItems: 'center', justifyContent: "center",width:mobileW*22/100}}>
                                                                             {/* <Text style={{ color: Colors.theme_color,fontSize:mobileW*3/100 }}>Question Solved</Text> */}
                                    </TouchableOpacity>

                                }  
                             

                               
                             
                                    
    <View style={{width:mobileW*20/100,flexDirection:'row',alignItems:'center',alignSelf:'flex-end',right:0}}>
     {
                                            this.state.data.question_status != 3 &&
<TouchableOpacity onPress={() => { this.getRatingStatus(1) }} style={{ justifyContent: 'center', height: windowHeight * 10 / 100, width: windowWidth * 8 / 100, marginLeft:5 }}>
                                        <Image source={localimag.Refres} resizeMode='contain' style={{ height: windowHeight * 8 / 100, width: windowWidth * 8 / 100, alignSelf: 'center' }} />
                                    </TouchableOpacity>}

                                <TouchableOpacity
                                    onPress={() => { this.setState({ modalVisible: true }) }}
                                    style={{ marginRight: 10 }}>
                                    <Image
                                        source={localimag.more}
                                        style={{ height: windowHeight * 8 / 100, width: (windowWidth * 8) / 100, resizeMode: 'contain' }}
                                    />
                                </TouchableOpacity>
                                </View>
                                
                           
                                   </View>
                            </View>
                            {
                                    this.state.user_type == 1  &&
                            <View>
                              {this.state.status_fav == 0 && <TouchableOpacity activeOpacity={0.9} onPress={() => { this.markFavUnfav(1),this.setState({status_fav:1}) }}
                                style={{ width:mobileW*10/100,marginLeft:mobileW*3/100 ,marginTop:mobileW*1/100,alignSelf:'flex-end',marginBottom:mobileW*1/100}}>
                                <Image resizeMode="contain" style={{ width:25, height: 25}} source={localimag.hollow_heart}></Image>
                            </TouchableOpacity>}
                            {this.state.status_fav == 1 && <TouchableOpacity activeOpacity={0.9} onPress={() => { this.markFavUnfav(0),this.setState({status_fav:0}) }}
      style={{ width:mobileW*10/100,marginLeft:mobileW*3/100 ,marginTop:mobileW*1/100,alignSelf:'flex-end',marginBottom:mobileW*1/100}}>
                                <Image resizeMode="contain" style={{ width: 25, height: 25 }} source={localimag.liked}></Image>
                            </TouchableOpacity>}
                            
                            </View>}
                            
                                    {
                                    this.state.user_type == 2  && this.state.request_status==1 && this.state.data.question_status != 3 &&
                                   <View style={{width:'95%',flexDirection:'row',alignItems:'center',alignSelf:'center',justifyContent:'space-between'}}>
                                    <Text style={{fontFamily:Font.medium,fontSize:mobileW*3.5/100,}}>Live Video Request</Text>
                                    <TouchableOpacity onPress={()=>{this.Acceptrejectcall(2)}} style={{width:'30%',alignItems:'center',paddingVertical:mobileW*2/100,borderWidth:1,borderColor:'#e1e1e1',borderRadius:2}}>
                                                                      <Text style={{color:Colors.theme_color,fontSize:mobileW*4/100,fontFamily:Font.medium}}>Accept</Text>
                                    </TouchableOpacity>
                                       <TouchableOpacity onPress={()=>{this.Acceptrejectcall(3)}} style={{width:'30%',alignItems:'center',paddingVertical:mobileW*2/100,borderWidth:1,borderColor:'#e1e1e1',borderRadius:2}}>
                                                                      <Text style={{color:'red',fontSize:mobileW*4/100,fontFamily:Font.medium}}>Reject</Text>
                                    </TouchableOpacity>
                                     </View>
                                      }
{ this.state.user_type == 2  && this.state.request_status==2 && this.state.data.question_status != 3 &&
                                       <TouchableOpacity onPress={()=>{this.startpermission('expert')}} style={{alignSelf:'flex-end' ,width:'40%',alignItems:'center',paddingVertical:mobileW*2/100,backgroundColor:Colors.theme_color,borderRadius:mobileW*2/100,right:20}}>
                                                                      <Text style={{color:'#fff',fontSize:mobileW*4/100,fontFamily:Font.medium}}>Start call</Text>
                                    </TouchableOpacity>}
                                      
                                   {
                                    (this.state.user_type == 1 && this.state.data.question_status != 3 && (this.state.request_status==0|| this.state.request_status==3)) &&
                                <View style={{width:'95%',flexDirection:'row',alignItems:'center',alignSelf:'center',marginTop:mobileW*3/100}}>
                                <Text style={{width:'70%',fontFamily:Font.medium,fontSize:mobileW*3.5/100}}>Send request to expert for live video</Text>
                            <TouchableOpacity onPress={()=>{this.sendRequestcall()}} style={{width:mobileW*30/100,paddingVertical:mobileW*2/100,borderWidth:1,borderColor:'#e1e1e1'}}>
                                <Text style={{color:Colors.theme_color,fontFamily:Font.regular,textAlign:'center'}}>Send Request</Text>
                            </TouchableOpacity>
                                </View>
                              }
                               {
                                    (this.state.user_type == 1 && this.state.data.question_status != 3 && this.state.request_status==1) &&

                                <Text style={{color:Colors.theme_color,fontFamily:Font.regular,textAlign:'center'}}>Requesting for live video</Text>
                          
                              }
                             {
                                    (this.state.user_type == 1 && this.state.request_status==2 && this.state.data.question_status != 3)  && 
<TouchableOpacity style={{width:'40%',paddingVertical:mobileW*2/100,backgroundColor:Colors.theme_color,borderRadius:mobileW*2/100,alignSelf:'flex-end',alignItems:'center',right:20}} onPress={()=>{this.startpermission('sub')}}>
                                <Text style={{color:'#fff',fontFamily:Font.regular,textAlign:'center'}}>Join call</Text>
                          </TouchableOpacity>
                              }
                           
                        <View style={{ paddingBottom: 290, width: '95%', alignSelf: 'center', paddingTop: 10 }}>
                                <FlatList

                                    data={this.state.data1}
                                    showsVerticalScrollIndicator={false}
                                //   onRefresh={() => this._onRefresh()}
                                //    refreshing={this.state.refresh}
                                    ref={ref => (this.FlatListRef = ref)} // assign the flatlist's ref to your component's FlatListRef...
                                    onContentSizeChange={() => this.FlatListRef.scrollToEnd()} // scroll it
                                    contentContainerStyle={{ marginBottom: mobileW*40/100}}
                                    keyboardDismissMode='interactive'
                                    keyboardShouldPersistTaps='always'

                                    renderItem={({ item, index }) => {
                                        return (
                                            <View style={{ width: '97%', alignSelf: 'center', paddingVertical: 7 }}>

                                                {
                                                    index == 0 &&
                                                    <View style={{ marginBottom: 10 }}>
                                                        <Text style={{ textAlign: 'left', fontFamily: Font.regular, color: '#ADA8A8' }}>Q. {this.state.data.question}  </Text>


                                                        <TouchableOpacity
                                                            style={{
                                                                marginTop: 30,
                                                                flexDirection: 'row',
                                                                alignItems: 'center',
                                                                justifyContent: 'center',
                                                                alignSelf: 'center',
                                                                width: windowWidth * 80 / 100,
                                                                backgroundColor: Colors.purewhite,
                                                                elevation: 10,
                                                                shadowColor: 'grey',
                                                                elevation: 5,
                                                                shadowOffset: { width: 2, height: 2, },
                                                                shadowOpacity: 0.3,
                                                                padding: 10, borderRadius: 5
                                                            }} onPress={() => { (this.state.data.document != null) ? this.setState({ imageModal: true, image_path: this.state.data.document }) : null }}>
                                                            <Image source={localimag.file} style={{ width: mobileH * 0.03, height: mobileH * 0.03, marginRight: 5 }} />
                                                            <Text style={{ textAlign: 'justify', fontFamily: Font.regular, color: '#000000', marginRight: 5 }}>{(this.state.data.document != null) ? 'File Uploaded' : 'No Document'}</Text>
                                                        </TouchableOpacity>
                                                        {/* <Image source={(this.state.data.document != 'NA' || this.state.data.document != null) ? { uri: config.img_url1 + this.state.data.document } : localimag.default} style={{ marginTop: 10, width: windowWidth, height: windowHeight * 0.25 }} resizeMode="cover" /> */}
                                                    </View>
                                                }



                                                {item.userid != this.state.user_id && <View style={{ alignItems: 'center', justifyContent: 'flex-start', flexDirection: 'row' }}>

                                                    {item.messageType == 'text' && <View colors={Colors.theme_color} style={{ alignSelf: 'flex-start', width: '70%', justifyContent: 'center', borderRadius: 10, paddingVertical: 7, marginTop: 5, backgroundColor: Colors.theme_color }}>
                                                        <View style={{
                                                            paddingVertical: 5, paddingHorizontal: 8, alignSelf: 'flex-start',
                                                            borderTopRightRadius: 10,
                                                            borderBottomLeftRadius: 10,
                                                            borderBottomRightRadius: 10,
                                                            flexDirection: 'row',
                                                            justifyContent: 'space-between',
                                                            width: '100%'
                                                        }}>
                                                            {item.messageType == 'text' && <Text style={{ fontSize: 14, fontFamily: Font.FontBold, color: '#fff', width: '80%' }}>{item.name}   </Text>}
                                                            <Text style={{ fontSize: 10, fontFamily: Font.FontRegular, color: '#fff', alignSelf: 'flex-end' }}>{item.time}</Text>
                                                        </View>
                                                    </View>}
                                                    {item.messageType == 'image' && <TouchableOpacity style={{ backgroundColor: Colors.theme_color, borderRadius: 3 }} activeOpacity={0.9} onPress={() => { (item.name != null) ? this.setState({ image_path: item.name, imageModal: true }) : null }}>
                                                        <View colors={Colors.theme_color} style={{ borderRadius: 10, paddingBottom: 5, justifyContent: 'center' }}>
                                                            <Image source={{ uri: config.img_url + item.name }} style={{ width: BannerWidth * 42 / 100, height: BannerHieght * 30 / 100, borderRadius: 5 }} />
                                                            <Text style={{ fontSize: 10, fontFamily: Font.FontRegular, color: '#fff', alignSelf: 'flex-end' }}>{item.time}</Text>
                                                        </View>
                                                    </TouchableOpacity>}


                                                </View>}
                                                {item.userid == this.state.user_id && <View style={{ alignItems: 'center', justifyContent: 'flex-end', flexDirection: 'row', }}>
                                                    {item.messageType == 'text' && <View style={{ width: '70%', alignSelf: 'flex-end', borderRadius: 10, paddingVertical: 7, justifyContent: 'center', marginBottom: 5, backgroundColor: 'grey' }}>
                                                        <View style={{
                                                            backgroundColor: Colors.appColor, borderTopLeftRadius: 10,
                                                            borderBottomLeftRadius: 10,
                                                            borderBottomRightRadius: 10,
                                                            paddingVertical: 5,
                                                            paddingHorizontal: 8,
                                                            backgroundColor: 'grey',
                                                            alignSelf: 'flex-end', flexDirection: 'row', justifyContent: 'space-between', width: '100%'
                                                        }}>
                                                            <Text style={{ fontSize: 10, fontFamily: Font.FontSemiBold, color: '#FFFFFF', alignSelf: 'flex-end', width: '20%' }}>{item.time}</Text>
                                                            {item.messageType == 'text' && <Text style={{ fontSize: 14, fontFamily: Font.FontBold, color: '#fff', width: '80%', textAlign: 'right' }}>{item.name}</Text>}


                                                        </View>

                                                    </View>}
                                                    {item.messageType == 'image' && <TouchableOpacity style={{ backgroundColor: 'grey', borderRadius: 3 }} activeOpacity={0.9} onPress={() => { (item.name != null) ? this.setState({ image_path:item.name, imageModal: true }) : null }}>
                                                        <View colors={Colors.theme_color} style={{ borderRadius: 10, paddingBottom: 5, justifyContent: 'center' }}>
                                                            <Image source={{ uri: config.img_url3+item.name }} style={{ width: BannerWidth * 42 / 100, height: BannerHieght * 30 / 100, borderRadius: 5 }} />
                                                            <Text style={{ fontSize: 10, fontFamily: Font.FontRegular, color: '#fff', alignSelf: 'flex-end' }}>{item.time}</Text>
                                                        </View>
                                                    </TouchableOpacity>}

                                                </View>
                                                }
                                            </View>
                                        )
                                    }}
                                />

                            </View>

                            <View style={{ position: 'absolute', borderTopWidth: 0, bottom: Platform.OS === 'ios' ? this.state.bottom : 0, left: 0, right: 0, paddingVertical: 7.5 }}>


                                {
                                    (this.state.user_type == 1) &&
                                    <View>
                                        {
                                            (this.state.data.question_status == 3 && this.state.rating_status == 0) &&
                                            <TouchableOpacity style={{ backgroundColor: Colors.theme_color, alignSelf: 'center', height: windowHeight * 8 / 100, width: windowWidth * 100 / 100, alignItems: 'center', justifyContent: 'center' }} onPress={() => {
                                                // this.props.navigation.navigate('RatingReviewPopup', {
                                                //     data: this.state.data
                                                // })
                                                this.props.navigation.navigate('RatingReviewUser', {
                                                    data: this.state.data
                                                })
                                            }}>
                                                <Text style={{ color: "#fff", fontSize: 15, textAlign: 'center', fontFamily: Font.FontBold }}>Rate Now</Text>
                                            </TouchableOpacity>
                                        }
                                        {/* {
                                            (this.state.question_status == 1 && this.state.rating_status == 1) &&
                                            <TouchableOpacity style={{ backgroundColor: Colors.theme_color, alignSelf: 'center', height: windowHeight * 8 / 100, width: windowWidth * 100 / 100, alignItems: 'center', justifyContent: 'center' }} onPress={() => { null }}>
                                                <Text style={{ color: "#fff", fontSize: 15, textAlign: 'center', fontFamily: Font.FontBold }}>Your question is solved, So you can't chat</Text>
                                            </TouchableOpacity>
                                        } */}
                                        {
                                            (this.state.data.question_status == 3 && this.state.rating_status == 1) &&
                                            <View style={{ position: 'absolute', bottom: -10 }}>
                                                {
                                                    (this.state.ratting_arr != 'NA') &&
                                                    <TouchableOpacity style={{ backgroundColor: "#fff", alignSelf: 'center', height: windowHeight * 15 / 100, width: windowWidth * 100 / 100, justifyContent: 'center', paddingLeft: 20, shadowColor: '#000000', shadowOffset: { width: 2, height: 2, }, shadowOpacity: 0.20, elevation: 20, }} onPress={() => { null }}>
                                                        <Text style={{ color: '#000', fontSize: mobileW * 2.5 / 100 }}>{this.state.ratting_arr.timestamp}</Text>
                                                        <View style={{ justifyContent: "flex-start" }}>
                                                            <StarRating
                                                                containerStyle={{ width: windowWidth * 20 / 100, height: windowHeight * 3 / 100, marginTop: mobileW * 0.5 / 100 }}
                                                                fullStar={localimag.star}
                                                                emptyStar={localimag.stargrey}
                                                                halfStarColor={'#FFC815'}
                                                                disabled={true}
                                                                maxStars={5}
                                                                starSize={mobileW * 4 / 100}
                                                                rating={this.state.ratting_arr.rating}
                                                            />
                                                            <Text numberOfLines={1} style={{ fontFamily: Font.bold, fontSize: mobileW * 4 / 100, color: '#000' }}>{this.state.ratting_arr.review}</Text>
                                                        </View>
                                                    </TouchableOpacity>
                                                }

                                            </View>
                                        }
                                        {
                                            this.state.data.question_status != 3 &&
                                            <View style={{ backgroundColor: Colors.theme_color, alignSelf: 'center', height: windowHeight * 8 / 100, width: windowWidth * 100 / 100, flexDirection: 'row', alignItems: 'center' }}>
                                                <TouchableOpacity onPress={() => { this.setState({ mediamodal: true }) }} style={{ width: mobileW * 10 / 100 }} >
                                                    <Image source={localimag.plusin} style={{ height: windowHeight * 8 / 100, width: windowWidth * 8 / 100, resizeMode: 'contain', alignSelf: 'center' }} />
                                                </TouchableOpacity>
                                                <TextInput
                                                    style={{
                                                        backgroundColor: Colors.purewhite, paddingLeft: 15, fontSize: windowHeight * 2 / 100, height: windowHeight * 6.5 / 100, width: windowWidth * 80 / 100, color: 'black', borderRadius: 5
                                                    }}
                                                    placeholder='Write a message'
                                                    placeholderTextColor={'#000'}
                                                    ref={(input) => { this.chatmsg = input; }}
                                                    onChangeText={(txt) => { this.setState({ chatmsg: txt }) }}
                                                    keyboardType="default"
                                                    onFocus={() => { this.setState({ Numberbtn: 1, bottom: 43 }); }}
                                                    blurOnSubmit={true}
                                                    scrollEnabled={true}
                                                    onSubmitEditing={() => {
                                                        this.setState({ bottom: 0 })
                                                    }}
                                                />
                                                {this.state.chatmsg.length > 0 &&
                                                    <TouchableOpacity onPress={() => { this.sendmessagebtn() }} style={{ width: mobileW * 10 / 100, justifyContent: 'center' }}>
                                                        <Image source={localimag.send} style={{ height: windowHeight * 8 / 100, width: windowWidth * 8 / 100, resizeMode: 'contain', alignSelf: 'center' }} />
                                                    </TouchableOpacity>}
                                            </View>
                                        }
                                    </View>
                                }




                                {
                                    (this.state.user_type == 2) &&
                                    <View>
                                        {
                                            (this.state.data.question_status == 3 && this.state.rating_status == 0) &&
                                            <TouchableOpacity style={{ backgroundColor: Colors.theme_color, alignSelf: 'center', height: windowHeight * 8 / 100, width: windowWidth * 100 / 100, alignItems: 'center', justifyContent: 'center' }} onPress={() => { null }}>
                                                <Text style={{ color: "#fff", fontSize: 15, textAlign: 'center', fontFamily: Font.FontBold }}>Your question is solved, So you can't chat</Text>
                                            </TouchableOpacity>
                                        }
                                        {
                                            (this.state.data.question_status == 3 && this.state.rating_status == 1) &&
                                            <View style={{ position: 'absolute', bottom: -10 }}>
                                                {
                                                    (this.state.ratting_arr != 'NA') &&
                                                    <TouchableOpacity style={{ backgroundColor: "#fff", alignSelf: 'center', height: windowHeight * 15 / 100, width: windowWidth * 100 / 100, justifyContent: 'center', paddingLeft: 20, shadowColor: '#000000', shadowOffset: { width: 2, height: 2, }, shadowOpacity: 0.20, elevation: 20, }} onPress={() => { null }}>
                                                        <Text style={{ color: '#000', fontSize: mobileW * 2.5 / 100 }}>{this.state.ratting_arr.timestamp}</Text>
                                                        <View style={{ justifyContent: "flex-start" }}>
                                                            <StarRating
                                                                containerStyle={{ width: windowWidth * 20 / 100, height: windowHeight * 3 / 100, marginTop: mobileW * 0.5 / 100 }}
                                                                fullStar={localimag.star}
                                                                emptyStar={localimag.stargrey}
                                                                halfStarColor={'#FFC815'}
                                                                disabled={true}
                                                                maxStars={5}
                                                                starSize={mobileW * 4 / 100}
                                                                rating={this.state.ratting_arr.rating}
                                                            />
                                                            <Text numberOfLines={1} style={{ fontFamily: Font.bold, fontSize: mobileW * 4 / 100, color: '#000' }}>{this.state.ratting_arr.review}</Text>
                                                        </View>
                                                    </TouchableOpacity>
                                                }

                                            </View>
                                        }
                                        {
                                            this.state.data.question_status != 3 &&
                                            <View style={{ backgroundColor: Colors.theme_color, alignSelf: 'center', height: windowHeight * 8 / 100, width: windowWidth * 100 / 100, flexDirection: 'row', alignItems: 'center' }}>
                                                <TouchableOpacity onPress={() => { this.setState({ mediamodal: true }) }} style={{ width: mobileW * 10 / 100 }} >
                                                    <Image source={localimag.plusin} style={{ height: windowHeight * 8 / 100, width: windowWidth * 8 / 100, resizeMode: 'contain', alignSelf: 'center' }} />
                                                </TouchableOpacity>
                                                <TextInput
                                                    style={{ backgroundColor: Colors.purewhite, paddingLeft: 15, fontSize: windowHeight * 2 / 100, height: windowHeight * 6.5 / 100, width: windowWidth * 80 / 100, color: 'black', borderRadius: 5 }}
                                                    placeholder='Write a message'
                                                    placeholderTextColor={'#000'}
                                                    ref={(input) => { this.chatmsg = input; }}
                                                    onChangeText={(txt) => { this.setState({ chatmsg: txt }) }}
                                                    keyboardType="default"
                                                    onFocus={() => { this.setState({ Numberbtn: 1, bottom: 43 }); }}
                                                    blurOnSubmit={true}
                                                    scrollEnabled={true}
                                                    onSubmitEditing={() => { this.setState({ bottom: 0 }) }}
                                                />
                                                {this.state.chatmsg.length > 0 &&
                                                    <TouchableOpacity onPress={() => { this.sendmessagebtn() }} style={{ width: mobileW * 10 / 100, justifyContent: 'center' }}>
                                                        <Image source={localimag.send} style={{ height: windowHeight * 8 / 100, width: windowWidth * 8 / 100, resizeMode: 'contain', alignSelf: 'center' }} />
                                                    </TouchableOpacity>}
                                            </View>
                                        }
                                    </View>
                                }
                            </View>
                        </View>
                    </View>
                </KeyboardAvoidingView>

            )
        }
        else {
            return (
                // <KeyboardAvoidingView style={styles.container} behavior='padding'>


                <View style={styles.container}>
                    {/* <Loader loading={this.state.loading} /> */}
                    <View style={{ flex: 1 }}>
                        <StatusBar
                            hidden={false}
                            backgroundColor={Colors.appColor}
                            translucent={false}
                            networkActivityIndicatorVisible={true}
                        />
                        <Modal
                            animationType="slide"
                            visible={this.state.imageModal}
                            onRequestClose={() => { this.setState({ imageModal: !this.state.imageModal }) }}
                        >
                            <View style={{ flex: 1 }}>
                                <SafeAreaView style={{ flex: 0, backgroundColor: Colors.statusbarcolor }} />
                                <StatusBar backgroundColor={Colors.statusbarcolor} barStyle='light-content' hidden={false} translucent={false}
                                    networkActivityIndicatorVisible={true} />
                                <View style={{
                                    zIndex: 99999, flexDirection: "row", height: mobileH * 0.090,
                                    paddingHorizontal: mobileW * 0.06, backgroundColor: Colors.theme_color
                                }}>
                                    <View style={{ flex: 1, justifyContent: "center" }}>
                                        <TouchableOpacity activeOpacity={1} style={{ flexDirection: "row", alignItems: "center" }}
                                            onPress={() => { this.setState({ imageModal: false }) }}
                                        >
                                            <View style={styles.leftHomeHeaderIconContainer12}>
                                                <Image source={localimag.back} style={{ height: mobileW * 0.07, width: mobileW * 0.07 }} />
                                            </View>
                                        </TouchableOpacity>
                                    </View>
                                    <View style={{ flex: 2, justifyContent: "center", alignItems: 'center' }}>

                                    </View>
                                    <TouchableOpacity activeOpacity={0.7} style={{ flex: 1, alignItems: 'flex-end', justifyContent: 'center' }}>

                                    </TouchableOpacity>
                                </View>
                                <View style={{ flex: 1 }}>
                                    <ImageZoom style={{ justifyContent: "center", alignItems: 'center' }} cropWidth={Dimensions.get('window').width}
                                        cropHeight={mobileH * 0.95}
                                        imageWidth={mobileW * 1}
                                        imageHeight={mobileW * 1}>
                                        <Image style={{ width: mobileW * 1, height: mobileW * 1, marginTop: -mobileH * 0.06 }}
                                            source={{ uri: config.img_url3 + this.state.image_path }} resizeMode="contain" />
                                    </ImageZoom>
                                </View>
                            </View>
                        </Modal>
                        <Modal
                            animationType="slide"
                            transparent={true}
                            visible={this.state.modalVisible}
                            onRequestClose={() => {
                                this.setState({ modalVisible: false })
                            }}>

                            <View style={{ flex: 1, backgroundColor: '#00000030', alignItems: 'center' }}>
                                <View style={{ position: 'absolute', bottom: 20, width: mobileW, }}>
                                    <View style={{ alignSelf: 'center', width: '94%', backgroundColor: '#ffffff', alignSelf: 'center', borderRadius: 10 }}>
                                        <TouchableOpacity style={{ width: '100%', alignSelf: 'center', justifyContent: 'center', alignItems: 'center', borderBottomColor: Colors.gray_medium, borderBottomWidth: 0.5 }} activeOpacity={1}>
                                            <View style={{ backgroundColor: Colors.mediabackground, borderRadius: 30, paddingVertical: mobileW * 3.5 / 100 }}>
                                                <Text style={{ fontFamily: Font.FontBold, textAlign: 'center', fontSize: mobileW * 4 / 100, color: Colors.gray_medium }}>Select Option</Text>
                                            </View>
                                        </TouchableOpacity>
                                        <TouchableOpacity style={{ width: '100%', alignSelf: 'center', justifyContent: 'center', alignItems: 'center', borderBottomColor: Colors.gray_medium, borderBottomWidth: 0.5 }} activeOpacity={0.9} onPress={() => { this.setState({ modalVisible: false }); this.permmissionclearchat() }}>
                                            <View style={{ backgroundColor: Colors.mediabackground, borderRadius: 30, paddingVertical: mobileW * 3.5 / 100 }}>
                                                <Text style={{ fontFamily: Font.FontBold, textAlign: 'center', fontSize: mobileW * 4 / 100, color: Colors.pop_text_color }}>Clear Chat</Text>
                                            </View>
                                        </TouchableOpacity>



                                        <TouchableOpacity style={{ width: '100%', alignSelf: 'center', marginTop: 10, justifyContent: 'center', alignItems: 'center' }} onPress={() => { this.setState({ modalVisible: false }); this.permmissionsendreport() }}>
                                            <View style={{ backgroundColor: Colors.mediabackground, borderRadius: 30, paddingVertical: mobileW * 3.5 / 100 }}>
                                                <Text style={{ fontFamily: Font.FontBold, textAlign: 'center', fontSize: mobileW * 4 / 100, color: Colors.pop_text_color }}>Report</Text>
                                            </View>
                                        </TouchableOpacity>
                                    </View>
                                    <View style={{ marginTop: 15, alignSelf: 'center', borderRadius: 10, backgroundColor: '#fff', width: '94%', justifyContent: 'center', alignItems: 'center', }}>
                                        <TouchableOpacity onPress={() => { this.setState({ modalVisible: false }) }} style={{ alignSelf: 'center', width: '94%', alignItems: 'center', justifyContent: 'center', paddingVertical: mobileW * 3.5 / 100 }}>
                                            <Text style={{ fontFamily: Font.FontBold, fontSize: mobileW * 4 / 100, color: "red" }}>{Lang_chg.cancelmedia[config.language]}</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View>
                        </Modal>
                        <Cameragallery mediamodal={this.state.mediamodal} Camerapopen={() => { this.Camerapopen() }}
                            Galleryopen={() => { this.Galleryopen() }}
                            Canclemedia={() => { this.setState({ mediamodal: false }) }}
                        />

                        <View
                            style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                height: (windowHeight * 10) / 100,
                                width: windowWidth * 100 / 100,
                                alignSelf: 'center',
                                backgroundColor: Colors.purewhite,
                                elevation: 10
                            }}>
                            <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', width: windowWidth * 0.67 }}>
                                <TouchableOpacity onPress={() => { this.goBack() }} style={{ justifyContent: 'center', height: windowHeight * 10 / 100, width: windowWidth * 8 / 100, marginLeft: 15 }}>
                                    <Image source={localimag.back} resizeMode='contain' style={{ height: windowHeight * 8 / 100, width: windowWidth * 8 / 100, alignSelf: 'center' }} />
                                </TouchableOpacity>

                                <View style={{ alignSelf: 'center', marginLeft: 10 }}>
                                    {
                                        (this.state.data.image != null && this.state.data.image != 'NA') ? <Image
                                            source={{ uri: config.img_url3 + this.state.data.image }}
                                            style={{
                                                width: (windowWidth * 14) / 100,
                                                height: (windowWidth * 14) / 100,
                                                resizeMode: 'cover',
                                                borderRadius: 100,
                                                alignSelf: 'center'
                                            }}
                                        />
                                            :
                                            <Image
                                                source={localimag.userr}
                                                style={{
                                                    width: (windowWidth * 14) / 100,
                                                    height: (windowWidth * 14) / 100,
                                                    resizeMode: 'cover',
                                                    borderRadius: 100,
                                                    alignSelf: 'center'
                                                }}
                                            />
                                    }

                                </View>
                                <View style={{ paddingLeft: 15, flexDirection: 'column', justifyContent: 'space-between' }} >
                                    <Text
                                        numberOfLines={1}
                                        style={{
                                            fontFamily: Font.Lato_Bold,
                                            fontFamily: 'Roboto-Bold',
                                            fontSize: (windowWidth * 3.8) / 100,
                                            width: windowWidth * 38 / 100,
                                        }}>
                                        {this.state.data.other_user_name}
                                    </Text>
                                    <Text
                                        numberOfLines={1}
                                        style={{
                                            fontFamily: Font.Lato_Bold,
                                            fontFamily: 'Roboto-Bold',
                                            fontSize: (windowWidth * 3) / 100,
                                            width: windowWidth * 38 / 100,
                                            color: (this.state.data.question_status == 1 || this.state.data.question_status == 0) ? "#07f70f" : Colors.theme_color
                                        }}>
                                        {(this.state.data.question_status == 1 || this.state.data.question_status == 0) ? 'Accepted' : 'Solved'}
                                    </Text>
                                    {/* <Text
                                        style={{
                                            fontFamily: Font.Lato_Regular,
                                            fontSize: (windowWidth * 3) / 100,
                                            color: (this.state.onlineStatus == 1) ? "#1bff0a" : 'red',
                                            width: windowWidth * 40 / 100,
                                        }}>
                                       
                                        Online
                                    </Text> */}

                                </View>

                            </View>

                            {
                                (this.state.user_type == 1 && this.state.data.question_status != 3) &&
                                <TouchableOpacity
                                    onPress={() => { this.questionSubmit() }}
                                    style={{ alignItems: 'center', justifyContent: "center" }}>
                                    <Text style={{ color: Colors.theme_color, fontSize: mobileW * 0.025 }}>Question Solved</Text>
                                </TouchableOpacity>

                            }
                             <TouchableOpacity
                                onPress={() => { this.getRatingStatus(0)}}
                                style={{ marginRight: 10 }}>
                                <Image
                                    source={localimag.Refres}
                                    style={{ height: windowWidth * 8 / 100, width: windowWidth * 0.08, resizeMode: 'contain' }}
                                />
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => { this.setState({ modalVisible: true }) }}
                                style={{ marginRight: 10 }}>
                                <Image
                                    source={localimag.more}
                                    style={{ height: windowWidth * 8 / 100, width: windowWidth * 0.08, resizeMode: 'contain' }}
                                />
                            </TouchableOpacity>
                        </View>



                        <View style={{ paddingBottom: 290, width: '95%', alignSelf: 'center', paddingTop: 10 }}>
                            {/* <View style={{ marginBottom: 10 }}>
                            <Text style={{ textAlign: 'justify', fontFamily: Font.regular, color: '#ADA8A8' }}>Q. {this.state.data.question}  </Text>
                            <Image source={(this.state.data.document != 'NA' || this.state.data.document != null) ? { uri: config.img_url1 + this.state.data.document } : localimag.default} style={{ marginTop: 10, width: windowWidth, height: windowHeight * 0.25 }} resizeMode="cover" />
                        </View> */}
                            <FlatList
                                data={this.state.data1}
                                showsVerticalScrollIndicator={false}
                                // onRefresh={() => this._onRefresh()}
                                // refreshing={this.state.refresh}
                                ref={ref => (this.FlatListRef = ref)} // assign the flatlist's ref to your component's FlatListRef...
                                onContentSizeChange={() => this.FlatListRef.scrollToEnd()} // scroll it
                                contentContainerStyle={{ marginBottom:  mobileW*40/100 }}
                                keyboardDismissMode='interactive'
                                keyboardShouldPersistTaps='always'

                                renderItem={({ item, index }) => {
                                    return (
                                        <View style={{ width: '97%', alignSelf: 'center', paddingVertical: 7 }}>

                                            {
                                                index == 0 &&
                                                <View style={{ marginBottom: 10 }}>
                                                    <Text style={{ textAlign: 'left', fontFamily: Font.regular, color: '#ADA8A8' }}>Q. {this.state.data.question}  </Text>


                                                    <TouchableOpacity
                                                        style={{
                                                            marginTop: 30,
                                                            flexDirection: 'row',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                            alignSelf: 'center',
                                                            width: windowWidth * 80 / 100,
                                                            backgroundColor: Colors.purewhite,
                                                            elevation: 10,
                                                            shadowColor: 'grey',
                                                            elevation: 5,
                                                            shadowOffset: { width: 2, height: 2, },
                                                            shadowOpacity: 0.3,
                                                            padding: 10, borderRadius: 5
                                                        }} onPress={() => { (this.state.data.document != null) ? this.setState({ imageModal: true, image_path: this.state.data.document }) : null }}>
                                                        <Image source={localimag.file} style={{ width: mobileH * 0.03, height: mobileH * 0.03, marginRight: 5 }} />
                                                        <Text style={{ textAlign: 'justify', fontFamily: Font.regular, color: '#000000', marginRight: 5 }}>{(this.state.data.document != null) ? 'File Uploaded' : 'No Document'}</Text>
                                                    </TouchableOpacity>

                                                </View>
                                            }



                                            {item.userid != this.state.user_id && <View style={{ alignItems: 'center', justifyContent: 'flex-start', flexDirection: 'row' }}>

                                                {item.messageType == 'text' && <View colors={Colors.theme_color} style={{ alignSelf: 'flex-start', width: '70%', justifyContent: 'center', borderRadius: 10, paddingVertical: 7, marginTop: 5, backgroundColor: Colors.theme_color }}>
                                                    <View style={{
                                                        paddingVertical: 5, paddingHorizontal: 8, alignSelf: 'flex-start',
                                                        borderTopRightRadius: 10,
                                                        borderBottomLeftRadius: 10,
                                                        borderBottomRightRadius: 10,
                                                        flexDirection: 'row',
                                                        justifyContent: 'space-between',
                                                        width: '100%'
                                                    }}>
                                                        {item.messageType == 'text' && <Text style={{ fontSize: 14, fontFamily: Font.FontBold, color: '#fff', width: '80%' }}>{item.name}   </Text>}
                                                        <Text style={{ fontSize: 10, fontFamily: Font.FontRegular, color: '#fff', alignSelf: 'flex-end' }}>{item.time}</Text>
                                                    </View>
                                                </View>}
                                                {item.messageType == 'image' && <TouchableOpacity style={{ backgroundColor: Colors.theme_color, borderRadius: 3 }} activeOpacity={0.9} onPress={() => { (item.name != null) ? this.setState({ image_path: item.name, imageModal: true }) : null }}>
                                                    <View colors={Colors.theme_color} style={{ borderRadius: 10, paddingBottom: 5, justifyContent: 'center' }}>
                                                        <Image source={{ uri: config.img_url + item.name }} style={{ width: BannerWidth * 42 / 100, height: BannerHieght * 30 / 100, borderRadius: 5 }} />
                                                        <Text style={{ fontSize: 10, fontFamily: Font.FontRegular, color: '#fff', alignSelf: 'flex-end' }}>{item.time}</Text>
                                                    </View>
                                                </TouchableOpacity>}


                                            </View>}
                                            {item.userid == this.state.user_id && <View style={{ alignItems: 'center', justifyContent: 'flex-end', flexDirection: 'row', }}>
                                                {item.messageType == 'text' && <View style={{ width: '70%', alignSelf: 'flex-end', borderRadius: 10, paddingVertical: 7, justifyContent: 'center', marginBottom: 5, backgroundColor: 'grey' }}>
                                                    <View style={{
                                                        backgroundColor: Colors.appColor, borderTopLeftRadius: 10,
                                                        borderBottomLeftRadius: 10,
                                                        borderBottomRightRadius: 10,
                                                        paddingVertical: 5,
                                                        paddingHorizontal: 8,
                                                        backgroundColor: 'grey',
                                                        alignSelf: 'flex-end', flexDirection: 'row', justifyContent: 'space-between', width: '100%'
                                                    }}>
                                                        <Text style={{ fontSize: 10, fontFamily: Font.FontSemiBold, color: '#FFFFFF', alignSelf: 'flex-end', width: '20%' }}>{item.time}</Text>
                                                        {item.messageType == 'text' && <Text style={{ fontSize: 14, fontFamily: Font.FontBold, color: '#fff', width: '80%', textAlign: 'right' }}>{item.name}</Text>}


                                                    </View>

                                                </View>}
                                                {item.messageType == 'image' && <TouchableOpacity style={{ backgroundColor: 'grey', borderRadius: 3 }} activeOpacity={0.9} onPress={() => { (item.name != null) ? this.setState({ image_path:item.name, imageModal: true }) : null }}>
                                                    <View colors={Colors.theme_color} style={{ borderRadius: 10, paddingBottom: 5, justifyContent: 'center' }}>
                                                        <Image source={{ uri: config.img_url3+item.name }} style={{ width: BannerWidth * 42 / 100, height: BannerHieght * 30 / 100, borderRadius: 5 }} />
                                                        <Text style={{ fontSize: 10, fontFamily: Font.FontRegular, color: '#fff', alignSelf: 'flex-end' }}>{item.time}</Text>
                                                    </View>
                                                </TouchableOpacity>}

                                            </View>
                                            }
                                        </View>
                                    )
                                }}
                            />

                        </View>


                        <View style={{ position: 'absolute', borderTopWidth: 0, bottom: Platform.OS === 'ios' ? this.state.bottom : 0, left: 0, right: 0, paddingVertical: 7.5 }}>


                            {
                                (this.state.user_type == 1) &&
                                <View>
                                    {
                                        (this.state.data.question_status == 3 && this.state.rating_status == 0) &&
                                        <TouchableOpacity style={{ backgroundColor: Colors.theme_color, alignSelf: 'center', height: windowHeight * 8 / 100, width: windowWidth * 100 / 100, alignItems: 'center', justifyContent: 'center' }} onPress={() => {
                                            // this.props.navigation.navigate('RatingReviewPopup', {
                                            //     data: this.state.data
                                            // })
                                            this.props.navigation.navigate('RatingReviewUser', {
                                                data: this.state.data
                                            })
                                        }}>
                                            <Text style={{ color: "#fff", fontSize: 15, textAlign: 'center', fontFamily: Font.FontBold }}>Rate Now</Text>
                                        </TouchableOpacity>
                                    }
                                    {/* {
                                        (this.state.question_status == 1 && this.state.rating_status == 1) &&
                                        <TouchableOpacity style={{ backgroundColor: Colors.theme_color, alignSelf: 'center', height: windowHeight * 8 / 100, width: windowWidth * 100 / 100, alignItems: 'center', justifyContent: 'center' }} onPress={() => { null }}>
                                            <Text style={{ color: "#fff", fontSize: 15, textAlign: 'center', fontFamily: Font.FontBold }}>Your question is solved, So you can't chat</Text>
                                        </TouchableOpacity>
                                    } */}
                                    {
                                        (this.state.data.question_status == 3 && this.state.rating_status == 1) &&
                                        <View style={{ position: 'absolute', bottom: -10 }}>
                                            {
                                                (this.state.ratting_arr != 'NA') &&
                                                <TouchableOpacity style={{ backgroundColor: "#fff", alignSelf: 'center', height: windowHeight * 15 / 100, width: windowWidth * 100 / 100, justifyContent: 'center', paddingLeft: 20, shadowColor: '#000000', shadowOffset: { width: 2, height: 2, }, shadowOpacity: 0.20, elevation: 20, }} onPress={() => { null }}>
                                                    <Text style={{ color: '#000', fontSize: mobileW * 2.5 / 100 }}>{this.state.ratting_arr.timestamp}</Text>
                                                    <View style={{ justifyContent: "flex-start" }}>
                                                        <StarRating
                                                            containerStyle={{ width: windowWidth * 20 / 100, height: windowHeight * 3 / 100, marginTop: mobileW * 0.5 / 100 }}
                                                            fullStar={localimag.star}
                                                            emptyStar={localimag.stargrey}
                                                            halfStarColor={'#FFC815'}
                                                            disabled={true}
                                                            maxStars={5}
                                                            starSize={mobileW * 4 / 100}
                                                            rating={this.state.ratting_arr.rating}
                                                        />
                                                        <Text numberOfLines={1} style={{ fontFamily: Font.bold, fontSize: mobileW * 4 / 100, color: '#000' }}>{this.state.ratting_arr.review}</Text>
                                                    </View>
                                                </TouchableOpacity>
                                            }

                                        </View>
                                    }
                                                      
                                      <View style={{position:'absolute',borderTopWidth:0.6,bottom:Platform.OS === 'ios'?this.state.bottom:0,left:0,right:0,borderTopColor:'#FFFFFF',paddingVertical:7.5,backgroundColor:'white'}}>
                                    {
                                        this.state.data.question_status != 3 &&
                                        <View style={{ backgroundColor: Colors.theme_color, alignSelf: 'center', height: windowHeight * 8 / 100, width: windowWidth * 100 / 100, flexDirection: 'row', alignItems: 'center' }}>
                                            <TouchableOpacity onPress={() => { this.setState({ mediamodal: true }) }} style={{ width: mobileW * 10 / 100 }} >
                                                <Image source={localimag.plusin} style={{ height: windowHeight * 8 / 100, width: windowWidth * 8 / 100, resizeMode: 'contain', alignSelf: 'center' }} />
                                            </TouchableOpacity>
                                            <TextInput
                                                style={{ backgroundColor: Colors.purewhite, paddingLeft: 15, fontSize: windowHeight * 2 / 100, height: windowHeight * 6.5 / 100, width: windowWidth * 80 / 100, color: 'black', borderRadius: 5 }}
                                                placeholder='Write a message'
                                                placeholderTextColor={'#000'}
                                                ref={(input) => { this.chatmsg = input; }}
                                                onChangeText={(txt) => { this.setState({ chatmsg: txt }) }}
                                                keyboardType="default"
                                                onFocus={() => { this.setState({ Numberbtn: 1, bottom: 43 }); }}
                                                blurOnSubmit={true}
                                                scrollEnabled={true}
                                                onSubmitEditing={() => { this.setState({ bottom: 0 }) }}
                                            />
                                            {this.state.chatmsg.length > 0 &&
                                                <TouchableOpacity onPress={() => { this.sendmessagebtn() }} style={{ width: mobileW * 10 / 100, justifyContent: 'center' }}>
                                                    <Image source={localimag.send} style={{ height: windowHeight * 8 / 100, width: windowWidth * 8 / 100, resizeMode: 'contain', alignSelf: 'center' }} />
                                                </TouchableOpacity>}
                                        </View>
                                    }
                                    </View>
                                </View>
                            }




                            {
                                (this.state.user_type == 2) &&
                                <View>
                                    {
                                        (this.state.data.question_status == 3 && this.state.rating_status == 0) &&
                                        <TouchableOpacity style={{ backgroundColor: Colors.theme_color, alignSelf: 'center', height: windowHeight * 8 / 100, width: windowWidth * 100 / 100, alignItems: 'center', justifyContent: 'center' }} onPress={() => { null }}>
                                            <Text style={{ color: "#fff", fontSize: 15, textAlign: 'center', fontFamily: Font.FontBold }}>Your question is solved, So you can't chat</Text>
                                        </TouchableOpacity>
                                    }
                                    {
                                        (this.state.data.question_status == 3 && this.state.rating_status == 1) &&
                                        <View style={{ position: 'absolute', bottom: -10 }}>
                                            {
                                                (this.state.ratting_arr != 'NA') &&
                                                <TouchableOpacity style={{ backgroundColor: "#fff", alignSelf: 'center', height: windowHeight * 15 / 100, width: windowWidth * 100 / 100, justifyContent: 'center', paddingLeft: 20, shadowColor: '#000000', shadowOffset: { width: 2, height: 2, }, shadowOpacity: 0.20, elevation: 20, }} onPress={() => { null }}>
                                                    <Text style={{ color: '#000', fontSize: mobileW * 2.5 / 100 }}>{this.state.ratting_arr.timestamp}</Text>
                                                    <View style={{ justifyContent: "flex-start" }}>
                                                        <StarRating
                                                            containerStyle={{ width: windowWidth * 20 / 100, height: windowHeight * 3 / 100, marginTop: mobileW * 0.5 / 100 }}
                                                            fullStar={localimag.star}
                                                            emptyStar={localimag.stargrey}
                                                            halfStarColor={'#FFC815'}
                                                            disabled={true}
                                                            maxStars={5}
                                                            starSize={mobileW * 4 / 100}
                                                            rating={this.state.ratting_arr.rating}
                                                        />
                                                        <Text numberOfLines={1} style={{ fontFamily: Font.bold, fontSize: mobileW * 4 / 100, color: '#000' }}>{this.state.ratting_arr.review}</Text>
                                                    </View>
                                                </TouchableOpacity>
                                            }

                                        </View>
                                    }
                                    <View style={{position:'absolute',borderTopWidth:0.6,bottom:Platform.OS === 'ios'?this.state.bottom:0,left:0,right:0,borderTopColor:'#FFFFFF',paddingVertical:7.5,backgroundColor:'white'}}>
                                    {
                                        this.state.data.question_status != 3 &&
                                        <View style={{ backgroundColor: Colors.theme_color, alignSelf: 'center', height: windowHeight * 8 / 100, width: windowWidth * 100 / 100, flexDirection: 'row', alignItems: 'center' }}>
                                            <TouchableOpacity onPress={() => { this.setState({ mediamodal: true }) }} style={{ width: mobileW * 10 / 100 }} >
                                                <Image source={localimag.plusin} style={{ height: windowHeight * 8 / 100, width: windowWidth * 8 / 100, resizeMode: 'contain', alignSelf: 'center' }} />
                                            </TouchableOpacity>
                                            <TextInput
                                                style={{ backgroundColor: Colors.purewhite, paddingLeft: 15, fontSize: windowHeight * 2 / 100, height: windowHeight * 6.5 / 100, width: windowWidth * 80 / 100, color: 'black', borderRadius: 5 }}
                                                placeholder='Write a message'
                                                placeholderTextColor={'#000'}
                                                ref={(input) => { this.chatmsg = input; }}
                                                onChangeText={(txt) => { this.setState({ chatmsg: txt }) }}
                                                keyboardType="default"
                                                onFocus={() => { this.setState({ Numberbtn: 1, bottom: 43 }); }}
                                                blurOnSubmit={true}
                                                scrollEnabled={true}
                                                onSubmitEditing={() => { this.setState({ bottom: 0 }) }}
                                            />
                                            {this.state.chatmsg.length > 0 &&
                                                <TouchableOpacity onPress={() => { this.sendmessagebtn() }} style={{ width: mobileW * 10 / 100, justifyContent: 'center' }}>
                                                    <Image source={localimag.send} style={{ height: windowHeight * 8 / 100, width: windowWidth * 8 / 100, resizeMode: 'contain', alignSelf: 'center' }} />
                                                </TouchableOpacity>}
                                        </View>
                                    }
                                    </View>
                                </View>
                            }


                        </View>
                    </View>
                </View>
                // </KeyboardAvoidingView>

            )
        }

    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF'
    },
    button: {
        backgroundColor: Colors.appColor,
        width: '90%',
        borderRadius: 8,
        paddingVertical: 8.5,
        marginTop: 7,
        marginTop: 10,
        alignSelf: 'center',
        alignItems: 'center'
    },


})