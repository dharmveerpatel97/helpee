import React, { Component } from 'react'
import { Text, View, TouchableOpacity, SafeAreaView, TextInput, FlatList, RefreshControl, ImageBackground, Dimensions, Modal, StatusBar, Image, ScrollView, BackHandler, StyleSheet,Alert } from 'react-native'
import { config, Otpprovider, Mapprovider, apifuntion, Colors, Font, validation, mobileH, mobileW, SocialLogin, Cameragallery, mediaprovider, localStorage, Lang_chg, consolepro, msgProvider, msgTitle, msgText, Currentltlg } from './Providers/utilslib/Utils'
import { localimag } from './Providers/Localimageprovider/Localimage'
import Footer from './Providers/Footer';
import ImageZoom from 'react-native-image-pan-zoom';
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
import OneSignal from 'react-native-onesignal';
export default class MyQuestion extends Component {
    _didFocusSubscription;
    _willBlurSubscription;
    constructor(props) {
        super(props)
        this.state = {
            content_2: '',
            question_arr: 'NA',
            question_arr1: 'NA',
            onCross: false,
            showSearch: false,
            txtsrch: '',
            documentModel: false,
            image: '',
            footer_image: '',
            count_noti: 0,
            refresh: false,
        }
        this._didFocusSubscription = props.navigation.addListener('focus', payload =>
            BackHandler.addEventListener('hardwareBackPress', this.handleBackPress)
        );
    }
    backpress = () => {
        this.props.navigation.goBack();
    }
    cross_click = async () => {
        //await this.SearchFilterFunction('');
        this.setState({ showSearch: false })
    }
    componentDidMount = () => {
        this.onReceived()
        this._willBlurSubscription = this.props.navigation.addListener('blur', payload =>
            BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress)
        );
        this.props.navigation.addListener('focus', () => {
            this.getQuestion();
            this.getAllData();
        });
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
                        BackHandler.exitApp();
                    }
                }
            }], {
            cancelable: false
        }
        ); // works best when the goBack is async
        return true;
    };
    getImage = (image) => {
        this.setState({ image: image });
    }

    //----------------------------------------------------------//

    SearchFilterFunction = (text) => {
        consolepro.consolelog('SearchFilterFunction')
        if (this.state.onCross == false) {
            this.setState({ txtsrch: text })
            //passing the inserted text in textinput
            consolepro.consolelog('test1', this.state.question_arr)
            let data1 = this.state.question_arr1
            if (data1 != 'NA') {
                consolepro.consolelog('test2')
                const newData = data1.filter(function (item) {
                    consolepro.consolelog('myitem', item)
                    //applying filter for the inserted text in search bar
                    const itemData = item.question ? item.question.toUpperCase() : ''.toUpperCase();
                    const textData = text.toUpperCase();
                    return itemData.indexOf(textData) > -1;
                });
                consolepro.consolelog('new data', newData)
                if (newData.length > 0) {
                    this.setState({ question_arr: newData })
                } else if (newData.length <= 0) {
                    this.setState({ question_arr: 'NA' })
                }
            }
        } else {
            this.search.clear();
            this.setState({ question_arr: this.state.question_arr1, onCross: false });
        }
    }
    cross_click = async () => {
        await this.SearchFilterFunction('');
        this.setState({ showSearch: false })
    }

    //-----------------------************-----------------------//

    getAllData = async () => {
        consolepro.consolelog('getAllData')
        let user_details = await localStorage.getItemObject('user_arr');
        consolepro.consolelog('user_details', user_details)
        let footer_image = user_details.image;
        consolepro.consolelog('footer_image', footer_image)
        this.setState({ footer_image: footer_image })

    }
    async onReceived() {
        OneSignal.setNotificationWillShowInForegroundHandler(notification => {
            this.setState({
                question_arr: 'NA',
                question_arr1:'NA',
              
            })
            this.getQuestion();
        });
        }
    getQuestion = async () => {
        consolepro.consolelog('getQuestion');
        let user_details = await localStorage.getItemObject('user_arr');
        consolepro.consolelog('user_details_ba', user_details);
        let url = config.baseURL + "getQuestionList.php?user_id=" + user_details.user_id;
        consolepro.consolelog(url)
        var dataaaaa = 0;
        if (this.state.refresh == true) {
            dataaaaa = 1;
        }
        apifuntion.getApi(url, dataaaaa).then((obj) => {
            consolepro.consolelog('obj', obj)
            if (obj.success == "true") {
                this.setState({ question_arr: obj.question_arr, count_noti: obj.count_noti })
                this.setState({ question_arr1: obj.question_arr })
                this.setState({ refresh: false })
                consolepro.consolelog('question_arr', obj.question_arr)
                consolepro.consolelog('getQuestion', this.state.question_arr)
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
    _onRefresh = () => {
        this.setState({ refresh: true })
        this.getQuestion()
    }
    //--------------------************----------------------//
    render() {

        return (
            <View style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
                <SafeAreaView style={{ flex: 0, backgroundColor: Colors.theme_color }} />
                <StatusBar backgroundColor={Colors.theme_color} barStyle='default' hidden={false} translucent={false}
                    networkActivityIndicatorVisible={true} />



                <Modal
                    animationType="slide"
                    visible={this.state.documentModel}
                    onRequestClose={() => { this.setState({ documentModel: !this.state.documentModel }) }}
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
                                    onPress={() => { this.setState({ documentModel: false }) }}
                                >
                                    <View style={styles.leftHomeHeaderIconContainer12}>
                                        <Image source={localimag.back} style={{ height: mobileW * 0.07, width: mobileW * 0.07 }} />
                                    </View>
                                </TouchableOpacity>
                            </View>
                            <View style={{ flex: 2, justifyContent: "center", alignItems: 'center' }}>
                                <Text style={{ fontSize: mobileW * 4.8 / 100, color: Colors.purewhite, }}>Document</Text>
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
                                    source={this.state.image == '' ? localimag.nodataFound : { uri: config.img_url3 + this.state.image, }} resizeMode="contain" />
                            </ImageZoom>
                        </View>
                    </View>
                </Modal>





                {this.state.showSearch == false && <View style={styles.setingsHeader}>
                    <TouchableOpacity activeOpacity={0.9} >
                    </TouchableOpacity>
                    <Text style={styles.OrderHistoryTitle}>My Questions</Text>
                    <TouchableOpacity activeOpacity={0.9} onPress={() => { this.setState({ showSearch: true }) }}>
                        <Image resizeMode="contain" style={{ width: 30, height: 30 }} source={localimag.search}></Image>
                    </TouchableOpacity>
                </View>}
                {this.state.showSearch == true && <View style={{ flexDirection: 'row', backgroundColor: Colors.theme_color, alignItems: 'center', justifyContent: 'space-between', height: windowWidth * 15.2 / 100, }}>
                    <View style={{
                        width: '92%', backgroundColor: '#F2F2F2', borderColor: 'gray', borderRadius: 40, alignItems: 'center',
                        justifyContent: 'center', marginTop: 10, alignSelf: 'flex-start', marginLeft: mobileW * 4 / 100
                    }}>
                        <TextInput style={{ color: 'black', width: '100%', paddingLeft: 15, textAlign: 'left', paddingRight: 35, height: 38, marginTop: 4, marginLeft: 4 }}
                            placeholder={'Search'}
                            value={"" + this.state.txtsrch + ""}
                            maxLength={20}
                            onChangeText={(text) => { this.SearchFilterFunction(text) }}>
                        </TextInput>
                        <TouchableOpacity onPress={() => { this.cross_click() }} style={{ width: 20, height: 20, justifyContent: 'center', alignSelf: 'center', position: 'absolute', right: 10 }}>
                            <Image resizeMode="contain" style={{ width: 30, height: 30, alignSelf: 'center', }} source={localimag.cross}></Image>
                        </TouchableOpacity>
                    </View>
                </View>}
                <View style={{ paddingBottom: mobileH * 16 / 100 }}>
                    {this.state.question_arr == 'NA' && <View style={{ height: mobileH * 80 / 100, justifyContent: 'center', alignItems: 'center' }}>
                        <Image resizeMode={'contain'} source={localimag.nodataFound} style={{ width: mobileW * 80 / 100, height: mobileW * 60 / 100 }} />
                    </View>}
                    {this.state.question_arr != 'NA' &&
                        <FlatList
                            refreshControl={
                                <RefreshControl
                                    refreshing={this.state.refresh}
                                    onRefresh={this._onRefresh}
                                    tintColor={Colors.theme_color}
                                    colors={[Colors.theme_color]}
                                />
                            }
                            contentContainerStyle={{ paddingBottom: 100 }}
                            data={this.state.question_arr}
                            showsVerticalScrollIndicator={false}
                            renderItem={({ item, index }) => {
                                return (
                                    <TouchableOpacity activeOpacity={1} onPress={() => {
                                        (item.status == 0) ? this.props.navigation.navigate('Question_details_pending_user', {
                                            "question": item.question,
                                            'expert_name': item.expert_name,
                                            'expert_image': item.expert_image,
                                            'document': item.document
                                        }) : null
                                    }}
                                        style={{ width: windowWidth * 100 / 100, borderBottomWidth: 1, borderColor: Colors.theme_color }}>
                                        <View style={{ flexDirection: 'row', width: windowWidth * 100 / 100, height: mobileW * 20 / 100, alignItems: 'flex-start', justifyContent: 'space-between' }}>
                                            <View style={{ width: mobileW * 13 / 100, padding: 10, marginTop: 3 }}>
                                                <Image resizeMode="cover" style={{ width: mobileW * 12 / 100, height: mobileW * 12 / 100, borderRadius: 100 }} source={item.expert_image == null ? localimag.default : { uri: config.img_url3 + item.expert_image }}></Image>
                                            </View>
                                            <View style={{ width: mobileW * 44 / 100, justifyContent: 'flex-start', padding: 10 }}>
                                                <Text style={{ fontFamily: Font.bold, fontSize: mobileW * 4.2 / 100 }}>{item.expert_name}</Text>
                                                <Text style={{ fontFamily: Font.medium, fontSize: mobileW * 3 / 100, color: Colors.grey }}>{item.speciality_name}</Text>
                                            </View>
                                            <View style={{ width: mobileW * 35 / 100, justifyContent: 'center', alignItems: 'flex-end', padding: 12 }}>
                                                <Text style={{ fontFamily: Font.bold, fontSize: mobileW * 3.2 / 100, }}>{item.createtime}</Text>
                                                {item.status == 1 && <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                    <Image source={localimag.gdot} style={{ width: mobileW * 2 / 100, height: mobileW * 2 / 100, resizeMode: 'contain' }}></Image>
                                                    <Text style={{ fontFamily: Font.bold, fontSize: mobileW * 3.6 / 100, color: Colors.green, marginLeft: 4 }}>Accepted</Text>
                                                </View>}
                                                {item.status == 0 && <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                    <Image source={localimag.ydot} style={{ width: mobileW * 2 / 100, height: mobileW * 2 / 100, resizeMode: 'contain' }}></Image>
                                                    <Text style={{ fontFamily: Font.bold, fontSize: mobileW * 3.6 / 100, color: Colors.yellow, marginLeft: 4 }}>Pending</Text>
                                                </View>}
                                                {item.status == 3 && <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                    <Image source={localimag.bdot} style={{ width: mobileW * 2 / 100, height: mobileW * 2 / 100, resizeMode: 'contain' }}></Image>
                                                    <Text style={{ fontFamily: Font.bold, fontSize: mobileW * 3.6 / 100, color: Colors.blue, marginLeft: 4 }}>Solved</Text>
                                                </View>}
                                                {item.status == 2 && <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                    <Image source={localimag.rdot} style={{ width: mobileW * 2 / 100, height: mobileW * 2 / 100, resizeMode: 'contain' }}></Image>
                                                    <Text style={{ fontFamily: Font.bold, fontSize: mobileW * 3.6 / 100, color: Colors.darkred, marginLeft: 4 }}>Rejected</Text>
                                                </View>}
                                            </View>
                                        </View>
                                        <View style={{ alignItems: 'flex-start', width: mobileW * 100 / 100, alignSelf: 'center', marginTop: 10, paddingLeft: 20, paddingBottom: mobileW * 4 / 100, paddingRight: 10 }}>
                                            <Text style={{ fontFamily: Font.regular, fontSize: mobileW * 3.4 / 100 }}>Q. {item.question}</Text>
                                        </View>
                                        <View style={{ alignItems: 'flex-start', width: mobileW * 100 / 100, alignSelf: 'center', flexDirection: 'row', justifyContent: 'space-between', paddingLeft: 20, paddingBottom: 10, paddingRight: 10 }}>
                                            <TouchableOpacity disabled={(item.document != null) ? false : true} activeOpacity={1} onPress={() => { this.setState({ documentModel: true }); this.getImage(item.document) }}
                                                style={{ flexDirection: 'row', elevation: 6, backgroundColor: Colors.purewhite, height: mobileH * 4 / 100, width: mobileW * 30 / 100, justifyContent: 'center', alignItems: 'center', borderRadius: 6, shadowColor: '#000000', shadowOffset: { width: 2, height: 2, }, shadowOpacity: 0.30 }}>
                                                <Image source={localimag.pdfDoc} style={{ width: mobileW * 4 / 100, height: mobileW * 4 / 100, resizeMode: 'contain' }}></Image>
                                                <Text style={{ marginLeft: 5, fontFamily: Font.regular, fontSize: mobileW * 3 / 100 }}>{(item.document != null) ? 'View Document' : 'No Document'}</Text>
                                            </TouchableOpacity>
                                            {(item.status == 1 || item.status == 3) && <TouchableOpacity activeOpacity={1} onPress={() => {
                                                this.props.navigation.navigate('Chat', { 'chatdata': { 'other_user_id': item.expert_id, 'other_user_name': item.expert_name, 'image': item.expert_image, blockstatus: 'no', 'question_id': item.ask_question_id, 'question': item.question, 'document': item.document, 'question_status': item.status } })
                                            }}

                                                style={{ flexDirection: 'row', elevation: 6, backgroundColor: Colors.theme_color, height: mobileH * 4 / 100, width: mobileW * 25 / 100, justifyContent: 'center', alignItems: 'center', borderRadius: 6, shadowColor: '#000000', shadowOffset: { width: 2, height: 2, }, shadowOpacity: 0.30 }}>
                                                <Image source={localimag.chatimg} style={{ width: mobileW * 4 / 100, height: mobileW * 4 / 100, resizeMode: 'contain' }}></Image>
                                                <Text style={{ marginLeft: 5, fontFamily: Font.regular, fontSize: mobileW * 3.2 / 100, color: Colors.purewhite }}>Chat</Text>
                                            </TouchableOpacity>}
                                            {item.status == 2 && <TouchableOpacity activeOpacity={1} onPress={() => { this.props.navigation.navigate('SecondChooseExpert', { 'question_id': item.ask_question_id, 'speciality_id': item.speciality_id1, 'expert_id': item.expert_id }); localStorage.setItemObject('data123', item); consolepro.consolelog('spffff', item) }}
                                                style={{ flexDirection: 'row', elevation: 6, backgroundColor: Colors.theme_color, height: mobileH * 4 / 100, width: mobileW * 27 / 100, justifyContent: 'center', alignItems: 'center', borderRadius: 6, shadowColor: '#000000', shadowOffset: { width: 2, height: 2, }, shadowOpacity: 0.30 }}>
                                                <Image source={localimag.whiteuser} style={{ width: mobileW * 3.5 / 100, height: mobileW * 3.5 / 100, resizeMode: 'contain' }}></Image>
                                                <Text style={{ marginLeft: 5, fontFamily: Font.regular, fontSize: mobileW * 3 / 100, color: Colors.purewhite }}>Choose Expert</Text>
                                            </TouchableOpacity>}
                                        </View>
                                    </TouchableOpacity>)
                            }}
                            keyExtractor={(item, index) => index.toString()}>
                        </FlatList>}
                </View>
                <View style={{ backgroundColor: '#FFFFFF', elevation: 4, height: mobileH * 6 / 100, position: 'absolute', bottom: 0, width: mobileW * 100 / 100, alignSelf: 'center', shadowColor: '#000000', shadowOffset: { width: 2, height: 2, }, shadowOpacity: 0.30 }}>
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
    //Privacy
    privacy_View: {
        width: '90%',
        marginLeft: 10,
        alignItems: 'center',
        alignSelf: 'center',
        marginTop: 30,
    },
});


