import React, { Component } from 'react'
import { Text, View, TouchableOpacity, SafeAreaView, TextInput, Alert, FlatList, Dimensions, StatusBar, Image, ScrollView, BackHandler, StyleSheet, Keyboard } from 'react-native'
import { config, Otpprovider, Mapprovider, apifuntion, Colors, Font, validation, mobileH, mobileW, SocialLogin, Cameragallery, mediaprovider, localStorage, Lang_chg, consolepro, msgProvider, msgTitle, msgText, Currentltlg } from './Providers/utilslib/Utils'
import { localimag } from './Providers/Localimageprovider/Localimage'
import StarRating from 'react-native-star-rating';
import Footerr from './Providers/Footerr';
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
export default class ExpertProfile extends Component {
    _didFocusSubscription;
    _willBlurSubscription;
    constructor(props) {
        super(props)
        this.state = {
            name: 'NA',
            about: '',
            education: 'NA',
            image: '',
            speciality_name: 'NA',

            paypal_id: 'NA',
            document_arr: 'NA',
            document_name: '',
            footer_image: null,
            count_noti: 0,
            avg_rat: 0,
            rate_count: 0,
            satisfied_customer: 0,
        }
        this._didFocusSubscription = props.navigation.addListener('focus', payload =>
            BackHandler.addEventListener('hardwareBackPress', this.handleBackPress)
        );
    }
    backpress = () => {
        this.props.navigation.goBack();
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
    componentDidMount = () => {
        this._willBlurSubscription = this.props.navigation.addListener('blur', payload =>
            BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress)
        );
        this.props.navigation.addListener('focus', () => {
            this.getProfileData();
            this.getDocument();
            this.getAllData();
        });
    }

    getAllData = async () => {
        consolepro.consolelog('getAllData')
        let user_details = await localStorage.getItemObject('user_arr');
        consolepro.consolelog('user_details', user_details)
        let footer_image = user_details.image;
        consolepro.consolelog('footer_image', footer_image)
        this.setState({ footer_image: footer_image })
    }

    getProfileData = async () => {
        let user_details = await localStorage.getItemObject('user_arr');
        consolepro.consolelog('user_detailhere', user_details)
        let name = user_details.name;
        let education = user_details.education;
        let speciality_name = user_details.speciality_name;
        let image = user_details.image;
        let about = user_details.about;
        let paypal_id = user_details.paypal_id;
        let satisfied_customer = user_details.satisfied_customer;
        let rating = user_details.rating;
        consolepro.consolelog('imagewe', image)
        if (user_details != 'NA' && user_details != null) {
            this.setState({ name: name, education: education, speciality_name: speciality_name, about: about, satisfied_customer: satisfied_customer, paypal_id: paypal_id, rating: rating });
        } else {
            this.setState({ education: 'NA', speciality_name: 'NA', });
        }
        if (image != null && image != "") {
            this.setState({ image: config.img_url3 + image });
            consolepro.consolelog('imagepath1', this.state.image)
        } else {
            consolepro.consolelog('imagepath2', this.state.image)
            this.setState({ image: 'NA' });
        }
    }

    //-----------------***********------------------//

    getDocument = async () => {
        consolepro.consolelog('getDocument');
        let user_details = await localStorage.getItemObject('user_arr');
        consolepro.consolelog('user_details', user_details);
        let url = config.baseURL + "getExpertDocuments.php?user_id=" + user_details.user_id;
        consolepro.consolelog(url)
        apifuntion.getApi(url,1).then((obj) => {
            consolepro.consolelog('obj', obj)
            if (obj.success == "true") {
                consolepro.consolelog('HI this')
                this.setState({ document_arr: obj.document_arr, count_noti: obj.count_noti, avg_rat: obj.avg_rat, rate_count: obj.rate_count, satisfied_customer: obj.satisfied_customer })
                consolepro.consolelog('document_arr', obj.document_arr)
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

    //--------------------************----------------------//
    render() {
        consolepro.consolelog('document_arr igot', this.state.document_arr)
        return (
            <View style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
                <SafeAreaView style={{ flex: 0, backgroundColor: Colors.theme_color }} />
                <StatusBar backgroundColor={Colors.theme_color} barStyle='default' hidden={false} translucent={false}
                    networkActivityIndicatorVisible={true} />
                <ScrollView showsVerticalScrollIndicator={false}>
                    <View style={{ paddingBottom: 50 }}>
                        <View style={styles.setingsHeader}>
                            <Text> </Text>
                            <Text style={styles.OrderHistoryTitle}>Profile</Text>
                            <TouchableOpacity activeOpacity={0.9} onPress={() => { this.props.navigation.navigate('Setting') }}>
                                <Image resizeMode="contain" style={{ width: 30, height: 30 }} source={localimag.setting}></Image>
                            </TouchableOpacity>
                        </View>
                        <View style={{ position: 'absolute', top: mobileW * 15 / 100, left: mobileW * 30 / 100, alignItems: 'center', }}>
                            <Image resizeMode="cover" style={{ width: mobileW * 32 / 100, height: mobileW * 32 / 100, borderRadius: 100 }} source={this.state.image == 'NA' ? localimag.default : { uri: this.state.image }}></Image>
                            <Text style={{ color: Colors.purewhite, fontSize: mobileW * 5.5 / 100, fontFamily: Font.bold }}>{this.state.name}</Text>
                            <View style={{ flexDirection: 'row', alignItems: 'center', }}>
                                <StarRating
                                    containerStyle={{ width: windowWidth * 16 / 100, height: windowHeight * 3 / 100, alignSelf: 'center', alignItems: 'center' }}
                                    fullStar={localimag.star}
                                    emptyStar={localimag.stargrey}
                                    halfStarColor={'#FFC815'}
                                    disabled={true}
                                    maxStars={5}
                                    starSize={mobileW * 3.2 / 100}
                                    rating={this.state.avg_rat} />
                                <Text style={{ color: Colors.purewhite, fontSize: mobileW * 3 / 100, fontFamily: Font.regular }}>({this.state.rate_count})</Text>
                            </View>
                        </View>
                        <View style={{ flexDirection: 'row', elevation: 10, backgroundColor: Colors.purewhite, width: mobileW * 90 / 100, alignSelf: 'center', justifyContent: 'center', height: mobileH * 15 / 100, position: 'absolute', top: mobileW * 61 / 100, shadowColor: '#000000', shadowOffset: { width: 2, height: 2, }, shadowOpacity: 0.20 }}>
                            <View style={{ alignItems: 'center', justifyContent: 'center', width: mobileW * 45 / 100, }}>
                                <Text style={{ color: Colors.theme_color, fontSize: mobileW * 6.2 / 100, fontFamily: Font.bold }}>{this.state.satisfied_customer}</Text>
                                <Text style={{ color: Colors.theme_color, fontSize: mobileW * 4.3 / 100, fontFamily: Font.bold }}>Satisfied Customers</Text>
                            </View>
                            <View style={{ alignItems: 'center', justifyContent: 'center', width: mobileW * 45 / 100 }}>
                                <Image resizeMode="contain" style={{ width: mobileW * 8 / 100, height: mobileW * 8 / 100, borderRadius: 100 }} source={localimag.greencheck}></Image>
                                <Text style={{ color: Colors.theme_color, fontSize: mobileW * 4.3 / 100, fontFamily: Font.bold }}>Verified Expert</Text>
                            </View>
                        </View>
                        <View style={{ height: mobileH * 16 / 100, alignItems: 'flex-start', marginTop: mobileH * 8 / 100, width: mobileW * 88 / 100, alignSelf: 'center' }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center',marginTop:mobileW*4/100 }}>
                                <Image resizeMode="contain" style={{ width: mobileW * 5.2 / 100, height: mobileH * 7 / 100, }} source={localimag.profession}></Image>
                                <Text style={{ marginLeft: 10, fontSize: mobileW * 4.5 / 100, fontFamily: Font.medium }}>{this.state.speciality_name}</Text>
                            </View>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Image resizeMode="contain" style={{ width: mobileW * 5.2 / 100, height: mobileH * 7 / 100, }} source={localimag.degreee}></Image>
                                <Text style={{ marginLeft: 10, fontSize: mobileW * 4.5 / 100, fontFamily: Font.medium }}>{this.state.education}</Text>
                            </View>
                        </View>
                        <View style={{ alignItems: 'flex-start', width: mobileW * 88 / 100, alignSelf: 'center', }}>
                            <Text style={{ color: Colors.theme_color, fontFamily: Font.bold, fontSize: mobileW * 4.2 / 100 }}>Description</Text>
                            <Text style={{ fontFamily: Font.medium, fontSize: mobileW * 4.3 / 100, marginTop: 10 }}>{this.state.about}</Text>
                        </View>
                        <View style={{ height: mobileH * 15 / 100, alignItems: 'flex-start', width: mobileW * 88 / 100, alignSelf: 'center', marginTop: mobileW * 4 / 100 }}>
                            <Text style={{ color: Colors.theme_color, fontFamily: Font.bold, fontSize: mobileW * 4.2 / 100 }}>Documents</Text>
                            <FlatList
                                data={this.state.document_arr}
                                horizontal={true}
                                showsVerticalScrollIndicator={false}
                                renderItem={({ item, index }) => {
                                    consolepro.consolelog('image igot', config.img_url3 + item.name)
                                    return (
                                        <View style={{ width: mobileW * 18 / 100, }}>
                                            <Image resizeMode="contain" style={{ width: mobileW * 12 / 100, height: mobileH * 10 / 100, }} source={item.name == null ? localimag.png : { uri: config.img_url3 + item.name }}></Image>
                                        </View>)
                                }}
                                keyExtractor={(item, index) => index.toString()}>
                            </FlatList>
                        </View>
                        <View style={{ height: mobileH * 12 / 100, alignItems: 'flex-start', width: mobileW * 88 / 100, alignSelf: 'center' }}>
                            <Text style={{ color: Colors.theme_color, fontFamily: Font.bold, fontSize: mobileW * 4.2 / 100 }}>PayPal Id</Text>
                            <Text style={{ fontFamily: Font.bold, fontSize: mobileW * 4.4 / 100 }}>{this.state.paypal_id}</Text>
                        </View>
                    </View>
                </ScrollView>
                <View style={{ backgroundColor: '#FFFFFF', elevation: 4, height: mobileH * 6 / 100, position: 'absolute', bottom: 0, width: mobileW * 100 / 100, alignSelf: 'center' }}>
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
        paddingHorizontal: 20,
        paddingTop: 0,
        paddingBottom: mobileW * 68 / 100,
        alignItems: 'center'
    },
    OrderHistoryTitle: {
        color: Colors.white_color,
        fontFamily: Font.medium,
        fontSize: windowWidth * 5.2 / 100,
        letterSpacing: 0.5,
    },
});


