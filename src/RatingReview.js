import React, { Component } from 'react'
import { Text, View, TouchableOpacity, SafeAreaView, FlatList, TextInput, Alert, Modal, Dimensions, StatusBar, Image, ScrollView, BackHandler, StyleSheet } from 'react-native'
import { config, Otpprovider, Mapprovider, apifuntion, Colors, Font, validation, mobileH, mobileW, SocialLogin, Cameragallery, mediaprovider, localStorage, Lang_chg, consolepro, msgProvider, msgTitle, msgText, Currentltlg } from './Providers/utilslib/Utils'
import { localimag } from './Providers/Localimageprovider/Localimage'
import StarRating from 'react-native-star-rating';
import Footerr from './Providers/Footerr';
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export default class RatingReview extends Component {
    _didFocusSubscription;
    _willBlurSubscription;
    constructor(props) {
        super(props)
        this.state = {
            modalVisible2: false,
            starCount: 4,
            status: '',
            footer_image: '',
            avg_rat: '',
            total_rate: '',
            one: '',
            two: '',
            three: '',
            four: '',
            five: '',
            rating_arr: 'NA',
            count_noti: 0
        }
        this._didFocusSubscription = props.navigation.addListener('focus', payload =>
            BackHandler.addEventListener('hardwareBackPress', this.handleBackPress)
        );
    }
    backpress = () => {
        this.props.navigation.goBack();
    }

    //------------------------------------------------//
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
    componentDidMount = async () => {
        this._willBlurSubscription = this.props.navigation.addListener('blur', payload =>
            BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress)
        );
        await localStorage.setItemObject('status', false);
        this.getAllData();
        this.getRatingReview();
    }

    //-----------------------------------------------//

    getAllData = async () => {
        consolepro.consolelog('getAllData')
        let user_details = await localStorage.getItemObject('user_arr');
        consolepro.consolelog('user_details', user_details)
        let footer_image = user_details.image;
        consolepro.consolelog('footer_image', footer_image)
        this.setState({ footer_image: footer_image })
    }

    //-----------------------------------------------//

    getRatingReview = async () => {
        consolepro.consolelog('getRatingReview');
        let user_details = await localStorage.getItemObject('user_arr');
        consolepro.consolelog('user_details', user_details);
        let url = config.baseURL + "getRatingReview.php?expert_id=" + user_details.user_id;
        consolepro.consolelog(url)
        apifuntion.getApi(url).then((obj) => {
            consolepro.consolelog('obj', obj)
            if (obj.success == "true") {
                consolepro.consolelog('objgot', obj)
                this.setState({
                    avg_rat: obj.avg_rat, total_rate: obj.total_rate, count_noti: obj.count_noti,
                    one: obj.one, two: obj.two, three: obj.three, four: obj.four, five: obj.five,
                    rating_arr: obj.rating_arr
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

    //------------------------------------------------------//

    render() {
        return (
            <View style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
                <SafeAreaView style={{ flex: 0, backgroundColor: Colors.theme_color }} />
                <StatusBar backgroundColor={Colors.theme_color} barStyle='default' hidden={false} translucent={false}
                    networkActivityIndicatorVisible={true} />
                <View style={styles.setingsHeader}>
                    {/* <TouchableOpacity activeOpacity={0.9} onPress={() => { this.props.navigation.goBack() }}>
                        <Image resizeMode="contain" style={{ width: 35, height: 40 }} source={localimag.back}></Image>
                    </TouchableOpacity> */}
                    <Text style={[styles.OrderHistoryTitle, { textAlign: 'center' }]}>Rating And Review</Text>

                </View>
                <View style={{ flexDirection: 'row', width: mobileW * 100 / 100, height: mobileH * 25 / 100, elevation: 20, backgroundColor: Colors.purewhite, marginTop: 15, shadowColor: '#000000', shadowOffset: { width: 2, height: 2, }, shadowOpacity: 0.20 }}>
                    <View style={{ justifyContent: 'center', marginLeft: 20 }}>
                        <Text style={{ fontFamily: Font.bold, fontSize: mobileW * 6 / 100 }}>{this.state.avg_rat == null ? 0 : this.state.avg_rat}</Text>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <StarRating
                                containerStyle={{ width: windowWidth * 16 / 100, height: windowHeight * 2 / 100, alignSelf: 'center', marginTop: mobileW * 0.5 / 100 }}
                                fullStar={localimag.star}
                                emptyStar={localimag.stargrey}
                                halfStarColor={'#FFC815'}
                                disabled={true}
                                maxStars={5}
                                starSize={mobileW * 3.2 / 100}
                                rating={this.state.avg_rat = null ? 0 : this.state.avg_rat}
                            />
                            <Text style={{ fontFamily: Font.bold, fontSize: mobileW * 3 / 100, color: Colors.textColor }}>({this.state.total_rate = 0 ? 0 : this.state.total_rate})</Text>
                        </View>
                    </View>
                    <View style={{ marginLeft: 30, marginTop: 15 }}>
                        <View style={{ width: mobileW * 60 / 100, flexDirection: 'row' }}>
                            <StarRating
                                containerStyle={{ width: windowWidth * 50 / 100, height: windowHeight * 4.5 / 100, alignSelf: 'center', }}
                                fullStar={localimag.star}
                                emptyStar={localimag.stargrey}
                                halfStarColor={'#FFC815'}
                                disabled={true}
                                maxStars={5}
                                starSize={mobileW * 4.8 / 100}
                                rating={5}
                            />
                            <Text style={{ marginLeft: 10 }}>({this.state.five == 0 ? 0 : this.state.five})</Text>
                        </View>
                        <View style={{ width: mobileW * 60 / 100, flexDirection: 'row' }}>
                            <StarRating
                                containerStyle={{ width: windowWidth * 50 / 100, height: windowHeight * 4.5 / 100, alignSelf: 'center', }}
                                fullStar={localimag.star}
                                emptyStar={localimag.stargrey}
                                halfStarColor={'#FFC815'}
                                disabled={true}
                                maxStars={5}
                                starSize={mobileW * 4.8 / 100}
                                rating={4}
                            />
                            <Text style={{ marginLeft: 10 }}>({this.state.four == 0 ? 0 : this.state.four})</Text>
                        </View>
                        <View style={{ width: mobileW * 60 / 100, flexDirection: 'row' }}>
                            <StarRating
                                containerStyle={{ width: windowWidth * 50 / 100, height: windowHeight * 4.5 / 100, alignSelf: 'center', }}
                                fullStar={localimag.star}
                                emptyStar={localimag.stargrey}
                                halfStarColor={'#FFC815'}
                                disabled={true}
                                maxStars={5}
                                starSize={mobileW * 4.8 / 100}
                                rating={3}
                            />
                            <Text style={{ marginLeft: 10 }}>({this.state.three == 0 ? 0 : this.state.three})</Text>
                        </View>
                        <View style={{ width: mobileW * 60 / 100, flexDirection: 'row' }}>
                            <StarRating
                                containerStyle={{ width: windowWidth * 50 / 100, height: windowHeight * 4.5 / 100, alignSelf: 'center', }}
                                fullStar={localimag.star}
                                emptyStar={localimag.stargrey}
                                halfStarColor={'#FFC815'}
                                disabled={true}
                                maxStars={5}
                                starSize={mobileW * 4.8 / 100}
                                rating={2}
                            />
                            <Text style={{ marginLeft: 10 }}>({this.state.two == 0 ? 0 : this.state.two})</Text>
                        </View>
                        <View style={{ width: mobileW * 60 / 100, flexDirection: 'row' }}>
                            <StarRating
                                containerStyle={{ width: windowWidth * 50 / 100, height: windowHeight * 4.5 / 100, alignSelf: 'center', }}
                                fullStar={localimag.star}
                                emptyStar={localimag.stargrey}
                                halfStarColor={'#FFC815'}
                                disabled={true}
                                maxStars={5}
                                starSize={mobileW * 4.8 / 100}
                                rating={1}
                            />
                            <Text style={{ marginLeft: 10 }}>({this.state.one == 0 ? 0 : this.state.one})</Text>
                        </View>
                    </View>
                    <View>
                    </View>
                </View>
                <View style={{ paddingBottom: mobileH * 43 / 100, }}>
                    {this.state.rating_arr == 'NA' && <View style={{ alignItems: 'center', justifyContent: 'center', height: '100%' }}><Image resizeMode="contain" style={{ width: '50%', height: '50%', }} source={localimag.nodataFound}></Image></View>}
                    {this.state.rating_arr != 'NA' &&
                        <FlatList
                            data={this.state.rating_arr}
                            showsHorizontalScrollIndicator={false}
                            showsVerticalScrollIndicator={false}
                            contentContainerStyle={{ paddingBottom: 100 }}
                            renderItem={({ item, index }) => {
                                return (
                                    <View style={{ elevation: 8, backgroundColor: Colors.purewhite, width: mobileW * 100 / 100, flexDirection: 'row', height: mobileH * 10 / 100, marginTop: 14, shadowColor: '#000000', shadowOffset: { width: 2, height: 2, }, shadowOpacity: 0.20 }}>
                                        <View style={{ marginLeft: 15, flexDirection: 'row', width: windowWidth * 100 / 100, height: windowHeight * 12 / 100, alignItems: 'center', justifyContent: 'flex-start', alignSelf: 'center', }}>
                                            <View style={{ width: mobileW * 10 / 100, }}>
                                                <Image resizeMode="cover" style={{ width: mobileW * 11 / 100, height: mobileW * 11 / 100, borderRadius: (mobileW * 11 / 100) / 2 }} source={item.image == null ? localimag.default : { uri: config.img_url3 + item.image }}></Image>
                                            </View>
                                            <View style={{ marginLeft: 15, width: mobileW * 65 / 100, }}>
                                                <Text numberOfLines={1} style={{ fontFamily: Font.bold, fontSize: mobileW * 3.3 / 100 }}>{item.name}</Text>
                                                <StarRating
                                                    containerStyle={{ width: windowWidth * 16 / 100, height: windowHeight * 2 / 100, alignSelf: 'flex-start', }}
                                                    fullStar={localimag.star}
                                                    emptyStar={localimag.stargrey}
                                                    halfStarColor={'#FFC815'}
                                                    disabled={true}
                                                    maxStars={5}
                                                    starSize={mobileW * 3.4 / 100}
                                                    rating={item.rating == null ? 0 : item.rating}
                                                />
                                                <Text style={{ fontFamily: Font.bold, fontSize: mobileW * 2.6 / 100, }}>{item.review}</Text>
                                            </View>
                                            <View style={{ alignItems: 'flex-end', width: mobileW * 14 / 100, height: mobileH * 5 / 100 }}>
                                                <Text style={{ fontSize: mobileW * 2.4 / 100 }}>{item.timestamp}</Text>
                                            </View>
                                        </View>
                                    </View>)
                            }}
                            keyExtractor={(item, index) => index.toString()}>
                        </FlatList>}
                </View>
                <View style={{ backgroundColor: '#FFFFFF', elevation: 4, height: mobileH * 6 / 100, position: 'absolute', bottom: 0, width: mobileW * 100 / 100, alignSelf: 'center' }}>
                    <Footerr
                        activepage='RatingReview'
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
            </View>
        )
    }
}
const styles = StyleSheet.create({
    setingsHeader: {
        backgroundColor: Colors.theme_color,
        justifyContent: 'space-between',
        paddingLeft: 20,
        paddingRight: 20,
        paddingTop: 5,
        paddingBottom: 25,
        alignItems: 'center',
    },
    OrderHistoryTitle: {
        color: Colors.purewhite,
        fontFamily: Font.medium,
        fontSize: windowWidth * 5.2 / 100,
        letterSpacing: 0.5,
    },
});


