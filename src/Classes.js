import React, { Component } from 'react'
import { Text, View, TouchableOpacity, SafeAreaView, ActivityIndicator, Dimensions, TextInput, Modal, StatusBar, ImageBackground, Image, ScrollView, FlatList, BackHandler, StyleSheet, Keyboard } from 'react-native'
import { config, Otpprovider, Mapprovider, apifuntion, Colors, Font, validation, mobileH, mobileW, SocialLogin, Cameragallery, mediaprovider, localStorage, Lang_chg, consolepro, msgProvider, msgTitle, msgText, Currentltlg } from './Providers/utilslib/Utils'
import { localimag } from './Providers/Localimageprovider/Localimage'
import Footer from './Providers/Footer';
import { WebView } from 'react-native-webview';
import { notification } from './Providers/NotificationProvider'
import VideoPlayer from 'react-native-video-player';
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export default class Classes extends Component {
    _didFocusSubscription;
    _willBlurSubscription;
    constructor(props) {
        super(props)
        this.state = {
            showSearch: false,
            txtsrch: '',
            flip: false,
            videoModal:false,
            normal_classes_arr: 'NA',
            live_classes_arr: 'NA',
            status1: '',
            videoStatus: '',
            status: 0,
            user_id: 0,
            class_id: 0,
            video_id: 0,
            watch_video_id: 0,
            amount: 0,
            webviewshow: false,
            runVideoModal: false,
            video_url: '',
            count_noti: 0,
            index: 0,
        }
        this._didFocusSubscription = props.navigation.addListener('focus', payload =>
            BackHandler.addEventListener('hardwareBackPress', this.handleBackPress)
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
        ); // works best when the goBack is async
        return true;
    };

    backpress = () => {
        this.props.navigation.goBack();
    }
    cross_click = async () => {
        this.setState({ showSearch: false })
    }

    //--------------------------------------------------------//

    getAllData = async () => {
        consolepro.consolelog('getAllData')
        let user_details = await localStorage.getItemObject('user_arr');
        consolepro.consolelog('user_details', user_details)
        let footer_image = user_details.image;
        let user_id = user_details.user_id;
        this.setState({ user_id: user_id });
        consolepro.consolelog('footer_image', footer_image)
        this.setState({ footer_image: footer_image })
    }

    //--------------------------------------------------------//

    componentDidMount = async () => {
        this._willBlurSubscription = this.props.navigation.addListener('blur', payload =>
            BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress)
        );
        this.props.navigation.addListener('focus', () => {
            if (config.device_type = 'ios') {
                setTimeout(() => {
                    this.getAllData();
                    this.getNormalClasses();
                    this.getLiveClasses();
                }, 600);
            } else {
                this.getAllData();
                this.getNormalClasses();
                this.getLiveClasses();
            }
        });
    }

    //-------------------------------------------------------//
    // item.class_id, item.video_price, item.status1, item.videoStatus, item.video_url, item.video_status
    getSingleVideoValue = async (video_id, amount, watch_status, subscription_status, video_url, video_status, index, video_subscription_id) => {

        this.setState({ index: index })
        if (parseInt(video_status) == 1 && parseInt(watch_status) == 1) {
            this.setState({ runVideoModal: true, status: 1, video_url: video_url, index })
        }
        else {
            if (subscription_status == 1) {
                this.watchVedioBySubscription(video_id, amount, index, video_subscription_id)
            } else {
                this.setState({ video_id: video_id, amount: amount, videoModal: true, status: 0, index })
            }
        }
    }

    //-------------------------------------------------------//
    watchVedioBySubscription = async (video_id, amount, index = 0, video_subscription_id) => {
        consolepro.consolelog('takeSingleVideoSubscription');
        let user_details = await localStorage.getItemObject('user_arr');
        consolepro.consolelog('user_details', user_details.user_id);
        let url = config.baseURL + "watchVedioBySubscription.php?user_id=" + user_details.user_id + "&video_id=" + video_id + "&amount=" + amount + "&video_subscription_id=" + video_subscription_id;
        consolepro.consolelog('url', url)
        apifuntion.getApi(url).then((obj) => {
            if (obj.success == 'true') {
                var normal_classes_arr = this.state.normal_classes_arr;
                normal_classes_arr[index].video_status = 1;
                normal_classes_arr[index].watch_status = 1;
                this.setState({ normal_classes_arr: normal_classes_arr })
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

    //-------------------------------------------------------//


    //-------------------------------------------------------//

    takeSingleVideoSubscription1 = async (video_id, amount, type = "NA", index = 0) => {
        if (config.device_type == 'ios') {
            this.setState({
                videoModal: false
            }, () => {
                setTimeout(() => {
                    this.takeSingleVideoSubscription(video_id, amount, type = "NA", index = 0)
                }, 300);
            })
            // this.setState({})
            // setTimeout(() => {
            // }, 600);
        } else {
            this.takeSingleVideoSubscription(video_id, amount, type = "NA", index = 0)
        }
    }


    takeSingleVideoSubscription = async (video_id, amount, type = "NA", index = 0) => {
        consolepro.consolelog('takeSingleVideoSubscription');
        let user_details = await localStorage.getItemObject('user_arr');
        consolepro.consolelog('user_details', user_details.user_id);
        let url = config.baseURL + "takeSingleVideoSubscription.php";
        consolepro.consolelog('url', url)
        let data = new FormData();
        data.append('user_id', user_details.user_id)
        data.append('video_id', video_id)
        data.append('amount', amount)
        data.append('type', type)
        consolepro.consolelog('data123', data)
        apifuntion.postApi(url, data).then((obj) => {
            if (obj.success == 'true') {
                consolepro.consolelog('yahaaa')
                this.setState({ watch_video_id: obj.watch_video_id })
                if (config.device_type = 'ios') {
                    setTimeout(() => {
                        this.setState({ webviewshow: true });
                    }, 600);
                } else {
                    this.setState({ webviewshow: true });
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

    //-------------------------------------------------------//

    getNormalClasses = async () => {
        consolepro.consolelog('getNormalClasses');
        let user_details = await localStorage.getItemObject('user_arr');
        consolepro.consolelog('user_details_ba', user_details);
        let url = config.baseURL + "getClasses.php?user_id=" + user_details.user_id + "&class_type=" + 0;
        consolepro.consolelog(url)
        apifuntion.getApi(url).then((obj) => {
            consolepro.consolelog('obj', obj)
            if (obj.success == "true") {
                this.setState({ normal_classes_arr: obj.normal_classes_arr, count_noti: obj.count_noti })
                consolepro.consolelog('normal_classes_arr', obj.normal_classes_arr);
                localStorage.setItemObject('normal_classes_arr', obj.normal_classes_arr);
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

    //------------------------------------------------------------//

    getLiveClasses = async () => {
        consolepro.consolelog('getLiveClasses');
        let user_details = await localStorage.getItemObject('user_arr');
        consolepro.consolelog('user_details_ba', user_details);
        let url = config.baseURL + "getClasses.php?user_id=" + user_details.user_id + "&class_type=" + 1;
        consolepro.consolelog(url)
        apifuntion.getApi(url).then((obj) => {
            consolepro.consolelog('obj', obj)
            if (obj.success == "true") {
                this.setState({ live_classes_arr: obj.live_classes_arr, })
                consolepro.consolelog('getLiveClasses', obj.live_classes_arr);
                localStorage.setItemObject('live_classes_arr', obj.live_classes_arr);
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

    //-----------------Payment---------------------//

    _onNavigationStateChange(webViewState) {
        consolepro.consolelog("webViewState.url", webViewState.url)
        webViewState.canGoBack = false
        if (webViewState.loading == false) {
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
                    this.single_video_payment_status_update(payment_id)
                    // let datetime = payment_date+' '+payment_time
                    // this.setState({webviewshow:false})  
                    // this._submitOffer(payment_id,datetime);
                } else if (t == 'payment_cancel.php') {
                    // msgProvider.toast(Lang_chg.payment_failed[config.language], 'center');
                    // this.setState({ webviewshow: false })
                    return false;
                }
            }
        }
    }

    //---------------------------------------------------------//

    single_video_payment_status_update = async (transaction_id,) => {
        consolepro.consolelog('payment_status_update');
        let user_details = await localStorage.getItemObject('user_arr');
        let url = config.baseURL + "single_video_payment_status_update.php";
        consolepro.consolelog('url', url)
        let data = new FormData();
        data.append('user_id', user_details.user_id)
        data.append('txn_id', transaction_id)
        data.append('watch_video_id', this.state.watch_video_id)
        consolepro.consolelog('yahaa')
        apifuntion.postApi(url, data).then((obj) => {
            consolepro.consolelog('obj', obj)
            if (obj.success == 'true') {
                var normal_classes_arr = this.state.normal_classes_arr;
                normal_classes_arr[this.state.index].video_status = 1;
                normal_classes_arr[this.state.index].watch_status = 1;
                this.setState({ normal_classes_arr: normal_classes_arr })
                if (obj.notification_arr != 'NA') {
                    notification.notification_arr(obj.notification_arr)
                }
                this.setState({ videoModal: false, webviewshow: false })
                this.props.navigation.navigate('Classes');
            } else {
                if (obj.active_status == 'deactivate') {
                    this.props.navigation.navigate('Login');
                    localStorage.clear();
                }
                return false;
            }
        }).catch((error) => {
            consolepro.consolelog("-------- error ------- " + error);
        });
    }

    //---------------------------------------------------------//

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
                                    source={{ uri: config.baseURL + 'stripe_payment/payment_url.php?user_id=' + this.state.user_id + '&order_id=' + this.state.class_id + '&descriptor_suffix=genius_genie&transfer_user_id=0&transfer_amount=0&amount=' + this.state.amount }}
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

                <Modal
                    animationType="slide"
                    transparent
                    visible={this.state.videoModal}
                    onRequestClose={() => {
                        this.setState({ videoModal: false });
                    }}>
                    <View style={{ flex: 1, backgroundColor: '#090D11', alignItems: 'center', justifyContent: 'center', borderRadius: 0, justifyContent: 'center', alignItems: 'center' }}>

                        <View style={{ width: mobileW * 84 / 100, height: mobileH * 35 / 100 }}>

                            <ImageBackground source={localimag.videoBackground}
                                imageStyle={{ borderRadius: 20, resizeMode: 'cover' }}
                                style={{ width: windowWidth * 84 / 100, height: mobileH * 32 / 100 }}>


                                <TouchableOpacity style={{ alignSelf: "flex-end" }} onPress={() => { this.setState({ videoModal: false }); }} >
                                    <Image source={localimag.cancel} style={{ height: 60, width: 60 }} />
                                </TouchableOpacity>


                                <View style={{ paddingTop: mobileW * 2 / 100, alignItems: 'center' }}>
                                    <Text style={{ fontFamily: 'Roboto-Medium', fontSize: mobileW * 5.5 / 100, color: Colors.purewhite }}>Watch Video</Text>
                                </View>
                                <View style={{ alignItems: 'center', height: mobileW * 12 / 100, justifyContent: 'center', marginBottom: 10 }}>
                                    <Image resizeMode="contain" style={{ width: mobileW * 12 / 100, height: mobileW * 8 / 100 }} source={localimag.videoIcon}></Image>
                                </View>
                                {this.state.status == 0 && <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: mobileW * 10 / 100, paddingHorizontal: mobileW * 3 / 100, }}>
                                    <TouchableOpacity activeOpacity={1} onPress={() => { this.takeSingleVideoSubscription1(this.state.video_id, this.state.amount); }}// 
                                        style={{ backgroundColor: '#3289C6', width: mobileW * 38 / 100, height: mobileW * 10 / 100, justifyContent: 'center', alignItems: 'center', borderRadius: 5 }}>
                                        <Text style={{ fontSize: 14, color: Colors.purewhite }}>${this.state.amount}/Video</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity activeOpacity={1} onPress={() => { this.props.navigation.navigate('VideoSubscriptionPlan'); this.setState({ videoModal: false }) }}
                                        style={{ backgroundColor: '#3289C6', width: mobileW * 38 / 100, height: mobileW * 10 / 100, justifyContent: 'center', alignItems: 'center', borderRadius: 5 }}>
                                        <Text style={{ fontSize: 14, color: Colors.purewhite }}>Subscription Plan</Text>
                                    </TouchableOpacity>
                                </View>
                                }
                            </ImageBackground>
                        </View>

                    </View>
                </Modal>

                <Modal
                    animationType="slide"
                    transparent
                    visible={this.state.runVideoModal}
                    onRequestClose={() => {
                        consolepro.consolelog('Modal has been closed.');
                    }}>
                    <View style={{ flex: 1, backgroundColor: '#090D11', alignItems: 'center', justifyContent: 'center', borderRadius: 0, }}>
                        <View style={{ width: mobileW * 84 / 100, height: mobileH * 40 / 100, justifyContent: 'center', alignItems: 'center' }}>
                            <VideoPlayer
                                video={{ uri: config.video_url + this.state.video_url }}
                                //video={{ uri: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4' }}
                                videoWidth={windowHeight * 0.63}
                                videoHeight={mobileW * 0.9}
                                thumbnail={this.state.adver_image_url}
                                endThumbnail={this.state.adver_image_url}
                                autoplay={true}
                                disableFullscreen={true}
                                //onShowControls={() => { this.openUrl() }}
                                resizeMode={"cover"}
                                style={{ height: windowHeight * 0.63, borderColor: '#DBB91B', borderRadius: 20, justifyContent: 'center', width: mobileW * 0.9, alignSelf: 'center', alignItems: 'center' }}
                                onEnd={() => { this.setState({ isLoading1: false }) }}
                                onLoad={() => { this.setState({ isLoading1: false }) }}
                                onLoadStart={() => { this.setState({ isLoading1: true }) }}
                                ref={r => this.player = r}
                                customStyles={{ seekBar: { backgroundColor: 'red', backgroundColor: 'blue', borderRadius: 10 }, videoWrapper: { borderRadius: 10 } }}
                            />
                            <ActivityIndicator color={Colors.theme_color} size="large" style={{ position: "absolute", zIndex: 99999999999999, alignSelf: 'center', }} animating={this.state.isLoading1} />
                        </View>
                        <TouchableOpacity onPress={() => { this.setState({ runVideoModal: false }) }} activeOpacity={1}
                            style={{ position: 'absolute', bottom: 40, alignItems: 'center', justifyContent: 'center' }}>
                            <Image source={localimag.cancel} style={{ width: mobileW * 15 / 100, height: mobileW * 15 / 100 }} />
                        </TouchableOpacity>
                    </View>
                </Modal>

                <View style={styles.setingsHeader}>
                    <View style={{ width: mobileW * 10 / 100 }}></View>
                    <Text style={styles.OrderHistoryTitle}>Classes</Text>
                    <View style={{ width: mobileW * 10 / 100 }}></View>
                </View>
                <View style={{ width: mobileW * 100 / 100, height: mobileH * 8 / 100, justifyContent: 'center', flexDirection: 'row' }}>
                    {this.state.flip == false && <View style={{ borderBottomColor: Colors.theme_color, borderBottomWidth: 6, width: mobileW * 50 / 100, marginLeft: 20, alignItems: 'center', justifyContent: 'center', }}>
                        <Text style={{ fontFamily: Font.bold, fontSize: mobileW * 4.5 / 100, }}>Normal Classes</Text>
                    </View>}
                    {this.state.flip == true && <TouchableOpacity onPress={() => { this.setState({ flip: false }) }} style={{ borderBottomColor: '#e5e5e5', borderBottomWidth: 6, width: mobileW * 50 / 100, marginLeft: 20, alignItems: 'center', justifyContent: 'center', }}>
                        <Text style={{ fontFamily: Font.bold, fontSize: mobileW * 4.5 / 100, }}>Normal Classes</Text>
                    </TouchableOpacity>}
                    {this.state.flip == false && <TouchableOpacity onPress={() => { this.setState({ flip: true }) }} style={{ borderBottomColor: '#e5e5e5', borderBottomWidth: 6, width: mobileW * 50 / 100, marginRight: 20, alignItems: 'center', justifyContent: 'center', }}>
                        <Text style={{ fontFamily: Font.bold, fontSize: mobileW * 4.5 / 100 }}>Live Classes</Text>
                    </TouchableOpacity>}
                    {this.state.flip == true && <View style={{ borderBottomColor: Colors.theme_color, borderBottomWidth: 6, width: mobileW * 50 / 100, marginRight: 20, alignItems: 'center', justifyContent: 'center', }}>
                        <Text style={{ fontFamily: Font.bold, fontSize: mobileW * 4.5 / 100, }}>Live Classes</Text>
                    </View>}
                </View>
                {this.state.flip == false && <View style={{ marginTop: 20, paddingBottom: 170 }}>
                    {this.state.normal_classes_arr == 'NA' && <View style={{ alignItems: 'center', justifyContent: 'center', height: '100%' }}><Image resizeMode="contain" style={{ width: '50%', height: '50%', }} source={localimag.nodataFound}></Image></View>}
                    {this.state.normal_classes_arr != 'NA' &&
                        <FlatList
                            data={this.state.normal_classes_arr}
                            showsVerticalScrollIndicator={false}
                            renderItem={({ item, index }) => {
                                return (
                                    <View style={{ width: windowWidth * 100 / 100, alignItems: 'center', justifyContent: 'flex-start', alignSelf: 'center', marginTop: 10 }}>
                                        <ImageBackground source={localimag.background}
                                            imageStyle={{ borderRadius: 20, resizeMode: 'cover' }}
                                            style={{ width: windowWidth * 90 / 100, }}>
                                            <View style={{ alignItems: 'flex-start', alignSelf: 'flex-start', width: windowWidth * 80 / 100, alignSelf: 'center', justifyContent: 'center', paddingVertical: 20 }}>
                                                {/* <Text numberOfLines={1} style={{ color: Colors.purewhite, fontSize: mobileW * 3.2 / 100 }}>{item.title}</Text> */}
                                                <Text numberOfLines={2} style={{ color: Colors.purewhite, fontSize: mobileW * 4.1 / 100, fontFamily: Font.medium }}>{item.title}</Text>
                                                <Text numberOfLines={2} style={{ color: Colors.purewhite, fontSize: mobileW * 3.5 / 100 }}>{item.description}</Text>
                                                <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                                                    <Image resizeMode="contain" style={{ width: mobileW * 6 / 100, height: mobileH * 4 / 100 }} source={localimag.clock}></Image>
                                                    <Text style={{ color: Colors.purewhite, fontSize: mobileW * 3 / 100 }}>{item.duration}</Text>
                                                </View>
                                                <TouchableOpacity activeOpacity={1} onPress={() => { this.getSingleVideoValue(item.class_id, item.video_price, item.watch_status, item.subscription_status, item.video_url, item.video_status, index, item.video_subscription_id); }}
                                                    style={{ flexDirection: 'row', backgroundColor: Colors.purewhite, alignItems: 'center', justifyContent: 'center', width: mobileW * 38 / 100, borderRadius: 10, height: mobileH * 4.3 / 100, }}>
                                                    <Text style={{ color: Colors.theme_color, fontSize: mobileW * 3.5 / 100 }}>{(item.watch_status == 0) ? "Start Now" : "Watch now"}</Text>
                                                    <Image resizeMode="contain" style={{ width: 25, height: 25 }} source={localimag.video}></Image>
                                                </TouchableOpacity>
                                            </View>
                                        </ImageBackground>
                                    </View>
                                )
                            }}
                            keyExtractor={(item, index) => index.toString()}>
                        </FlatList>}
                </View>}
                {this.state.flip == true && <View style={{ marginTop: 20, paddingBottom: 170 }}>
                    {this.state.live_classes_arr == 'NA' && <View style={{ alignItems: 'center', justifyContent: 'center', height: '100%' }}><Image resizeMode="contain" style={{ width: '50%', height: '50%', }} source={localimag.nodataFound}></Image></View>}
                    {this.state.live_classes_arr != 'NA' &&
                        <FlatList
                            data={this.state.live_classes_arr}
                            showsVerticalScrollIndicator={false}
                            renderItem={({ item, index }) => {
                                return (
                                    <TouchableOpacity activeOpacity={1} onPress={() => { this.props.navigation.navigate('JoinClassDetails',{class_id:item.class_id}); }} style={{ width: windowWidth * 100 / 100, alignItems: 'center', justifyContent: 'flex-start', alignSelf: 'center', marginTop: 10 }}>
                                        <ImageBackground source={localimag.background}
                                            imageStyle={{ borderRadius: 20, resizeMode: 'cover' }}
                                            style={{ width: windowWidth * 90 / 100, }}>
                                            <View style={{ alignItems: 'flex-start', alignSelf: 'flex-start', width: windowWidth * 80 / 100, alignSelf: 'center', justifyContent: 'center', paddingVertical: mobileW * 6 / 100, }}>
                                                {/* <Text numberOfLines={1} style={{ color: Colors.purewhite, fontSize: mobileW * 3.2 / 100 }}>{item.title}</Text> */}
                                                <Text numberOfLines={2} style={{ color: Colors.purewhite, fontSize: mobileW * 4.1 / 100, fontFamily: Font.medium }}>{item.title}</Text>
                                                <Text numberOfLines={2} style={{ color: Colors.purewhite, fontSize: mobileW * 3.5 / 100 }}>{item.description}</Text>
                                                <View style={{ justifyContent: 'center', alignItems: 'flex-start' }}>
                                                    <Text style={{ color: Colors.purewhite, fontSize: mobileW * 3 / 100, marginTop: 3 }}>{item.expert_name}</Text>
                                                    <Text style={{ color: Colors.purewhite, fontSize: mobileW * 3 / 100, marginTop: 3 }}>Number of session - {item.no_of_session}</Text>
                                                </View>
                                            </View>
                                        </ImageBackground>
                                    </TouchableOpacity>
                                )
                            }}
                            keyExtractor={(item, index) => index.toString()}>
                        </FlatList>}
                </View>}
                <View style={{ backgroundColor: '#FFFFFF', elevation: 4, height: mobileH * 6 / 100, position: 'absolute', bottom: 0, width: mobileW * 100 / 100, alignSelf: 'center', shadowColor: '#000000', shadowOffset: { width: 2, height: 2, }, shadowOpacity: 0.30 }}>
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

