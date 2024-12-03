import React, { Component } from 'react'
import { Text, View, TouchableOpacity, SafeAreaView, Dimensions, StatusBar, Image, ScrollView, TextInput, FlatList, BackHandler, StyleSheet } from 'react-native'
import { config, Otpprovider, Mapprovider, apifuntion, Colors, Font, validation, mobileH, mobileW, SocialLogin, Cameragallery, mediaprovider, localStorage, Lang_chg, consolepro, msgProvider, msgTitle, msgText, Currentltlg } from './Providers/utilslib/Utils'
import { localimag } from './Providers/Localimageprovider/Localimage'
import Footer from './Providers/Footer';
import Footerr from './Providers/Footerr';
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
const demoArray1 = [
    { title: localimag.person5, name: "Roxanne", message: "I am new in the town and ...", number: 1, time: 'Now' },
    { title: localimag.person6, name: "Jennifer", message: "Thanks a lot", number: 9, time: '18:00' },
    { title: localimag.person5, name: "Samantha", message: "see you there", number: 7, time: '18:09' },
    { title: localimag.person6, name: "Jennifer", message: "Thanks a lot", number: 6, time: '18:32' },
];
export default class Message extends Component {
    constructor(props) {
        super(props)
        this.state = {
            status: '',
            showSearch: false,
            txtsrch: ''
        }
    }
    backpress = () => {
        this.props.navigation.goBack();
    }
    cross_click = async () => {
        //await this.SearchFilterFunction('');
        this.setState({ showSearch: false })
    }
    componentDidMount = async () => {
        let status = await localStorage.getItemObject('status');
        this.setState({ status: status });
    }

    //--------------------************------------------------------------//
    render() {
        return (
            <View style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
                <SafeAreaView style={{ flex: 0, backgroundColor: Colors.theme_color }} />
                <StatusBar backgroundColor={Colors.theme_color} barStyle='default' hidden={false} translucent={false}
                    networkActivityIndicatorVisible={true} />
                {this.state.showSearch == false && <View style={styles.setingsHeader}>
                    <View style={{ width: mobileW * 10 / 100 }}></View>
                    <Text style={styles.OrderHistoryTitle}>Messages</Text>
                    <TouchableOpacity activeOpacity={0.9} onPress={() => { this.setState({ showSearch: true }) }}>
                        <Image resizeMode="contain" style={{ width: 30, height: 30 }} source={localimag.search}></Image>
                    </TouchableOpacity>
                </View>}
                {this.state.showSearch == true && <View style={{ flexDirection: 'row', backgroundColor: Colors.theme_color, alignItems: 'center', justifyContent: 'space-between', height: windowHeight * 9 / 100, }}>
                    <View style={{width: '92%', backgroundColor: '#F2F2F2', borderColor: 'gray', borderRadius: 40, alignItems: 'center',
                        justifyContent: 'center', marginTop: 10, alignSelf: 'flex-start', marginLeft: mobileW * 4 / 100 }}>
                        <TextInput style={{ color: 'black', width: '100%', paddingLeft: 5, textAlign: 'left', paddingRight: 35, height: 35, marginTop: 4, marginLeft: 4 }}
                            placeholder={'Search'}
                            value={"" + this.state.txtsrch + ""}
                            maxLength={20}
                            onChangeText={(text) => { this.setState({ txtsrch: text }) }}>
                        </TextInput>
                        <TouchableOpacity onPress={() => { this.cross_click() }} style={{ width: 20, height: 20, justifyContent: 'center', alignSelf: 'center', position: 'absolute', right: 10 }}>
                            <Image resizeMode="contain" style={{ width: 30, height: 30, alignSelf: 'center', }} source={localimag.cross}></Image>
                        </TouchableOpacity>
                    </View>
                </View>}
                <View style={{ width: mobileW * 100 / 100 }}>
                    <FlatList
                        data={demoArray1}
                        showsVerticalScrollIndicator={false}
                        renderItem={({ item, index }) => {
                            return (
                                <TouchableOpacity onPress={() => { this.props.navigation.navigate('Chat') }} style={{ width: windowWidth * 100 / 100, height: mobileW * 25 / 100, alignItems: 'center', justifyContent: 'flex-start', alignSelf: 'center', borderTopWidth: 1, borderColor: Colors.theme_color }}>
                                    <View style={{ flexDirection: 'row', width: windowWidth * 90 / 100, height: mobileW * 25 / 100, alignItems: 'center', justifyContent: 'flex-start', alignSelf: 'center', }}>
                                        <View style={{ width: mobileW * 20 / 100, }}>
                                            <Image resizeMode="cover" style={{ width: mobileW * 20 / 100, height: mobileW * 20 / 100, borderRadius: 100 }} source={item.title}></Image>
                                        </View>
                                        <View style={{ marginLeft: 15, width: mobileW * 55 / 100, }}>
                                            <Text style={{ fontFamily: Font.bold, fontSize: mobileW * 5 / 100 }}>{item.name}</Text>
                                            <Text style={{ fontFamily: Font.medium, fontSize: mobileW * 4 / 100, color: '#D4D4D4' }}>{item.message}</Text>
                                        </View>
                                        <View style={{ width: mobileW * 15 / 100, alignItems: 'center', justifyContent: 'center' }}>
                                            <View style={{ backgroundColor: Colors.theme_color, width: mobileW * 6.4 / 100, height: mobileW * 6.4 / 100, borderRadius: 40, alignItems: 'center', justifyContent: 'center' }}>
                                                <Text style={{ fontFamily: Font.bold, fontSize: mobileW * 3.4 / 100, color: Colors.purewhite }}>{item.number}</Text>
                                            </View>
                                            <Text style={{ fontFamily: Font.bold, fontSize: mobileW * 3.9 / 100, color: '#D4D4D4' }}>{item.time}</Text>
                                        </View>
                                    </View>
                                </TouchableOpacity>)
                            }}
                        keyExtractor={(item, index) => index.toString()}>
                    </FlatList>
                </View>
                {this.state.status != false && <View style={{ backgroundColor: '#FFFFFF', elevation: 4, height: mobileH * 6 / 100, position: 'absolute', bottom: 0, width: mobileW * 100 / 100, alignSelf: 'center',shadowColor: '#000000', shadowOffset: { width: 2, height: 2, }, shadowOpacity: 0.30 }}>
                    <Footer
                        activepage='Message'
                        usertype={1}
                        footerpage={[
                            { name: 'Home', countshow: false, image: localimag.home, activeimage: localimag.home },
                            { name: 'Message', countshow: false, image: localimag.chat, activeimage: localimag.messagedash },
                            { name: 'Notification', countshow: false, image: localimag.bellred, activeimage: localimag.bell },
                            { name: 'Classes', countshow: false, image: localimag.classes, activeimage: localimag.classes },
                            { name: 'Profile', countshow: false, image: localimag.person2, activeimage: localimag.person2 },
                        ]}
                        navigation={this.props.navigation}
                        imagestyle1={{ width: 32, height: 32, backgroundColor: '#FFFFFF', countcolor: 'red', countbackground: 'white', resizeMode: 'contain' }}
                    //   count_inbox={count_inbox}
                    />
                </View>}
                {this.state.status == false && <View style={{ backgroundColor: '#FFFFFF', elevation: 4, height: mobileH * 6 / 100, position: 'absolute', bottom: 0, width: mobileW * 100 / 100, alignSelf: 'center' }}>
                    <Footerr
                        activepage='Message'
                        usertype={1}
                        footerpage={[
                            { name: 'ExpertHome', countshow: false, image: localimag.home, activeimage: localimag.home },
                            { name: 'Message', countshow: false, image: localimag.chat, activeimage: localimag.messagedash },
                            { name: 'ManageQueries', countshow: false, image: localimag.catg, activeimage: localimag.catdash },
                            { name: 'ExpertProfile', countshow: false, image: localimag.person4, activeimage: localimag.person4 },
                        ]}
                        navigation={this.props.navigation}
                        imagestyle1={{ width: 32, height: 32, backgroundColor: '#FFFFFF', countcolor: 'red', countbackground: 'white', resizeMode: 'contain' }}
                    //   count_inbox={count_inbox}
                    />
                </View>}
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


