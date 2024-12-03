import React, { Component } from 'react'
import { Alert, Text, View, TouchableOpacity, SafeAreaView, Dimensions, StatusBar, Image, ScrollView, FlatList, BackHandler, StyleSheet } from 'react-native'
import { config, Otpprovider, Mapprovider, apifuntion, Colors, Font, validation, mobileH, mobileW, SocialLogin, Cameragallery, mediaprovider, localStorage, Lang_chg, consolepro, msgProvider, msgTitle, msgText, Currentltlg } from './Providers/utilslib/Utils'
import { localimag } from './Providers/Localimageprovider/Localimage'
import Footer from './Providers/Footer';
import Footerr from './Providers/Footerr';
import HideWithKeyboard from 'react-native-hide-with-keyboard';
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
const demoArray1 = [
    { title: localimag.person2, name: "Andrew", message: "John Miller has given me the answer of your question", number: 1, time: 'Now', ratinMessage: 'see the rating' },
    { title: localimag.person2, name: "Andrew", message: "Your Payment has succesfully started now", number: 9, time: '7m ago' },
    { title: localimag.person5, name: "Samantha", message: "your otp is 7798", number: 7, time: '9m ago' },
    { title: localimag.person6, name: "Jennifer", message: "You have successfully registered", number: 6, time: '18m ago' },
];
export default class Notification extends Component {
    _didFocusSubscription;
    _willBlurSubscription;
    constructor(props) {
        super(props)
        this.state = {
            status: '',
            notification_arr: "NA",
            footer_image: null,
            count_noti: 0,
            user_type: 0
        }
        this._didFocusSubscription = props.navigation.addListener('focus', payload =>
            BackHandler.addEventListener('hardwareBackPress', this.handleBackPress)
        );
    }
    backpress = () => {
        this.props.navigation.goBack();
    }
    getAllData = async () => {
        consolepro.consolelog('getAllData')
        let user_details = await localStorage.getItemObject('user_arr');
        consolepro.consolelog('user_details', user_details)
        let footer_image = user_details.image;
        consolepro.consolelog('footer_image', footer_image)
        this.setState({ footer_image: footer_image, user_type: user_details.user_type })

    }
    componentDidMount() {
        // alert(count_inbox)
        this._willBlurSubscription = this.props.navigation.addListener('blur', payload =>
            BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress)
        );
        this.props.navigation.addListener('focus', () => {
        });
        this.getNotification();
        this.getAllData();
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
        ); // works best when the goBack is async
        return true;
    };

    //-------------------------------------------------------//


    _deleteNoti = async (type, notification_message_id, index) => {
        if (type == 'single') {
            Alert.alert(
                Lang_chg.Confirm[config.language],
                Lang_chg.msgConfirmTextNotifyDeleteMsg[config.language], [{
                    text: Lang_chg.No[config.language],
                    onPress: () => console.log('Cancel Pressed'),
                    style: Lang_chg.cancel[config.language],
                }, {
                    text: Lang_chg.Yes[config.language],
                    onPress: () => { this.deleteNotification(type, notification_message_id, index) }
                }], {
                cancelable: false
            });
            return true;
        } else {
            Alert.alert(
                Lang_chg.Confirm[config.language],
                Lang_chg.msgConfirmTextNotifyAllDeleteMsg[config.language], [{
                    text: Lang_chg.No[config.language],
                    onPress: () => console.log('Cancel Pressed'),
                    style: Lang_chg.cancel[config.language],
                }, {
                    text: Lang_chg.Yes[config.language],
                    onPress: () => { this.deleteNotification(type, notification_message_id, index) }
                }], {
                cancelable: false
            });
            return true;
        }
    }









    getNotification = async () => {
        consolepro.consolelog('getNotification');
        let user_details = await localStorage.getItemObject('user_arr');
        this.setState({ user_type: user_details.user_type })
        consolepro.consolelog('user_details_ba', user_details);
        let url = config.baseURL + "getNotification.php?user_id=" + user_details.user_id;
        consolepro.consolelog(url)
        apifuntion.getApi(url).then((obj) => {
            consolepro.consolelog('obj', obj)
            if (obj.success == "true") {
                this.setState({ notification_arr: obj.notification_arr, count_noti: obj.count_noti })
                consolepro.consolelog('notification_arr', obj.notification_arr)
                consolepro.consolelog('notification_arr', this.state.notification_arr)
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

    //----------------************-----------------//

    deleteNotification = async (type, notification_message_id, index) => {
        consolepro.consolelog('deleteNotification');
        let user_details = await localStorage.getItemObject('user_arr');
        consolepro.consolelog('user_details_ba', user_details);
        let url = config.baseURL + "deleteNotification.php?user_id=" + user_details.user_id + "&type=" + type + "&notification_id=" + notification_message_id;
        consolepro.consolelog(url)
        apifuntion.getApi(url).then((obj) => {
            consolepro.consolelog('obj', obj)
            if (obj.success == "true") {
                if (type == 'single') {
                  let data6 =this.state.notification_arr
                    data6.splice(index,1)
                    if(data6.length<=0)
                           {
                            data6='NA';
                           }
                      
                        this.setState({notification_arr:data6})
                   
                } else {
                    this.setState({
                        notification_arr: 'NA',
                    })
                }
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
    //-----------------------------------------------------------//

    openUrl(action, action_id, other_user_id,item) {
        if (action == 'rate_now') {
            this.props.navigation.navigate('RatingReview');
            return false;
        }
        if (action == 'ask_ques' ) {
            this.props.navigation.navigate('ExpertHome');
            return false;
        }
        if (action == 'subscription_active') {
            this.props.navigation.navigate('SubscriptionHistory', { prvious_page: 'Notification' });
            return false;
        }
        if (action == 'Accept') {
            // this.props.navigation.navigate('MyQuestion');
            this.props.navigation.navigate('MyQuestion',{ 'chatdata': { 'other_user_id': item.user_id, 'other_user_name': item.user_name, 'image': item.user_image, blockstatus: 'no', 'question_id': item.action_id, 'question': item.question, 'document': item.document, 'question_status': item.question_status }})
            return false;
        }
        if (action == 'video_subscription_active') {
            this.props.navigation.navigate('SubscriptionHistory', { prvious_page: 'Notification' });
            return false;
        }
        if(action=='vedio_request')
        {
            this.props.navigation.navigate('Chat',{ 'chatdata': { 'other_user_id': item.user_id, 'other_user_name': item.user_name, 'image': item.user_image, blockstatus: 'no', 'question_id': item.action_id, 'question': item.question, 'document': item.document, 'question_status': item.question_status }})
        }
        if(action=='vedio_request_accept')
        {
            this.props.navigation.navigate('Chat',{ 'chatdata': { 'other_user_id': item.user_id, 'other_user_name': item.user_name, 'image': item.user_image, blockstatus: 'no', 'question_id': item.action_id, 'question': item.question, 'document': item.document, 'question_status': item.question_status }})
        }
    }



    render() {
        return (
            <View style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
                <SafeAreaView style={{ flex: 0, backgroundColor: Colors.theme_color }} />
                <StatusBar backgroundColor={Colors.theme_color} barStyle='default' hidden={false} translucent={false}
                    networkActivityIndicatorVisible={true} />
                <View style={{ flexDirection: "row", height: mobileH * 0.090, paddingHorizontal: mobileW * 0.04, zIndex: 99999, backgroundColor: Colors.theme_color }}>
                    <View style={{ flex: 1, justifyContent: "center" }}>
                        <TouchableOpacity activeOpacity={1} style={{ flexDirection: "row", alignItems: "center" }}
                            onPress={() => { this.props.navigation.goBack() }}
                        >
                            <View style={{ height: 44, width: 44, borderRadius: 3, alignItems: 'flex-start', justifyContent: 'center', }}>
                                {/* <Image source={require('./icons/back_button.png')} style={styles.headerBackIcon} /> */}
                            </View>
                        </TouchableOpacity>
                    </View>
                    <View style={{ flex: 2, justifyContent: "center", }}>
                        <Text style={{
                            fontFamily: Font.bold,
                            fontSize: windowWidth * 5.2 / 100,
                            alignSelf: 'center',
                            textAlign: 'center',
                            color: "#fff",

                        }}>{"Notifications"}</Text>
                    </View>
                    <TouchableOpacity activeOpacity={0.7} style={{ flex: 1, alignItems: 'flex-end', justifyContent: 'center' }} onPress={() => { this._deleteNoti('all', 0, 0) }}>
                        <Text style={[styles.OrderHistoryTitlee, { textAlign: "right" }]}>Clear</Text>
                    </TouchableOpacity>
                </View>
                <View style={{ width: mobileW * 100 / 100 }}>
                    {this.state.notification_arr == 'NA' && <View style={{ height: mobileH * 80 / 100, justifyContent: 'center', alignItems: 'center' }}>
                        <Image source={localimag.nodataFound} style={{ width: mobileW * 80 / 100, height: mobileW * 60 / 100 }} />
                    </View>}
                    {this.state.notification_arr != 'NA' &&
                        <FlatList
                            data={this.state.notification_arr}
                            showsVerticalScrollIndicator={false}
                            contentContainerStyle={{paddingBottom: mobileW*45/100 }}
                            renderItem={({ item, index }) => {
                                return (
                                    <TouchableOpacity onPress={() => { this.openUrl(item.action, item.action_id, item.other_user_id,item) }} style={{ width: windowWidth * 100 / 100, height: mobileW * 25 / 100, alignItems: 'center', justifyContent: 'flex-start', alignSelf: 'center', borderBottomWidth: 1, borderColor: Colors.theme_color }}>
                                        <View style={{ flexDirection: 'row', width: windowWidth * 90 / 100, height: mobileW * 25 / 100, alignItems: 'center', justifyContent: 'flex-start', alignSelf: 'center', }}>
                                            <View style={{ width: mobileW * 20 / 100, }}>
                                                <Image resizeMode="cover" style={{ width: mobileW * 18 / 100, height: mobileW * 18 / 100, borderRadius: 100 }} source={(item.user_image == null) || (item.user_image == 'NA') ? localimag.default : { uri: config.img_url3 + item.user_image }}></Image>
                                            </View>
                                            <View style={{ marginLeft: 20, width: mobileW * 52 / 100 }}>
                                                <Text style={{ fontFamily: Font.bold, fontSize: mobileW * 5.2 / 100 }}>{item.user_name}</Text>
                                                <Text style={{ fontFamily: Font.medium, fontSize: mobileW * 3.6 / 100, color: '#D4D4D4' }}>{item.message}</Text>
                                                {this.state.status == false && <Text style={{ fontFamily: Font.medium, fontSize: mobileW * 3.4 / 100, color: Colors.theme_color }}>{item.ratinMessage}</Text>}
                                            </View>
                                            {/* {this.state.status != false && <View style={{ width: mobileW * 16 / 100, alignItems: 'center', justifyContent: 'center', marginBottom: mobileW * 2 / 100 }}>
                                            <TouchableOpacity onPress={() => { this._deleteNoti('single', item.notification_message_id, index) }}
                                                style={{ width: mobileW * 6 / 100, height: mobileH * 3 / 100, borderRadius: 40, alignItems: 'center', justifyContent: 'center' }}>
                                                <Image resizeMode="contain" style={{ width: mobileW * 8 / 100, height: mobileH * 5 / 100, }} source={localimag.cross}></Image>
                                            </TouchableOpacity>
                                            <Text style={{ fontFamily: Font.bold, fontSize: mobileW * 3.3 / 100, color: 'red' }}>{item.agotime}</Text>
                                        </View>}
                                        {this.state.status == false && */}
                                            <View style={{ width: mobileW * 20 / 100, alignItems: 'center', justifyContent: 'center', marginBottom: mobileW * 2 / 100 }}>
                                                <Text style={{ fontFamily: Font.bold, fontSize: mobileW * 3 / 100, color: '#D4D4D4' }}>{item.agotime} </Text>
                                                <TouchableOpacity onPress={() => { this._deleteNoti('single', item.notification_message_id, index) }} style={{ width: mobileW * 6 / 100, height: mobileH * 3 / 100, borderRadius: 40, alignItems: 'center', justifyContent: 'center', marginTop: 5 }}>
                                                    <Image resizeMode="contain" style={{ width: mobileW * 8 / 100, height: mobileH * 5 / 100, }} source={localimag.cross}></Image>
                                                </TouchableOpacity>
                                            </View>
                                            {/* } */}
                                        </View>
                                    </TouchableOpacity>)
                            }}
                            keyExtractor={(item, index) => index.toString()}>
                        </FlatList>}
                </View>
                {parseInt(this.state.user_type) == 1 && <View style={{ backgroundColor: '#FFFFFF', elevation: 4, height: mobileH * 6 / 100, position: 'absolute', bottom: 0, width: mobileW * 100 / 100, alignSelf: 'center', shadowColor: '#000000', shadowOffset: { width: 2, height: 2, }, shadowOpacity: 0.30 }}>
                    <Footer
                        activepage='Notification'
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
                        activepage='Notification'
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
        fontFamily: Font.bold,
        fontSize: windowWidth * 5.2 / 100,
        letterSpacing: 0.5
    },
    OrderHistoryTitlee: {
        color: Colors.white_color,
        fontFamily: Font.bold,
        fontSize: windowWidth * 4.5 / 100,
        letterSpacing: 0.5,
    },
});


