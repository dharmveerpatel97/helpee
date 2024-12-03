import React, { Component, createRef } from 'react'
import { Text, View, SafeAreaView, StatusBar, TouchableOpacity, Image, KeyboardAvoidingView, TextInput, Modal, ImageBackground, Dimensions, ScrollView, BackHandler, Alert, FlatList, Keyboard, StyleSheet, Platform } from 'react-native'
import { config, Otpprovider, Mapprovider, apifuntion, Colors, Font, validation, mobileH, mobileW, SocialLogin, Cameragallery, mediaprovider, localStorage, Lang_chg, consolepro, msgProvider, msgTitle, msgText, Currentltlg } from './Providers/utilslib/Utils'
import { localimag } from './Providers/Localimageprovider/Localimage';
import Carousel from 'react-native-snap-carousel';
import { WebView } from 'react-native-webview';
import { notification } from './Providers/NotificationProvider'

import Footer from './Providers/Footer';

const windowWidth = Dimensions.get('window').width;
export default class SubscriptionPlan1 extends Component {

    constructor(props) {
        super(props)
        this.state = {
            plan_id: 0,
            user_subscription_id: 0,
            user_id: 0,
            amount: 0,
            webviewshow: false,
            user_id: 0,
            activeIndex: 0,
            carouselItems: [
                {
                    title: "Pro Plan",
                    text: "$300",
                    question: '10'
                },
                {
                    title: "Basic Plan",
                    text: "$100",
                    question: '5'
                },
                {
                    title: "Master Plan",
                    text: "$500",
                    question: '25'
                },
            ],
            footer_image: null,
        }
        this.setUserType();
    }
    setUserType = async () => {
        let result = await localStorage.getItemObject('user_arr')
        if (result != null) {
            this.setState({
                footer_image: result.image
            })
        }
    }

    componentDidMount = () => {
        this.props.navigation.addListener('focus', () => {
            this.getSubscriptionPlan();
            this.setDetails();
            // this.insetSubscription(); 
        });

    }

    handleBackPress = () => {
        this.props.navigation.goBack()
    };

    setDetails = async () => {
        let user_details = await localStorage.getItemObject('user_arr');
        consolepro.consolelog('user_details', user_details);
        let user_id = user_details.user_id;
        this.setState({ user_id: user_id });
    }

    //-------------------------------------------//

    payment_status_update = async (transaction_id) => {


        consolepro.consolelog('payment_status_update');
        let user_details = await localStorage.getItemObject('user_arr');
        consolepro.consolelog('user_details', user_details);
        consolepro.consolelog('this.state.plan_id', this.state.plan_id)
        let url = config.baseURL + "payment_status_update.php";
        consolepro.consolelog('url', url)
        let data = new FormData();
        data.append('user_id', user_details.user_id)
        data.append('txn_id', transaction_id)
        data.append('plan_id', this.state.plan_id)
        data.append('order_id', this.state.user_subscription_id)


        this.setState({
            webviewshow: false
        }, () => {
            setTimeout(() => {
                apifuntion.postApi(url, data).then((obj) => {
                    if (obj.success == 'true') {
                        if (obj.notification_arr != 'NA') {
                            notification.notification_arr(obj.notification_arr)
                        }
                        this.props.navigation.navigate('PaymentSuccessfull1');
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



                //this.takeSingleVideoSubscription(video_id, amount, type = "NA", index = 0)
            }, 300);
        })

    }

    //--------------------------------------------//

    takeSubscriptionPlan = async (plan_id, amount) => {
        consolepro.consolelog('takeSubscriptionPlan');
        let user_details = await localStorage.getItemObject('user_arr');
        consolepro.consolelog('user_details', user_details);
        let subscription_plan_details = await localStorage.getItemObject('subscriptionplan_arr');
        consolepro.consolelog('subscription_plan_details', subscription_plan_details);
        this.setState({ plan_id: plan_id, amount: amount, user_id: user_details.user_id });
        consolepro.consolelog('plan_id', this.state.plan_id)
        consolepro.consolelog('amount', this.state.amount)
        consolepro.consolelog('user_id', this.state.user_id)
        let url = config.baseURL + "takeSubscriptionPlan.php";
        consolepro.consolelog('url', url)
        let data = new FormData();
        data.append('user_id', user_details.user_id)
        data.append('plan_id', plan_id)
        consolepro.consolelog('plan_data', data)
        apifuntion.postApi(url, data).then((obj) => {
            if (obj.success == 'true') {
                consolepro.consolelog('user_subscription_id', obj.user_subscription_id)
                this.setState({ user_subscription_id: obj.user_subscription_id })
                localStorage.setItemObject('user_subscription_id', obj.user_subscription_id)
                setTimeout(() => {
                    this.setState({ webviewshow: true })
                }, 600);
                // this.props.navigation.navigate('Payment');
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

    //-----------------Payment---------------------//

    _onNavigationStateChange(webViewState) {
        webViewState.canGoBack = false
        if (webViewState.loading == false) {
            console.log('webViewState', webViewState);
            console.log(webViewState.url)
            var t = webViewState.url.split('/').pop().split('?')[0]
            if (typeof (t) != null) {
                var p = webViewState.url.split('?').pop().split('&')
                console.log('file name', t);
                if (t == 'payment_success_final.php') {
                    // console.log('parameter', p);
                    // this.notifcationSendSubscribe()
                    var payment_id = 0;
                    var payment_date = '';
                    var payment_time = '';
                    console.log('p.length', p.length);
                    for (var i = 0; i < p.length; i++) {
                        var val = p[i].split('=');
                        console.log('val', val);
                        if (val[0] == 'payment_id') {
                            payment_id = val[1]
                        }
                        // if (val[0] == 'txn_date') {
                        //     payment_date = val[1]
                        // }
                        // if (val[0] == 'txn_time') {
                        //     payment_time = val[1]
                        // }
                    }
                    this.payment_status_update(payment_id)
                    // let datetime = payment_date+' '+payment_time



                    // this._submitOffer(payment_id,datetime);
                } else if (t == 'payment_cancel.php') {
                    // msgProvider.toast(Lang_chg.payment_failed[config.language], 'center');
                    // this.setState({ webviewshow: false })
                    return false;
                }
            }
        }
    }

    //-----------------***********--------------------//

    getSubscriptionPlan = async () => {
        consolepro.consolelog('getSubscriptionPlan');
        let user_details = await localStorage.getItemObject('user_arr');
        var user_id = 0;
        if (user_details != null) {
            user_id = user_details.user_id
        }
        var plan_type = this.props.route.params.plan_type;
        consolepro.consolelog('user_details_ba', user_details);
        let url = config.baseURL + "getSubscriptionPlan.php?user_id=" + user_id + "&plan_type=" + plan_type;
        consolepro.consolelog(url)
        apifuntion.getApi(url).then((obj) => {
            consolepro.consolelog('obj', obj)
            if (obj.success == "true") {
                if (obj.subscriptionplan_arr != 'NA') {
                    var res2 = obj.subscriptionplan_arr.map(function (item) {
                        return Object.values(item);
                    });
                    console.log('res1', res2)

                    this.setState({ subscriptionplan_arr: res2 })
                }
                localStorage.setItemObject('subscriptionplan_arr', obj.subscriptionplan_arr);
                consolepro.consolelog('subscriptionplan_arr', this.state.subscriptionplan_arr.plan_id);
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

    //-------------------************------------------//

    updateSignupSteps = async () => {
        consolepro.consolelog('updateSignupSteps');
        let user_details = await localStorage.getItemObject('user_arr');
        consolepro.consolelog('user_details_ba', user_details);
        let url = config.baseURL + "updateSignupSteps.php?user_id=" + user_details.user_id + "&signup_step=" + '2';
        consolepro.consolelog(url)
        apifuntion.getApi(url).then((obj) => {
            consolepro.consolelog('obj', obj)
            if (obj.success == "true") {
                localStorage.setItemString('guest_user', 'no');
                this.props.navigation.navigate('Home')
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
    //-------------------************------------------//
    _renderItem = ({ item, index }) => {
        consolepro.consolelog('item', item)
        consolepro.consolelog('index', index)
        return (
            <TouchableOpacity activeOpacity={1} onPress={() => { }}
                style={{ backgroundColor: Colors.theme_color, borderRadius: 12, height: mobileH * 28 / 100, width: mobileW * 62 / 100, alignSelf: 'center' }}>
                <View style={{ height: mobileH * 7 / 100, alignItems: 'center', backgroundColor: Colors.purewhite, elevation: 4, borderTopRightRadius: 12, borderTopLeftRadius: 12, justifyContent: 'center' }}>
                    <Text style={{ color: Colors.theme_color, fontSize: mobileW * 4.4 / 100, fontFamily: Font.bold }}>{item[1]}</Text>
                </View>
                <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={{ color: Colors.purewhite, fontFamily: Font.bold, fontSize: mobileW * 6 / 100, marginTop: 10 }}>{item[2]}</Text>
                    <Text style={{ color: Colors.purewhite, fontFamily: Font.regular, fontSize: mobileW * 3.6 / 100, }} >{item[6] == 1 ? '(Monthly)' : '(Single)'}</Text>
                    <Text style={{ color: Colors.purewhite, fontFamily: Font.bold, fontSize: mobileW * 3.6 / 100, marginTop: 5 }}>Ask {item[5]} Questions</Text>
                    <TouchableOpacity activeOpacity={1} onPress={() => { this.takeSubscriptionPlan(item[0], item[2]); }} style={{ backgroundColor: Colors.theme_color, height: mobileH * 5 / 100, width: mobileW * 32 / 100, alignSelf: 'center', borderRadius: 10, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', borderColor: Colors.purewhite, borderWidth: 1, marginTop: 10 }}>
                        <Text style={{ color: Colors.purewhite, fontSize: mobileW * 3 / 100, fontFamily: Font.bold }}>Choose Plan</Text>
                        <Image style={{ width: mobileW * 6 / 100, height: mobileH * 4 / 100, marginLeft: 4, marginTop: 3 }} resizeMode={'contain'} source={localimag.rightarrow}></Image>
                    </TouchableOpacity>
                </View>
            </TouchableOpacity>
        );
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
                                    source={{ uri: config.baseURL + 'stripe_payment/payment_url.php?user_id=' + this.state.user_id + '&order_id=' + this.state.user_subscription_id + '&descriptor_suffix=genius_genie&transfer_user_id=0&transfer_amount=0&amount=' + this.state.amount }}
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
                <TouchableOpacity activeOpacity={1} onPress={() => { Keyboard.dismiss(); }}>
                    <View style={{ alignItems: 'flex-start', alignSelf: 'center', justifyContent: 'center', height: mobileH * 8 / 100, width: mobileW * 94 / 100 }}>
                        <TouchableOpacity onPress={() => { this.handleBackPress() }} >
                            <Image style={{ width: mobileW * 9 / 100, height: mobileH * 7 / 100, resizeMode: "contain" }} source={localimag.back}></Image>
                        </TouchableOpacity>
                    </View>
                    <View style={{ alignItems: 'center', justifyContent: 'flex-start', }}>
                        <View style={{ height: mobileH * 25 / 100, width: mobileW * 84 / 100, alignItems: 'center', alignSelf: 'center', justifyContent: 'center', }}>
                            <View style={{ height: mobileH * 7 / 100, alignItems: 'center', justifyContent: 'flex-start' }}>
                                <Image style={{ width: mobileW * 8 / 100, height: mobileH * 7 / 100, }} resizeMode={'contain'} source={localimag.star}></Image>
                            </View>
                            <View style={{ width: mobileW * 74 / 100, height: mobileH * 11 / 100, alignSelf: 'center', alignItems: 'center', justifyContent: 'space-between', }}>
                                <Text style={{ fontSize: mobileW * 6 / 100, fontFamily: Font.bold, }}>Subscription Plan</Text>
                                <View style={{ alignSelf: 'center', alignItems: 'center', justifyContent: 'center' }}>
                                    <Text style={{ fontFamily: 'Roboto-Medium', fontSize: mobileW * 4.4 / 100, textAlign: 'center', color: Colors.font_color }}>You can cancel this subscription only when you use the app.</Text>
                                </View>
                            </View>
                        </View>
                        <View style={{ height: mobileH * 38 / 100, width: mobileW * 100 / 100, alignItems: 'center', alignSelf: 'center', marginTop: 30 }}>
                            <Carousel
                                layout={"default"}
                                ref={ref => this.carousel = ref}
                                data={this.state.subscriptionplan_arr}
                                sliderWidth={mobileW * 100 / 100}
                                itemWidth={mobileW * 68 / 100}
                                renderItem={this._renderItem}
                                onSnapToItem={index => this.setState({ activeIndex: index })} />
                        </View>
                        <View>
                            {/* <TouchableOpacity activeOpacity={1} onPress={() => { this.updateSignupSteps(); }}
                                style={{ borderWidth: 2, borderColor: Colors.theme_color, width: mobileW * 60 / 100, height: mobileH * 7 / 100, marginTop: 25, borderRadius: 10, alignItems: 'center', justifyContent: 'center' }}>
                                <Text style={{ fontSize: mobileW * 4 / 100, fontFamily: 'Roboto-Medium' }}>Skip Now</Text>
                            </TouchableOpacity> */}
                        </View>
                    </View>
                </TouchableOpacity>
                <Footer
                    activepage='Home'
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
    splash: {
        width: mobileW * 50 / 100,
        height: mobileH * 22 / 100,
    },
    eyeChangep: {
        width: 16,
        height: 16,
        resizeMode: 'contain',
        marginTop: 2,
        marginRight: 5,
    },
    eyeChangep1: {
        width: 14,
        height: 12,
        resizeMode: 'contain',
        marginTop: 2,
        marginRight: 5,
    },
});


