import React, { Component } from 'react'
import { Text, View, TouchableOpacity, SafeAreaView, Dimensions, StatusBar, Image, ScrollView, BackHandler, StyleSheet } from 'react-native'
import { config, Otpprovider, Mapprovider, apifuntion, Colors, Font, validation, mobileH, mobileW, SocialLogin, Cameragallery, mediaprovider, localStorage, Lang_chg, consolepro, msgProvider, msgTitle, msgText, Currentltlg } from './Providers/utilslib/Utils'
import HTMLView from 'react-native-htmlview';
import { localimag } from './Providers/Localimageprovider/Localimage'
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

import Footer from './Providers/Footer';
import Footerr from './Providers/Footerr';
import HideWithKeyboard from 'react-native-hide-with-keyboard';

export default class TermsConditions extends Component {
    constructor(props) {
        super(props)
        this.state = {
            content_2: '',
            user_type: 1,
            footer_image: null,
        }
        this.setUserType();
    }

    backpress = () => {
        this.props.navigation.goBack();
    }
    backpress = () => {
        this.props.navigation.goBack();
    }
    componentDidMount = () => {
        this.get_term_condition();
    }
    setUserType = async () => {
        let result = await localStorage.getItemObject('user_arr')
        if (result != null) {
            this.setState({
                user_type: result.user_type,
                footer_image: result.image,
            })
        }
    }
    //-----------------***********--------------------//
    get_term_condition = async () => {
        consolepro.consolelog('get_term_condition');

        let url = config.baseURL + "get_all_content.php?user_id=" + 0;
        consolepro.consolelog(url)
        apifuntion.getApi(url).then((obj) => {
            consolepro.consolelog('obj', obj)
            if (obj.success == "true") {
                consolepro.consolelog('HI this')
                this.setState({ content_2: obj.content_arr[2].content[0] })
                if (obj.content_arr[2].content[0] == null) {
                    this.setState({ content_2: '' })
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
    //--------------------************------------------------------------//
    render() {
        return (
            <View style={{ flex: 1, height: '100%', width: '100%', backgroundColor: '#FFFFFF' }}>
                <SafeAreaView style={{ flex: 0, backgroundColor: Colors.theme_color }} />
                <StatusBar backgroundColor={Colors.theme_color} barStyle='default' hidden={false} translucent={false}
                    networkActivityIndicatorVisible={true} />
                <View style={styles.setingsHeader}>
                    <TouchableOpacity activeOpacity={0.9} onPress={() => { this.backpress() }}>
                        <Image resizeMode="contain" style={{ width: 25, height: 30 }} source={localimag.back}></Image>
                    </TouchableOpacity>
                    <Text style={styles.OrderHistoryTitle}>Terms & Conditions</Text>
                    <Text></Text>
                </View>
                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 90 }}>
                    <View style={styles.privacy_View}>
                        <HTMLView value={this.state.content_2} />
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
    //Privacy
    privacy_View: {
        width: '90%',
        marginLeft: 10,
        alignItems: 'center',
        alignSelf: 'center',
        marginTop: 30,
    },
});


