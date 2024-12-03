import React, { Component } from 'react'
import { Text, View, TouchableOpacity, SafeAreaView, Dimensions, TextInput, Keyboard, StatusBar, Image, ScrollView, FlatList, BackHandler, StyleSheet, ImageBackground } from 'react-native'
import { config, Otpprovider, Mapprovider, apifuntion, Colors, Font, validation, mobileH, mobileW, SocialLogin, Cameragallery, mediaprovider, localStorage, Lang_chg, consolepro, msgProvider, msgTitle, msgText, Currentltlg } from './Providers/utilslib/Utils'
import { localimag } from './Providers/Localimageprovider/Localimage'

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export default class ExpertPayment extends Component {
    constructor(props) {
        super(props)
        this.state = {
            credit: '',
        }
    }
    backpress = () => {
        this.props.navigation.goBack();
    }
    componentDidMount = async () => {
        await localStorage.setItemObject('move', false);
    }
    //--------------------************-----------------------//
    render() {
        return (
            <View style={{ flex: 1,backgroundColor: '#FFFFFF' }}>
                <SafeAreaView style={{ flex: 0, backgroundColor: Colors.theme_color }} />
                <StatusBar backgroundColor={Colors.theme_color} barStyle='default' hidden={false} translucent={false}
                    networkActivityIndicatorVisible={true} />
                <View style={styles.setingsHeader}>
                    <TouchableOpacity activeOpacity={0.9} onPress={() => { this.backpress() }}>
                        <Image resizeMode="contain" style={{ width: 25, height: 30 }} source={localimag.back}></Image>
                    </TouchableOpacity>
                    <Text style={styles.OrderHistoryTitle}>Payment</Text>
                    <View style={{ width: mobileW * 10 / 100 }}></View>
                </View>
                <View style={{ height: mobileH * 25 / 100, marginTop: 40, alignItems: 'center', alignSelf: 'center', }}>
                    <ImageBackground source={localimag.card} resizeMode={'cover'} style={{ width: mobileW * 94 / 100, height: mobileH * 22 / 100, }}
                        imageStyle={{ borderRadius: 15 }}>
                        <View style={{ marginTop: mobileH * 11 / 100, height: windowHeight * 4 / 100, marginLeft: mobileW * 10 / 100 }}>
                            <Text style={{ color: Colors.purewhite, fontSize: mobileW * 4.4 / 100, fontFamily: Font.medium }}>xxxx xxxx xxxx x966</Text>
                        </View>
                        <View style={{ width: mobileW * 70 / 100, flexDirection: 'row', justifyContent: 'space-between', height: windowHeight * 4 / 100, marginLeft: mobileW * 10 / 100 }}>
                            <Text style={{ color: Colors.purewhite, fontSize: mobileW * 3 / 100, fontFamily: Font.medium }}>cardholder name</Text>
                            <Text style={{ color: Colors.purewhite, fontSize: mobileW * 3 / 100, fontFamily: Font.medium }}>00/0000</Text>
                        </View>
                    </ImageBackground>
                </View>
                <View style={{ borderBottomWidth: 2, alignSelf: 'center', borderBottomColor: '#DADADA' }}>
                    <Text style={{ fontSize: mobileW * 3 / 100, color: Colors.textColor }}>Card Number</Text>
                    <TextInput
                        onChangeText={text => { this.setState({ credit: text }) }}
                        value={"" + this.state.credit + ""}
                        maxLength={50}
                        returnType="done"
                        returnKeyType="done"
                        style={{ fontFamily: Font.bold, width: mobileW * 82 / 100, fontSize: mobileW * 3.4 / 100, padding: 1, }}
                        placeholder="xxxx xxxx xxxx x966"
                        keyboardType={'default'}
                        placeholderTextColor={Colors.font_color}
                        onSubmitEditing={() => { Keyboard.dismiss() }}/>
                </View>
                <View style={{ flexDirection: 'row', alignSelf: 'center', marginTop: 30 }}>
                    <View style={{ width: mobileW * 40 / 100, borderBottomWidth: 2, alignSelf: 'center', borderBottomColor: '#DADADA' }}>
                        <Text style={{ fontSize: mobileW * 3 / 100, color: Colors.textColor }}>MM/YYYY</Text>
                        <TextInput
                            onChangeText={text => { this.setState({ credit: text }) }}
                            value={"" + this.state.credit + ""}
                            maxLength={50}
                            returnType="done"
                            returnKeyType="done"
                            style={{ fontFamily: Font.bold, width: mobileW * 40 / 100, fontSize: mobileW * 3.4 / 100, padding: 1, }}
                            placeholder="00/0000"
                            keyboardType={'default'}
                            placeholderTextColor={Colors.font_color}
                            onSubmitEditing={() => { Keyboard.dismiss() }}/>
                    </View>
                    <View style={{ marginLeft: 20, borderBottomWidth: 2, alignSelf: 'center', borderBottomColor: '#DADADA' }}>
                        <Text style={{ fontSize: mobileW * 3 / 100, color: Colors.textColor }}>CVV</Text>
                        <TextInput
                            onChangeText={text => { this.setState({ credit: text }) }}
                            value={"" + this.state.credit + ""}
                            maxLength={50}
                            returnType="done"
                            returnKeyType="done"
                            style={{ fontFamily: Font.bold, width: mobileW * 38 / 100, fontSize: mobileW * 3.4 / 100, padding: 1, }}
                            placeholder="000"
                            keyboardType={'default'}
                            placeholderTextColor={Colors.font_color}
                            onSubmitEditing={() => { Keyboard.dismiss() }}/>
                    </View>
                </View>
                <View style={{ marginTop: 30, borderBottomWidth: 2, alignSelf: 'center', borderBottomColor: '#DADADA' }}>
                    <Text style={{ fontSize: mobileW * 3 / 100, color: Colors.textColor }}>Card Holder name</Text>
                    <TextInput
                        onChangeText={text => { this.setState({ credit: text }) }}
                        value={"" + this.state.credit + ""}
                        maxLength={50}
                        returnType="done"
                        returnKeyType="done"
                        style={{ fontFamily: Font.bold, width: mobileW * 82 / 100, fontSize: mobileW * 3.4 / 100, padding: 1, }}
                        placeholder="card holder name"
                        keyboardType={'default'}
                        placeholderTextColor={Colors.font_color}
                        onSubmitEditing={() => { Keyboard.dismiss() }} />
                </View>
                <View style={{ marginTop: 30, borderBottomWidth: 2, alignSelf: 'center', borderBottomColor: '#DADADA' }}>
                    <Text style={{ fontSize: mobileW * 3 / 100, color: Colors.textColor }}>ID Number</Text>
                    <TextInput
                        onChangeText={text => { this.setState({ credit: text }) }}
                        value={"" + this.state.credit + ""}
                        maxLength={50}
                        returnType="done"
                        returnKeyType="done"
                        style={{ fontFamily: Font.bold, width: mobileW * 82 / 100, fontSize: mobileW * 3.4 / 100, padding: 1, }}
                        placeholder="0000 0000 000 00"
                        keyboardType={'default'}
                        placeholderTextColor={Colors.font_color}
                        onSubmitEditing={() => { Keyboard.dismiss() }}/>
                </View>
                <View style={{ width: mobileW * 84 / 100, height: mobileH * 10 / 100, borderRadius: 15, alignItems: 'center', justifyContent: 'flex-start', alignSelf: 'center' }}>
                    <TouchableOpacity activeOpacity={1} onPress={() => { this.props.navigation.navigate('PaymentSuccessfull') }}
                        style={{ width: mobileW * 84 / 100, height: mobileH * 6 / 100, backgroundColor: Colors.theme_color, borderRadius: 5, alignItems: 'center', justifyContent: 'center', alignSelf: 'center', marginTop: 40 }}>
                        <Text style={{ fontSize: mobileW * 4 / 100, fontFamily: Font.bold, color: Colors.purewhite }}>Pay Now</Text>
                    </TouchableOpacity>
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
        fontFamily: Font.medium,
        fontSize: windowWidth * 5.2 / 100,
        letterSpacing: 0.5
    },
});


