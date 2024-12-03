import React, { Component } from 'react'
import { Text,Modal,RefreshControl, View, TouchableOpacity,Alert, SafeAreaView, Dimensions, FlatList, StatusBar, Image, ScrollView, BackHandler, StyleSheet,NativeEventEmitter,PermissionsAndroid,Platform } from 'react-native'
import { config, Otpprovider, Mapprovider, apifuntion, Colors, Font, validation, mobileH, mobileW, SocialLogin, Cameragallery, mediaprovider, localStorage, Lang_chg, consolepro, msgProvider, msgTitle, msgText, Currentltlg } from './Providers/utilslib/Utils'
import { localimag } from './Providers/Localimageprovider/Localimage'
import StarRating from 'react-native-star-rating';
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
import Footer from './Providers/Footer';
import { WebView } from 'react-native-webview';
// import RNZoomUsBridge, {RNZoomUsBridgeEventEmitter} from '@mokriya/react-native-zoom-us-bridge';
// const meetingEventEmitter = new NativeEventEmitter(RNZoomUsBridgeEventEmitter);
   import ZoomUs,{ ZoomEmitter } from 'react-native-zoom-us';
  const zoomEmitter = new NativeEventEmitter(ZoomEmitter);

  const ZOOM_APP_KEY = "oc1OTAxoNljYnC1kxR911EoZ1DDQ0WudDUpY";
  const ZOOM_APP_SECRET = "CzEiM5kAYI50VO4ptj9FSC4gm4FY4XFHgeTU";
  const ZOOM_JWT_APP_KEY = "xOjErDodQMW5_GxN8b0uCg";
  const ZOOM_JWT_APP_SECRET = "6BcZDbMj4dkusQkZYGt5nLKTSDc5YtISGiQ4";


export default class JoinClassDetails extends Component {
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
            webviewshow:false,
            expert_name: '',
            about_me: '',
            rating: '',
            image: '',
            video_price:0,
            session_arr: 'NA',
            footer_image: null,
            meetingId: '',
            meetingPassword: '',
            txn_date_time:'',
            transaction_id:'',
            amount:'',
              pay_condition:false,
            meetingTitle: '',
            userName: '',
            userEmail: '',
            refresh: false,
            userId: '',
            accessToken: '',
            userZoomAccessToken: '',
        }
        this.initializeZoomSDK();
        this.setUserType();

     

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
        //-------zoom end------------//


    }
    backpress = () => {
        this.props.navigation.goBack();
    }
    
    _onRefresh = () => {
        this.setState({ refresh: true })
        this.getClassDetails(1)
      }

    setUserType = async () => {
        let result = await localStorage.getItemObject('user_arr')
        if (result != null) {
            this.setState({
                footer_image: result.image
            })
        }
    }

    componentDidMount = async () => {
        this.props.navigation.addListener('focus', () => {
            this.getClassDetails(0);
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

    startpermission=async(type)=>{

        if(Platform.OS === 'ios')
        {
             if (type == 'sub') {
                await ZoomUs.joinMeeting({
                    userName:this.state.userName.toString(),
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
     _onNavigationStateChange(webViewState) {
        webViewState.canGoBack = false
        if (webViewState.loading == false) {
            // console.log('webViewState', webViewState);
            // console.log(webViewState.url)
            var t = webViewState.url.split('/').pop().split('?')[0]
            if (typeof (t) != null) {
                var p = webViewState.url.split('?').pop().split('&')
                // console.log('file name', t);
                if (t == 'payment_success.php') {

                    var payment_id=0;
                    //  console.log('p.length', p.length);
                    //  console.log('p.length', p);;

                    for (var i = 0; i < p.length; i++) {
                        var val = p[i].split('=');
                        console.log('val', val);
                        if (val[0] == "payment_id") {
                            payment_id = val[1]
                            console.log('val[1]',val[1])
                        }
                    }
                       console.log('payment_id',payment_id)
                       if(this.state.pay_condition==false){
                           this.setState({pay_condition:true})
                        setTimeout(()=>{
                            msgProvider.toast('Payment transfer successfully', 'center');
                            this.data_add_click(payment_id);
                         },500)
                       }
                      
                  
    
                    
                }  else if (t == 'payment_cancel.php') {
                   
                        this.props.navigation.goBack()
                
                    msgProvider.toast('Payment unsuccessful', 'center');
                    return false
                }
                // else if (t == 'payment_failed.php') {
                //     msgProvider.alert(msgTitle.information[config.language], "Payment unsuccessful", false);
                //     this.props.navigation.goBack();
                // }
            }
        }
    }

    

    data_add_click=async(payment_id)=>{
        let user_details = await localStorage.getItemObject('user_arr');
     
        let transaction_id = payment_id
       
   
        let url = config.baseURL + "joinClassPayment.php?user_id="+user_details.user_id+'&amount='+this.state.video_price+'&class_id='+this.state.class_id+'&txn_id='+transaction_id;
        console.log('url', url)
        
         apifuntion.getApi(url).then((obj) => {
          console.log('obj',obj)
      if (obj.success == 'true') {
  this.setState({webviewshow:false})
  setTimeout( () => {
     this.getClassDetails(1);
  },500);



 } else {
    
      msgProvider.alert(msgTitle.information[config.language], obj.msg[config.language], false);
      
      return false;
      }
      }).catch((error)=>{
      console.log("-------- error ------- " + error);
      })
      }

    //---------------------------------------------------//

    getClassDetails = async (page) => {
        consolepro.consolelog('getClassDetails');
        let user_details = await localStorage.getItemObject('user_arr');
        let class_id = this.state.class_id;
        this.setState({ class_id: class_id,userName:user_details.name })
        consolepro.consolelog('class_id', class_id);
        consolepro.consolelog('user_details_ba', user_details);
        let url = config.baseURL + "getClassesDetails.php?user_id=" + user_details.user_id + "&class_id=" + this.state.class_id;
        consolepro.consolelog(url)
        apifuntion.getApi(url,page).then((obj) => {
            consolepro.consolelog('obj', obj)
            if (obj.success == "true") {
                this.setState({
                    class_details_arr: obj.class_details_arr, speciality_name: obj.class_details_arr.speciality_name,
                    topic_description: obj.class_details_arr.topic_description, title: obj.class_details_arr.title,
                    expert_name: obj.class_details_arr.name, image: obj.class_details_arr.image,
                    rating: obj.class_details_arr.rating, about_me: obj.class_details_arr.about_me,meetingId:obj.class_details_arr.meeting_id,meetingPassword:obj.class_details_arr.meeting_password,video_price:obj.class_details_arr.video_price
                })
                consolepro.consolelog('class_details_arr', obj.class_details_arr);
                this.setState({ session_arr: obj.session_arr,refresh:false })
                this.setState({ payment_status: obj.session_arr.payment_status,payment_arr:obj.payment_arr })
                if(obj.payment_arr !='NA')
                {
                    let item= obj.payment_arr
                    this.setState({amount:item.amount,transaction_id:item.txn_id,txn_date_time:item.txn_date_time})
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

    //--------------------************----------------------//

    render() {
        consolepro.consolelog('speciality_name', this.state.speciality_name)
        return (
            <View style={{ flex: 1, }}>
<Modal
                    animationType="slide"
                    transparent={false}
                    visible={this.state.webviewshow}
                    onRequestClose={() => {
                        this.setState({ webviewshow: false })
                    }}>

                    <View style={{ flex: 1 }}>
                        <SafeAreaView style={{ flex: 0, backgroundColor: Colors.theme_color }} />
                        <StatusBar backgroundColor={Colors.theme_color} barStyle='default' hidden={false} translucent={false}
                            networkActivityIndicatorVisible={true} />
                        <View style={{ alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between', paddingTop: mobileW * 5 / 100, paddingHorizontal: mobileW * 4 / 100 }}>
                            <TouchableOpacity activeOpacity={0.9} onPress={() => { this.setState({ webviewshow: false }) }}>
                                <Image resizeMode="contain" style={{ width: 30, height: 30 }} source={localimag.back}></Image>
                            </TouchableOpacity>
                            <Text style={{
                                color: '#000',
                                fontFamily: Font.medium,
                                fontSize: windowWidth * 5.2 / 100,
                                letterSpacing: 0.5
                            }}>Payment</Text>
                            <Text></Text>
                        </View>

                        <View style={{ flex: 1, backgroundColor: 'white' }}>
                            {
                                this.state.webviewshow == true &&
                                <WebView
                                    source={{ uri: config.baseURL + 'stripe_payment/payment_url.php?user_id=' + this.state.user_id + '&order_id=' + this.state.class_id + '&descriptor_suffix=genius_genie&transfer_user_id=0&transfer_amount=0&amount=' + this.state.video_price }}
                                    onNavigationStateChange={this._onNavigationStateChange.bind(this)}
                                    javaScriptEnabled={true}
                                    domStorageEnabled={true}
                                    startInLoadingState={false}
                                    containerStyle={{ marginTop: 20, flex: 1 }}
                                    textZoom={100}
                                />
                            }
                        </View>
                    </View>
                </Modal>

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
                <ScrollView refreshControl={
          <RefreshControl
            refreshing={this.state.refresh}
            onRefresh={this._onRefresh}
            tintColor='black'
          />}  contentContainerStyle={{ paddingBottom: 80 }}>
                    <View style={{}}>
                        <View style={{ width: mobileW * 90 / 100, alignSelf: 'center', paddingVertical: 15 }}>
                            <View style={{ justifyContent: 'center', alignItems: 'flex-start' }}>
                                <Text style={{ fontSize: mobileW * 4 / 100, fontFamily: Font.bold }}>{this.state.speciality_name}</Text>
                                <Text style={{ fontSize: mobileW * 5.5 / 100, fontFamily: Font.medium }}>{this.state.title}</Text>
                                <Text style={{ fontSize: mobileW * 4.5 / 100, fontFamily: Font.medium }}>{this.state.topic_description}</Text>
                            </View>
                            <Text style={{ fontSize: mobileW * 4 / 100, fontFamily: Font.bold, marginBottom: 20 }}>Expert</Text>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                <View style={{ width: mobileW * 20 / 100, height: mobileW * 20 / 100, alignItems: 'center', justifyContent: 'center' }}>
                                    <Image source={this.state.image == '' ? localimag.default : { uri: config.img_url3 + this.state.image }} style={{ width: mobileW * 22 / 100, height: mobileW * 22 / 100, borderRadius: 100 }} />
                                </View>
                                <View style={{ marginLeft: 10, width: mobileW * 72 / 100, }}>
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: mobileW * 70 / 100 }}>
                                        <Text style={{ fontFamily: 'Roboto-Bold', fontSize: mobileW * 4 / 100 }}>{this.state.expert_name}</Text>
                                        <View style={{ flexDirection: 'row', alignItems: 'center', width: mobileW * 23 / 100, }}>
                                            <StarRating
                                                containerStyle={{ width: windowWidth * 16 / 100, height: windowHeight * 3 / 100, alignSelf: 'center', justifyContent: 'center', alignItems: 'center' }}
                                                fullStar={localimag.star}
                                                emptyStar={localimag.stargrey}
                                                halfStarColor={'#FFC815'}
                                                disabled={true}
                                                maxStars={5}
                                                starSize={mobileW * 3 / 100}
                                                rating={this.state.rating == '' ? 0 : this.state.rating}
                                            />
                                            <Text style={{ color: Colors.theme_color, fontSize: mobileW * 3.2 / 100 }}>({this.state.rating == '' ? 0 : parseFloat(this.state.rating).toFixed(1)})</Text>
                                        </View>
                                    </View>
                                    <Text style={{ fontSize: mobileW * 3.3 / 100, fontFamily: 'Roboto-Medium' }}>{this.state.about_me}</Text>
                                </View>
                            </View>
                        </View>
                        <View style={{ marginTop: mobileW * 6 / 100 }}>
                            <Text style={{ fontSize: mobileW * 4 / 100, fontFamily: 'Roboto-Bold', paddingLeft: 20 }}>Sections</Text>
                            {this.state.session_arr == 'NA' && <View style={{ alignItems: 'center', justifyContent: 'center', height: '100%' }}><Image resizeMode="contain" style={{ width: '50%', height: '50%', }} source={localimag.nodataFound}></Image></View>}
                            {this.state.session_arr != 'NA' &&
                            <View>
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
                                                {item.payment_status == 1 && <TouchableOpacity onPress={() => { this.props.navigation.navigate('LiveStream') }}
                                                    style={{ backgroundColor: Colors.theme_color, width: mobileW * 18 / 100, justifyContent: 'center', alignItems: 'center', paddingVertical: 2 }}>
                                                    {item.status == 0 && <Text numberOfLines={1} style={{ fontSize: mobileW * 3 / 100, fontFamily: 'Roboto-Medium', color: Colors.purewhite }}>Join at {item.session_start_time}</Text>}
                                                    {item.status == 1 && <Text numberOfLines={1} style={{ fontSize: mobileW * 3 / 100, fontFamily: 'Roboto-Medium', color: Colors.purewhite }}>Join Now</Text>}
                                                    {item.status == 2 && <Text numberOfLines={1} style={{ fontSize: mobileW * 3 / 100, fontFamily: 'Roboto-Medium', color: Colors.purewhite }}>Watch Now</Text>}
                                                </TouchableOpacity>}
                                                {/* {item.button_status != 'Join Now' && <View style={{backgroundColor: Colors.theme_color,width:mobileW*18/100, justifyContent: 'center', alignItems: 'center', paddingVertical:2}}>
                                           <Text style={{fontSize: mobileW*3/100, fontFamily: 'Roboto-Medium', color: Colors.purewhite}}>{item.button_status}</Text>
                                       </View>} */}
                                            </View>)
                                    }}
                                    keyExtractor={(item, index) => index.toString()}>
                                </FlatList>
                                </View>
                                }
                        </View>
                        {
                            this.state.payment_arr != 'NA' &&
                            <>
                                <Text style={{ fontSize: mobileW * 4 / 100, fontFamily: 'Roboto-Bold', paddingLeft: 20, marginTop: 4 }}>Payments Details</Text>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', borderBottomWidth: 1, paddingVertical: 15, paddingHorizontal: 20 }}>
                                    <Text style={{ fontFamily: 'Roboto-Medium', fontSize: mobileW * 3.5 / 100 }}>Date</Text>
                                    <Text style={{ fontFamily: 'Roboto-Medium', fontSize: mobileW * 3.5 / 100 }}>{this.state.txn_date_time}</Text>
                                </View>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', borderBottomWidth: 1, paddingVertical: 15, paddingHorizontal: 20 }}>
                                    <Text style={{ fontFamily: 'Roboto-Medium', fontSize: mobileW * 3.5 / 100 }}>Transaction Id</Text>
                                    <Text style={{ fontFamily: 'Roboto-Medium', fontSize: mobileW * 3.5 / 100 }}>{this.state.transaction_id}</Text>
                                </View>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', borderBottomWidth: 1, paddingVertical: 15, paddingHorizontal: 20 }}>
                                    <Text style={{ fontFamily: 'Roboto-Medium', fontSize: mobileW * 3.5 / 100 }}>Amount</Text>
                                    <Text style={{ fontFamily: 'Roboto-Medium', fontSize: mobileW * 3.5 / 100 }}>${this.state.amount}</Text>
                                </View>
                            </>
                        }
                        {
                            this.state.payment_arr != 'NA' &&
                            <View style={{ width: mobileW * 84 / 100,marginTop:mobileW*5/100,  alignItems: 'center', justifyContent: 'center', alignSelf: 'center' }}>
                            <TouchableOpacity activeOpacity={1} onPress={() => { this.startpermission('sub') }}
                                style={{ width: mobileW * 84 / 100, height: mobileH * 7 / 100, backgroundColor: Colors.theme_color, borderRadius: 25, alignItems: 'center', justifyContent: 'center', alignSelf: 'center' }}>
                                <Text style={{ fontSize: mobileW * 4.2 / 100, fontFamily: Font.bold, color: Colors.purewhite }}>Join Class</Text>
                            </TouchableOpacity>
                            </View>
                        }
                        {
                            this.state.payment_arr == 'NA' &&
                            <View style={{ width: mobileW * 84 / 100,marginTop:mobileW*5/100,  alignItems: 'center', justifyContent: 'center', alignSelf: 'center' }}>
                            <TouchableOpacity activeOpacity={1} onPress={() => { this.setState({webviewshow:true}) }}
                                style={{ width: mobileW * 84 / 100, height: mobileH * 7 / 100, backgroundColor: Colors.theme_color, borderRadius: 25, alignItems: 'center', justifyContent: 'center', alignSelf: 'center' }}>
                                <Text style={{ fontSize: mobileW * 4.2 / 100, fontFamily: Font.bold, color: Colors.purewhite }}>Join Class (${this.state.video_price})</Text>
                            </TouchableOpacity>
                            </View>
                        }
                    </View>
                </ScrollView>
                <Footer
                    activepage='Classes'
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