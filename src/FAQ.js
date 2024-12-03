import React, { Component } from 'react'
import { Text, View, TouchableOpacity, SafeAreaView, TextInput, FlatList, Alert, Modal, Dimensions, StatusBar, Image, ScrollView, BackHandler, StyleSheet, Keyboard } from 'react-native'
import { config, Otpprovider, Mapprovider, apifuntion, Colors, Font, validation, mobileH, mobileW, SocialLogin, Cameragallery, mediaprovider, localStorage, Lang_chg, consolepro, msgProvider, msgTitle, msgText, Currentltlg } from './Providers/utilslib/Utils'
import { localimag } from './Providers/Localimageprovider/Localimage'
import { Collapse, CollapseHeader, CollapseBody, AccordionList } from 'accordion-collapse-react-native';
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
import Footer from './Providers/Footer';
import Footerr from './Providers/Footerr';
import HideWithKeyboard from 'react-native-hide-with-keyboard';
export default class FAQ extends Component {
    constructor(props) {
        super(props)
        this.state = {
            subscription: '',
            amount: '',
            bom: '',
            eom: '',
            modalVisible2: false,
            user_type: 0,
            footer_image: null,
        }
        this.setUserType()
    }
    backpress = () => {
        this.props.navigation.goBack();
    }
    componentDidMount = () => {
        this.FAQ();
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
    FAQ = async () => {
        consolepro.consolelog('FAQ');
        let user_details = await localStorage.getItemObject('user_arr');
        consolepro.consolelog('user_details', user_details);
        let url = config.baseURL + "getFAQ.php?user_id=" + user_details.user_id + "&faq_type=" + user_details.user_type;
        consolepro.consolelog(url)
        apifuntion.getApi(url).then((obj) => {
            consolepro.consolelog('obj', obj)
            if (obj.success == "true") {
                consolepro.consolelog('true')
                this.setState({ faq_arr: obj.faq_arr })
                consolepro.consolelog('faq_arr', this.state.faq_arr)
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
                <View style={styles.setingsHeader}>
                    <TouchableOpacity activeOpacity={0.9} onPress={() => { this.props.navigation.goBack() }}>
                        <Image resizeMode="contain" style={{ width: 35, height: 40 }} source={localimag.back}></Image>
                    </TouchableOpacity>
                    <Text style={styles.OrderHistoryTitle}>FAQs</Text>
                    <Text style={{ width: 20 }}> </Text>
                </View>
                <View style={{ marginTop: 30, width: mobileW * 100 / 100, alignItems: 'center', alignSelf: 'center', paddingBottom: 80 }}>
                    <FlatList
                        data={this.state.faq_arr}
                        showsVerticalScrollIndicator={false}

                        contentContainerStyle={{ paddingBottom: 120 }}
                        renderItem={({ item, index }) => {
                            return (
                                <Collapse>
                                    <CollapseHeader>
                                        <View style={{ borderBottomColor: Colors.theme_color, borderBottomWidth: 0.6, padding: 20, width: mobileW * 100 / 100, alignSelf: 'center' }}>
                                            <View style={{ width: mobileW * 86 / 100, alignSelf: 'center', alignItems: 'flex-start', flexDirection: 'row' }}>
                                                <Text style={{ fontFamily: Font.medium, color: Colors.theme_color, fontSize: mobileW * 4.2 / 100,width:windowWidth*80/100 }}>{item.question}</Text>
                                                <Image resizeMode="contain" style={{ width: 35, height: 25,position:'absolute',right:0 }} source={localimag.drop}></Image>
                                            </View>
                                        </View>
                                    </CollapseHeader>
                                    <CollapseBody>
                                        <View style={{ padding: 20, width: mobileW * 100 / 100, alignSelf: 'center', backgroundColor: '#DBECFB' }}>
                                            <Text style={{ fontFamily: Font.medium, fontSize: mobileW * 4.2 / 100 }}>{item.answer}</Text>
                                            <View style={{ alignItems: 'flex-end', marginTop: 20 }}>
                                                <Text style={{ fontSize: mobileW * 3 / 100 }}>Was this helpful?</Text>
                                            </View>
                                        </View>
                                    </CollapseBody>
                                </Collapse>
                            )
                        }}
                        keyExtractor={(item, index) => index.toString()}>
                    </FlatList>
                    <AccordionList
                        list={this.state.list}
                        header={this._head}
                        body={this._body}
                        keyExtractor={item => item.key} />
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
                        activepage="ExpertProfile"

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
        fontSize: windowWidth * 5.2 / 100,
        letterSpacing: 0.5,
    },
});


