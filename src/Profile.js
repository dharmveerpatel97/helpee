import React, { Component } from 'react'
import { Text, View, TouchableOpacity, SafeAreaView, TextInput, Alert, Dimensions, StatusBar, Image, ScrollView, BackHandler, StyleSheet } from 'react-native'
import { config, Otpprovider, Mapprovider, apifuntion, Colors, Font, validation, mobileH, mobileW, SocialLogin, Cameragallery, mediaprovider, localStorage, Lang_chg, consolepro, msgProvider, msgTitle, msgText, Currentltlg } from './Providers/utilslib/Utils'
import { localimag } from './Providers/Localimageprovider/Localimage'
import Footer from './Providers/Footer';
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
export default class Profile extends Component {
    _didFocusSubscription;
    _willBlurSubscription;
    constructor(props) {
        super(props)
        this.state = {
            imagepath: 'NA',
            name: '',
            email: '',
            user_information_arr: 'NA',
            no_of_question: '0',
            no_of_videos: '0',
            subscription_plan_name: 'NA',
            subscription_amount: '0',
            count_noti: 0,
            footer_image: null,
        }
        this._didFocusSubscription = props.navigation.addListener('focus', payload =>
            BackHandler.addEventListener('hardwareBackPress', this.handleBackPress)
        );
    }
    backpress = () => {
        this.props.navigation.goBack();
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
    componentDidMount = () => {
        this._willBlurSubscription = this.props.navigation.addListener('blur', payload =>
            BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress)
        );
        this.props.navigation.addListener('focus', () => {
            this.getProfileData();
            this.getUserDetails();
            this.getAllData();
        });
    }

    //------------------------------------------------------------//

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
    getAllData = async () => {
        consolepro.consolelog('getAllData')
        let user_details = await localStorage.getItemObject('user_arr');
        consolepro.consolelog('user_details', user_details)
        let footer_image = user_details.image;
        consolepro.consolelog('footer_image', footer_image)

        this.setState({ footer_image: footer_image })
    }

    //---------------------------------------------------------------//

    getProfileData = async () => {
        let user_details = await localStorage.getItemObject('user_arr');
        consolepro.consolelog('user_detailhere', user_details)
        let name = user_details.name;
        let mobile = user_details.mobile;
        let email = user_details.email;
        let image = user_details.image;
        this.setState({ footer_image: image })
        consolepro.consolelog('imagewe', image)
        if (user_details != 'NA' && user_details != null) {
            this.setState({ name: name, mobile: mobile, email: email });
        }
        if (image != null && image != "") {
            this.setState({ imagepath: config.img_url3 + image });
            consolepro.consolelog('imagepath', this.state.imagepath)
        } else {
            consolepro.consolelog('imagepath', this.state.imagepath)
            this.setState({ imagepath: 'NA' });
        }
    }

    //-------------------------------------------------------------//

    getUserDetails = async () => {
        consolepro.consolelog('getUserDetails');
        let user_details = await localStorage.getItemObject('user_arr');
        consolepro.consolelog('user_details', user_details);
        let url = config.baseURL + "getUserProfileDetails.php?user_id=" + user_details.user_id;
        consolepro.consolelog(url)
        apifuntion.getApi(url,1).then((obj) => {
            consolepro.consolelog('obj', obj)
            if (obj.success == "true") {
                consolepro.consolelog('HI this')
                if (obj.user_information_arr != 'NA') {
                    this.setState({ count_noti: obj.count_noti, user_information_arr: obj.user_information_arr, subscription_amount: obj.user_information_arr.plan_price, subscription_plan_name: obj.user_information_arr.plan_name, })
                    consolepro.consolelog('user_information_arr', obj.user_information_arr)
                }
                this.setState({
                    no_of_videos: obj.vedio_count,
                    no_of_question: obj.no_of_question_left,
                })
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

    //--------------------------------------------------------------//

    render() {
        return (
            <View style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
                <SafeAreaView style={{ flex: 0, backgroundColor: Colors.theme_color }} />
                <StatusBar backgroundColor={Colors.theme_color} barStyle='default' hidden={false} translucent={false}
                    networkActivityIndicatorVisible={true} />
                <ScrollView>
                    <View style={{ paddingBottom: 150, }}>
                        <View style={styles.setingsHeader}>
                            <Text> </Text>
                            <Text style={styles.OrderHistoryTitle}>Profile</Text>
                            <Text> </Text>
                        </View>
                        <View style={{ position: 'absolute', top: mobileW * 34 / 100, left: mobileW * 30 / 100 }}>
                            <Image resizeMode="cover" style={{ width: mobileW * 38 / 100, height: mobileW * 38 / 100, borderRadius: 100 }} source={this.state.imagepath == 'NA' ? localimag.default : { uri: this.state.imagepath }}></Image>
                        </View>
                        <View style={{ height: mobileH * 25 / 100, alignItems: 'center', justifyContent: 'flex-end' }}>
                            <Text style={{ fontSize: mobileW * 5.6 / 100, fontFamily: Font.bold }}>{this.state.name}</Text>
                            <Text style={{ fontSize: mobileW * 3.4 / 100, fontFamily: Font.medium, color: Colors.grey }}>{this.state.email}</Text>

                            {
                                this.state.user_information_arr != 'NA' && <Text style={{ fontSize: mobileW * 3.4 / 100, fontFamily: Font.medium, color: Colors.grey }}>{this.state.subscription_plan_name}(${this.state.subscription_amount})</Text>
                            }
                            {
                                this.state.user_information_arr != 'NA' &&
                                <Text style={{ fontSize: mobileW * 3.4 / 100, fontFamily: Font.medium, color: Colors.grey }}>{this.state.no_of_question} Remaining Question</Text>
                            }
                            {
                                parseInt(this.state.no_of_videos) > 0 &&
                                <Text style={{ fontSize: mobileW * 3.4 / 100, fontFamily: Font.medium, color: Colors.grey }}>{this.state.no_of_videos} Number of Videos</Text>
                            }
                            <Text style={{ fontSize: mobileW * 4 / 100, fontFamily: Font.bold, color: Colors.green }}>Active</Text>
                        </View>
                        <View style={{ height: mobileH * 35 / 100, alignItems: 'center', justifyContent: 'center', }}>


                            <TouchableOpacity activeOpacity={1} onPress={() => { this.props.navigation.navigate('EditProfile') }} style={{ flexDirection: 'row', borderBottomWidth: 0.7, alignItems: 'center', borderColor: Colors.font_color, width: mobileW * 84 / 100, alignSelf: 'center', justifyContent: 'space-between', paddingBottom: mobileH * 0.018 }}>
                                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                                    <Image resizeMode="cover" style={{ width: mobileW * 6.5 / 100, height: mobileW * 6.5 / 100, }} source={localimag.user12}></Image>
                                    <Text style={{ marginLeft: 10, fontSize: mobileW * 4 / 100, fontFamily: Font.bold }}>Edit Profile</Text>
                                </View>
                                <Image resizeMode="cover" style={{ width: mobileW * 5 / 100, height: mobileW * 5 / 100 }} source={localimag.arrow}></Image>
                            </TouchableOpacity>



                            <TouchableOpacity activeOpacity={1} onPress={() => { this.props.navigation.navigate('Setting') }} style={{ marginTop: 32, flexDirection: 'row', borderBottomWidth: 0.7, alignItems: 'center', borderColor: Colors.font_color, width: mobileW * 84 / 100, alignSelf: 'center', justifyContent: 'space-between', paddingBottom: mobileH * 0.018 }}>
                                <View style={{ flexDirection: 'row', alignItems: 'center', }}>
                                    <Image style={{ width: mobileW * 8 / 100, height: mobileW * 8 / 100, resizeMode: "contain" }} source={localimag.setin}></Image>
                                    <Text style={{ marginLeft: 10, fontSize: mobileW * 4 / 100, fontFamily: Font.bold }}>Settings</Text>
                                </View>
                                <Image resizeMode="cover" style={{ width: mobileW * 5 / 100, height: mobileW * 5 / 100, borderRadius: 100 }} source={localimag.arrow}></Image>
                            </TouchableOpacity>

                            <TouchableOpacity activeOpacity={1} onPress={() => { this.Logout(); }} style={{ marginTop: 32, flexDirection: 'row', alignItems: 'center', borderColor: Colors.font_color, width: mobileW * 84 / 100, alignSelf: 'center', justifyContent: 'space-between', }}>
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <Image resizeMode="cover" style={{ width: mobileW * 8 / 100, height: mobileW * 8 / 100, borderRadius: 100 }} source={localimag.logout}></Image>
                                    <Text style={{ marginLeft: 10, fontSize: mobileW * 4 / 100, fontFamily: Font.bold, color: 'red' }}>Logout</Text>
                                </View>
                                <Image resizeMode="cover" style={{ width: mobileW * 5 / 100, height: mobileH * 3 / 100 }} source={localimag.arrow}></Image>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView >
                <View style={{ backgroundColor: '#FFFFFF', elevation: 4, height: mobileH * 6 / 100, position: 'absolute', bottom: 0, width: mobileW * 100 / 100, alignSelf: 'center', shadowColor: '#000000', shadowOffset: { width: 2, height: 2, }, shadowOpacity: 0.30 }}>
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
                </View>
            </View >
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
        paddingTop: 60,
        paddingBottom: 140,
        alignItems: 'center'
    },
    OrderHistoryTitle: {
        color: Colors.white_color,
        fontFamily: Font.bold,
        fontSize: windowWidth * 5.2 / 100,
        letterSpacing: 0.5,
    },
});


