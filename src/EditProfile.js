import React, { Component } from 'react'
import { Text, View, TouchableOpacity, SafeAreaView, TextInput, Keyboard, Alert, Dimensions, StatusBar, Image, ScrollView, BackHandler, StyleSheet } from 'react-native'
import { config, Otpprovider, Mapprovider, apifuntion, Colors, Font, validation, mobileH, mobileW, SocialLogin, Cameragallery, mediaprovider, localStorage, Lang_chg, consolepro, msgProvider, msgTitle, msgText, Currentltlg } from './Providers/utilslib/Utils'
import { firebaseprovider } from './Providers/FirebaseProvider'
import { localimag } from './Providers/Localimageprovider/Localimage'
import Footer from './Providers/Footer';
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
export default class EditProfile extends Component {
    constructor(props) {
        super(props)
        this.state = {
            fname: '',
            lname: '',
            email: '',
            mobile: '',
            imagepath: 'NA',
            mediamodal: false,
            edit: 0,
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
    successMessage = () => {
        Alert.alert(
            "Information Message",
            "Your profile has been updated successfully",
            [
                { text: "OK", onPress: () => { { this.props.navigation.navigate("Profile"); } } }
            ],
            { cancelable: false }
        );
    }
    backpress = () => {
        this.props.navigation.goBack();
    }
    componentDidMount = () => {
        this.props.navigation.addListener('focus', () => {
            this.getProfileData();
        });
    }

    getProfileData = async () => {
        let user_details = await localStorage.getItemObject('user_arr');
        consolepro.consolelog('user_detailhere', user_details)
        let fname = user_details.f_name;
        let lname = user_details.l_name;
        let mobile = user_details.mobile;
        let email = user_details.email;
        let image = user_details.image;
        consolepro.consolelog('imagewe', image)
        if (user_details != 'NA' && user_details != null) {
            this.setState({ fname: fname, lname: lname, mobile: mobile, email: email });
        }
        if (image != null && image != "") {
            this.setState({ imagepath: config.img_url3 + image });
            consolepro.consolelog('imagepath1', this.state.imagepath)
        } else {
            consolepro.consolelog('imagepath2', this.state.imagepath)
            this.setState({ imagepath: 'NA' });
        }
    }
    //---------------------------------------------------//
    Camerapopen = async () => {
        mediaprovider.launchCamera(false).then((res) => {
            console.log('camerares', res)
            this.setState({ mediamodal: false, imagepath: res.path, edit: 1 })
        }).catch((error) => {
            this.setState({ mediamodal: false, edit: 0 })
        })
    }
    Galleryopen = () => {
        mediaprovider.launchGellery(false).then((res) => {
            console.log('camerares', res)
            this.setState({ imagepath: res.path, mediamodal: false, edit: 1 })
        }).catch((error) => {
            this.setState({ mediamodal: false, edit: 0 })
        })
    }
    //------------------------------------------------------//

    EditProfile = async () => {
        consolepro.consolelog('EditProfile');
        consolepro.consolelog('imagepath', this.state.imagepath);
        let user_details = await localStorage.getItemObject('user_arr');
        consolepro.consolelog('user_details_ba', user_details);
        let fname = this.state.fname;
        let lname = this.state.lname;
        let mobile = this.state.mobile;
        let email = this.state.email;
        if (fname.length <= 0) {
            msgProvider.toast(msgText.emptyFirstName[config.language], 'top')
            return false;
        }
        if (lname.length <= 0) {
            msgProvider.toast(msgText.emptyLastName[config.language], 'top')
            return false;
        }
        if (mobile.length <= 0) {
            msgProvider.toast(msgText.emptyPhone[config.language], 'top')
            return false;
        }
        if (mobile.length < 6) {
            msgProvider.toast(msgText.minimumPhoneLength[config.language], 'top')
            return false;
        }
        if (mobile.length > 16) {
            msgProvider.toast(msgText.maximumPhoneLength[config.language], 'top')
            return false;
        }
        if (email.length <= 0) {
            msgProvider.toast(msgText.emptyEmail[config.language], 'top')
            return false;
        }
        const regg = /^([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;
        if (regg.test(email) !== true) {
            msgProvider.toast(msgText.validEmail[config.language], 'top')
            return false;
        }
        let url = config.baseURL + "edit_profile.php";
        consolepro.consolelog('url', url)
        let data = new FormData();
        data.append('user_id', user_details.user_id)
        data.append('f_name', fname)
        data.append('l_name', lname)
        data.append('mobile', mobile)
        data.append('email', email)
        data.append('edit', this.state.edit)
        if (this.state.edit == 1) {
            data.append('file', {
                uri: this.state.imagepath,
                type: 'image/jpg', // or photo.type
                name: 'image.jpg'
            })
        }

        consolepro.consolelog('data1', data)
        apifuntion.postApi(url, data).then((obj) => {
            if (obj.success == 'true') {
                consolepro.consolelog('truew', obj)
                localStorage.setItemObject('user_arr', obj.user_details);
                this.successMessage();
                setTimeout(() => {
                    firebaseprovider.firebaseUserCreate();
                }, 1500);
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
    //--------------------************-------------------//
    render() {
        return (
            <View style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
                <SafeAreaView style={{ flex: 0, backgroundColor: Colors.theme_color }} />
                <StatusBar backgroundColor={Colors.theme_color} barStyle='default' hidden={false} translucent={false}
                    networkActivityIndicatorVisible={true} />
                <Cameragallery mediamodal={this.state.mediamodal} Camerapopen={() => { this.Camerapopen() }}
                    Galleryopen={() => { this.Galleryopen() }} Canclemedia={() => { this.setState({ mediamodal: false }) }} />
                <ScrollView contentContainerStyle={{ paddingBottom: 80 }}>
                    <View>
                        <View style={styles.setingsHeader}>
                            <TouchableOpacity activeOpacity={0.9} onPress={() => { this.props.navigation.navigate('Profile') }}>
                                <Image resizeMode="contain" style={{ width: 40, height: 40 }} source={localimag.back}></Image>
                            </TouchableOpacity>
                            <Text style={styles.OrderHistoryTitle}>Edit Profile</Text>
                            <Text> </Text>
                        </View>
                        <View style={{ alignItems: 'center', paddingVertical: 20 }}>
                            <Image resizeMode="cover" style={{ width: mobileW * 42 / 100, height: mobileW * 42 / 100, borderRadius: 100 }} source={this.state.imagepath == 'NA' ? localimag.default : { uri: this.state.imagepath }}></Image>
                            <Text onPress={() => { this.setState({ mediamodal: true }) }} style={{ color: Colors.theme_color, paddingVertical: 20, fontSize: mobileW * 3.8 / 100 }}>Change Profile Photo</Text>
                        </View>
                        <View style={{ height: mobileH * 30 / 100, alignItems: 'center', justifyContent: 'center', }}>
                            <View style={{ flexDirection: 'row', borderBottomWidth: 0.6, alignItems: 'flex-end', borderColor: Colors.font_color, width: mobileW * 84 / 100, height: mobileH * 6 / 100, alignSelf: 'center', justifyContent: 'flex-start', }}>
                                <Image resizeMode="cover" style={{ width: mobileW * 5 / 100, height: mobileH * 3 / 100, marginBottom: 4 }} source={localimag.name}></Image>
                                <TextInput
                                    onChangeText={text => { this.setState({ fname: text }) }}
                                    value={"" + this.state.fname + ""}
                                    maxLength={50}
                                    returnType="done"
                                    returnKeyType="done"
                                    onSubmitEditing={() => { Keyboard.dismiss() }}
                                    style={{ padding: 2, fontFamily: Font.regular, marginLeft: 10, width: mobileW * 72 / 100, fontSize: mobileW * 3.2 / 100, height: mobileW * 7.5 / 100 }}
                                    placeholder="First Name"
                                    keyboardType={'default'}
                                    placeholderTextColor={Colors.textColor} />
                            </View>
                            <View style={{ flexDirection: 'row', borderBottomWidth: 0.6, alignItems: 'flex-end', borderColor: Colors.font_color, width: mobileW * 84 / 100, height: mobileH * 6 / 100, alignSelf: 'center', justifyContent: 'flex-start', marginTop: 15 }}>
                                <Image resizeMode="cover" style={{ width: mobileW * 5 / 100, height: mobileH * 3 / 100, marginBottom: 4 }} source={localimag.name}></Image>
                                <TextInput
                                    onChangeText={text => { this.setState({ lname: text }) }}
                                    value={"" + this.state.lname + ""}
                                    maxLength={50}
                                    returnType="done"
                                    returnKeyType="done"
                                    onSubmitEditing={() => { Keyboard.dismiss() }}
                                    style={{ padding: 2, fontFamily: Font.regular, marginLeft: 10, width: mobileW * 72 / 100, fontSize: mobileW * 3.2 / 100, height: mobileW * 7.5 / 100 }}
                                    placeholder="Last Name"
                                    keyboardType={'default'}
                                    placeholderTextColor={Colors.textColor} />
                            </View>
                            <View style={{ flexDirection: 'row', borderBottomWidth: 0.6, alignItems: 'flex-end', borderColor: Colors.font_color, width: mobileW * 84 / 100, height: mobileH * 6 / 100, alignSelf: 'center', justifyContent: 'flex-start', marginTop: 15 }}>
                                <Image resizeMode="cover" style={{ width: mobileW * 5 / 100, height: mobileH * 3 / 100, marginBottom: 4 }} source={localimag.phone}></Image>
                                <TextInput
                                    onChangeText={text => { this.setState({ mobile: text }) }}
                                    value={"" + this.state.mobile + ""}
                                    maxLength={16}
                                    returnType="done"
                                    returnKeyType="done"
                                    onSubmitEditing={() => { Keyboard.dismiss() }}
                                    style={{ padding: 2, fontFamily: Font.regular, marginLeft: 10, width: mobileW * 72 / 100, fontSize: mobileW * 3.2 / 100, height: mobileW * 7.5 / 100 }}
                                    placeholder="Mobile Number"
                                    keyboardType={'numeric'}
                                    placeholderTextColor={Colors.textColor} />
                            </View>
                            <View style={{ flexDirection: 'row', borderBottomWidth: 0.6, alignItems: 'flex-end', borderColor: Colors.font_color, width: mobileW * 84 / 100, height: mobileH * 6 / 100, alignSelf: 'center', justifyContent: 'flex-start', marginTop: 15 }}>
                                <Image resizeMode="cover" style={{ width: mobileW * 5 / 100, height: mobileH * 3 / 100, marginBottom: 4 }} source={localimag.email}></Image>
                                <TextInput
                                    onChangeText={text => { this.setState({ email: text }) }}
                                    value={"" + this.state.email + ""}
                                    maxLength={50}
                                    editable={false}
                                    returnType="done"
                                    returnKeyType="done"
                                    onSubmitEditing={() => { Keyboard.dismiss() }}
                                    style={{ padding: 2, fontFamily: Font.regular, marginLeft: 10, width: mobileW * 72 / 100, fontSize: mobileW * 3.2 / 100, height: mobileW * 7.5 / 100 }}
                                    placeholder="Email"
                                    keyboardType={'default'}
                                    placeholderTextColor={Colors.textColor} />
                            </View>
                        </View>
                        <View style={{ width: mobileW * 72 / 100, height: mobileH * 12 / 100, borderRadius: 15, alignItems: 'center', justifyContent: 'center', alignSelf: 'center', }}>
                            <TouchableOpacity activeOpacity={1} style={{ width: mobileW * 84 / 100, height: mobileH * 5 / 100, backgroundColor: Colors.theme_color, borderRadius: 15, alignItems: 'center', justifyContent: 'center', alignSelf: 'center', marginTop: 60 }}
                                onPress={() => { this.EditProfile() }}>
                                <Text style={{ fontSize: mobileW * 4.2 / 100, fontFamily: Font.bold, color: Colors.purewhite }}>Update</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>
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
        paddingTop: 15,
        paddingBottom: 15,
        alignItems: 'center'
    },
    OrderHistoryTitle: {
        color: Colors.font_color,
        fontFamily: Font.bold,
        fontSize: windowWidth * 5.2 / 100,
        letterSpacing: 0.5,
    },
});


