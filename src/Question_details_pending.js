import React, { Component } from 'react';
import { Text, View, Image, Platform, Modal, BackHandler, Alert, StyleSheet, FlatList, TextInput, StatusBar, KeyboardAvoidingView, Dimensions, TouchableOpacity, SafeAreaView } from 'react-native'
import { config, Otpprovider, Mapprovider, apifuntion, Colors, Font, validation, mobileH, mobileW, SocialLogin, Cameragallery, mediaprovider, localStorage, Lang_chg, consolepro, msgProvider, msgTitle, msgText, Currentltlg, localimag } from './Providers/utilslib/Utils'
import firebase from './Config1';
import Firebase from 'firebase';
import ImageZoom from 'react-native-image-pan-zoom';
//import ImagePicker from 'react-native-image-picker';
import ImagePicker from 'react-native-image-crop-picker';
import { firebaseprovider } from './Providers/FirebaseProvider';
import { notification } from './Providers/NotificationProvider'
import OneSignal from 'react-native-onesignal';
import NetInfo from '@react-native-community/netinfo';
import Footerr from './Providers/Footerr';
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
// import Loader from './Loader'
const BannerHieght = Dimensions.get('window').height;
const BannerWidth = Dimensions.get('window').width;
global.userChatIdGlobal = '';
global.blockinbox = 'no';



export default class Question_details_pending extends Component {


    constructor(props) {
        super(props)
        this.state = {
            expert_name: this.props.route.params.expert_name,
            expert_image: this.props.route.params.expert_image,
            question: this.props.route.params.question,
            document: this.props.route.params.document,
            selectImage: 'NA',
            fileData: '',
            fileUri: '',
            imageModal: false,
            image_path: '',
            footer_image: null,
        }
        this.setUserType();
    }
    setUserType = async () => {
        let result = await localStorage.getItemObject('user_arr')
        if (result != null) {
            this.setState({
                footer_image: result.image,
            })
        }
    }
    render() {

        return (
            <View style={styles.container}>
                <Modal
                    animationType="slide"
                    visible={this.state.imageModal}
                    onRequestClose={() => { this.setState({ imageModal: !this.state.imageModal }) }}
                >
                    <View style={{ flex: 1 }}>
                        <SafeAreaView style={{ flex: 0, backgroundColor: Colors.statusbarcolor }} />
                        <StatusBar backgroundColor={Colors.statusbarcolor} barStyle='light-content' hidden={false} translucent={false}
                            networkActivityIndicatorVisible={true} />
                        <View style={{
                            zIndex: 99999, flexDirection: "row", height: mobileH * 0.090,
                            paddingHorizontal: mobileW * 0.06, backgroundColor: Colors.theme_color
                        }}>
                            <View style={{ flex: 1, justifyContent: "center" }}>
                                <TouchableOpacity activeOpacity={1} style={{ flexDirection: "row", alignItems: "center" }}
                                    onPress={() => { this.setState({ imageModal: false }) }}
                                >
                                    <View style={styles.leftHomeHeaderIconContainer12}>
                                        <Image source={localimag.back} style={{ height: mobileW * 0.07, width: mobileW * 0.07 }} />
                                    </View>
                                </TouchableOpacity>
                            </View>
                            <View style={{ flex: 2, justifyContent: "center", alignItems: 'center' }}>

                            </View>
                            <TouchableOpacity activeOpacity={0.7} style={{ flex: 1, alignItems: 'flex-end', justifyContent: 'center' }}>

                            </TouchableOpacity>
                        </View>
                        <View style={{ flex: 1 }}>
                            <ImageZoom style={{ justifyContent: "center", alignItems: 'center' }} cropWidth={Dimensions.get('window').width}
                                cropHeight={mobileH * 0.95}
                                imageWidth={mobileW * 1}
                                imageHeight={mobileW * 1}>
                                <Image style={{ width: mobileW * 1, height: mobileW * 1, marginTop: -mobileH * 0.06 }}
                                    source={{ uri: config.img_url3 + this.state.document }} resizeMode="contain" />
                            </ImageZoom>
                        </View>
                    </View>
                </Modal>

                {/* <Loader loading={this.state.loading} /> */}
                <View style={{ flex: 1 }}>
                    <SafeAreaView style={{ flex: 0, backgroundColor: Colors.statusbarcolor }} />
                    <StatusBar backgroundColor={Colors.statusbarcolor} barStyle='light-content' hidden={false} translucent={false}
                        networkActivityIndicatorVisible={true} />
                    <View
                        style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            height: (windowHeight * 12) / 100,
                            width: windowWidth * 100 / 100,
                            alignSelf: 'center',
                            backgroundColor: Colors.purewhite,
                            elevation: 10,
                            paddingBottom: 10,
                            shadowColor: '#000',
                            elevation: 5,
                            shadowOffset: { width: 2, height: 2, },
                            shadowOpacity: 0.3,
                            borderBottomColor: 'gray',
                            borderBottomWidth: 2
                        }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', width: windowWidth * 0.70 }}>
                            <TouchableOpacity onPress={() => { this.props.navigation.goBack() }} style={{ justifyContent: 'center', height: windowHeight * 10 / 100, width: windowWidth * 8 / 100, marginLeft: 15 }}>
                                <Image source={localimag.back} resizeMode='contain' style={{ height: windowHeight * 8 / 100, width: windowWidth * 8 / 100, alignSelf: 'center' }} />
                            </TouchableOpacity>

                            <View style={{ alignSelf: 'center', marginLeft: 10 }}>
                                {
                                    (this.state.expert_image == null) ? <Image
                                        source={localimag.default}
                                        style={{
                                            width: (windowWidth * 14) / 100,
                                            height: (windowWidth * 14) / 100,
                                            resizeMode: 'cover',
                                            borderRadius: 100,
                                            alignSelf: 'center'
                                        }}
                                    />
                                        :
                                        <Image
                                            source={{ uri: config.img_url1 + this.state.expert_image }}
                                            style={{
                                                width: (windowWidth * 14) / 100,
                                                height: (windowWidth * 14) / 100,
                                                resizeMode: 'cover',
                                                borderRadius: 100,
                                                alignSelf: 'center'
                                            }}
                                        />
                                }

                            </View>
                            <View style={{ paddingLeft: 15, flexDirection: 'column', justifyContent: 'space-between' }} >
                                <Text
                                    numberOfLines={1}
                                    style={{
                                        fontFamily: Font.Lato_Bold,
                                        fontFamily: 'Roboto-Bold',
                                        fontSize: (windowWidth * 3.8) / 100,
                                        width: windowWidth * 38 / 100,
                                    }}>
                                    {this.state.expert_name}
                                </Text>
                            </View>
                        </View>
                    </View>
                    <View style={{ width: '95%', alignSelf: 'center', paddingTop: 10 }}>
                        <View style={{ marginTop: 10, padding: 10 }}>
                            <Text style={{ textAlign: 'justify', fontFamily: Font.regular, color: '#bab6b6' }}>Q. {this.state.question} </Text>
                        </View>
                    </View>
                    <TouchableOpacity
                        activeOpacity={0.9}
                        style={{
                            marginTop: 30,
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'center',
                            alignSelf: 'center',
                            width: windowWidth * 80 / 100,
                            backgroundColor: Colors.purewhite,
                            elevation: 10,
                            shadowColor: 'grey',
                            elevation: 5,
                            shadowOffset: { width: 2, height: 2, },
                            shadowOpacity: 0.3,
                            padding: 5
                        }} onPress={() => { (this.state.document != null) ? this.setState({ imageModal: true }) : null }}>
                        <Image source={localimag.file} style={{ width: mobileH * 0.03, height: mobileH * 0.03, marginRight: 5 }} />
                        <Text style={{ textAlign: 'justify', fontFamily: Font.regular, color: '#000000', marginRight: 5 }}>{(this.state.document != null) ? 'File Uploaded' : 'No Document'} </Text>
                    </TouchableOpacity>
                </View>
                <Footerr
                    activepage='ExpertHome'
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
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF'
    },
    button: {
        backgroundColor: Colors.appColor,
        width: '90%',
        borderRadius: 8,
        paddingVertical: 8.5,
        marginTop: 7,
        marginTop: 10,
        alignSelf: 'center',
        alignItems: 'center'
    },


})