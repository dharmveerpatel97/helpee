import React, { Component } from 'react'
import { Text, View, TouchableOpacity, SafeAreaView, Dimensions, StatusBar, ImageBackground, TextInput, Image, ScrollView, FlatList, BackHandler, StyleSheet, Keyboard } from 'react-native'
import { config, Otpprovider, Mapprovider, apifuntion, Colors, Font, validation, mobileH, mobileW, SocialLogin, Cameragallery, mediaprovider, localStorage, Lang_chg, consolepro, msgProvider, msgTitle, msgText, Currentltlg } from './Providers/utilslib/Utils'
import { localimag } from './Providers/Localimageprovider/Localimage'
import StarRating from 'react-native-star-rating';
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
import Footer from './Providers/Footer';

export default class SecondChooseExpert extends Component {
    constructor(props) {
        super(props)
        this.state = {
            content_2: '',
            starCount: 4,
            showSearch: false,
            question_id: this.props.route.params.question_id,
            speciality_id: this.props.route.params.speciality_id,
            expert_id: this.props.route.params.expert_id,
            txtsrch: '',
            expert_arr_category: 'NA',
            footer_image: null,
            ask_question_id: ''
        }
        this.setUserType();
    }
    backpress = () => {
        this.props.navigation.goBack();
    }
    cross_click = async () => {
        //await this.SearchFilterFunction('');
        this.setState({ showSearch: false })
    }
    componentDidMount = () => {
        this.getALLData();
    }

    setUserType = async () => {
        let result = await localStorage.getItemObject('user_arr')
        if (result != null) {
            this.setState({
                footer_image: result.image
            })
        }
    }

    getALLData = async () => {
        consolepro.consolelog('getALLData');
        let question_data = await localStorage.getItemObject('expert_question_arr');
        let data = await localStorage.getItemObject('data123')
        if (question_data != null && question_data != 'NA') {

            consolepro.consolelog('This is 3')
        } else {

            consolepro.consolelog('This is 4')
        }
        consolepro.consolelog('speciality_idssdddss', this.state.speciality_id)
        this.getExpertByCategory();
    }

    //---------------------------------------------------------------------------// 

    getExpertByCategory = async () => {
        consolepro.consolelog('getExpertByCategory');
        consolepro.consolelog('this.state.speciality_id', this.state.speciality_id);
        let user_details = await localStorage.getItemObject('user_arr');
        consolepro.consolelog('user_details_ba', user_details);
        let url = config.baseURL + "get_expert_again_select.php?user_id=" + user_details.user_id + "&speciality_id=" + this.state.speciality_id + "&question_id=" + this.state.speciality_id + "&expert_id=" + this.state.expert_id;
        consolepro.consolelog(url)
        apifuntion.getApi(url).then((obj) => {
            consolepro.consolelog('obj', obj)
            if (obj.success == "true") {
                this.setState({ expert_arr_category: obj.expert_arr })
                consolepro.consolelog('expert_arr_cateogryqqqqqq', obj.expert_arr)
                consolepro.consolelog('specialityName', this.state.specialityName)
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

    //-----------------***********--------------------//

    updateQuestion = async (expert_id) => {
        consolepro.consolelog('updateQuestion');
        console.log('expert_id', expert_id)
        console.log('ask_question_id', this.state.question_id)
        let user_details = await localStorage.getItemObject('user_arr');
        consolepro.consolelog('user_details_ba', user_details);
        let question_data = await localStorage.getItemObject('expert_question_arr')
        consolepro.consolelog('question_data2', question_data)
        let url = config.baseURL + "updateAskQuestion.php";
        consolepro.consolelog('url', url)
        let data = new FormData();
        data.append('user_id', user_details.user_id)
        data.append('expert_id', expert_id)
        data.append('question_id', this.state.question_id)
        consolepro.consolelog('dataaaaaa', data)
        apifuntion.postApi(url, data).then((obj) => {
            consolepro.consolelog('objqqq', obj)
            if (obj.success == 'true') {
                this.props.navigation.navigate('ExpertSendSuccess');
            } else {
                consolepro.consolelog('false')
                msgProvider.alert(msgTitle.information[config.language], obj.msg[config.language], false);
                if (obj.active_status == 'deactivate') {
                    BackHandler.exitApp();
                    localStorage.clear();
                }
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
                {this.state.showSearch == false && <View style={styles.setingsHeader}>
                    <TouchableOpacity activeOpacity={0.9} onPress={() => { this.backpress() }}>
                        <Image resizeMode="contain" style={{ width: 30, height: 30 }} source={localimag.back}></Image>
                    </TouchableOpacity>
                    <Text style={styles.OrderHistoryTitle}>Choose Our Experts</Text>
                    <TouchableOpacity activeOpacity={0.9} onPress={() => { this.setState({ showSearch: true }) }}>
                        <Image resizeMode="contain" style={{ width: 30, height: 30 }} source={localimag.search}></Image>
                    </TouchableOpacity>
                </View>}
                {this.state.showSearch == true && <View style={{ flexDirection: 'row', backgroundColor: Colors.theme_color, alignItems: 'center', justifyContent: 'space-between', height: windowHeight * 9 / 100, }}>
                    <View style={{ width: '86%', backgroundColor: '#F2F2F2', borderColor: 'gray', borderRadius: 40, alignItems: 'center', justifyContent: 'center', marginTop: 10, alignSelf: 'flex-start', marginRight: 10, marginLeft: 25 }}>
                        <TextInput style={{ color: 'black', width: '100%', paddingLeft: 5, textAlign: 'left', paddingRight: 35, height: 35, marginTop: 4, marginLeft: 4 }}
                            placeholder={'Search'}
                            value={"" + this.state.txtsrch + ""}
                            maxLength={20}
                            onChangeText={(text) => {
                                this.setState({ txtsrch: text })
                            }}>
                        </TextInput>
                        <TouchableOpacity onPress={() => { this.cross_click() }} style={{ width: 20, height: 20, justifyContent: 'center', alignSelf: 'center', position: 'absolute', right: 10 }}>
                            <Image resizeMode="contain" style={{ width: 30, height: 30, alignSelf: 'center', }} source={localimag.cross}></Image>
                        </TouchableOpacity>
                    </View>
                </View>}
                <View style={{ width: mobileW * 100 / 100, paddingBottom: 60 }}>
                    {this.state.expert_arr_category == 'NA' && <View style={{ height: mobileH * 80 / 100, justifyContent: 'center', alignItems: 'center' }}>
                        <Image source={localimag.nodataFound} style={{ width: mobileW * 80 / 100, height: mobileW * 60 / 100 }} />
                    </View>}
                    {this.state.expert_arr_category != 'NA' &&
                        <FlatList
                            data={this.state.expert_arr_category}
                            showsVerticalScrollIndicator={false}
                            contentContainerStyle={{ paddingBottom: 100 }}
                            renderItem={({ item, index }) => {
                                return (
                                    <View style={{ flexDirection: 'row', elevation: 5, backgroundColor: Colors.purewhite, width: windowWidth * 100 / 100, height: windowHeight * 20 / 100, alignItems: 'center', justifyContent: 'flex-start', alignSelf: 'center', marginTop: 8, shadowColor: '#000000', shadowOffset: { width: 2, height: 2, }, shadowOpacity: 0.20 }}>
                                        <View style={{ width: mobileW * 30 / 100, marginLeft: 15, alignItems: 'center', justifyContent: 'center' }}>
                                            <Image resizeMode="cover" style={{ width: mobileW * 28 / 100, height: mobileW * 28 / 100, borderRadius: 100 }} source={item.image == null ? localimag.default : { uri: config.img_url3 + item.image }}></Image>
                                        </View>
                                        <View style={{ width: mobileW * 41 / 100, marginLeft: 5, }}>
                                            <Text numberOfLines={1} style={{ fontSize: mobileW * 4 / 100, fontFamily: Font.bold }}>{item.name}</Text>
                                            <Text numberOfLines={1} style={{ fontSize: mobileW * 3.1 / 100, fontFamily: Font.medium, color: Colors.grey }}>{item.speciality_name}</Text>
                                            <Text numberOfLines={1} style={{ fontSize: mobileW * 3.1 / 100, fontFamily: Font.medium, color: Colors.grey }}>{item.description}</Text>
                                            <Text numberOfLines={1} style={{ fontSize: mobileW * 3.1 / 100, fontFamily: Font.medium, color: Colors.grey }}>{item.satisfied_customer} satisfied Customer</Text>
                                        </View>
                                        <View style={{ width: mobileW * 25 / 100, marginRight: 14, height: mobileW * 18 / 100, alignItems: 'flex-end' }}>
                                            <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 15 }}>
                                                <StarRating
                                                    containerStyle={{ width: windowWidth * 16 / 100, height: windowHeight * 3 / 100, alignSelf: 'center', justifyContent: 'center', alignItems: 'center' }}
                                                    fullStar={localimag.star}
                                                    emptyStar={localimag.stargrey}
                                                    halfStarColor={'#FFC815'}
                                                    disabled={true}
                                                    maxStars={5}
                                                    starSize={mobileW * 3.2 / 100}
                                                    rating={item.rating == null ? '0' : item.rating}
                                                />
                                                <Text style={{ color: Colors.theme_color, fontSize: mobileW * 3.2 / 100 }}>({item.rating == null ? '0' : parseFloat(item.rating).toFixed(1)})</Text>
                                            </View>
                                            <TouchableOpacity activeOpacity={1} onPress={() => { this.updateQuestion(item.user_id) }}
                                                style={{ marginTop: mobileW * 5.5 / 100, alignItems: 'center', justifyContent: 'center', backgroundColor: Colors.theme_color, padding: 4, borderRadius: 8, marginRight: 12 }}>
                                                <Text style={{ color: Colors.purewhite, fontSize: mobileW * 3 / 100, paddingHorizontal: 5 }}>Ask Expert</Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>)
                            }}
                            keyExtractor={(item, index) => index.toString()}>
                        </FlatList>}
                </View>
                <Footer
                    activepage='MyQuestion'
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


