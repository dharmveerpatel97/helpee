import React, { Component } from 'react'
import { Text, View, TouchableOpacity, SafeAreaView, Dimensions, StatusBar, Image, ScrollView, BackHandler, StyleSheet } from 'react-native'
import { config, Otpprovider, Mapprovider, apifuntion, Colors, Font, validation, mobileH, mobileW, SocialLogin, Cameragallery, mediaprovider, localStorage, Lang_chg, consolepro, msgProvider, msgTitle, msgText, Currentltlg } from './Providers/utilslib/Utils'
import { localimag } from './Providers/Localimageprovider/Localimage'
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
export default class AnswerPage extends Component {
    constructor(props) {
        super(props)
        this.state = {
        }
    }
    backpress = () => {
        this.props.navigation.goBack();
    }

    //--------------------------------------------------------//

    render() {
        return (
            <View style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
                <SafeAreaView style={{ flex: 0, backgroundColor: Colors.theme_color }} />
                <StatusBar backgroundColor={Colors.theme_color} barStyle='default' hidden={false} translucent={false}
                    networkActivityIndicatorVisible={true} />
                <View style={styles.setingsHeader}>
                    <TouchableOpacity activeOpacity={0.9} onPress={() => { this.backpress() }}>
                        <Image resizeMode="contain" style={{ width: 25, height: 30 }} source={localimag.back}></Image>
                    </TouchableOpacity>
                    <Text style={styles.OrderHistoryTitle}></Text>
                    <Text></Text>
                </View>
                <View style={{ height: mobileH * 96 / 100, width: mobileW * 100 / 100, backgroundColor: Colors.purewhite, position: 'absolute', borderRadius: 25, marginTop: 60 }}>
                    <ScrollView>
                        <View style={{ paddingBottom: mobileW * 30 / 100 }}>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 20, width: mobileW * 94 / 100, alignSelf: 'center', alignItems: 'center' }}>
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <View style={{ borderRadius: 100, borderWidth: 1, borderColor: '#9BD19E', }}>
                                        <Image resizeMode="contain" style={{ width: 68, height: 70, }} source={localimag.person4}></Image>
                                    </View>
                                    <View style={{ marginLeft: 30 }}>
                                        <Text style={{ fontFamily: Font.bold, fontSize: mobileW * 4 / 100 }}>Micheal Jonas</Text>
                                        <Text style={{ fontFamily: Font.medium, fontSize: mobileW * 3 / 100, color: Colors.textColor }}>2 days ago</Text>
                                    </View>
                                </View>
                                <TouchableOpacity activeOpacity={1} style={{ flexDirection: 'row', backgroundColor: '#E5E5E5', justifyContent: 'center', width: mobileW * 18 / 100, height: mobileH * 3.5 / 100, borderRadius: 5, alignItems: 'center', }}>
                                    <Image resizeMode="contain" style={{ width: 20, height: 20, marginTop: 2 }} source={localimag.chatt}></Image>
                                    <Text style={{ fontFamily: Font.medium, fontSize: mobileW * 3.9 / 100, color: Colors.theme_color }}>chat</Text>
                                </TouchableOpacity>
                            </View>
                            <View style={{ width: mobileW * 90 / 100, alignSelf: 'center', marginTop: 15 }}>
                                <Text style={{ fontSize: mobileW * 4 / 100, fontFamily: Font.bold }}>Is the reason that nothingh can go faster than light because we have not tried hard enough ?</Text>
                            </View>
                            <View style={{ width: mobileW * 90 / 100, alignSelf: 'center', marginTop: 15, backgroundColor: '#E5E5E5E5', height: mobileH * 50 / 100 }}>
                                <Text style={{ fontSize: mobileW * 4.5 / 100, fontFamily: Font.bold, marginTop: 30 }}>The universal speed limit which we commonly called speed of light. Is fundamental to the way universe work. It is dificult to visiualize this if you have never heard this before, but scientist have found the faster you go the more you spatiual direction in the dimension in the foward direction shrink and slower the clock run when oberseve by the external oberserver. In other word space and speed are not fixed background on which everything takes place in the world</Text>
                            </View>
                            <View style={{ marginTop: 16, width: mobileW * 96 / 100, height: mobileH * 7 / 100, borderRadius: 15, alignItems: 'center', justifyContent: 'flex-start', alignSelf: 'center' }}>
                                <TouchableOpacity activeOpacity={1} onPress={() => { this.props.navigation.navigate('ManageQueries') }}
                                    style={{ width: mobileW * 90 / 100, height: mobileH * 4.5 / 100, backgroundColor: '#E5E5E5E5', borderRadius: 12, alignItems: 'center', justifyContent: 'center', alignSelf: 'center', }}>
                                    <Text style={{ fontSize: mobileW * 3.8 / 100, fontFamily: Font.bold, color: Colors.theme_color }}>Submit</Text>
                                </TouchableOpacity>
                            </View>
                            <View style={{ width: mobileW * 96 / 100, height: mobileH * 10 / 100, borderRadius: 15, alignItems: 'center', justifyContent: 'flex-start', alignSelf: 'center' }}>
                                <View activeOpacity={1} onPress={() => { this.props.navigation.navigate('SignupExpert') }}
                                    style={{ width: mobileW * 90 / 100, height: mobileH * 4.5 / 100, borderRadius: 12, alignItems: 'center', justifyContent: 'center', alignSelf: 'center', borderWidth: 1, borderColor: Colors.theme_color }}>
                                    <Text style={{ fontSize: mobileW * 3.8 / 100, fontFamily: Font.bold, color: Colors.theme_color }}>Edit your answer</Text>
                                </View>
                            </View>
                        </View>
                    </ScrollView>
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
        paddingTop: 1,
        paddingBottom: 45,
        alignItems: 'center'
    },
    OrderHistoryTitle: {
        color: Colors.white_color,
        fontFamily: Font.bold,
        fontSize: windowWidth * 5.2 / 100,
        letterSpacing: 0.5
    },
});


