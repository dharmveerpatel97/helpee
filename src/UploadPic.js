import React, { Component } from 'react'
import { Text, View, TouchableOpacity, SafeAreaView, Dimensions, Keyboard, Alert, TextInput, StatusBar, Image, ScrollView, BackHandler, StyleSheet } from 'react-native'
import { config, Otpprovider, Mapprovider, apifuntion, Colors, Font, validation, mobileW, mobileH, SocialLogin, Cameragallery, mediaprovider, localStorage, Lang_chg, consolepro, msgProvider, msgTitle, msgText, Currentltlg } from './Providers/utilslib/Utils'
import { localimag } from './Providers/Localimageprovider/Localimage'
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
import Footer from './Providers/Footer';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import HideWithKeyboard from 'react-native-hide-with-keyboard';
global.count_inbox=0
export default class UploadPic extends Component {
    _didFocusSubscription;
    _willBlurSubscription;
    constructor(props) {
        super(props)
        this.state = {
            prifile_pic: 'NA',
            imagepath: 'NA',
            cameraon: false,
            image_new1: {},
            mediamodal: false,
            education: '',
            about: '',
            paypalid: ''
        }
        this._didFocusSubscription = props.navigation.addListener('focus', payload =>
            BackHandler.addEventListener('hardwareBackPress', this.handleBackPress)
        );
    }
    // successMessage = () => {
    //     Alert.alert(
    //         "Information Message",
    //         "Your details has been uploaded successfully",
    //         [
    //             { text: "OK", onPress: () => { {  } } }
    //         ],
    //         { cancelable: false }
    //     );
    // }
    backpress = () => {
        this.props.navigation.navigate('Login');
    }
    componentDidMount() {
        this.props.navigation.addListener('focus', () => {
            //this.get_Speciality();
        });
        this._willBlurSubscription = this.props.navigation.addListener('blur', payload =>
            BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress)
        );
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
                        this.props.navigation.navigate('Login');
                        //BackHandler.exitApp();
                    }
                }
            }], {
            cancelable: false
        }
        ); // works best when the goBack is async
        return true;
    };


    //---------------------------------------------------//
    Camerapopen = async () => {
        mediaprovider.launchCamera(false).then((res) => {
            console.log('camerares', res)
            this.setState({ mediamodal: false })
            this.setState({ imagepath: res.path })
        }).catch((error) => {
            this.setState({ mediamodal: false })

        })
    }
    Galleryopen = () => {
        mediaprovider.launchGellery(false).then((res) => {
            console.log('camerares', res)
            this.setState({ imagepath: res.path })
            this.setState({ mediamodal: false })
        }).catch((error) => {
            this.setState({ mediamodal: false })

        })
    }
    //---------------------************-------------------------//
    UploadImages = async () => {
        consolepro.consolelog('UploadImages');
        consolepro.consolelog('image', this.state.imagepath);
        let user_details = await localStorage.getItemObject('user_arr');
        let user_id = user_details.user_id;

        let about = this.state.about;
        let education = this.state.education;
        let paypalid = this.state.paypalid;
        if (education.length == 0) {
            msgProvider.toast(msgText.emptyEducation[config.language], 'top')
            return false;
        }
        if (about.length == 0) {
            msgProvider.toast(msgText.emptyAbout[config.language], 'top')
            return false;
        }
        if (paypalid.length == 0) {
            msgProvider.toast(msgText.emptyPayPalId[config.language], 'top')
            return false;
        }
        consolepro.consolelog('data')
        let url = config.baseURL + "uploadUserDetails.php";
        consolepro.consolelog('url', url)
        let data = new FormData();
        data.append('user_id', user_id)
        data.append('education', education)
        data.append('about_me', about)
        if (this.state.imagepath != 'NA') {
            data.append('file', {
                uri: this.state.imagepath,
                type: 'image/jpg', // or photo.type
                name: 'image.jpg'
            })
        }
        data.append('paypal_id', paypalid)
        apifuntion.postApi(url, data).then((obj) => {
            if (obj.success == 'true') {
                consolepro.consolelog('true');
                this.props.navigation.navigate('SetWorkingHours');
                localStorage.setItemString('user_id', obj.user_details.user_id.toString());
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

    //--------------------************------------------------------------//
    render() {
        return (
       
            <View style={{flex:1,backgroundColor:'#fff'}}>
            <ScrollView contentContainerStyle={{flexGrow :1}} keyboardDismissMode='interactive' keyboardShouldPersistTaps='always' showsVerticalScrollIndicator={false}>
            <KeyboardAwareScrollView>
               <TouchableOpacity activeOpacity={1} style={{flex:1}} onPress={()=>{Keyboard.dismiss()}}>
      
              <View style={{flex:1,backgroundColor:'#fff'}}>
              
              <SafeAreaView style={{backgroundColor:Colors.statusbar_color, flex:0}}/>
              <StatusBar barStyle='light-content' backgroundColor={Colors.statusbar_color} hidden={false} translucent={false}
                      networkActivityIndicatorVisible={true} />
            
                <View style={{width:'100%',alignSelf:'center'}}>
                <Cameragallery mediamodal={this.state.mediamodal} Camerapopen={() => { this.Camerapopen() }}
                    Galleryopen={() => { this.Galleryopen() }} Canclemedia={() => { this.setState({ mediamodal: false }) }} />
                <View style={styles.setingsHeader}>
                    <TouchableOpacity activeOpacity={0.9} onPress={() => { this.backpress() }}>
                        <Image style={{ width: 30, height: 30, resizeMode: 'contain' }} source={localimag.back}></Image>
                    </TouchableOpacity>
                    <Text style={styles.OrderHistoryTitle}></Text>
                    <Text></Text>
                </View>
         
           
                    <View >
                        <View style={{ alignItems: 'center', justifyContent: 'center', alignSelf: 'center', marginTop: mobileW * 3 / 100,width:mobileW*95/100,alignSelf:'center' }}>
                            <TouchableOpacity activeOpacity={1} onPress={() => { this.setState({ mediamodal: true }) }} style={{ backgroundColor: Colors.theme_color, borderRadius: 100, width: mobileW * 35 / 100, height: mobileW * 35 / 100, alignSelf: 'center', justifyContent: 'center', alignItems: 'center',}}>
                                <Image source={this.state.imagepath == 'NA' ? localimag.default : { uri: this.state.imagepath }} style={{ width: mobileW * 35 / 100, height: mobileW * 35 / 100, resizeMode: 'cover', borderRadius: 100, }}></Image>
                            </TouchableOpacity>
                            <Text style={{ fontFamily: Font.bold, fontSize: mobileW * 4.2 / 100, marginTop: 15 }}>Upload a Picture</Text>
                            <View style={{ marginTop: mobileW * 10 / 100, }}>
                                <Text style={{ fontSize: mobileW * 4.5 / 100, fontFamily: Font.bold, }}>Education</Text>
                                <View style={{ flexDirection: 'row', borderWidth: 2, borderColor: Colors.line_color, width: mobileW * 84 / 100,alignItems:'center', borderRadius: 12, alignSelf: 'center', justifyContent: 'center', marginTop: 8 }}>
                                    <Image style={{ width: mobileW * 5 / 100, height: mobileW * 6.2 / 100, marginLeft: 12 }} resizeMode={'contain'} source={localimag.name}></Image>
                                    <TextInput
                                        onChangeText={text => { this.setState({ education: text }) }}
                                        value={this.state.education}
                                        maxLength={50}
                                        returnType="done"
                                        returnKeyType="done"
                                        style={{ fontFamily: Font.bold, marginLeft: 5, width: mobileW * 72 / 100, fontSize: mobileW * 4.2 / 100, padding: 6,paddingVertical:mobileW*2/100, }}
                                        placeholder="Education"
                                        keyboardType={'default'}
                                        placeholderTextColor={Colors.textColor}
                                        onSubmitEditing={() => { Keyboard.dismiss() }} />
                                </View>
                            </View>
                            <View style={{ marginTop: mobileW * 4 / 100, }}>
                                <Text style={{ fontSize: mobileW * 4.5 / 100, fontFamily: Font.bold, }}>About</Text>
                                <View style={{ flexDirection: 'row', marginTop: mobileW * 1.5 / 100,paddingVertical:mobileW*2/100, width: mobileW * 84 / 100, alignSelf: 'center', borderRadius: 10, borderWidth: 2, borderColor: Colors.theme_color }}>
                                    <Image style={{ width: mobileW * 4.5 / 100, height: mobileW * 6.2 / 100, marginLeft: 12 }} resizeMode={'contain'} source={localimag.pencil}></Image>
                                    <TextInput
                                        onChangeText={text => { this.setState({ about: text }) }}
                                        value={this.state.about}
                                        maxLength={250}
                                        multiline={true}
                                        returnType="done"
                                        returnKeyType="done"
                                        onSubmitEditing={() => { Keyboard.dismiss() }}
                                        style={{ fontFamily: 'Roboto-Regular', marginLeft: 10, width: mobileW * 72 / 100, fontSize: mobileW * 3.8 / 100, fontWeight: 'bold', height: mobileW * 22 / 100, textAlignVertical: 'top' }}
                                        placeholder=""
                                        keyboardType={'default'}
                                        placeholderTextColor={Colors.textColor}
                                    />
                                </View>
                            </View>
                            <View style={{ marginTop: mobileW * 4 / 100, }}>
                                <Text style={{ fontSize: mobileW * 4.5 / 100, fontFamily: Font.bold, }}>PayPal Id</Text>
                                <View style={{ flexDirection: 'row', borderWidth: 2, borderColor: Colors.line_color, width: mobileW * 84 / 100, borderRadius: 12, alignSelf: 'center', justifyContent: 'center', marginTop: 8 ,alignItems:'center'}}>
                                    <Image style={{ width: mobileW * 5 / 100, height: mobileW * 12 / 100, marginLeft: 10, }} resizeMode={'contain'} source={localimag.paypalid}></Image>
                                    <TextInput
                                        onChangeText={text => { this.setState({ paypalid: text }) }}
                                        value={this.state.paypalid}
                                        maxLength={30}
                                        returnType="done"
                                        returnKeyType="done"
                                        style={{ fontFamily: Font.bold, marginLeft: 5, width: mobileW * 72 / 100, fontSize: mobileW * 4.2 / 100, padding: 6,paddingVertical:mobileW*2/100, }}
                                        placeholder="PayPal Id"
                                        keyboardType={'default'}
                                        placeholderTextColor={Colors.textColor}
                                        onSubmitEditing={() => { Keyboard.dismiss() }} />
                                </View>
                            </View>
                            <View style={{ width: mobileW * 72 / 100,paddingVertical: mobileW * 2/ 100, borderRadius: 15, alignItems: 'center', justifyContent: 'flex-start', alignSelf: 'center', marginTop: mobileW * 6 / 100,marginBottom:mobileW*4/100 }}>
                                <TouchableOpacity activeOpacity={1} style={{ width: mobileW * 82 / 100,paddingVertical:mobileW*2/100, backgroundColor: Colors.theme_color, borderRadius: 35, alignItems: 'center', justifyContent: 'center', alignSelf: 'center' }}
                                    onPress={() => { this.UploadImages() }}>
                                    <Text style={{ fontSize: mobileW * 5 / 100, fontFamily: Font.medium, color: Colors.purewhite }}>Continue</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                    </View>
                    </View>
                    </TouchableOpacity>
                    </KeyboardAwareScrollView>
                    </ScrollView>
                 
         
                <HideWithKeyboard>


                    
                    <Footer
                        usertype={2}
                        footerpage={[
                            { name: 'Home', countshow: false, image: localimag.home, activeimage: localimag.home },

                            { name: 'MyQuestion', countshow: false, image: (count_inbox > 0) ? localimag.messagered : localimag.message1, activeimage: (count_inbox > 0) ? localimag.messagered : localimag.message1 },

                            { name: 'Notification', countshow: false, image: (this.state.count_noti > 0) ? localimag.bell_red : localimag.bell1, activeimage: (this.state.count_noti > 0) ? localimag.bell_red : localimag.bell1 },

                            { name: 'Classes', countshow: false, image: localimag.classes, activeimage: localimag.classes },

                            { name: 'Profile', countshow: false, image: this.state.footer_image == null ? localimag.default : { uri: config.img_url3 + this.state.footer_image }, activeimage: this.state.footer_image == null ? localimag.default : { uri: config.img_url3 + this.state.footer_image }, round: 'yes' },
                        ]}
                        navigation={this.props.navigation}
                        imagestyle1={{ width: 32, height: 32, backgroundColor: '#FFFFFF', countcolor: 'red', countbackground: 'white', resizeMode: 'contain' }}
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


