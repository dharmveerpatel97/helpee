import React, { Component } from 'react'
import { Text, View, TouchableOpacity, TextInput, SafeAreaView, Keyboard, Dimensions, StatusBar, Image, ScrollView, BackHandler, StyleSheet } from 'react-native'
import { config, Otpprovider, Mapprovider, apifuntion, Colors, Font, validation, mobileH, mobileW, SocialLogin, Cameragallery, mediaprovider, localStorage, Lang_chg, consolepro, msgProvider, msgTitle, msgText, Currentltlg } from './Providers/utilslib/Utils'
import { localimag } from './Providers/Localimageprovider/Localimage'
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
export default class TermsConditions extends Component {
    constructor(props) {
        super(props)
        this.state = {
            email: '',
            cnumber: '',
            expiry: '',
            cvv: '',
            zip: ''
        }
    }
    backpress = () => {
        this.props.navigation.goBack();
    }
    //--------------------************------------------------------------//
    render() {
        return (
            <View style={{ flex: 1, height: '100%', width: '100%', backgroundColor: '#FFFFFF' }}>
                <SafeAreaView style={{ flex: 0, backgroundColor: Colors.theme_color }} />
                <StatusBar backgroundColor={Colors.theme_color} barStyle='default' hidden={false} translucent={false}
                    networkActivityIndicatorVisible={true} />
                <View style={styles.setingsHeader}>
                    <TouchableOpacity activeOpacity={0.9} onPress={() => { this.backpress() }}>
                        <Image resizeMode="contain" style={{ width: 25, height: 30 }} source={localimag.back}></Image>
                    </TouchableOpacity>
                    <Text style={styles.OrderHistoryTitle}>Payment</Text>
                    <Text></Text>
                </View>
                <View style={{ flexDirection: 'row', width: mobileW * 86 / 100, alignSelf: 'center', alignItems: 'center', height: mobileH * 8 / 100 }}>
                    <View style={{ borderWidth: 4, borderRadius: 100, width: mobileW * 6.8 / 100, height: mobileW * 6.8 / 100, borderColor: Colors.theme_color }}><Text> </Text></View>
                    <Text style={{ fontFamily: Font.medium, fontSize: mobileW * 3.5 / 100, marginLeft: 10 }}>CreditCard/Debit Card</Text>
                </View>
                <View style={{ height: mobileH * 10 / 100, width: mobileW * 86 / 100, alignSelf: 'center', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                    <Text style={{ fontSize: mobileW * 3.5 / 100, fontFamily: Font.medium }}>Email address</Text>
                    <View style={{ flexDirection: 'row', borderWidth: 2, borderColor: Colors.line_color, width: mobileW * 86 / 100, height: mobileH * 7 / 100, borderRadius: 5, alignSelf: 'center', justifyContent: 'center', }}>
                        <TextInput
                            onChangeText={text => { this.setState({ email: text }) }}
                            value={"" + this.state.email + ""}
                            maxLength={30}
                            returnType="done"
                            returnKeyType="done"
                            style={{ fontFamily: Font.regular, width: mobileW * 74 / 100, fontSize: mobileW * 4 / 100, padding: 6, fontWeight: 'bold', }}
                            placeholder="Example@gmail.com"
                            keyboardType={'default'}
                            placeholderTextColor={Colors.text_color}
                            onSubmitEditing={() => { Keyboard.dismiss() }}
                        />
                        <Image resizeMode="contain" style={{ width: 20, height: mobileH * 7 / 100 }} source={localimag.gmail}></Image>
                    </View>
                </View>
                <View style={{ height: mobileH * 10 / 100, width: mobileW * 86 / 100, alignSelf: 'center', alignItems: 'flex-start', justifyContent: 'space-between', marginTop: 20 }}>
                    <Text style={{ fontSize: mobileW * 3.5 / 100, fontFamily: Font.medium }}>Credit card number</Text>
                    <View style={{ flexDirection: 'row', borderWidth: 2, borderColor: '#A7A7A7', width: mobileW * 86 / 100, height: mobileH * 7 / 100, borderRadius: 5, alignSelf: 'center', justifyContent: 'center', }}>
                        <TextInput
                            onChangeText={text => { this.setState({ cnumber: text }) }}
                            value={"" + this.state.cnumber + ""}
                            maxLength={16}
                            returnType="done"
                            returnKeyType="done"
                            style={{ fontFamily: Font.regular, width: mobileW * 74 / 100, fontSize: mobileW * 4 / 100, padding: 6, fontWeight: 'bold' }}
                            placeholder="0000 0000 0000 0000"
                            keyboardType={'numeric'}
                            placeholderTextColor={Colors.text_color}
                            onSubmitEditing={() => { Keyboard.dismiss() }}
                        />
                        <Image resizeMode="contain" style={{ width: 20, height: mobileH * 7 / 100 }} source={localimag.creditcard}></Image>
                    </View>
                </View>
                <View style={{ flexDirection: 'row', width: mobileW * 86 / 100, height: mobileH * 11 / 100, marginTop: 20, alignItems: 'center', alignSelf: 'center' }}>
                    <View style={{ height: mobileH * 10 / 100, width: mobileW * 27 / 100, alignSelf: 'center', alignItems: 'flex-start', justifyContent: 'space-between', marginTop: 20 }}>
                        <Text style={{ fontSize: mobileW * 3.4 / 100, fontFamily: Font.medium }}>Expiry Date</Text>
                        <View style={{ borderWidth: 2, borderColor: '#A7A7A7', width: mobileW * 27 / 100, height: mobileH * 7 / 100, borderRadius: 5, alignSelf: 'center', justifyContent: 'center', }}>
                            <TextInput
                                onChangeText={text => { this.setState({ expiry: text }) }}
                                value={"" + this.state.expiry + ""}
                                maxLength={5}
                                returnType="done"
                                returnKeyType="done"
                                style={{ fontFamily: Font.bold, marginLeft: 2, width: mobileW * 25 / 100, fontSize: mobileW * 4 / 100, padding: 6, }}
                                placeholder="MM/YY"
                                keyboardType={'numeric'}
                                placeholderTextColor={Colors.text_color}
                                onSubmitEditing={() => { Keyboard.dismiss() }}
                            />
                        </View>
                    </View>
                    <View style={{ marginLeft: 15, height: mobileH * 10 / 100, width: mobileW * 26 / 100, alignSelf: 'center', alignItems: 'flex-start', justifyContent: 'space-between', marginTop: 20 }}>
                        <Text style={{ fontSize: mobileW * 3.4 / 100, fontFamily: Font.medium }}>CVV</Text>
                        <View style={{ flexDirection: 'row', borderWidth: 2, borderColor: '#A7A7A7', width: mobileW * 28 / 100, height: mobileH * 7 / 100, borderRadius: 5, alignSelf: 'center', justifyContent: 'center', alignItems: 'center' }}>
                            <TextInput
                                onChangeText={text => { this.setState({ cvv: text }) }}
                                value={"" + this.state.cvv + ""}
                                maxLength={4}
                                returnType="done"
                                returnKeyType="done"
                                style={{ fontFamily: Font.bold, marginLeft: 1, width: mobileW * 18 / 100, fontSize: mobileW * 4 / 100, padding: 6, }}
                                placeholder="CVV"
                                keyboardType={'numeric'}
                                placeholderTextColor={Colors.text_color}
                                onSubmitEditing={() => { Keyboard.dismiss() }}
                            />
                            <Image resizeMode="contain" style={{ width: 20, height: 40 }} source={localimag.question}></Image>
                        </View>
                    </View>
                    <View style={{ marginLeft: 15, height: mobileH * 10 / 100, width: mobileW * 26 / 100, alignSelf: 'center', alignItems: 'flex-start', justifyContent: 'space-between', marginTop: 20 }}>
                        <Text style={{ fontSize: mobileW * 3.4 / 100, fontFamily: Font.medium }}>ZIP/Postal code</Text>
                        <View style={{ borderWidth: 2, borderColor: '#A7A7A7', width: mobileW * 26 / 100, height: mobileH * 7 / 100, borderRadius: 5, alignSelf: 'center', justifyContent: 'center', }}>
                            <TextInput
                                onChangeText={text => { this.setState({ zip: text }) }}
                                value={"" + this.state.zip + ""}
                                maxLength={5}
                                returnType="done"
                                returnKeyType="done"
                                style={{ fontFamily: Font.regular, marginLeft: 2, width: mobileW * 25 / 100, fontSize: mobileW * 3.8 / 100, padding: 6, fontWeight: 'bold' }}
                                placeholder="12345"
                                keyboardType={'numeric'}
                                placeholderTextColor={Colors.text_color}
                                onSubmitEditing={() => { Keyboard.dismiss() }}
                            />
                        </View>
                    </View>
                </View>
                <View style={{ width: mobileW * 72 / 100, height: mobileH * 12 / 100, borderRadius: 15, alignItems: 'center', justifyContent: 'center', alignSelf: 'center', marginTop: 16 }}>
                    <TouchableOpacity activeOpacity={1} style={{ width: mobileW * 84 / 100, height: mobileH * 7 / 100, backgroundColor: Colors.theme_color, borderRadius: 35, alignItems: 'center', justifyContent: 'center', alignSelf: 'center' }}
                        onPress={() => { this.props.navigation.navigate('PaymentSuccessfull') }}>
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
        fontFamily: Font.bold,
        fontSize: windowWidth * 5.2 / 100,
        letterSpacing: 0.5
    },
});


