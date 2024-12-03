import React, { Component } from 'react'
import { Text, View, TouchableOpacity, SafeAreaView, Dimensions, Modal, TextInput, StatusBar, ImageBackground, Image, ScrollView, FlatList, BackHandler, StyleSheet } from 'react-native'
import { config, Otpprovider, Mapprovider, apifuntion, Colors, Font, validation, mobileH, mobileW, SocialLogin, Cameragallery, mediaprovider, localStorage, Lang_chg, consolepro, msgProvider, msgTitle, msgText, Currentltlg } from './Providers/utilslib/Utils'
import { localimag } from './Providers/Localimageprovider/Localimage'
import Footerr from './Providers/Footerr';
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
const demoArray1 = [
    { title: localimag.person2, name: "Andrew", message: "Columbia University", number: '22,765', degree: 'Is there any issue that we cannot travel faster than light as we have never tried Hard', star: '5' },
    { title: localimag.person5, name: "Rossel", message: "Oxford University", number: '92,645', degree: 'Why gravitational force always attract, And can this force exists in the every part of the cosmos', star: '4.5' },
    { title: localimag.person1, name: "Peter", message: "Stanford University", number: '72,679', degree: 'Is there any issue that we cannot travel faster than light as we have never tried Hard', star: '5' },
    { title: localimag.person3, name: "Watson", message: "Haward University", number: '69,671', degree: 'Why gravitational force always attract, And can this force exists in the every part of the cosmos', star: '3' },
    { title: localimag.person6, name: "Kiara", message: "St Paul University", number: '60,782', degree: 'Is there any issue that we cannot travel faster than light as we have never tried Hard', star: '5' },
    { title: localimag.person6, name: "Kiara", message: "Markus University", number: '60,782', degree: 'Why gravitational force always attract, And can this force exists in the every part of the cosmos', star: '5' },
];
const demoArray = [
    { title: localimag.person2, name: "Andrew", message: "14-june-2021", number: '22,765', degree: 'Is there any issue that we cannot travel faster than light as we have never tried Hard', star: '5' },
    { title: localimag.person5, name: "Rossel", message: "21-may-2021", number: '92,645', degree: 'Why gravitational force always attract, And can this force exists in the every part of the cosmos', star: '4.5' },
    { title: localimag.person1, name: "Peter", message: "13-march-2021", number: '72,679', degree: 'Is there any issue that we cannot travel faster than light as we have never tried Hard', star: '5' },
    { title: localimag.person3, name: "Watson", message: "14-june-2021", number: '69,671', degree: 'Why gravitational force always attract, And can this force exists in the every part of the cosmos', star: '3' },
    { title: localimag.person6, name: "Kiara", message: "21-may-2021", number: '60,782', degree: 'Is there any issue that we cannot travel faster than light as we have never tried Hard', star: '5' },
    { title: localimag.person6, name: "Kiara", message: "13-march-2021", number: '60,782', degree: 'Why gravitational force always attract, And can this force exists in the every part of the cosmos', star: '5' },
];
export default class ManageQueries extends Component {
    constructor(props) {
        super(props)
        this.state = {
            content_2: '',
            starCount: 4,
            showSearch: false,
            txtsrch: '',
            flip: false,
            answerModal: false
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
        await localStorage.setItemObject('status', false);
    }
    // //-----------------***********--------------------//
    render() {
        return (
            <View style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
                <SafeAreaView style={{ flex: 0, backgroundColor: Colors.theme_color }} />
                <StatusBar backgroundColor={Colors.theme_color} barStyle='default' hidden={false} translucent={false}
                    networkActivityIndicatorVisible={true} />
                <Modal
                    animationType="slide"
                    transparent
                    visible={this.state.answerModal}
                    onRequestClose={() => {
                        consolepro.consolelog('Modal has been closed.');
                    }}>
                    <View style={{ flex: 1, backgroundColor: '#0909090', alignItems: 'center', justifyContent: 'flex-end', borderRadius: 0, }}>
                        <View style={{ height: mobileH * 40 / 100, width: mobileW * 100 / 100, backgroundColor: Colors.purewhite, borderRadius: 25 }}>
                            <View style={{ width: mobileW * 96 / 100, alignSelf: 'center', flexDirection: 'row', justifyContent: 'space-between', marginTop: 20 }}>
                                <Text style={{ fontFamily: Font.medium, fontSize: mobileW * 4 / 100 }}>ANSWER</Text>
                                <TouchableOpacity activeOpacity={0.9}>
                                    <Image resizeMode="contain" style={{ width: 25, height: 30 }} source={localimag.editingg}></Image>
                                </TouchableOpacity>
                            </View>
                            <View style={{ width: mobileW * 96 / 100, alignSelf: 'center' }}>
                                <Text style={{ fontSize: mobileW * 4 / 100, fontFamily: Font.medium, marginTop: 20 }}>No. The universal speed limit which we commonly know as speed of light is a fundamental to the way universe work. It is difficult to visivalize thjis if you have never heard about it before but the scientist  have founfd that the faster you go the more you spatial te dimension in the forward direction shtink and the slower the clock run when viewed by external observer</Text>
                            </View>
                            <View style={{ width: mobileW * 84 / 100, height: mobileH * 10 / 100, borderRadius: 5, alignItems: 'center', justifyContent: 'flex-start', alignSelf: 'center', marginTop: 10 }}>
                                <TouchableOpacity activeOpacity={1} onPress={() => { this.setState({ answerModal: false }) }}
                                    style={{ width: mobileW * 74 / 100, height: mobileH * 6 / 100, backgroundColor: Colors.theme_color, borderRadius: 12, alignItems: 'center', justifyContent: 'center', alignSelf: 'center' }}>
                                    <Text style={{ fontSize: mobileW * 4 / 100, fontFamily: Font.bold, color: Colors.purewhite }}>Submit Answer</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </Modal>
                <View style={styles.setingsHeader}>
                    <View activeOpacity={0.9} onPress={() => { this.backpress() }}></View>
                    <Text style={styles.OrderHistoryTitle}>Manage Queries</Text>
                    <View activeOpacity={0.9} onPress={() => { this.props.navigation.navigate('Notification') }}>
                    </View>
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: mobileW * 100 / 100, alignSelf: 'center', paddingTop: 6, paddingBottom: 10, backgroundColor: Colors.theme_color }}>
                    {this.state.flip == false && <View style={{ borderBottomColor: Colors.purewhite, borderBottomWidth: 5, width: mobileW * 22 / 100, marginLeft: 20, alignItems: 'center', justifyContent: 'center', }}>
                        <Text style={{ marginLeft: 0, color: Colors.purewhite, fontFamily: Font.bold, fontSize: mobileW * 4 / 100, }}>Queries</Text>
                    </View>}
                    {this.state.flip == true && <View style={{ width: mobileW * 22 / 100, marginLeft: 20, alignItems: 'center', justifyContent: 'center', }}>
                        <Text onPress={() => { this.setState({ flip: false }) }} style={{ marginLeft: 0, color: Colors.purewhite, fontFamily: Font.bold, fontSize: mobileW * 4 / 100, }}>Queries</Text>
                    </View>}
                    {this.state.flip == false && <View style={{ width: mobileW * 22 / 100, marginRight: 20, alignItems: 'center', justifyContent: 'center', }}>
                        <Text onPress={() => { this.setState({ flip: true }) }} style={{ marginRight: 0, color: Colors.purewhite, fontFamily: Font.bold, fontSize: mobileW * 4 / 100 }}>Solve</Text>
                    </View>}
                    {this.state.flip == true && <View style={{ borderBottomColor: Colors.purewhite, borderBottomWidth: 5, width: mobileW * 22 / 100, marginRight: 20, alignItems: 'center', justifyContent: 'center', }}>
                        <Text style={{ marginRight: 0, color: Colors.purewhite, fontFamily: Font.bold, fontSize: mobileW * 4 / 100, }}>Solve</Text>
                    </View>}
                </View>
                {this.state.flip == false && <View style={{ width: mobileW * 100 / 100, paddingBottom: mobileH * 20 / 100, backgroundColor: Colors.theme_color }}>
                    <FlatList
                        data={demoArray1}
                        showsVerticalScrollIndicator={false}
                        renderItem={({ item, index }) => {
                            return (
                                <View style={{ flexDirection: 'row', elevation: 15, backgroundColor: '#FFFFFF', width: windowWidth * 90 / 100, height: windowHeight * 16 / 100, alignItems: 'center', justifyContent: 'flex-start', alignSelf: 'center', borderRadius: 15, marginBottom: 10, marginTop: 5 }}>
                                    <View style={{ width: mobileW * 30 / 100, marginLeft: 5, alignItems: 'center', justifyContent: 'center' }}>
                                        <Image resizeMode="cover" style={{ width: mobileW * 25 / 100, height: mobileW * 25 / 100, borderRadius: 100 }} source={item.title}></Image>
                                    </View>
                                    <View style={{ width: mobileW * 50 / 100, marginLeft: 5, height: mobileH * 14 / 100, }}>
                                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: mobileW * 55 / 100, height: mobileH * 2.7 / 100 }}>
                                            <Text numberOfLines={1} style={{ fontSize: mobileW * 4.2 / 100, fontFamily: Font.bold }}>{item.name}</Text>
                                            <TouchableOpacity activeOpacity={0.9} >
                                                <Image resizeMode="contain" style={{ width: 40, height: 20 }} source={localimag.chatt}></Image>
                                            </TouchableOpacity>
                                        </View>
                                        <Text numberOfLines={1} style={{ fontSize: mobileW * 3.2 / 100, fontFamily: Font.bold, color: Colors.textColor }}>{item.message}</Text>
                                        <Text numberOfLines={3} style={{ fontSize: mobileW * 3.2 / 100, fontFamily: Font.medium, }}>{item.degree}</Text>
                                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: mobileW * 80 / 100, marginTop: 2, }}>
                                            <TouchableOpacity activeOpacity={1} onPress={() => { this.setState({ answerModal: true }) }} style={{ alignItems: 'center', justifyContent: 'center', backgroundColor: Colors.theme_color, borderRadius: 5, width: mobileW * 52 / 100, padding: 2 }}>
                                                <Text style={{ color: Colors.purewhite, fontSize: mobileW * 3 / 100, fontFamily: Font.bold }}>Answer Now</Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                </View>)
                        }}
                        keyExtractor={(item, index) => index.toString()}>
                    </FlatList>
                </View>}
                {this.state.flip == true && <View style={{ width: mobileW * 100 / 100, paddingBottom: mobileH * 20 / 100, backgroundColor: Colors.theme_color }}>
                    <FlatList
                        data={demoArray}
                        showsVerticalScrollIndicator={false}
                        renderItem={({ item, index }) => {
                            return (
                                <View style={{ flexDirection: 'row', elevation: 15, backgroundColor: '#FFFFFF', width: windowWidth * 90 / 100, height: windowHeight * 16 / 100, alignItems: 'center', justifyContent: 'flex-start', alignSelf: 'center', borderRadius: 15, marginBottom: 10, marginTop: 5 }}>
                                    <View style={{ width: mobileW * 30 / 100, marginLeft: 5, alignItems: 'center', justifyContent: 'center' }}>
                                        <Image resizeMode="cover" style={{ width: mobileW * 25 / 100, height: mobileW * 25 / 100, borderRadius: 100 }} source={item.title}></Image>
                                    </View>
                                    <View style={{ width: mobileW * 50 / 100, marginLeft: 5, height: mobileH * 14 / 100, }}>
                                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: mobileW * 55 / 100, height: mobileH * 3 / 100 }}>
                                            <Text numberOfLines={1} style={{ fontSize: mobileW * 4.2 / 100, fontFamily: Font.bold, color: Colors.theme_color }}>{item.name}</Text>
                                            <View activeOpacity={0.9} onPress={() => { this.backpress() }}>
                                                <Image resizeMode="contain" style={{ width: 40, height: 20 }} source={localimag.checks}></Image>
                                            </View>
                                        </View>
                                        <Text numberOfLines={1} style={{ fontSize: mobileW * 2.6 / 100, fontFamily: Font.bold, color: Colors.textColor }}>{item.message}</Text>
                                        <Text numberOfLines={3} style={{ fontSize: mobileW * 3.2 / 100, fontFamily: Font.medium, }}>{item.degree}</Text>
                                        <View style={{ flexDirection: 'row', justifyContent: 'flex-end', width: mobileW * 55 / 100, marginTop: 2, }}>
                                            <TouchableOpacity activeOpacity={1} onPress={() => { this.props.navigation.navigate('AnswerPage') }} style={{ alignItems: 'center', justifyContent: 'center', backgroundColor: '#E5E5E5', borderRadius: 5, width: mobileW * 22 / 100, padding: 1 }}>
                                                <Text style={{ color: Colors.theme_color, fontSize: mobileW * 3 / 100, fontFamily: Font.bold }}>Solved</Text>
                                            </TouchableOpacity>
                                            <View activeOpacity={0.9} onPress={() => { this.backpress() }}>
                                                <Image resizeMode="contain" style={{ width: 40, height: 20 }} source={localimag.chats}></Image>
                                            </View>
                                        </View>
                                    </View>
                                </View>)
                        }}
                        keyExtractor={(item, index) => index.toString()}>
                    </FlatList>
                </View>}
                <View style={{ backgroundColor: '#FFFFFF', elevation: 4, height: mobileH * 6 / 100, position: 'absolute', bottom: 0, width: mobileW * 100 / 100, alignSelf: 'center' }}>
                    <Footerr
                        activepage='ManageQueries'
                        usertype={1}
                        footerpage={[
                            { name: 'ExpertHome', countshow: false, image: localimag.home, activeimage: localimag.homdash, round: 'no' },
                            { name: 'Message', countshow: false, image: localimag.messagered, activeimage: localimag.chat, round: 'no' },
                            { name: 'ManageQueries', countshow: false, image: localimag.catg, activeimage: localimag.catdash, round: 'no' },
                            { name: 'ExpertProfile', countshow: false, image: localimag.person4, activeimage: localimag.person4, round: 'yes' },
                        ]}
                        navigation={this.props.navigation}
                        imagestyle1={{ width: 32, height: 32, backgroundColor: '#FFFFFF', countcolor: 'red', countbackground: 'white', resizeMode: 'contain' }}
                        //count_inbox={count_inbox}
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
        alignItems: 'center',
        borderBottomWidth: 2,
        borderBottomColor: Colors.purewhite
    },
    OrderHistoryTitle: {
        color: Colors.white_color,
        fontFamily: Font.bold,
        fontSize: windowWidth * 5 / 100,
        letterSpacing: 0.5
    },
});


