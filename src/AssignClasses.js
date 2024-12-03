import React, { Component } from 'react'
import { Text, View, TouchableOpacity, SafeAreaView, Dimensions, TextInput, StatusBar, ImageBackground, Image, ScrollView, FlatList, BackHandler, StyleSheet, Keyboard } from 'react-native'
import { config, Otpprovider, Mapprovider, apifuntion, Colors, Font, validation, mobileH, mobileW, SocialLogin, Cameragallery, mediaprovider, localStorage, Lang_chg, consolepro, msgProvider, msgTitle, msgText, Currentltlg } from './Providers/utilslib/Utils'
import { localimag } from './Providers/Localimageprovider/Localimage'
import Footerr from './Providers/Footerr';
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export default class AssignClasses extends Component {
    _didFocusSubscription;
    _willBlurSubscription;
    constructor(props) {
        super(props)
        this.state = {
            content_2: '',
            showSearch: false,
            txtsrch: '',
            footer_image: '',
            assign_class_arr: 'NA',
            count_noti: 0,
        }
        this._didFocusSubscription = props.navigation.addListener('focus', payload =>
            BackHandler.addEventListener('hardwareBackPress', this.handleBackPress)
        );
    }
    backpress = () => {
        this.props.navigation.goBack();
    }

    cross_click = async () => {
        this.setState({ showSearch: false })
    }

    //..............................................//

    componentDidMount = async () => {
        this._willBlurSubscription = this.props.navigation.addListener('blur', payload =>
            BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress)
        );
        this.props.navigation.addListener('focus', () => {
            this.getAllData();
            this.getAssignClasses();
        });
    }



    //..............................................//


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
        let user_details = await localStorage.getItemObject('user_arr');
        let footer_image = user_details.image;
        consolepro.consolelog('footer_image', footer_image)
        this.setState({ footer_image: footer_image })
    }

    //............................................//

    getAssignClasses = async () => {
        consolepro.consolelog('getAssignClasses');
        let user_details = await localStorage.getItemObject('user_arr');
        let url = config.baseURL + "getAssignClasses.php?user_id=" + user_details.user_id + "&expert_id=" + user_details.user_id;
        consolepro.consolelog(url)
        apifuntion.getApi(url).then((obj) => {
            consolepro.consolelog('obj', obj)
            if (obj.success == "true") {
                this.setState({ assign_class_arr: obj.assign_class_arr, count_noti: obj.count_noti })
                consolepro.consolelog('assign_class_arr', obj.assign_class_arr);
                localStorage.setItemObject('assign_class_arr', obj.assign_class_arr);
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

    //-------------------------------------------------------//

    render() {
        return (
            <View style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
                <SafeAreaView style={{ flex: 0, backgroundColor: Colors.theme_color }} />
                <StatusBar backgroundColor={Colors.theme_color} barStyle='default' hidden={false} translucent={false}
                    networkActivityIndicatorVisible={true} />
                <View style={styles.setingsHeader}>
                    <View style={{ width: mobileW * 10 / 100 }}></View>
                    <Text style={styles.OrderHistoryTitle}>Assign Classes</Text>
                    <View style={{ width: mobileW * 10 / 100 }}></View>
                </View>

                <View style={{ marginTop: 10, paddingBottom: 70 }}>
                    {this.state.assign_class_arr == 'NA' && <View style={{ alignItems: 'center', justifyContent: 'center', height: '100%' }}><Image resizeMode="contain" style={{ width: '50%', height: '50%', }} source={localimag.nodataFound}></Image></View>}
                    {this.state.assign_class_arr != 'NA' &&
                        <FlatList
                            data={this.state.assign_class_arr}
                            showsVerticalScrollIndicator={false}
                            renderItem={({ item, index }) => {
                                return (
                                    <TouchableOpacity activeOpacity={1} onPress={() => { this.props.navigation.navigate('ExpertLiveClass',{class_id:item.class_id}) }} style={{ width: windowWidth * 100 / 100, alignItems: 'center', justifyContent: 'flex-start', alignSelf: 'center', marginTop: 10 }}>
                                        <ImageBackground source={localimag.background}
                                            imageStyle={{ borderRadius: 20, resizeMode: 'cover' }}
                                            style={{ width: windowWidth * 90 / 100, }}>
                                            <View style={{ alignItems: 'flex-start', alignSelf: 'flex-start', width: windowWidth * 80 / 100, alignSelf: 'center', justifyContent: 'center', paddingVertical: mobileW * 8 / 100 }}>
                                                {/* <Text numberOfLines={1} style={{ color: Colors.purewhite, fontSize: mobileW * 3.2 / 100 }}>{item.title}</Text> */}
                                                <Text numberOfLines={2} style={{ color: Colors.purewhite, fontSize: mobileW * 4.1 / 100, fontFamily: Font.medium }}>{item.title}</Text>
                                                <Text numberOfLines={2} style={{ color: Colors.purewhite, fontSize: mobileW * 3.5 / 100 }}>{item.description}</Text>
                                                <View style={{ justifyContent: 'center', alignItems: 'flex-start' }}>
                                                    <Text style={{ color: Colors.purewhite, fontSize: mobileW * 3 / 100, marginTop: 3 }}>{item.name}</Text>
                                                    <Text style={{ color: Colors.purewhite, fontSize: mobileW * 3 / 100, marginTop: 3 }}>Number of section - {item.no_of_session}</Text>
                                                </View>
                                            </View>
                                        </ImageBackground>
                                    </TouchableOpacity>
                                )
                            }}
                            keyExtractor={(item, index) => index.toString()}>
                        </FlatList>}
                </View>
                <View style={{ backgroundColor: '#FFFFFF', elevation: 4, height: mobileH * 6 / 100, position: 'absolute', bottom: 0, width: mobileW * 100 / 100, alignSelf: 'center', shadowColor: '#000000', shadowOffset: { width: 2, height: 2, }, shadowOpacity: 0.30 }}>
                    <Footerr
                        activepage='AssignClasses'
                        usertype={1}
                        footerpage={[
                            { name: 'ExpertHome', countshow: false, image: localimag.home, activeimage: localimag.homdash, round: 'no' },

                            { name: 'AssignClasses', countshow: false, image: localimag.classes, activeimage: localimag.classes, round: 'no' },

                            { name: 'Notification', countshow: false, image: (this.state.count_noti > 0) ? localimag.bell_red : localimag.bell1, activeimage: (this.state.count_noti > 0) ? localimag.bell_red : localimag.bell1 },
                            { name: 'RatingReview', countshow: false, image: localimag.person1, activeimage: localimag.person1, round: 'no' },
                            { name: 'ExpertProfile', countshow: false, image: this.state.footer_image == null ? localimag.default : { uri: config.img_url3 + this.state.footer_image }, activeimage: this.state.footer_image == null ? localimag.default : { uri: config.img_url3 + this.state.footer_image }, round: 'yes' },
                        ]}
                        navigation={this.props.navigation}
                        imagestyle1={{ width: 32, height: 40, backgroundColor: '#FFFFFF', countcolor: 'red', countbackground: 'white', resizeMode: 'contain' }}
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
