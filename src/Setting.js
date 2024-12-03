import React, { Component } from 'react'
import { Text, View, SafeAreaView, StatusBar, Dimensions, Alert, TouchableOpacity, Image, Switch, ScrollView, BackHandler, StyleSheet } from 'react-native'
import { config, Otpprovider, Mapprovider, apifuntion, Colors, Font, validation, mobileH, mobileW, SocialLogin, Cameragallery, mediaprovider, localStorage, Lang_chg, consolepro, msgProvider, msgTitle, msgText, Currentltlg } from './Providers/utilslib/Utils'
import { localimag } from './Providers/Localimageprovider/Localimage'
import { Shareratepro } from './Providers/Sharerateapp';
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
import Footer from './Providers/Footer';
import Footerr from './Providers/Footerr';
import HideWithKeyboard from 'react-native-hide-with-keyboard';
export default class Setting extends Component {
    constructor(props) {
        super(props)
        this.state = {
            login_type: '',
            share_url: '',
            rated: false,
            rate_url: '',
            action: '',
            subscription_plan_id: '',
            show: '',
            notification: true,
            user_type: 0,
            footer_image: null,
        }
        this._didFocusSubscription = props.navigation.addListener('focus', payload =>
            BackHandler.addEventListener('hardwareBackPress', this.handleBackPress)
        );
    }
    componentDidMount = async () => {
        // this.setState({ status: status });
        // consolepro.consolelog('statusrrr', status)
        this.setUserType();
        this.get_all_details();
        this.pushNotification();
    }
    setUserType = async () => {
        let result = await localStorage.getItemObject('user_arr')
  
        if (result != null) {
            this.setState({
                user_id: result.user_id,
                user_type: result.user_type,
                login_type: result.login_type,
                footer_image: result.image,
            })
        }
    }


    Logout = () => {
        Alert.alert(
            'Logout',
            'Do you want to logout ?', [{
                text: 'No',
                onPress: () => console.log('Cancel button Pressed'),
                style: 'cancel'
            }, {
                text: 'Yes',
                onPress: () => { { config.AppLogout(this.props.navigation) } }
            }], {
            cancelable: false
        }
        ); // works best when the goBack is async
        return true;
    };

    handleBackPress = () => {
        this.props.navigation.goBack();
        return true;
    };
    backpress = () => {
        this.props.navigation.goBack();
    }
    sharefun = () => {
        Shareratepro.sharefunction(config.appname, this.state.share_url)
        consolepro.consolelog("this is share URL", this.state.rate_url)
    }
    ratefun = () => {
        Shareratepro.Rateusfunction(this.state.rate_url)
    }

    pushNotification = async () => {
        let user_details = await localStorage.getItemObject('user_arr');
        let notification_status = user_details.notification_status;
        consolepro.consolelog('notification_status', notification_status)
        if (notification_status == 1) {
            this.setState({ notification: true })
        } else {
            this.setState({ notification: false })
        }
    }

    //-------------*******--------------//

    changeNotification = async () => {
        consolepro.consolelog('changeNotification');
        let user_details = await localStorage.getItemObject('user_arr');
        consolepro.consolelog('user_details_ba', user_details);
        let notification_status = user_details.notification_status;

        let url = config.baseURL + "changeNotificationStatus.php";
        consolepro.consolelog(url)
        let data = new FormData();
        data.append('user_id', user_details.user_id)
        data.append('action', notification_status)
        apifuntion.postApi(url, data).then((obj) => {
            consolepro.consolelog('obj', obj)
            if (obj.success == "true") {
                consolepro.consolelog('true')
                localStorage.setItemObject('user_arr', obj.user_details)
                consolepro.consolelog('userIgot', obj.user_details)
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
    //-----------------------**********----------------------//
    get_all_details = async () => {
        consolepro.consolelog('setting');
        let user_details = await localStorage.getItemObject('user_arr');
        consolepro.consolelog('user_details', user_details);
        let url = config.baseURL + "get_all_content.php?user_id=" + user_details.user_id;
        consolepro.consolelog(url)
        apifuntion.getApi(url,1).then((obj) => {
            consolepro.consolelog('obj', obj)
            if (obj.success == "true") {
                if (obj.content_arr != 'NA') {
                    this.setState({ share_url: obj.content_arr[5].content[0] });
                    consolepro.consolelog('Tis is share url', this.state.share_url)
                    if (Platform.OS == 'ios') {
                        this.setState({ rate_url: obj.content_arr[3].content[config.language] });
                    } else {
                        this.setState({ rate_url: obj.content_arr[4].content[config.language] });
                    }
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
    //--------------------*********-----------------//
    render() {
        // consolepro.consolelog('statusigot', this.state.status)
        var user_type = this.state.user_type
        return (
            <View style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
                <SafeAreaView style={{ flex: 0, backgroundColor: Colors.theme_color }} />
                <StatusBar backgroundColor={Colors.theme_color} barStyle='default' hidden={false} translucent={false}
                    networkActivityIndicatorVisible={true} />
                <View style={styles.setingsHeader}>
                    <TouchableOpacity activeOpacity={0.9} onPress={() => { this.props.navigation.goBack() }}>
                        <Image resizeMode="contain" style={{ width: 25, height: 30 }} source={localimag.back}></Image>
                    </TouchableOpacity>
                    <Text style={styles.OrderHistoryTitle}>Settings</Text>
                    <View style={{ width: '6%' }}></View>
                </View>
                <ScrollView showsVerticalScrollIndicator={false} style={{ paddingBottom: 100, }}>
                    <View style={{ width: mobileW * 92 / 100, alignSelf: 'center', marginTop: 30 }}>
                        <TouchableOpacity activeOpacity={1} style={styles.settings_Box} >
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <Image source={localimag.notification1}
                                        style={{ height: windowWidth * 6 / 100, width: windowWidth * 6 / 100, resizeMode: 'contain', }}>
                                    </Image>
                                    <Text style={styles.settingsTxt}>Notifications</Text>
                                </View>
                                <Switch trackColor={{ false: '#E1EFF9', true: '#E1EFF9' }}
                                    thumbColor={Colors.theme_color} ios_backgroundColor="#E6EDEB" onValueChange={(txt) => { this.setState({ notification: txt }); this.changeNotification() }} value={this.state.notification} />
                            </View>

                        </TouchableOpacity>
                        {this.state.login_type == 0 && <TouchableOpacity activeOpacity={1} onPress={() => { this.props.navigation.navigate("ChangePassword") }} style={styles.settings_Box}>
                            <View style={styles.settingsLeft}>
                                <Image source={localimag.change_password}
                                    style={{ height: windowWidth * 6 / 100, width: windowWidth * 6 / 100, resizeMode: 'contain' }}>
                                </Image>
                                <Text style={styles.settingsTxt}>Change Password</Text>
                            </View>
                        </TouchableOpacity>}
                        {user_type != 2 && <TouchableOpacity activeOpacity={1} onPress={() => { this.props.navigation.navigate("SubscriptionHistory", { 'prvious_page': 'Setting' }) }} style={styles.settings_Box} >
                            <View style={styles.settingsLeft}>
                                <Image source={localimag.subscription}
                                    style={{ height: windowWidth * 6 / 100, width: windowWidth * 6 / 100, resizeMode: 'contain' }}></Image>
                                <Text style={styles.settingsTxt}>Subscription History</Text>
                            </View>
                        </TouchableOpacity>}
                        <TouchableOpacity activeOpacity={1} style={styles.settings_Box} onPress={() => { this.props.navigation.navigate("FAQ") }}>
                            <View style={styles.settingsLeft}>
                                <Image source={localimag.faq}
                                    style={{ height: windowWidth * 6 / 100, width: windowWidth * 6 / 100, resizeMode: 'contain' }}></Image>
                                <Text style={styles.settingsTxt}>FAQ/Help</Text>
                            </View>
                        </TouchableOpacity>
                        {user_type != 2 && <TouchableOpacity activeOpacity={1} style={styles.settings_Box} onPress={() => { this.props.navigation.navigate("FavouriteExpert") }}>
                            <View style={styles.settingsLeft}>
                                <Image source={localimag.favourite}
                                    style={{ height: windowWidth * 6 / 100, width: windowWidth * 6 / 100, resizeMode: 'contain', }}></Image>
                                <Text style={styles.settingsTxt}>Favourite Experts</Text>
                            </View>
                        </TouchableOpacity>}
                        {user_type == 2 && <TouchableOpacity activeOpacity={1} style={styles.settings_Box} onPress={() => { this.props.navigation.navigate("ExpertEditProfile") }}>
                            <View style={styles.settingsLeft}>
                                <Image source={localimag.availability}
                                    style={{ width: windowWidth * 6 / 100, height: windowWidth * 6 / 100, resizeMode: 'contain', }}></Image>
                                <Text style={styles.settingsTxt}>Edit Profile</Text>
                            </View>
                        </TouchableOpacity>}
                        {user_type == 2 && <TouchableOpacity activeOpacity={1} style={styles.settings_Box} onPress={() => { this.props.navigation.navigate("EditAvailability") }}>
                            <View style={styles.settingsLeft}>
                                <Image source={localimag.faq}
                                    style={{ width: windowWidth * 6 / 100, height: windowWidth * 6 / 100, resizeMode: 'contain', }}></Image>
                                <Text style={styles.settingsTxt}>Edit Availability</Text>
                            </View>
                        </TouchableOpacity>}
                        <TouchableOpacity activeOpacity={1}
                            style={{ marginLeft: mobileW * 3 / 100, padding: 2, marginBottom: 5, marginTop: 10, borderBottomWidth: 0.6 }} >
                            <Text style={styles.settingsTxttt}>More</Text>
                        </TouchableOpacity>
                        <TouchableOpacity activeOpacity={1} onPress={() => { this.props.navigation.navigate("TermsConditions") }} style={styles.settings_Box} >
                            <View style={styles.settingsLeft}>
                                <Image source={localimag.terms}
                                    style={{ height: windowWidth * 6 / 100, width: windowWidth * 6 / 100, resizeMode: 'contain', }}></Image>
                                <Text style={styles.settingsTxt}>Terms & Conditions</Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity activeOpacity={1} onPress={() => { this.props.navigation.navigate("PrivacyPolicy") }} style={styles.settings_Box}>
                            <View style={styles.settingsLeft}>
                                <Image source={localimag.privacy1}
                                    style={{ height: windowWidth * 6 / 100, width: windowWidth * 6 / 100, resizeMode: 'contain', }}></Image>
                                <Text style={styles.settingsTxt}>Privacy Policy</Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity activeOpacity={1} onPress={() => { this.props.navigation.navigate("AboutUS") }} style={styles.settings_Box}>
                            <View style={styles.settingsLeft}>
                                <Image source={localimag.about1}
                                    style={{ height: windowWidth * 6 / 100, width: windowWidth * 6 / 100, resizeMode: 'contain', }}></Image>
                                <Text style={styles.settingsTxt}>About Us</Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.settings_Box} activeOpacity={0.9} onPress={() => { this.props.navigation.navigate('Contact') }}>
                            <View style={styles.settingsLeft}>
                                <Image source={localimag.contact_us}
                                    style={{ height: windowWidth * 6 / 100, width: windowWidth * 6 / 100, resizeMode: 'contain' }}></Image>
                                <Text style={styles.settingsTxt}>Contact Us</Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.settings_Box} activeOpacity={0.9} onPress={() => { this.ratefun() }} >
                            <View style={styles.settingsLeft}>
                                <Image source={localimag.rate1}
                                    style={{ height: windowWidth * 6 / 100, width: windowWidth * 6 / 100, resizeMode: 'contain' }}></Image>
                                <Text style={styles.settingsTxt}>Rate App</Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.settings_Box} activeOpacity={0.9} onPress={() => { this.sharefun() }} >
                            <View style={styles.settingsLeft}>
                                <Image source={localimag.share}
                                    style={{ height: windowWidth * 6 / 100, width: windowWidth * 6 / 100, resizeMode: 'contain' }}></Image>
                                <Text style={styles.settingsTxt}>Share App</Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.settings_Box} activeOpacity={0.9} onPress={() => { this.Logout(); }}>
                            <View style={styles.settingsLeft}>
                                <Image source={localimag.out}
                                    style={{ height: windowWidth * 6 / 100, width: windowWidth * 6 / 100, resizeMode: 'contain', }}></Image>
                                <Text style={styles.settingsTxtt}>Logout</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
                {parseInt(this.state.user_type) == 1 && <View style={{ backgroundColor: '#FFFFFF', elevation: 4, height: mobileH * 6 / 100, position: 'absolute', bottom: 0, width: mobileW * 100 / 100, alignSelf: 'center', shadowColor: '#000000', shadowOffset: { width: 2, height: 2, }, shadowOpacity: 0.30 }}>
                    <Footer
                        activepage='Profile'
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
                        activepage='ExpertProfile'
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
    OrderHistoryTitle: {
        color: Colors.white_color,
        fontFamily: Font.bold,
        fontSize: windowWidth * 5.2 / 100,
    },
    //Setting
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
    settingsTxt: {
        fontSize: mobileW * 0.035,
        fontFamily: Font.medium,
        marginLeft: windowWidth * 4 / 100
    },
    settingsTxtt: {
        fontSize: mobileW * 0.035,
        fontFamily: Font.medium,
        marginLeft: windowWidth * 4 / 100,
        color: Colors.darkred
    },
    settingsTxttt: {
        fontSize: mobileW * 0.035,
        fontFamily: Font.medium,
        marginLeft: windowWidth * 10 / 100,
    },
    settings_Box: {
        justifyContent: 'space-between',
        paddingBottom: 2,
        paddingTop: 2,
        paddingRight: 15,
        paddingLeft: 15,
        marginTop: 10
    },
    settingAcount: {
        color: Colors.theme_color,
        fontSize: 21,
        fontFamily: Font.bold,
        marginTop: 10,
        marginBottom: 10,
        marginLeft: windowWidth * 3 / 100
    },
    settingsAcount: {
        borderBottomWidth: 2,
        borderBottomColor: '#E8E8E8',
        width: windowWidth * 100 / 100
    },
    settingsLeft: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center'
    }
});
