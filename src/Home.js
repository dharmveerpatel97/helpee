import React, { Component } from 'react'
import { Text, View, TouchableOpacity, SafeAreaView, TextInput, Alert, Modal, FlatList, Dimensions, StatusBar, Image, ScrollView, BackHandler, StyleSheet, Keyboard } from 'react-native'
import { config, Otpprovider, Mapprovider,pushnotification, apifuntion, Colors, Font, validation, mobileH, mobileW, SocialLogin, Cameragallery, mediaprovider, localStorage, Lang_chg, consolepro, msgProvider, msgTitle, msgText, Currentltlg } from './Providers/utilslib/Utils'
import { localimag } from './Providers/Localimageprovider/Localimage'
import Footer from './Providers/Footer';
import StarRating from 'react-native-star-rating';
import OneSignal from 'react-native-onesignal';
import HideWithKeyboard from 'react-native-hide-with-keyboard';
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export default class Home extends Component {
    _didFocusSubscription;
    _willBlurSubscription;
    constructor(props) {
        super(props)
        this.state = {
            question: '',
            starCount: 4,
            speciality_id: '',
            speciality_arr_pop:'NA',
            speciality_name: 'Select Your Speciality',
            speciality_arr: 'NA',
            speciality_arr1: 'NA',
            onCross: false,
            showSearch: false,
            txtsrch: '',
            specialist: false,
            expert_arr: 'NA',
            expert_arr_category: 'NA',
            specialityName: '',
            doc: 'Choose File',
            expert_question_arr: [],
            mediamodal: false,
            user_id: '',
            count_noti: 0,
            footer_image: null,
            specialitydata: []
        }
       
        /* O N E S I G N A L   S E T U P */
        OneSignal.setAppId(config.onesignalappid);
        OneSignal.setLogLevel(6, 0);
        OneSignal.setRequiresUserPrivacyConsent(false);
        OneSignal.promptForPushNotificationsWithUserResponse(response => {
            console.log("Prompt response:", response);
        });
       
        this._didFocusSubscription = props.navigation.addListener('focus', payload =>
            BackHandler.addEventListener('hardwareBackPress', this.handleBackPress)
        );
      
    }

    //-----------------------------------------------------------//
    Camerapopen = async () => {
        mediaprovider.launchCamera(false).then((res) => {
            console.log('camerares', res)
            this.setState({ mediamodal: false, doc: res.path, edit: 1 })
        }).catch((error) => {
            this.setState({ mediamodal: false, edit: 0 })
        })
    }
    Galleryopen = () => {
        mediaprovider.launchGellery(false).then((res) => {
            console.log('camerares', res)
            this.setState({ doc: res.path, mediamodal: false, edit: 1 })
        }).catch((error) => {
            this.setState({ mediamodal: false, edit: 0 })
        })
    }
    //-------------------------------------------------------------//

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

    //------------------------------------------------------------//

    LoginPopup = () => {
        this.props.navigation.navigate('Login')
        return false;
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

    //------------------------------------------------------------//

    componentDidMount = async () => {
        pushnotification.redirectfun(this.props.navigation);

        this.props.navigation.addListener('focus', () => {
            this.setState({ footer_image: null })
            localStorage.removeItem('socialdata');
            setting_status = true;
            localStorage.removeItem('expert_name');
            this.get_Speciality();
            this.getExpertList();
            this.getAllData();
            consolepro.consolelog('this is global variable', doLogin)
        });
        this._willBlurSubscription = this.props.navigation.addListener('blur', payload =>
            BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress)
        );
    }

    // componentWillUnmount() {
    //     OneSignal.removeEventListener('opened', this.onOpened);
    //     const { navigation } = this.props;
    //     navigation.removeListener('focus', () => {
    //         console.log('remove lister')
    //     });
    // }



   

    //--------------------------------------------------------------//

    navigateNot(name) {
        // if (doLogin == true) {
        //     // this.props.navigation.navigate('Login');
        // } else {
        this.props.navigation.navigate(name);
        // }
    }

    //--------------------------------------------------------------//

    backpress = () => {
        this.props.navigation.goBack();
    }

    //---------------------------------------------------------------//

    onStarRatingPress(rating) {
        this.setState({ starCount: rating });
    }

    //----------------------------------------------------------------//

    navigatePage(pagename) {
        this.props.navigation.navigate(pagename);
    }

    //-----------------------------------------------------------------//

    navigateSpeciality() {
        this.setState({ specialist: true,speciality_arr:this.state.speciality_arr_pop });
    }

    //----------------------------------------------------------------//

    addItem = (index) => {
        let data = this.state.speciality_arr;
        let len = this.state.speciality_arr.length;
        for (let i = 0; i < len; i++) {
            data[i].status = false;
        }
        data[index].status = !data[index].status;
        // let speciality_id = data[index].speciality_id;
        this.setState({
            speciality_name: data[index].name,
            speciality_id: data[index].speciality_id,
            specialist: false
        })
        consolepro.consolelog('this is speciality_id', this.state.speciality_id)
    }

    //---------------------------------------------------------------------//

    getAllData = async () => {
        consolepro.consolelog('getAllData')
        var check_question = await localStorage.getItemObject('ask_done');
        if (check_question != null) {
            this.setState({ speciality_name: 'Select Your Speciality', speciality_id: '', doc: 'Choose File', specialityName: '', question: '' })
            localStorage.removeItem('ask_done');
        }
        let user_details = await localStorage.getItemObject('user_arr');
        consolepro.consolelog('user_details_home', user_details)
        let footer_image = user_details.image;
        consolepro.consolelog('footer_image', footer_image)
        this.setState({ footer_image: footer_image })
    }

    //----------------------------------------------------------------------//

    AskQuestionFromExpert = async () => {
        consolepro.consolelog('AskQuestionFromExpert')
        let user_details = await localStorage.getItemObject('user_arr');
        consolepro.consolelog('user_details_ba', user_details);


        let expert_question_arr = []
        let speciality_id = this.state.speciality_id;
        let question = this.state.question;
        let doc = this.state.doc;

        if (speciality_id == 0) {
            msgProvider.toast(msgText.emptySpeciality[config.language], 'top')
            return false;
        }
        if (question.length == 0) {
            msgProvider.toast(msgText.emptyQuestion[config.language], 'top')
            return false;
        }
        // if (doc == 'Choose File') {
        //     msgProvider.toast(msgText.emptyDocument[config.language], 'top')
        //     return false;
        // }

        let localdata = {
            speciality_id: speciality_id,
            question: question,
            doc: this.state.doc,
        }
        expert_question_arr.push(localdata);
        consolepro.consolelog('expert_question_arr', expert_question_arr)
        localStorage.setItemObject('expert_question_arr', expert_question_arr)
        

        let guest_user = await localStorage.getItemString('guest_user');
        if (guest_user == 'yes') {
            localStorage.setItemString('signup_check', 'yes');

            // var check = await localStorage.getItemString('signup_check');
            // console.log("himanshu sign",check);

            
            this.props.navigation.navigate('Signup')
            return false
        }

       

        var sub_status = user_details.sub_status;

        if(user_details.sms_otp_show_hide=='hide')
        {
            this.props.navigation.navigate('ChooseExpert');

        }
        else{

        
        if (sub_status == 'ask_now') {
            this.props.navigation.navigate('ChooseExpert');
        }


        if (sub_status == 'sub_buy') {

            Alert.alert(
                'Information Message',
                'Please buy subscription plan first', [{
                    text: 'Cancel',
                    onPress: () => consolepro.consolelog('Cancel button Pressed'),
                    style: 'cancel'
                }, {
                    text: 'Ok',
                    onPress: () => {
                        {
                            this.props.navigation.navigate('SubscriptionPlan1', { plan_type: 1 });
                        }
                    }
                }], {
                cancelable: false
            }
            ); // works best when the goBack is async
            return true;
        }
    }

        if (sub_status == 'add_addon') {
            Alert.alert(
                'Information Message',
                'Your plan question quantity limit is over, You want to add single subscription plan', [{
                    text: 'Cancel',
                    onPress: () => consolepro.consolelog('Cancel button Pressed'),
                    style: 'cancel'
                }, {
                    text: 'Ok',
                    onPress: () => {
                        {
                            this.props.navigation.navigate('SubscriptionPlan1', { plan_type: 0 });
                        }
                    }
                }], {
                cancelable: false
            }
            );
            return true;
        }


    }

    //--------------------------------------------------------------//

    SearchFilterFunction = (text) => {
        consolepro.consolelog('SearchFilterFunction')
        if (this.state.onCross == false) {
            this.setState({ txtsrch: text })
            //passing the inserted text in textinput
            consolepro.consolelog('test1', this.state.speciality_arr)
            let data1 = this.state.speciality_arr1
            if (data1 != 'NA') {
                consolepro.consolelog('test2')
                const newData = data1.filter(function (item) {
                    consolepro.consolelog('myitem', item)
                    //applying filter for the inserted text in search bar
                    const itemData = item.name ? item.name.toUpperCase() : ''.toUpperCase();
                    const textData = text.toUpperCase();
                    return itemData.indexOf(textData) > -1;
                });
                consolepro.consolelog('new data', newData)
                if (newData.length > 0) {
                    this.setState({ speciality_arr: newData })
                } else if (newData.length <= 0) {
                    this.setState({ speciality_arr: 'NA' })
                }
            }
        } else {
            this.search.clear();
            this.setState({ speciality_arr: this.state.speciality_arr1, onCross: false });
        }
    }
    cross_click = async () => {
        await this.SearchFilterFunction('');
        this.setState({ showSearch: false })
    }

    //---------------------***********-----------------------//

    get_Speciality = async () => {
        consolepro.consolelog('get_Speciality');
        let user_details = await localStorage.getItemObject('user_arr');
        var user_id = 0;
        if (user_details != null) {
            user_id = user_details.user_id
        }
        consolepro.consolelog('user_details_ba', user_details);
        let url = config.baseURL + "getSpecialityList.php?user_id=" + user_id;
        consolepro.consolelog(url)
        apifuntion.getApi(url).then((obj) => {
            consolepro.consolelog('obj', obj)
            if (obj.success == "true") {
                this.setState({speciality_arr_pop: obj.speciality_arr, speciality_arr: obj.speciality_arr, speciality_arr1: obj.speciality_arr, count_noti: obj.count_noti })
                localStorage.setItemObject('speciality_arr', obj.speciality_arr);
                // localStorage.setItemObject('user_arr', obj.user_details);
                consolepro.consolelog('speciality_arr', this.state.speciality_arr)
                consolepro.consolelog('speciality_arr1', this.state.speciality_arr1)
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

    //-----------------------************-----------------------//

    getExpertList = async () => {
        consolepro.consolelog('getExpertList');
        let user_details = await localStorage.getItemObject('user_arr');
        var user_id = 0;
        consolepro.consolelog('user_details_ba', user_details);
        if (user_details != null) {
            user_id = user_details.user_id;
            this.setState({ user_id: user_details.user_id });
            console.log('user11', this.state.user_id)
        } else {
            user_id = 0;
            this.setState({ user_id: 0 });
            console.log('user22', this.state.user_id)
        }
        let guest_user = await localStorage.getItemString('guest_user');
        if (guest_user == 'yes') {
            user_id = 0
            this.setState({ user_id: 0 });
        }
        let url = config.baseURL + "getAllExpertList.php?user_id=" + user_id;
        consolepro.consolelog(url)
        apifuntion.getApi(url).then((obj) => {
            consolepro.consolelog('obj', obj)
            if (obj.success == "true") {
                if (user_id != 0) {
                    localStorage.setItemObject('user_arr', obj.user_details);
                }
                this.setState({ expert_arr: obj.expert_arr, })
                localStorage.setItemObject('expert_arr', obj.expert_arr);
                consolepro.consolelog('expert_arr', this.state.expert_arr)
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

    render() {
        return (
            <View style={{ flex: 1 }}>
                <SafeAreaView style={{ flex: 0, backgroundColor: Colors.theme_color }} />
                <StatusBar backgroundColor={Colors.theme_color} barStyle='default' hidden={false} translucent={false}
                    networkActivityIndicatorVisible={true} />
                <Cameragallery mediamodal={this.state.mediamodal} Camerapopen={() => { this.Camerapopen() }}
                    Galleryopen={() => { this.Galleryopen() }} Canclemedia={() => { this.setState({ mediamodal: false }) }} />
                <Modal
                    animationType="slide"
                    transparent
                    visible={this.state.specialist}
                    onRequestClose={() => {
                        this.setState({ specialist: false })
                    }}>
                    <SafeAreaView style={{ flex: 1 }}>
                        <View style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
                            <View style={{ justifyContent: 'space-between', flexDirection: 'row', width: mobileW * 90 / 100, alignItems: 'center', height: mobileH * 10 / 100, alignSelf: 'center' }}>
                                <TouchableOpacity activeOpacity={1} onPress={() => { this.setState({ specialist: false }) }}>
                                    <Image resizeMode="contain" style={{ width: 30, height: 30 }} source={localimag.back}></Image>
                                </TouchableOpacity>
                                <Text style={{ fontSize: mobileW * 5 / 100, fontFamily: Font.medium }}>Choose your specialities</Text>
                                <View style={{ justifyContent: 'center', marginTop: 5 }}>
                                    {/* <Text onPress={() => { this.setState({ specialist: false }); }} style={{ fontFamily: Font.bold, fontSize: mobileW * 3.8 / 100 }}>Done</Text> */}
                                </View>
                            </View>
                            <TouchableOpacity activeOpacity={1}
                                style={{ height: mobileH * 7 / 100, width: mobileW * 88 / 100, alignSelf: 'center', borderRadius: 10, borderWidth: 2, borderColor: Colors.theme_color, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', }}>
                                <View style={{ justifyContent: 'center', alignItems: 'center', marginLeft: 8 }}>
                                    <Image source={localimag.blue_search} style={{ width: mobileW * 12 / 100, height: mobileW * 5 / 100, resizeMode: 'contain' }}></Image>
                                </View>
                                <TextInput
                                 //   onChangeText={text => { this.setState({ txtsrch: text }) }}
                                 //   value={"" + this.state.txtsrch + ""}
                                    maxLength={250}
                                    returnType="done"
                                    returnKeyType="done"
                                    onChangeText={(text) => { this.SearchFilterFunction(text) }}
                                    onSubmitEditing={() => { Keyboard.dismiss() }}
                                    style={{ fontFamily: Font.regular, marginLeft: 2, width: mobileW * 75 / 100, fontSize: mobileW * 3.8 / 100, fontWeight: 'bold', height: mobileH * 6 / 100, textAlignVertical: "center" }}
                                    placeholder=""
                                    keyboardType={'default'}
                                    placeholderTextColor={Colors.text_color}
                                />
                                <TouchableOpacity onPress={() => { this.cross_click() }} style={{ width: 20, height: 20, justifyContent: 'center', alignSelf: 'center', position: 'absolute', right: 10 }}>
                                    <Image resizeMode="contain" style={{ width: 25, height: 25, alignSelf: 'center', }} source={localimag.cancel}></Image>
                                </TouchableOpacity>
                            </TouchableOpacity>
                            <View style={{ marginTop: mobileW * 5 / 100 }}>
                                {this.state.speciality_arr == 'NA' && <Image resizeMode="contain" style={{ width: '100%', height: '60%', marginTop: 0 }} source={localimag.nodataFound}></Image>}
                                {this.state.speciality_arr != 'NA' &&
                                    <FlatList
                                        data={this.state.speciality_arr}
                                        showsVerticalScrollIndicator={false}
                                        renderItem={({ item, index }) => {
                                            return (
                                                <TouchableOpacity onPress={() => { this.addItem(index), consolepro.consolelog('image ig ot', config.img_url3 + item.image) }} style={{ width: mobileW * 100 / 100, height: mobileH * 8 / 100, alignItems: 'center', justifyContent: 'flex-start', alignSelf: 'center', }}>
                                                    <View style={{ width: mobileW * 90 / 100, alignItems: 'center', justifyContent: 'flex-start', borderBottomWidth: 1, borderBottomColor: '#EDEDED', flexDirection: 'row' }}>
                                                        <Image source={{ uri: config.img_url3 + item.image }} style={{ width: mobileW * 5 / 100, height: mobileW * 5 / 100, resizeMode: 'contain', }}></Image>
                                                        <View style={{ justifyContent: 'center', width: mobileW * 80 / 100 }}>
                                                            <Text style={{ fontFamily: Font.medium, fontSize: mobileW * 4 / 100, marginLeft: 6 }}> {item.name}</Text>
                                                        </View>
                                                        {item.status == false && <View style={{ borderColor: Colors.theme_color, borderRadius: 5, borderWidth: 1, width: mobileW * 5 / 100, height: mobileW * 5 / 100, marginBottom: 4 }}></View>}
                                                        {item.status == true && <Image style={{ width: mobileW * 6 / 100, height: mobileW * 6 / 100, }} source={localimag.checksignup}></Image>}
                                                    </View>
                                                </TouchableOpacity>)
                                        }}
                                        keyExtractor={(item, index) => index.toString()}>
                                    </FlatList>}
                            </View>
                        </View>
                    </SafeAreaView>
                </Modal>

                <ScrollView showsVerticalScrollIndicator={false} style={{ paddingBottom: 10, }}>
                    <View style={{ paddingBottom: 50 }}>
                        <View style={styles.setingsHeader}>
                            <TouchableOpacity activeOpacity={1} ></TouchableOpacity>
                            <Text style={styles.OrderHistoryTitle}>Home</Text>
                            <Text></Text>
                        </View>
                        <View style={{ flexDirection: 'row', }}>
                            <View style={{ height: mobileH * 14 / 100, width: mobileW * 80 / 100, }}>
                                <FlatList
                                    data={this.state.speciality_arr1}
                                    horizontal={true}
                                    scrollEnabled={false}
                                    showsHorizontalScrollIndicator={false}
                                    showsVerticalScrollIndicator={false}
                                    renderItem={({ item, index }) => {
                                        return (
                                            <View style={{ alignItems: 'center', justifyContent: 'center', }} >
                                                <TouchableOpacity activeOpacity={1} style={{ width: windowWidth * 15 / 100, alignItems: 'center', justifyContent: 'space-between', alignSelf: 'center', marginLeft: mobileW * 4.5 / 100, }}
                                                    onPress={() => { this.props.navigation.navigate('FraternityList', { speciality_id: item.speciality_id, specialist_name: item.name }); consolepro.consolelog('Rock', item.speciality_id); localStorage.setItemObject('speciality_id', item.speciality_id) }}>
                                                    <View style={{ width: windowWidth * 15 / 100, height: windowWidth * 15 / 100, alignItems: 'center', justifyContent: 'center', alignSelf: 'center', backgroundColor: Colors.theme_color, borderRadius: 40 }}>
                                                        <Image style={{ width: mobileW * 10 / 100, height: mobileW * 10 / 100, borderRadius: 100, resizeMode: 'cover' }} source={{ uri: config.img_url3 + item.image }}></Image>
                                                    </View>
                                                    <Text numberOfLines={1} style={{ fontSize: mobileW * 3 / 100, fontFamily: Font.medium, color: Colors.theme_color }}>{item.name}</Text>
                                                </TouchableOpacity>
                                            </View>)
                                    }}
                                    keyExtractor={(item, index) => index.toString()}>
                                </FlatList>
                            </View>
                            <TouchableOpacity activeOpacity={1} style={{ width: windowWidth * 15 / 100, alignItems: 'center', justifyContent: 'space-between', alignSelf: 'center', marginRight: mobileW * 3 / 100, marginLeft: 10, }}
                                onPress={() => { this.props.navigation.navigate('Category') }}>
                                <View style={{ width: windowWidth * 15 / 100, height: windowWidth * 15 / 100, alignItems: 'center', justifyContent: 'center', alignSelf: 'center', backgroundColor: Colors.theme_color, borderRadius: 40, }}>
                                    <Image resizeMode="contain" style={{ width: mobileW * 8 / 100, height: mobileH * 5 / 100, marginTop: 20 }} source={localimag.whiteDot}></Image>
                                </View>
                                <Text style={{ fontSize: mobileW * 3 / 100, fontFamily: Font.regular, color: Colors.theme_color }}>{'More'}</Text>
                            </TouchableOpacity>
                        </View>
                        <TouchableOpacity activeOpacity={1} onPress={() => { this.navigateSpeciality(); }}
                            style={{ height: mobileH * 7 / 100, width: mobileW * 92 / 100, alignSelf: 'center', borderRadius: 10, borderWidth: 4, borderColor: Colors.theme_color, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', }}>
                            <Text style={{ fontFamily: Font.bold, marginLeft: 10, width: mobileW * 75 / 100, fontSize: mobileW * 4.2 / 100, height: mobileH * 3 / 100, alignSelf: 'center', color: Colors.textColor }}>{this.state.speciality_name}</Text>
                            <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                                <Image source={localimag.dropdown} style={{ width: mobileW * 11 / 100, height: mobileW * 4 / 100, resizeMode: 'contain' }}></Image>
                            </View>
                        </TouchableOpacity>
                        <View style={{ marginTop: mobileW * 3 / 100, height: mobileH * 30 / 100, width: mobileW * 92 / 100, alignSelf: 'center', borderRadius: 10, borderWidth: 4, borderColor: Colors.theme_color }}>
                            <TextInput
                                onChangeText={text => { this.setState({ question: text }) }}
                                value={"" + this.state.question + ""}
                                maxLength={250}
                                multiline={true}
                                returnType="done"
                                returnKeyType="done"
                                onSubmitEditing={() => { Keyboard.dismiss() }}
                                style={{ fontFamily: Font.regular, marginLeft: 10, width: mobileW * 86 / 100, fontSize: mobileW * 3.8 / 100, fontWeight: 'bold', height: mobileH * 21 / 100, textAlignVertical: 'top' }}
                                placeholder="Ask a question ..."
                                keyboardType={'default'}
                                placeholderTextColor={Colors.text_color}
                            />
                            <View style={{ flexDirection: 'row', width: mobileW * 88 / 100, height: mobileH * 8 / 100, borderRadius: 15, alignItems: 'center', justifyContent: 'center', alignSelf: 'center' }}>
                                <TouchableOpacity activeOpacity={1} onPress={() => { this.setState({ mediamodal: true }) }}
                                    style={{ flexDirection: 'row', width: mobileW * 28 / 100, height: mobileH * 5 / 100, backgroundColor: Colors.theme_color, borderRadius: 15, alignItems: 'center', justifyContent: 'center', alignSelf: 'center', paddingHorizontal: mobileW * 4 / 100 }}>
                                    {this.state.doc == 'Choose File' && <Text numberOfLines={1} style={{ fontSize: mobileW * 3.4 / 100, fontFamily: Font.bold, color: Colors.purewhite, }}>Choose File</Text>}
                                    {this.state.doc != 'Choose File' && <Text numberOfLines={1} style={{ fontSize: mobileW * 3.4 / 100, fontFamily: Font.bold, color: Colors.purewhite, }}>File Choosed</Text>}
                                    {this.state.doc != 'Choose File' && <TouchableOpacity style={{ width: mobileW * 5 / 100, height: mobileW * 5 / 100, justifyContent: 'center', alignItems: 'center' }} onPress={() => { this.setState({ doc: 'Choose File' }) }}>
                                        <Image resizeMode={'contain'} source={localimag.white_close} style={{ marginLeft: 10, width: mobileW * 3 / 100, height: mobileW * 2 / 100 }}></Image>
                                    </TouchableOpacity>}
                                </TouchableOpacity>
                                <TouchableOpacity activeOpacity={1} style={{ marginLeft: 10, width: mobileW * 56 / 100, height: mobileH * 5 / 100, backgroundColor: Colors.theme_color, borderRadius: 15, alignItems: 'center', justifyContent: 'center', alignSelf: 'center' }}
                                    onPress={() => { this.AskQuestionFromExpert() }}>
                                    <Text style={{ fontSize: mobileW * 3.8 / 100, fontFamily: Font.bold, color: Colors.purewhite }}>Start Now</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                        <View style={{ flexDirection: 'row', width: mobileW * 92 / 100, height: mobileH * 7 / 100, justifyContent: 'space-between', alignItems: 'center', alignSelf: 'center' }}>
                            <TouchableOpacity style={{ padding: 2 }}>
                                <Text style={{ fontFamily: Font.bold, fontSize: mobileW * 3.8 / 100, color: Colors.theme_color }}>Experts</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => { this.navigateNot('ExpertList') }} style={{ padding: 2 }}>
                                <Text style={{ fontFamily: Font.bold, fontSize: mobileW * 3.8 / 100, color: 'red' }}>View all</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={{ width: mobileW * 96 / 100, alignSelf: 'center', height: mobileH * 42 / 100, alignItems: 'center', justifyContent: 'center', }}>
                            {this.state.expert_arr == 'NA' && <Image resizeMode="contain" style={{ width: '100%', height: '60%', marginTop: 0 }} source={localimag.nodataFound}></Image>}
                            {this.state.expert_arr != 'NA' &&
                                <FlatList
                                    data={this.state.expert_arr}
                                    horizontal={true}
                                    showsHorizontalScrollIndicator={false}
                                    showsVerticalScrollIndicator={false}
                                    renderItem={({ item, index }) => {
                                        return (
                                            <TouchableOpacity activeOpacity={1} onPress={() => {
                                                this.props.navigation.navigate('ExpertDetails', { other_user_id: item.user_id });
                                                // localStorage.setItemObject('user_id', item.user_id)
                                            }}>
                                                <View style={{ width: windowWidth * 60 / 100, height: (config.device_type == 'ios') ? windowHeight * 35 / 100 : windowHeight * 40 / 100, alignItems: 'center', justifyContent: 'flex-start', alignSelf: 'center', marginLeft: mobileW * 4 / 100,paddingBottom:mobileW*2/100, backgroundColor: '#FFFFFF', elevation: 4, borderRadius: 10, shadowColor: '#000000', shadowOffset: { width: 2, height: 2, }, shadowOpacity: 0.30 }}>
                                                    <View style={{ width: windowWidth * 60 / 100, height: windowHeight * 18 / 100, alignItems: 'center', justifyContent: 'flex-end', alignSelf: 'center', }}>
                                                        <Image style={{ width: mobileW * 29 / 100, height: mobileW * 29 / 100, borderRadius: 60 }} resizeMode={'cover'} source={item.image == null ? localimag.default : { uri: config.img_url3 + item.image }}></Image>
                                                    </View>
                                                    <View>
                                                        <Text style={{ fontFamily: Font.bold, fontSize: mobileW * 4.8 / 100, }}>{item.name}</Text>
                                                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', height: mobileW * 4 / 100 }}>
                                                            <StarRating
                                                                containerStyle={{ width: windowWidth * 16 / 100, height: windowHeight * 3 / 100, alignSelf: 'center', alignItems: 'center' }}
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
                                                    </View>
                                                    <View style={{ alignSelf: 'center', width: mobileW * 50 / 100, alignItems: 'center', justifyContent: 'flex-start', }}>
                                                        <Text style={{ fontFamily: Font.medium, fontSize: mobileW * 4.5 / 100, }}>{item.speciality_name}</Text>
                                                        <Text style={{ fontFamily: Font.medium, fontSize: mobileW * 3.2 / 100, textAlign: 'center' }}>{item.description}</Text>
                                                    </View>
                                                    <View style={{ alignItems: 'center', justifyContent: 'flex-end', marginTop: 8,paddingVertical:mobileW*1/100, }}>
                                                        <Text style={{ fontFamily: Font.medium, fontSize: mobileW * 3.2 / 100 }}><Text style={{ fontFamily: Font.bold, fontSize: mobileW * 3.2 / 100 }}>{item.satisfied_customer}</Text> Satisfied Customer</Text>
                                                    </View>
                                                </View>
                                            </TouchableOpacity>)
                                    }}
                                    keyExtractor={(item, index) => index.toString()}>
                                </FlatList>}
                        </View>
                    </View>
                </ScrollView>
                <HideWithKeyboard>
                <View style={{ backgroundColor: '#FFFFFF', elevation: 4, height: mobileH * 6 / 100, position: 'absolute', bottom: 0, width: mobileW * 100 / 100, alignSelf: 'center' }}>
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
                </HideWithKeyboard>
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
        paddingTop: 14,
        paddingBottom: 14,
        alignItems: 'center'
    },
    OrderHistoryTitle: {
        color: Colors.white_color,
        fontFamily: Font.bold,
        fontSize: windowWidth * 5.2 / 100,
        letterSpacing: 0.5
    },
    imagestyle1: {
        width: mobileW * 6 / 100
    }
});


