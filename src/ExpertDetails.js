import React, { Component } from 'react'
import { Text, View, TouchableOpacity, SafeAreaView, TextInput, Alert, Dimensions, StatusBar, Image, ScrollView, BackHandler, StyleSheet, Keyboard } from 'react-native'
import { config, Otpprovider, Mapprovider, apifuntion, Colors, Font, validation, mobileH, mobileW, SocialLogin, Cameragallery, mediaprovider, localStorage, Lang_chg, consolepro, msgProvider, msgTitle, msgText, Currentltlg } from './Providers/utilslib/Utils'
import { localimag } from './Providers/Localimageprovider/Localimage'
import StarRating from 'react-native-star-rating';
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
import Footer from './Providers/Footer';
export default class ExpertDetails extends Component {
    constructor(props) {
        super(props)
        this.state = {
            content_2: '',
            expert_arr: 'NA',
            other_user_id: this.props.route.params.other_user_id,
            name: 'NA',
            about: '',
            education: 'NA',
            image: '',
            other_id: '',
            speciality_name: 'NA',
            satisfied_customer: '',
            status: 0,
            footer_image: null,
        }
        this.setUserType();
    }

    setUserType = async () => {
        let result = await localStorage.getItemObject('user_arr')
        if (result != null) {
            this.setState({
                footer_image: result.image
            })
        }
    }

    backpress = () => {
        this.props.navigation.goBack();
    }

    successMessage = () => {
        Alert.alert(
            "Information Message",
            "You have successfully marked favourite",
            [
                { text: "OK", onPress: () => { { console.log('Marked favourite') } } }
            ],
            { cancelable: false }
        );
    }

    LoginPopup = () => {
        Alert.alert(
            'Information Message',
            'Please login first', [{
                text: 'Cancel',
                onPress: () => consolepro.consolelog('Cancel button Pressed'),
                style: 'cancel'
            }, {
                text: 'Ok',
                onPress: () => {
                    {
                        this.props.navigation.navigate('Login')
                    }
                }
            }], {
            cancelable: false
        }
        ); // works best when the goBack is async
        return true;
    }

    componentDidMount = () => {
        this.props.navigation.addListener('focus', () => {
            this.getExpertProfileDetails();
        });
    }

    navigatee = () => {
        // if(doLogin == true){
        //     this.LoginPopup();
        // }else{
        this.props.navigation.navigate('AskQuestion');
        // }
    }

    getExpertProfileDetails = async () => {
        consolepro.consolelog('getExpertProfileDetails');
        let user_details = await localStorage.getItemObject('user_arr');
        var user_id = 0;
        if (user_details != null && user_details != 'NA') {
            user_id = user_details.user_id;
        }

        let url = config.baseURL + "getExpertProfileDetails.php?user_id=" + user_id + "&other_user_id=" + this.state.other_user_id;
        consolepro.consolelog(url)
        apifuntion.getApi(url).then((obj) => {
            consolepro.consolelog('obj', obj)
            if (obj.success == "true") {
                this.setState({ expert_arr: obj.expert_arr, name: obj.expert_arr.name, rating: obj.expert_arr.rating, satisfied_customer: obj.expert_arr.satisfied_customer, speciality_name: obj.expert_arr.speciality_name, description: obj.expert_arr.description, about: obj.expert_arr.about_me, image: obj.expert_arr.image })
                consolepro.consolelog('expert_arr', this.state.expert_arr)
                this.setState({ other_id: obj.expert_arr.user_id, status: obj.expert_arr.fav_status })
                localStorage.setItemObject('expert_arr', obj.expert_arr);
                // this.getStatus();
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

    //------------------------------------------------------------------//

    getStatus = async () => {
        consolepro.consolelog('getStatus');
        let user_details = await localStorage.getItemObject('user_arr');
        consolepro.consolelog('user_details_ba', user_details);
        if (user_details != null && user_details != 'NA') {

            let url = config.baseURL + "getFavouriteExpertStatus.php?user_id=" + user_details.user_id + "&other_id=" + this.state.other_id;
            consolepro.consolelog(url)
            apifuntion.getApi(url).then((obj) => {
                consolepro.consolelog('obj', obj)
                if (obj.success == "true") {
                    this.setState({ status: obj.status })
                    consolepro.consolelog('status', this.state.status)
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
    }

    //------------------------------------------------------------------//
    LoginPopup = () => {
        this.props.navigation.navigate('Login');
        // return false;
        // Alert.alert(
        //     'Information Message',
        //     'Please login first', [{
        //         text: 'Cancel',
        //         onPress: () => consolepro.consolelog('Cancel button Pressed'),
        //         style: 'cancel'
        //     }, {
        //         text: 'Ok',
        //         onPress: () => {
        //             {
        //                 this.props.navigation.navigate('Login')
        //             }
        //         }
        //     }], {
        //     cancelable: false
        // }
        // ); // works best when the goBack is async
        // return true;
    }
    markFavUnfav = async (status) => {

        let guest_user = await localStorage.getItemString('guest_user');
        let user_details = await localStorage.getItemObject('user_arr');
        consolepro.consolelog('markFavUnfav', user_details);
        if (guest_user == 'yes') {
            this.props.navigation.navigate('Login');
        } else {

            consolepro.consolelog('user_details_ba', user_details);
            let other_id = await localStorage.getItemObject('user_id');
            consolepro.consolelog('other_id', this.state.other_user_id);
            let url = config.baseURL + "markExpertFavouriteUnFavourite.php";
            consolepro.consolelog(url)
            let data = new FormData();
            data.append('user_id', user_details.user_id)
            data.append('other_id', this.state.other_user_id)
            data.append('status', status)
            apifuntion.postApi(url, data).then((obj) => {
                consolepro.consolelog('obj', obj);
                if (obj.success == "true") {
                    consolepro.consolelog('true')
                    consolepro.consolelog('this is i got', obj)
                    var status = 0;
                    //this.successMessage();
                    if (this.state.status == 1) {
                        status = 0
                    } else {
                        status = 1;
                    }
                    this.setState({ status: status })
                    // this.getStatus();
                } else {
                    consolepro.consolelog('false')
                    msgProvider.alert(msgTitle.information[config.language], obj.msg[config.language], false);
                    if (obj.active_status == 'deactivate') {
                        this.props.navigation.navigate('Login');
                        //BackHandler.exitApp();
                        localStorage.clear();
                    }
                    return false;
                }
            }).catch((error) => {
                consolepro.consolelog("-------- error ------- " + error);
            });
        }
    }

    //-----------------------------------------------------------------//

    render() {
        return (
            <View style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
                <SafeAreaView style={{ flex: 0, backgroundColor: Colors.theme_color }} />
                <StatusBar backgroundColor={Colors.theme_color} barStyle='default' hidden={false} translucent={false}
                    networkActivityIndicatorVisible={true} />
                <ScrollView contentContainerStyle={{ paddingBottom: 90 }}>
                    <View >
                        <View style={styles.setingsHeader}>
                            <TouchableOpacity activeOpacity={0.9} onPress={() => { this.backpress() }}>
                                <Image resizeMode="contain" style={{ width: 35, height: 35 }} source={localimag.back}></Image>
                            </TouchableOpacity>
                            <Text style={styles.OrderHistoryTitle}></Text>
                            {this.state.status == 0 && <TouchableOpacity activeOpacity={0.9} onPress={() => { this.markFavUnfav(1) }}
                                style={{ backgroundColor: Colors.purewhite, padding: 7, borderRadius: 25, justifyContent: 'flex-end', alignItems: 'center' }}>
                                <Image resizeMode="contain" style={{ width: 20, height: 20, marginTop: 2, marginHorizontal: 1.5 }} source={localimag.hollow_heart}></Image>
                            </TouchableOpacity>}
                            {this.state.status == 1 && <TouchableOpacity activeOpacity={0.9} onPress={() => { this.markFavUnfav(0) }}
                                style={{ backgroundColor: Colors.purewhite, padding: 7, borderRadius: 25, justifyContent: 'flex-end', alignItems: 'center' }}>
                                <Image resizeMode="contain" style={{ width: 20, height: 20, marginTop: 2, marginHorizontal: 1.5 }} source={localimag.liked}></Image>
                            </TouchableOpacity>}
                        </View>
                        <View style={{ position: 'absolute', top: mobileH * 2 / 100, left: mobileW * 30 / 100, alignItems: 'center', }}>
                            <Image resizeMode="cover" style={{ width: mobileW * 32 / 100, height: mobileW * 32 / 100, borderRadius: 100 }} source={this.state.image == null ? localimag.default : { uri: config.img_url3 + this.state.image }}></Image>
                            <Text style={{ color: Colors.purewhite, fontSize: mobileW * 5.5 / 100, fontFamily: Font.bold }}>{this.state.name == null ? 'NA' : this.state.name}</Text>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <StarRating
                                    containerStyle={{ width: windowWidth * 16 / 100, height: windowHeight * 3 / 100, alignSelf: 'center', alignItems: 'center' }}
                                    fullStar={localimag.star}
                                    emptyStar={localimag.stargrey}
                                    halfStarColor={'#FFC815'}
                                    disabled={true}
                                    maxStars={5}
                                    starSize={mobileW * 3.2 / 100}
                                    rating={this.state.rating == null ? 0 : this.state.rating} />
                                <Text style={{ color: Colors.purewhite, fontSize: mobileW * 3 / 100, fontFamily: Font.regular }}>({this.state.rating == null ? '0' : parseFloat(this.state.rating).toFixed(1)})</Text>
                            </View>
                        </View>
                        <View style={{ flexDirection: 'row', elevation: 10, backgroundColor: Colors.purewhite, width: mobileW * 90 / 100, alignSelf: 'center', justifyContent: 'center', height: mobileH * 16 / 100, position: 'absolute', top: mobileW * 50 / 100, shadowColor: '#000000', shadowOffset: { width: 2, height: 2, }, shadowOpacity: 0.20 }}>
                            <View style={{ alignItems: 'center', justifyContent: 'center', width: mobileW * 45 / 100, }}>
                                <Text style={{ color: Colors.theme_color, fontSize: mobileW * 6 / 100, fontFamily: Font.bold }}>{this.state.satisfied_customer == null ? 0 : this.state.satisfied_customer}</Text>
                                <Text style={{ color: Colors.theme_color, fontSize: mobileW * 4 / 100, fontFamily: Font.bold }}>Satisfied Customers</Text>
                            </View>
                            <View style={{ alignItems: 'center', justifyContent: 'center', width: mobileW * 45 / 100 }}>
                                <Image resizeMode="contain" style={{ width: mobileW * 8.5 / 100, height: mobileH * 4.5 / 100, }} source={localimag.greencheck}></Image>
                                <Text style={{ color: Colors.theme_color, fontSize: mobileW * 4 / 100, fontFamily: Font.bold }}>Verified Expert</Text>
                            </View>
                        </View>
                        <View style={{ height: mobileH * 16 / 100, alignItems: 'flex-start', marginTop: mobileH * 8 / 100, width: mobileW * 88 / 100, alignSelf: 'center' }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Image resizeMode="contain" style={{ width: mobileW * 6 / 100, height: mobileH * 7 / 100, }} source={localimag.profession}></Image>
                                <Text style={{ marginLeft: 10, fontSize: mobileW * 4.2 / 100, fontFamily: Font.medium }}>{this.state.speciality_name == null ? 'NA' : this.state.speciality_name}</Text>
                            </View>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Image resizeMode="contain" style={{ width: mobileW * 6 / 100, height: mobileH * 7 / 100, }} source={localimag.degreee}></Image>
                                <Text style={{ marginLeft: 10, fontSize: mobileW * 4.2 / 100, fontFamily: Font.medium }}>{this.state.description == null ? 'NA' : this.state.description}</Text>
                            </View>
                        </View>
                        <View style={{ alignItems: 'flex-start', width: mobileW * 88 / 100, alignSelf: 'center', paddingBottom: mobileH * 0.02 }}>
                            <Text style={{ color: Colors.theme_color, fontFamily: Font.bold, fontSize: mobileW * 4.1 / 100 }}>Description</Text>
                            <Text style={{ fontFamily: Font.medium, fontSize: mobileW * 4.1 / 100, marginTop: 10 }}>{this.state.about == null ? 'NA' : this.state.about}</Text>
                        </View>

                    </View>

                </ScrollView>
                <View style={{ position: "absolute", bottom: mobileH * 0.072, justifyContent: "center", alignItems: 'center', left: 0, right: 0 }}>
                    <TouchableOpacity activeOpacity={1} style={{ width: mobileW * 90 / 100, height: mobileH * 6.5 / 100, backgroundColor: Colors.theme_color, borderRadius: 35, alignItems: 'center', justifyContent: 'center', alignSelf: 'center' }}
                        onPress={() => { this.navigatee(); }}>
                        <Text style={{ fontSize: mobileW * 4 / 100, fontFamily: Font.bold, color: Colors.purewhite }}>Ask your question</Text>
                    </TouchableOpacity>
                </View>
                <Footer
                    activepage='Home'
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
        paddingBottom: mobileW * 60 / 100,
        alignItems: 'center'
    },
    OrderHistoryTitle: {
        color: Colors.white_color,
        fontFamily: Font.bold,
        fontSize: windowWidth * 5.2 / 100,
        letterSpacing: 0.5,
    },
});


