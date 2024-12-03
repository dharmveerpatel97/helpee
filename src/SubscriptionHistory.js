import React, { Component } from 'react'
import { Text, View, TouchableOpacity, SafeAreaView, TextInput, FlatList, Alert, Modal, Dimensions, StatusBar, Image, ScrollView, BackHandler, StyleSheet } from 'react-native'
import { config, Otpprovider, Mapprovider, apifuntion, Colors, Font, validation, mobileH, mobileW, SocialLogin, Cameragallery, mediaprovider, localStorage, Lang_chg, consolepro, msgProvider, msgTitle, msgText, Currentltlg } from './Providers/utilslib/Utils'
import { localimag } from './Providers/Localimageprovider/Localimage'
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
import Footer from './Providers/Footer';
import Footerr from './Providers/Footerr';
import HideWithKeyboard from 'react-native-hide-with-keyboard';
export default class SubscriptionHistory extends Component {
    constructor(props) {
        super(props)
        this.state = {
            subscription: '',
            amount: '',
            bom: '',
            eom: '',
            modalVisible2: false,
            subscription_history_arr: 'NA',
            user_type: 0,
            footer_image: null,
        }
    }
    backpress = () => {
        this.props.navigation.goBack();
    }
    componentDidMount = () => {
        this.getSubscriptionHistory();
        this.setUserType();
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
    getSubscriptionHistory = async () => {
        consolepro.consolelog('getSubscriptionHistory');
        let user_details = await localStorage.getItemObject('user_arr');
        consolepro.consolelog('user_details', user_details);
        let url = config.baseURL + "getSubscriptionHistory.php?user_id=" + user_details.user_id;
        consolepro.consolelog(url)
        apifuntion.getApi(url).then((obj) => {
            consolepro.consolelog('obj', obj)
            if (obj.success == "true") {
                consolepro.consolelog('objgot', obj)
                this.setState({ subscription_history_arr: obj.subscription_history_arr })
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


    //--------------------************------------------------------------//
    render() {
        return (
            <View style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
                <SafeAreaView style={{ flex: 0, backgroundColor: Colors.theme_color }} />
                <StatusBar backgroundColor={Colors.theme_color} barStyle='default' hidden={false} translucent={false}
                    networkActivityIndicatorVisible={true} />
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={this.state.modalVisible2}
                    onRequestClose={() => {
                        consolepro.consolelog('Modal has been closed.');
                    }}>
                    <View
                        style={{
                            flex: 1,
                            backgroundColor: 'rgba(0, 0, 0, 0.8)',
                            alignItems: 'center',
                            justifyContent: 'center',
                            borderRadius: 0,
                        }}>
                        <View style={styles.signupPopupotp}>
                            <View style={{ width: mobileW * 70 / 100, alignSelf: 'center', paddingBottom: 40 }}>
                                <Text style={{ fontFamily: Font.bold, fontSize: mobileW * 4 / 100 }}>Are you sure want to cancel your subscription?</Text>
                            </View>
                            <View style={{ flexDirection: 'row', alignSelf: 'flex-end', justifyContent: 'space-between', padding: 6, width: mobileW * 32 / 100, marginRight: 35, marginTop: 20 }}>
                                <View style={{ padding: 5, alignItems: 'center', justifyContent: 'center', paddingLeft: 14, paddingRight: 14 }}>
                                    <Text style={{ fontFamily: Font.bold, fontSize: mobileW * 3.6 / 100 }} onPress={() => { this.setState({ modalVisible2: false }) }}>No</Text>
                                </View>
                                <View style={{ backgroundColor: Colors.theme_color, padding: 5, alignItems: 'center', justifyContent: 'center', paddingLeft: 14, paddingRight: 14 }}>
                                    <Text style={{ fontFamily: Font.bold, fontSize: mobileW * 3.6 / 100 }} onPress={() => { this.setState({ modalVisible2: false }); this.props.navigation.navigate('ReasonPage') }}>Yes</Text>
                                </View>
                            </View>
                        </View>
                    </View>
                </Modal>
                <View style={styles.setingsHeader}>
                    <TouchableOpacity activeOpacity={0.9} onPress={() => { this.backpress() }}>
                        <Image resizeMode="contain" style={{ width: 35, height: 40 }} source={localimag.back}></Image>
                    </TouchableOpacity>
                    <Text style={styles.OrderHistoryTitle}>Subscription History</Text>
                    <Text style={{ width: 20 }}> </Text>
                </View>
                <View style={{ paddingBottom: mobileW * 20 / 100 }}>
                    {this.state.subscription_history_arr == 'NA' && <View style={{ alignItems: 'center', justifyContent: 'center', height: '100%' }}><Image resizeMode="contain" style={{ width: '50%', height: '50%', }} source={localimag.nodataFound}></Image></View>}
                    {this.state.subscription_history_arr != 'NA' &&
                        <FlatList
                            data={this.state.subscription_history_arr}
                            showsVerticalScrollIndicator={false}
                            contentContainerStyle={{ paddingBottom: 90 }}
                            renderItem={({ item, index }) => {
                                return (
                                    <View style={{ marginBottom: 2, width: mobileW * 90 / 100, alignSelf: 'center', backgroundColor: Colors.purewhite, elevation: 10, marginTop: 15, shadowColor: '#000000', shadowOffset: { width: 2, height: 2, }, shadowOpacity: 0., paddingBottom: 20 }}>
                                        <View style={{ justifyContent: 'space-between', flexDirection: 'row', width: mobileW * 82 / 100, alignSelf: 'center', marginTop: 10 }}>
                                            <Text style={{ fontFamily: Font.bold, fontSize: mobileW * 4.5 / 100, color: Colors.textColor }}>Status</Text>
                                            <Text style={{ fontFamily: Font.bold, fontSize: mobileW * 4.5 / 100, color: Colors.textColor, color: Colors.theme_color }}>Active</Text>
                                        </View>
                                        <View style={{ justifyContent: 'space-between', flexDirection: 'row', width: mobileW * 82 / 100, alignSelf: 'center', marginTop: 10 }}>
                                            <Text style={{ fontFamily: Font.bold, fontSize: mobileW * 4.5 / 100, color: Colors.textColor }}>Type</Text>
                                            <Text style={{ fontFamily: Font.bold, fontSize: mobileW * 3.5 / 100, color: Colors.textColor, }}>{item.type}</Text>
                                        </View>
                                        <View style={{ justifyContent: 'space-between', flexDirection: 'row', width: mobileW * 82 / 100, alignSelf: 'center', marginTop: 10 }}>
                                            <Text style={{ fontFamily: Font.bold, fontSize: mobileW * 4.5 / 100, color: Colors.textColor }}>Plan name</Text>
                                            <Text style={{ fontFamily: Font.bold, fontSize: mobileW * 3.5 / 100, color: Colors.textColor, }}>{item.plan_name}</Text>
                                        </View>
                                        <View style={{ justifyContent: 'space-between', flexDirection: 'row', width: mobileW * 82 / 100, alignSelf: 'center', marginTop: 10 }}>
                                            <Text style={{ fontFamily: Font.bold, fontSize: mobileW * 4.5 / 100, color: Colors.textColor }}>Amount</Text>
                                            <Text style={{ fontFamily: Font.bold, fontSize: mobileW * 3.5 / 100, color: Colors.textColor, }}>${item.amount}</Text>
                                        </View>
                                        <View style={{ justifyContent: 'space-between', flexDirection: 'row', width: mobileW * 82 / 100, alignSelf: 'center', marginTop: 10 }}>
                                            <Text style={{ fontFamily: Font.bold, fontSize: mobileW * 4.5 / 100, color: Colors.textColor }}>Start date</Text>
                                            <Text style={{ fontFamily: Font.bold, fontSize: mobileW * 3.5 / 100, color: Colors.textColor, }}>{item.start_date}</Text>
                                        </View>
                                        <View style={{ justifyContent: 'space-between', flexDirection: 'row', width: mobileW * 82 / 100, alignSelf: 'center', marginTop: 10 }}>
                                            <Text style={{ fontFamily: Font.bold, fontSize: mobileW * 4.5 / 100, color: Colors.textColor }}>End Date</Text>
                                            <Text style={{ fontFamily: Font.bold, fontSize: mobileW * 3.5 / 100, color: Colors.textColor, }}>{item.expiry_date}</Text>
                                        </View>
                                        <View style={{ justifyContent: 'space-between', flexDirection: 'row', width: mobileW * 82 / 100, alignSelf: 'center', marginTop: 10 }}>
                                            <View>
                                                <Text style={{ fontFamily: Font.bold, fontSize: mobileW * 4.5 / 100, color: Colors.textColor }}>Transaction Id</Text>
                                            </View>
                                            <View style={{ width: mobileW * 40 / 100 }}>
                                                <Text style={{ fontFamily: Font.bold, fontSize: mobileW * 3.5 / 100, color: Colors.textColor, }}>{item.txn_id}</Text>
                                            </View>
                                        </View>
                                        <View style={{ justifyContent: 'space-between', flexDirection: 'row', width: mobileW * 82 / 100, alignSelf: 'center', marginTop: 10 }}>
                                            <Text style={{ fontFamily: Font.bold, fontSize: mobileW * 4.5 / 100, color: Colors.textColor }}>{item.type == 'Question' ? 'Number of Questions': 'Number of Videos'}</Text>
                                            <Text style={{ fontFamily: Font.bold, fontSize: mobileW * 3.5 / 100, color: Colors.textColor, }}>{item.no_of_questions}</Text>
                                        </View>
                                    </View>
                                )
                            }}
                            keyExtractor={(item, index) => index.toString()}>
                        </FlatList>}
                </View>
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
    setingsHeader: {
        flexDirection: 'row',
        backgroundColor: Colors.purewhite,
        justifyContent: 'space-between',
        paddingLeft: 20,
        paddingRight: 20,
        paddingTop: 5,
        paddingBottom: 25,
        alignItems: 'center',
        elevation: 2,
        shadowColor: '#000000',
        shadowOffset: { width: 2, height: 2, },
        shadowOpacity: 0.30
    },
    OrderHistoryTitle: {
        color: Colors.font_color,
        fontFamily: Font.bold,
        fontSize: windowWidth * 0.048,
        letterSpacing: 0.5,
    },
    //OTP Popup
    signupPopupotp: {
        paddingVertical: 10,
        borderRadius: 0,
        paddingTop: 45,
        backgroundColor: '#fff',
        width: '90%',
        paddingBottom: 20,
        textAlign: 'center',
        alignItems: 'center',
    }

});


