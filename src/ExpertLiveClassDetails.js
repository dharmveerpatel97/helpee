import React, { Component } from 'react'
import { Text, View, TouchableOpacity, SafeAreaView, Dimensions, FlatList, StatusBar, Image, ScrollView, BackHandler, StyleSheet } from 'react-native'
import { config, Otpprovider, Mapprovider, apifuntion, Colors, Font, validation, mobileH, mobileW, SocialLogin, Cameragallery, mediaprovider, localStorage, Lang_chg, consolepro, msgProvider, msgTitle, msgText, Currentltlg } from './Providers/utilslib/Utils'
import { localimag } from './Providers/Localimageprovider/Localimage'
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
import Footerr from './Providers/Footerr';
import HideWithKeyboard from 'react-native-hide-with-keyboard';

const demoArray = [
    { date: '18-08-2021', time: '8:00Am-9:00Am', status: 'Not Started', color: 1, button_status: 'Start Now' },
    { date: '18-08-2021', time: '8:00Am-9:00Am', status: 'Live Now', color: 2, button_status: 'Join Now' },
    { date: '18-08-2021', time: '8:00Am-9:00Am', status: 'Completed', color: 3, button_status: 'Watch Now' },
];
export default class ExpertLiveClassDetails extends Component {
    constructor(props) {
        super(props)
        this.state = {
            starCount: 4,
            class_id: '',
            class_details_arr: 'NA',
            payment_arr: 'NA',
            speciality_name: '',
            topic_description: '',
            title: '',
            expert_name: '',
            about_me: '',
            rating: '',
            image: '',
            session_arr: 'NA',
            footer_image: null,
        }
    }
    backpress = () => {
        this.props.navigation.goBack();
    }
    componentDidMount = async () => {
        this.props.navigation.addListener('focus', () => {
            this.getClassDetails();
        });
        await localStorage.setItemObject('navigate', false);
    }

    //---------------------------------------------------//

    getClassDetails = async () => {
        consolepro.consolelog('getClassDetails');
        let user_details = await localStorage.getItemObject('user_arr');
        let class_id = await localStorage.getItemObject('class_id');
        this.setState({ class_id: class_id, footer_image: user_details.image })
        consolepro.consolelog('class_id', class_id);
        consolepro.consolelog('user_details_ba', user_details);
        let url = config.baseURL + "getClassesDetails.php?user_id=" + user_details.user_id + "&class_id=" + this.state.class_id;
        consolepro.consolelog(url)
        apifuntion.getApi(url).then((obj) => {
            consolepro.consolelog('obj', obj)
            if (obj.success == "true") {
                this.setState({
                    class_details_arr: obj.class_details_arr[0], speciality_name: obj.class_details_arr[0].speciality_name,
                    topic_description: obj.class_details_arr[0].topic_description, title: obj.class_details_arr[0].title,
                    expert_name: obj.class_details_arr[0].name, image: obj.class_details_arr[0].image,
                    rating: obj.class_details_arr[0].rating, about_me: obj.class_details_arr[0].about_me
                })
                consolepro.consolelog('class_details_arr', obj.class_details_arr);
                this.setState({ session_arr: obj.session_arr })
                this.setState({ payment_status: obj.session_arr.payment_status })
                consolepro.consolelog('payment_arr', obj.payment_arr);
                consolepro.consolelog('session_arr', obj.session_arr);
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

    //-----------------------------------------------------------//
    render() {
        return (
            <View style={{ flex: 1, }}>
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
                <ScrollView>
                    <View style={{ paddingBottom: mobileW * 10 / 100, }}>
                        <View style={{ borderBottomWidth: 0.7 }}>
                            <View style={{ width: mobileW * 90 / 100, alignSelf: 'center' }}>
                                <View style={{ paddingVertical: mobileW * 5 / 100, justifyContent: 'center', alignItems: 'flex-start' }}>
                                    <Text style={{ fontSize: mobileW * 4 / 100, fontFamily: Font.bold }}>{this.state.speciality_name}</Text>
                                    <Text style={{ fontSize: mobileW * 5.5 / 100, fontFamily: Font.medium }}>{this.state.title}</Text>
                                    <Text style={{ fontSize: mobileW * 4.5 / 100, fontFamily: Font.medium }}>{this.state.topic_description}</Text>
                                </View>
                            </View>
                        </View>
                        <View style={{ marginTop: mobileW * 5 / 100 }}>
                            <Text style={{ fontSize: mobileW * 4 / 100, fontFamily: 'Roboto-Bold', paddingLeft: 20 }}>Sections</Text>
                            {this.state.session_arr == 'NA' && <View style={{ alignItems: 'center', justifyContent: 'center', height: '100%' }}><Image resizeMode="contain" style={{ width: '50%', height: '50%', }} source={localimag.nodataFound}></Image></View>}
                            {this.state.session_arr != 'NA' &&
                                <FlatList
                                    data={this.state.session_arr}
                                    showsVerticalScrollIndicator={false}
                                    contentContainerStyle={{ paddingBottom: 60 }}
                                    renderItem={({ item, index }) => {
                                        return (
                                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', borderBottomWidth: 1, paddingVertical: 20, paddingHorizontal: 20 }}>
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
                                                {/* {item.button_status != 'Start Now' && <View style={{ backgroundColor: Colors.theme_color, width: mobileW * 18 / 100, justifyContent: 'center', alignItems: 'center', paddingVertical: 2 }}>
                                                <Text style={{ fontSize: mobileW * 3 / 100, fontFamily: 'Roboto-Medium', color: Colors.purewhite }}>{item.button_status}</Text>
                                            </View>} */}
                                            </View>
                                        )
                                    }}
                                    keyExtractor={(item, index) => index.toString()}>
                                </FlatList>}
                        </View>
                    </View>
                </ScrollView>
                <Footerr
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


