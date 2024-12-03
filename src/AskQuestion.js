import React, { Component } from 'react'
import { Text, View, TouchableOpacity, SafeAreaView, TextInput, Alert, Keyboard, Modal, Dimensions, StatusBar, Image, ScrollView, BackHandler, StyleSheet } from 'react-native'
import { config, Otpprovider, Mapprovider, apifuntion, Colors, Font, validation, mobileH, mobileW, SocialLogin, Cameragallery, mediaprovider, localStorage, Lang_chg, consolepro, msgProvider, msgTitle, msgText, Currentltlg } from './Providers/utilslib/Utils'
import { localimag } from './Providers/Localimageprovider/Localimage'
import { notification } from './Providers/NotificationProvider';
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
import HideWithKeyboard from 'react-native-hide-with-keyboard';
import Footer from './Providers/Footer';
export default class AskQuestion extends Component {
    constructor(props) {
        super(props)
        this.state = {
            modalVisible2: false,
            question: '',
            //doc:'Choose Document',
            mediamodal: false,
            imagepath: 'Choose Document',
            show_text: '',
            expert_id: '',
            speciality_id: '',
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
    //---------------------------------------------------//

    backpress = () => {
        this.props.navigation.goBack();
    }
    componentDidMount = () => {
        this.getExpertId();
    }

    //---------------------------------------------------//

    Camerapopen = async () => {
        this.setState({ show_text: '' })
        mediaprovider.launchCamera(false).then((res) => {
            console.log('camerares', res)
            this.setState({ mediamodal: false, imagepath: res.path, edit: 1, show_text: 'File Choosed' })
        }).catch((error) => {
            this.setState({ mediamodal: false, edit: 0 })
        })
    }

    Galleryopen = () => {
        this.setState({ show_text: '' })
        mediaprovider.launchGellery(false).then((res) => {
            console.log('camerares', res)
            this.setState({ imagepath: res.path, mediamodal: false, edit: 1, show_text: 'File Choosed' })
        }).catch((error) => {
            this.setState({ mediamodal: false, edit: 0 })
        })
    }

    //..........................................................//

    getSpecialityID = async () => {
        let speciality_id = await localStorage.getItemObject('speciality_id')
        if (speciality_id != null && speciality_id != 'NA') {
            this.setState({ speciality_id: speciality_id })
        }
    }

    //............................................................//

    getExpertId = async () => {
        let expert_arr = await localStorage.getItemObject('expert_arr');
        let expertdata = await localStorage.getItemObject('expertdata');
        consolepro.consolelog('expertdata', expertdata);
        let pagenav = await localStorage.getItemObject('pagenav');
        if (pagenav != true) {
            this.setState({ expert_id: expert_arr.user_id, speciality_id: expert_arr.speciality_id })
        } else {
            this.setState({ expert_id: expertdata.user_id });
            this.getSpecialityID();
        }
    }

    //------------------------------------------------------//

    AskQuestionFromExpert = async () => {


        consolepro.consolelog('AskQuestionFromExpert')
        let user_details = await localStorage.getItemObject('user_arr');
        consolepro.consolelog('user_details', user_details);
        let expert_id = this.state.expert_id;
        let speciality_id = this.state.speciality_id;
        let question = this.state.question;
        let imagepath = this.state.imagepath;

        if (question.length == 0) {
            msgProvider.toast(msgText.emptyQuestion[config.language], 'top')
            return false;
        }
        // if (imagepath == 'Choose Document') {
        //     msgProvider.toast(msgText.emptyDocument[config.language], 'top')
        //     return false;
        // }
        let guest_user = await localStorage.getItemString('guest_user');
        if (guest_user == 'yes') {
            this.props.navigation.navigate('Signup')
            return false
        }

        let url = config.baseURL + "askQuestion.php";
        consolepro.consolelog('url', url)
        let data = new FormData();
        data.append('user_id', user_details.user_id)
        data.append('expert_id', expert_id)
        data.append('speciality_id', speciality_id)
        data.append("question", question)
        if (imagepath != 'Choose Document') {
            data.append('file', {
                uri: imagepath,
                type: 'image/jpg', // or photo.type
                name: 'image.jpg'
            })
        }
        apifuntion.postApi(url, data).then((obj) => {
            if (obj.success == 'true') {
                if (obj.notification_arr != 'NA') {
                    notification.notification_arr(obj.notification_arr)
                }
                localStorage.removeItem('expert_question_arr')
                localStorage.setItemObject('expert_name', obj.expert_name);
                this.props.navigation.navigate('QuestionSendSuccessfull');
            } else {
                consolepro.consolelog('false')
                if (obj.active_status == 'deactivate') {
                    config.checkUserDeactivate(this.props.navigation);
                    return false;
                }
                setTimeout(() => {
                    msgProvider.alert(msgTitle.information[config.language], obj.msg[config.language], false);
                    return false;
                }, 600);
            }
        }).catch((error) => {
            consolepro.consolelog("-------- error ------- " + error);
        });
    }

    //-------------------------------------------------------//

    render() {
        return (
            <View style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
                    <View style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
                <SafeAreaView style={{ flex: 0, backgroundColor: Colors.theme_color }} />
                <StatusBar backgroundColor={Colors.theme_color} barStyle='default' hidden={false} translucent={false}
                    networkActivityIndicatorVisible={true} />
                <Cameragallery mediamodal={this.state.mediamodal} Camerapopen={() => { this.Camerapopen() }}
                    Galleryopen={() => { this.Galleryopen() }} Canclemedia={() => { this.setState({ mediamodal: false }) }} />
                <View style={styles.setingsHeader}>
                    <TouchableOpacity activeOpacity={0.9} onPress={() => { this.props.navigation.goBack() }}>
                        <Image resizeMode="contain" style={{ width: 35, height: 30 }} source={localimag.back}></Image>
                    </TouchableOpacity>
                    <Text style={styles.OrderHistoryTitle}>Ask Question</Text>
                    <Text style={{ width: 20 }}> </Text>
                </View>
                <View style={{ height: mobileW * 70 / 100, }}>
                    <View style={{ width: mobileW * 90 / 100, alignSelf: 'center', marginTop: 15 }}>
                        <Text style={{ fontSize: mobileW * 3.8 / 100, fontFamily: 'Roboto-Bold', }}>Description</Text>
                    </View>
                    <View style={{ marginTop: mobileW * 3 / 100, width: mobileW * 90 / 100, alignSelf: 'center', borderWidth: 0.7 }}>
                        <TextInput
                            onChangeText={text => { this.setState({ question: text }) }}
                            value={"" + this.state.question + ""}
                            maxLength={250}
                            multiline={true}
                            returnType="done"
                            returnKeyType="done"
                            onSubmitEditing={() => { Keyboard.dismiss() }}
                            style={{ fontFamily: Font.regular, marginLeft: 10, width: mobileW * 88 / 100, fontSize: mobileW * 3.8 / 100, height: mobileH * 21 / 100, textAlignVertical: 'top' }}
                            placeholder="Description"
                            keyboardType={'default'}
                            placeholderTextColor={Colors.text_color}
                        />
                    </View>
                </View>
                <View style={{ justifyContent: 'flex-start', }}>
                    <View style={{ width: mobileW * 90 / 100, alignSelf: 'center', marginTop: 10 }}>
                        <Text numberOfLines={1} style={{ fontSize: mobileW * 3.8 / 100, fontFamily: 'Roboto-Bold', }}>Document</Text>
                    </View>
                    <TouchableOpacity onPress={() => { this.setState({ mediamodal: true }) }}
                        style={{ marginTop: mobileW * 3 / 100, height: mobileH * 6 / 100, width: mobileW * 90 / 100, alignSelf: 'center', borderWidth: 0.7, justifyContent: 'center' }}>
                        <Text numberOfLines={1} style={{ fontFamily: Font.regular, marginLeft: 10, width: mobileW * 88 / 100, fontSize: mobileW * 3.8 / 100, color: Colors.textColor }}>{(this.state.show_text != '') ? this.state.show_text : "Choose File"}</Text>
                    </TouchableOpacity>
                </View>
                <View style={{ width: mobileW * 84 / 100, borderRadius: 15, alignItems: 'center', justifyContent: 'flex-start', alignSelf: 'center', marginTop: 30 }}>
                    <TouchableOpacity activeOpacity={1} onPress={() => { this.AskQuestionFromExpert() }}
                        style={{ width: mobileW * 90 / 100, height: mobileH * 6 / 100, backgroundColor: Colors.theme_color, borderRadius: 12, alignItems: 'center', justifyContent: 'center', alignSelf: 'center' }}>
                        <Text style={{ fontSize: mobileW * 4.4 / 100, fontFamily: Font.bold, color: Colors.purewhite }}>Submit</Text>
                    </TouchableOpacity>
                </View>
                </View>
                <HideWithKeyboard>
                <Footer
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
                </HideWithKeyboard>
            </View>
        )
    }
}
const styles = StyleSheet.create({
    setingsHeader: {
        flexDirection: 'row',
        backgroundColor: Colors.purewhite,
        justifyContent: 'space-between',
        paddingVertical:mobileW*3/100,
        alignItems: 'center',
        // elevation: 4,
        borderBottomWidth: 2,
        borderBottomColor: '#D3D3D3',
        // shadowColor: '#000000',
        // shadowOffset: { width: 2, height: 2, },
        // shadowOpacity: 0.30,
    },
    OrderHistoryTitle: {
        color: Colors.font_color,
        fontFamily: Font.bold,
        fontSize: windowWidth * 5.2 / 100,
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


