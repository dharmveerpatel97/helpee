import React, { Component } from 'react'
import { Text, View, TouchableOpacity, SafeAreaView, Dimensions, Alert, StatusBar, Image, ScrollView, BackHandler, StyleSheet } from 'react-native'
import { config, Otpprovider, Mapprovider, apifuntion, Colors, Font, validation, mobileH, mobileW, SocialLogin, Cameragallery, mediaprovider, localStorage, Lang_chg, consolepro, msgProvider, msgTitle, msgText, Currentltlg } from './Providers/utilslib/Utils'
import { localimag } from './Providers/Localimageprovider/Localimage'
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
import Footer from './Providers/Footer';
import Footerr from './Providers/Footerr';
import HideWithKeyboard from 'react-native-hide-with-keyboard';

export default class UploadDocNext extends Component {
    _didFocusSubscription;
    _willBlurSubscription;
    constructor(props) {
        super(props)
        this.state = {
            firstFile: 'NA',
            secondFile: 'NA',
            thirdFile: 'NA',
            mediamodal: false,
            footer_image: null,
        }
        this._didFocusSubscription = props.navigation.addListener('focus', payload =>
            BackHandler.addEventListener('hardwareBackPress', this.handleBackPress)
        );
    }
    backpress = () => {
        this.props.navigation.navigate('Login');
    }
    componentDidMount() {
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
            if (this.state.firstFile == 'NA') {
                this.setState({ mediamodal: false, firstFile: res.path, edit: 1, })
            } else if (this.state.secondFile == 'NA') {
                this.setState({ mediamodal: false, secondFile: res.path, edit: 1, })
            } else if (this.state.thirdFile == 'NA') {
                this.setState({ mediamodal: false, thirdFile: res.path, edit: 1, })
            }
        }).catch((error) => {
            this.setState({ mediamodal: false, edit: 0 })
        })
    }
    Galleryopen = () => {
        mediaprovider.launchGellery(false).then((res) => {
            console.log('camerares', res)
            if (this.state.firstFile == 'NA') {
                this.setState({ firstFile: res.path, mediamodal: false, edit: 1 })
            } else if (this.state.secondFile == 'NA') {
                this.setState({ secondFile: res.path, mediamodal: false, edit: 1 })
            } else if (this.state.thirdFile == 'NA') {
                this.setState({ thirdFile: res.path, mediamodal: false, edit: 1 })
            }
        }).catch((error) => {
            this.setState({ mediamodal: false, edit: 0 })
        })
    }
    //------------------------------------------------------//

    uploadDocuments = async () => {
        consolepro.consolelog('uploadDocuments123');
        let user_details = await localStorage.getItemObject('user_arr');
        consolepro.consolelog('user_details', user_details);
        let user_id = user_details.user_id;
     
        if (this.state.firstFile == 'NA') {
            msgProvider.toast(msgText.emptyDoc[config.language], 'top')
            return false;
        }
        let url = config.baseURL + "uploadDocs.php";
        consolepro.consolelog('url', url)
        let data = new FormData();
        data.append('user_id', user_id)
        data.append('firstFile', {
            uri: this.state.firstFile,
            type: 'image/jpg', // or photo.type
            name: 'image.jpg'
        })
        if (this.state.secondFile != 'NA') {
            data.append('secondFile', {
                uri: this.state.secondFile,
                type: 'image/jpg', // or photo.type
                name: 'image.jpg'
            })
        }
        if (this.state.thirdFile != 'NA') {
            data.append('thirdFile', {
                uri: this.state.thirdFile,
                type: 'image/jpg', // or photo.type
                name: 'image.jpg'
            })
        }
        consolepro.consolelog('data', data)
        apifuntion.postApi(url, data).then((obj) => {
            if (obj.success == 'true') {
                this.props.navigation.navigate('UploadPic');
            } else {
                consolepro.consolelog('false')
                if (obj.active_status == 'deactivate') {
                    config.checkUserDeactivate(this.props.navigation);
                    return false;
                }
                // msgProvider.alert(msgTitle.information[config.language], obj.msg[config.language], false);
                // return false;
            }
        }).catch((error) => {
            consolepro.consolelog("-------- error ------- " + error);
        });
    }

    //--------------------************------------------------------------//
    render() {
        return (
            <View style={{ flex: 1, width: '100%', backgroundColor: '#FFFFFF' }}>
                <SafeAreaView style={{ flex: 0, backgroundColor: Colors.theme_color }} />
                <StatusBar backgroundColor={Colors.theme_color} barStyle='default' hidden={false} translucent={false}
                    networkActivityIndicatorVisible={true} />
                <Cameragallery mediamodal={this.state.mediamodal} Camerapopen={() => { this.Camerapopen() }}
                    Galleryopen={() => { this.Galleryopen() }} Canclemedia={() => { this.setState({ mediamodal: false }) }} />
                <View style={styles.setingsHeader}>
                    <TouchableOpacity activeOpacity={0.9} onPress={() => { this.backpress() }}>
                        <Image resizeMode="contain" style={{ width: 25, height: 30 }} source={localimag.back}></Image>
                    </TouchableOpacity>
                    <Text style={styles.OrderHistoryTitle}>Upload Document</Text>
                    <Text></Text>
                </View>
                <View style={{ width: mobileW * 80 / 100, alignSelf: 'center', paddingVertical: mobileW * 8 / 100 }}>
                    <Text style={{ fontFamily: 'Roboto-Bold', fontSize: mobileW * 4.2 / 100 }}>Driving License, Voter Id Card</Text>
                </View>
                <View style={{ flexDirection: 'row', width: mobileW * 84 / 100, height: mobileH * 14 / 100, alignSelf: 'center', alignItems: 'center', justifyContent: 'center' }}>

                    <TouchableOpacity onPress={() => { this.setState({ mediamodal: true }) }} activeOpacity={1}
                        style={{ width: mobileW * 25 / 100, height: mobileH * 14 / 100, alignItems: 'center', justifyContent: 'center', elevation: 8, backgroundColor: Colors.purewhite, borderRadius: 15, shadowColor: '#000000', shadowOffset: { width: 2, height: 2, }, shadowOpacity: 0.20 }}>
                        {

                            this.state.firstFile == 'NA' ? <Image source={localimag.plus} style={{ width: mobileW * 0.08, height: mobileW * 0.082, resizeMode: 'cover', borderRadius: 15 }}></Image> :
                                <Image source={{ uri: this.state.firstFile }} style={{ width: mobileW * 25 / 100, height: mobileH * 14 / 100, resizeMode: 'cover', borderRadius: 15 }}></Image>
                        }


                        <TouchableOpacity onPress={() => { this.setState({ firstFile: 'NA' }) }} style={{ position: 'absolute', top: 2, right: 2 }}>
                            {this.state.firstFile != 'NA' && <Image source={localimag.cross} style={{ width: mobileW * 6 / 100, height: mobileH * 3 / 100, }}></Image>}
                        </TouchableOpacity>
                    </TouchableOpacity>



                    <TouchableOpacity onPress={() => { this.setState({ mediamodal: true }) }} activeOpacity={1}
                        style={{ marginLeft: mobileW * 2 / 100, width: mobileW * 25 / 100, height: mobileH * 14 / 100, alignItems: 'center', justifyContent: 'center', elevation: 8, backgroundColor: Colors.purewhite, borderRadius: 15, shadowColor: '#000000', shadowOffset: { width: 2, height: 2, }, shadowOpacity: 0.20 }}>
                        {

                            this.state.secondFile == 'NA' ? <Image source={localimag.plus} style={{ width: mobileW * 0.08, height: mobileW * 0.082, resizeMode: 'cover', borderRadius: 15 }}></Image> :
                                <Image source={{ uri: this.state.secondFile }} style={{ width: mobileW * 25 / 100, height: mobileH * 14 / 100, resizeMode: 'cover', borderRadius: 15 }}></Image>
                        }
                        <TouchableOpacity onPress={() => { this.setState({ secondFile: 'NA' }) }} style={{ position: 'absolute', top: 2, right: 2 }}>
                            {this.state.secondFile != 'NA' && <Image source={localimag.cross} style={{ width: mobileW * 6 / 100, height: mobileH * 3 / 100, }}></Image>}
                        </TouchableOpacity>
                    </TouchableOpacity>



                    <TouchableOpacity onPress={() => { this.setState({ mediamodal: true }) }} activeOpacity={1}
                        style={{ marginLeft: mobileW * 2 / 100, width: mobileW * 25 / 100, height: mobileH * 14 / 100, alignItems: 'center', justifyContent: 'center', elevation: 8, backgroundColor: Colors.purewhite, borderRadius: 15, shadowColor: '#000000', shadowOffset: { width: 2, height: 2, }, shadowOpacity: 0.20 }}>

                        {

                            this.state.thirdFile == 'NA' ? <Image source={localimag.plus} style={{ width: mobileW * 0.08, height: mobileW * 0.082, resizeMode: 'cover', borderRadius: 15 }}></Image> :
                                <Image source={{ uri: this.state.thirdFile }} style={{ width: mobileW * 25 / 100, height: mobileH * 14 / 100, resizeMode: 'cover', borderRadius: 15 }}></Image>
                        }
                        <TouchableOpacity onPress={() => { this.setState({ thirdFile: 'NA' }) }} style={{ position: 'absolute', top: 2, right: 2 }}>
                            {this.state.thirdFile != 'NA' && <Image source={localimag.cross} style={{ width: mobileW * 6 / 100, height: mobileH * 3 / 100, }}></Image>}
                        </TouchableOpacity>
                    </TouchableOpacity>
                </View>
                <View style={{ width: mobileW * 72 / 100, borderRadius: 15, alignItems: 'center', justifyContent: 'flex-start', alignSelf: 'center', marginTop: 30 }}>
                    <TouchableOpacity activeOpacity={1} style={{ width: mobileW * 84 / 100,paddingVertical:mobileW*3/100, backgroundColor: Colors.theme_color, borderRadius: 35, alignItems: 'center', justifyContent: 'center', alignSelf: 'center' }}
                        onPress={() => { this.uploadDocuments() }}>
                        <Text style={{ fontSize: mobileW * 3.8 / 100, fontFamily: Font.bold, color: Colors.purewhite }}>Submit</Text>
                    </TouchableOpacity>
                </View>
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


