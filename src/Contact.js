import React, { Component, createRef } from 'react'
import { Text, View, SafeAreaView, StatusBar, TouchableOpacity, Image, KeyboardAvoidingView, TextInput, Modal, ImageBackground, Dimensions, ScrollView, BackHandler, Alert, FlatList, Keyboard, StyleSheet } from 'react-native'
import { config, Otpprovider, Mapprovider, apifuntion, Colors, Font, validation, mobileH, mobileW, SocialLogin, Cameragallery, mediaprovider, localStorage, Lang_chg, consolepro, msgProvider, msgTitle, msgText, Currentltlg } from './Providers/utilslib/Utils'
import { localimag } from './Providers/Localimageprovider/Localimage'
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
import Footer from './Providers/Footer';
import Footerr from './Providers/Footerr';
import HideWithKeyboard from 'react-native-hide-with-keyboard';

export default class Contact extends Component {
    constructor(props) {
        super(props)
        this.state = {
            name: '',
            email: '',
            admin_email: '',
            description: '',
            user_type: 1,
            footer_image: null
        }
        this.setUserType()
    }

    componentDidMount() {
        this.showData();
        this.getAdminDetails();
    }
    setUserType = async () => {
        let result = await localStorage.getItemObject('user_arr')
        if (result != null) {
            this.setState({
                user_type: result.user_type,
                footer_image: result.image
            })
        }
    }

    successMessage = () => {
        Alert.alert(
            "Information Message",
            "Your message has been sent successfully",
            [
                { text: "OK", onPress: () => { { this.props.navigation.navigate("Setting"); } } }
            ],
            { cancelable: false }
        );
    }

    showData = async () => {
        let userdata = await localStorage.getItemObject('user_arr');
        if (userdata != 'NA' && userdata != null) {
            let name = userdata.name
            let email = userdata.email
            if (name != null && email != null) {
                this.setState({ name: name, email: email });
            }
        }
    }




    //--------------------------------------------//
    getAdminDetails = () => {
        var user_id = 0;
        let url = config.baseURL + "getAdminDetails.php?user_id=" + user_id;
        consolepro.consolelog(url)
        apifuntion.getApi(url,1).then((obj) => {
            consolepro.consolelog('obj', obj)
            if (obj.success == "true") {
                this.setState({ admin_email: obj.admin_details.email, })
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
    //--------------------------------------------//



    //--------------------------------------------//
    contact_us = async () => {
    
        consolepro.consolelog('contact_us');
        let user_details = await localStorage.getItemObject('user_arr');
        consolepro.consolelog('user_details_ba', user_details);
        let name = this.state.name;
        let description = this.state.description;
        if (name.length <= 0) {
            msgProvider.toast(msgText.emptyName[config.language], 'top')
            return false;
        }
        if (description.length <= 0) {
            msgProvider.toast(msgText.emptyDiscription[config.language], 'top')
            return false;
        }
        if (description.length <= 4) {
            msgProvider.toast(msgText.lengthDiscription[config.language], 'top')
            return false;
        }
        let url = config.baseURL + "Contact_user.php";
        consolepro.consolelog('url', url)
        let data = new FormData();
        data.append('user_id',user_details.user_id)
        data.append('name',this.state.name)
        data.append('email',user_details.email)
        data.append('message',this.state.description)
        consolepro.consolelog('hello',data)
        apifuntion.postApi(url, data).then((obj) => {
            
            if (obj.success == 'true') {
                   msgProvider.toast('Thank you for contacting us', 'top')
   this.props.navigation.navigate("Setting")
            } else {
                consolepro.consolelog('false')
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

    //------------------------------------------------------------//

    render() {
        return (
            <View style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
            <View style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
                <SafeAreaView style={{ flex: 0, backgroundColor: Colors.theme_color }} />
                <StatusBar backgroundColor={Colors.theme_color} barStyle='default' hidden={false} translucent={false}
                    networkActivityIndicatorVisible={true} />
                <TouchableOpacity activeOpacity={1} onPress={() => { Keyboard.dismiss() }} style={{ height: windowHeight * 100 / 100, paddingBottom: 60 }}>
                    <View style={styles.setingsHeader}>
                        <TouchableOpacity activeOpacity={0.9} onPress={() => { this.props.navigation.navigate('Setting') }}>
                            <Image resizeMode="contain" style={{ width: 25, height: 30 }} source={localimag.back}></Image>
                        </TouchableOpacity>
                        <Text style={styles.OrderHistoryTitle}>Contact Us</Text>
                        <Text></Text>
                    </View>
                    <View style={{ height: windowHeight * 92 / 100, width: windowWidth * 100 / 100, alignSelf: 'center', alignItems: 'center', justifyContent: 'flex-start', }}>
                        <View style={{ width: windowWidth * 92 / 100, height: windowHeight * 92 / 100, }}>
                            <View style={{ alignItems: 'center', justifyContent: 'center', paddingVertical: 30 }}>
                                <Text style={{ fontFamily: Font.bold, fontSize: mobileW * 4.2 / 100 }}>Configure Contact us Email to be:</Text>
                                <Text style={{ fontFamily: Font.bold, fontSize: mobileW * 3.8 / 100, color: Colors.theme_color }}>{this.state.admin_email}</Text>
                            </View>
                            <TouchableOpacity style={{ flexDirection: 'row', height: windowHeight * 8 / 100, borderRadius: 20, alignItems: 'center', backgroundColor: Colors.purewhite, elevation: 4, shadowColor: '#000000', shadowOffset: { width: 2, height: 2, }, shadowOpacity: 0.30 }} activeOpacity={1}>
                                <Image source={localimag.user_blue}
                                    style={{ marginLeft: windowHeight * 3.5 / 100, height: windowWidth * 6 / 100, width: windowWidth * 5.5 / 100, resizeMode: 'contain', marginBottom: 4 }}>
                                </Image>
                                <TextInput placeholder={'Full Name'}
                                    ref={input => { this.name = input }}
                                    onChangeText={(txt) => { this.setState({ name: txt }) }}
                                    value={"" + this.state.name + ""}
                                    maxLength={50}
                                    returnType="done"
                                    returnKeyType="done"
                                    onSubmitEditing={() => { Keyboard.dismiss() }}
                                    editable={false}
                                    placeholderTextColor={Colors.textColor}
                                    style={{ marginLeft: windowWidth * 3 / 100, fontFamily: Font.regular, color: Colors.textColor, fontSize: windowWidth * 3.9 / 100, height: windowHeight * 6 / 100, width: windowWidth * 72 / 100, padding: 2 }}>
                                </TextInput>
                            </TouchableOpacity>
                            <TouchableOpacity style={{ flexDirection: 'row', marginTop: windowHeight * 3 / 100, height: windowHeight * 8 / 100, borderRadius: 20, alignItems: 'center', backgroundColor: Colors.purewhite, elevation: 4, shadowColor: '#000000', shadowOffset: { width: 2, height: 2, }, shadowOpacity: 0.30 }} activeOpacity={1}>
                                <Image source={localimag.email_blue}
                                    style={{ marginLeft: windowHeight * 3.5 / 100, height: windowWidth * 6 / 100, width: windowWidth * 5.5 / 100, resizeMode: 'contain', marginBottom: 4 }}>
                                </Image>
                                <TextInput placeholder={'Email'}
                                    ref={input => { this.email = input }}
                                    onChangeText={(txt) => { this.setState({ email: txt }) }}
                                    value={"" + this.state.email + ""}
                                    maxLength={50}
                                    returnType="done"
                                    returnKeyType="done"
                                    onSubmitEditing={() => { Keyboard.dismiss() }}
                                    editable={false}
                                    placeholderTextColor={Colors.textColor}
                                    style={{ padding: 2, marginLeft: windowWidth * 3 / 100, fontFamily: Font.regular, color: Colors.textColor, fontSize: windowWidth * 3.9 / 100, height: windowHeight * 6 / 100, width: windowWidth * 72 / 100 }}>
                                </TextInput>
                            </TouchableOpacity>
                            <TouchableOpacity style={{ flexDirection: 'row', marginTop: windowHeight * 3 / 100, height: windowHeight * 25 / 100, borderRadius: 20, backgroundColor: Colors.purewhite, elevation: 4, shadowColor: '#000000', shadowOffset: { width: 2, height: 2, }, shadowOpacity: 0.30, paddingTop: mobileW * 2 / 100 }}>
                                <Image source={localimag.edit_blue}
                                    style={{ marginLeft: windowHeight * 3.5 / 100, height: windowWidth * 6 / 100, width: windowWidth * 5.5 / 100, resizeMode: 'contain', }}>
                                </Image>
                                <TextInput placeholder={'Message'}
                                    ref={input => { this.description = input }}
                                    onChangeText={(txt) => { this.setState({ description: txt }) }}
                                    value={"" + this.state.description + ""}
                                    maxLength={250}
                                    multiline={true}
                                    returnType="done"
                                    returnKeyType="done"
                                    onSubmitEditing={() => { Keyboard.dismiss() }}
                                    placeholderTextColor={Colors.textColor}
                                    style={{ padding: 2, marginLeft: windowWidth * 3 / 100, fontFamily: Font.regular, color: Colors.textColor, fontSize: windowWidth * 4 / 100, height: windowHeight * 20 / 100, width: windowWidth * 76 / 100, textAlignVertical: 'top' }}>
                                </TextInput>
                            </TouchableOpacity>
                            <TouchableOpacity activeOpacity={1} onPress={() => { this.contact_us() }} style={{ marginTop: windowHeight * 6 / 100, height: windowHeight * 8 / 100, borderRadius: 20, alignItems: 'center', justifyContent: 'center', backgroundColor: Colors.theme_color }}>
                                <Text style={{ fontFamily: Font.bold, color: Colors.white_color, fontSize: windowWidth * 4.4 / 100 }}>Send</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </TouchableOpacity>
                </View>
                {parseInt(this.state.user_type) == 1 && 
                <HideWithKeyboard>
                <View style={{ backgroundColor: '#FFFFFF', elevation: 4, height: mobileH * 6 / 100, position: 'absolute', bottom: 0, width: mobileW * 100 / 100, alignSelf: 'center', shadowColor: '#000000', shadowOffset: { width: 2, height: 2, }, shadowOpacity: 0.30 }}>
                    
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
                </View>
                </HideWithKeyboard>
                }
                {parseInt(this.state.user_type) == 2 && 
                <HideWithKeyboard>
                <View style={{ backgroundColor: '#FFFFFF', elevation: 4, height: mobileH * 6 / 100, position: 'absolute', bottom: 0, width: mobileW * 100 / 100, alignSelf: 'center', shadowColor: '#000000', shadowOffset: { width: 2, height: 2, }, shadowOpacity: 0.30 }}>
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

                </View>
                    </HideWithKeyboard>
                }
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

