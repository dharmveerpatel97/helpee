import React, { Component } from 'react'
import { Text, View, SafeAreaView, StatusBar, Dimensions, Alert, TouchableOpacity, Image, Switch, ScrollView, BackHandler, StyleSheet } from 'react-native'
import { config, Otpprovider, Mapprovider, apifuntion, Colors, Font, validation, mobileH, mobileW, SocialLogin, Cameragallery, mediaprovider, localStorage, Lang_chg, consolepro, msgProvider, msgTitle, msgText, Currentltlg } from './Providers/utilslib/Utils'
import { localimag } from './Providers/Localimageprovider/Localimage'
import { Shareratepro } from './Providers/Sharerateapp';
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
export default class ExpertSetting extends Component {
    constructor(props) {
        super(props)
        this.state = {
            login_type: '',
            share_url: '',
            rated: false,
            rate_url: '',
            action: '',
            subscription_plan_id: '',
            show: ''
        }
        this._didFocusSubscription = props.navigation.addListener('focus', payload =>
            BackHandler.addEventListener('hardwareBackPress', this.handleBackPress)
        );
    }
    componentDidMount = () => {
        this.props.navigation.addListener('focus', () => {
            // this.get_all_details();
            // this.checkLoginType();
            // this.getSubscriptionPlan();
        });
    }
    Logout = () => {
        Alert.alert(
            'Logout',
            'Do you want to logout ?', [{
                text: 'No',
                onPress: () => console.log('Cancel button Pressed'),
                style: 'cancel'
            }, {
                text: 'Yes',
                onPress: () => { { this.props.navigation.navigate('Login'); localStorage.clear(); localStorage.removeItem('isLogin') } }
            }], {
            cancelable: false
        }
        ); // works best when the goBack is async
        return true;
    };

    handleBackPress = () => {
        this.props.navigation.goBack();
        return true;
    };
    backpress = () => {
        this.props.navigation.goBack();
    }
    
    //--------------------*********-----------------//
    render() {
        return (
            <View style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
                <SafeAreaView style={{ flex: 0, backgroundColor: Colors.theme_color }} />
                <StatusBar backgroundColor={Colors.theme_color} barStyle='default' hidden={false} translucent={false}
                    networkActivityIndicatorVisible={true} />
                <View style={styles.setingsHeader}>
                    <TouchableOpacity activeOpacity={0.9} onPress={() => { this.props.navigation.goBack() }} style={{ marginRight: 20 }}>
                        <Image resizeMode="contain" style={{ width: 35, height: 35 }} source={localimag.back}></Image>
                    </TouchableOpacity>
                    <Text style={styles.OrderHistoryTitle}>Settings</Text>
                    <View style={{ width: '6%' }}></View>
                </View>
                {this.state.show == false && <TouchableOpacity activeOpacity={1} onPress={() => { this.setState({ show: true }) }} style={{ flexDirection: 'row', justifyContent: 'flex-start', borderBottomWidth: 1, height: mobileH * 8 / 100, alignItems: 'center', marginTop: 15, width: mobileW * 90 / 100, alignSelf: 'center' }}>
                    <Image resizeMode="contain" style={{ width: 28, height: 30 }} source={localimag.eperson}></Image>
                    <Text style={{ marginLeft: 25, fontSize: mobileW * 4.2 / 100, fontFamily: Font.medium }}>My Account</Text>
                    <Image resizeMode="contain" style={{ width: 12, height: 12, marginLeft: 10, marginTop: 2 }} source={localimag.downarrow}></Image>
                </TouchableOpacity>}
                {this.state.show == true && <TouchableOpacity activeOpacity={1} onPress={() => { this.setState({ show: false }) }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'flex-start', borderBottomWidth: 1, height: mobileH * 8 / 100, alignItems: 'center', marginTop: 15, width: mobileW * 90 / 100, alignSelf: 'center' }}>
                        <Image resizeMode="contain" style={{ width: 28, height: 30 }} source={localimag.eperson}></Image>
                        <Text style={{ marginLeft: 25, fontSize: mobileW * 4.2 / 100, fontFamily: Font.medium }}>My Account</Text>
                        <Image resizeMode="contain" style={{ width: 12, height: 12, marginLeft: 12, marginTop: 2 }} source={localimag.uparrow}></Image>
                    </View>
                    <TouchableOpacity activeOpacity={1} onPress={() => { this.props.navigation.navigate('RatingReview') }} style={{ justifyContent: 'center', borderBottomWidth: 1, height: mobileH * 8 / 100, alignItems: 'flex-start', width: mobileW * 90 / 100, alignSelf: 'center' }}>
                        <Text style={{ marginLeft: 50, fontSize: mobileW * 4.2 / 100, fontFamily: Font.medium, color: 'grey' }}>View Ratings</Text>
                    </TouchableOpacity>
                </TouchableOpacity>}
                <TouchableOpacity activeOpacity={1} onPress={() => { this.props.navigation.navigate('FAQ') }} style={{ flexDirection: 'row', justifyContent: 'flex-start', borderBottomWidth: 1, height: mobileH * 8 / 100, alignItems: 'center', marginTop: 15, width: mobileW * 90 / 100, alignSelf: 'center' }}>
                    <Image resizeMode="contain" style={{ width: 38, height: 38 }} source={localimag.FAQs}></Image>
                    <Text style={{ marginLeft: 18, fontSize: mobileW * 4.2 / 100, fontFamily: Font.medium }}>FAQ/Help</Text>
                </TouchableOpacity>
                <TouchableOpacity activeOpacity={1} onPress={() => { this.props.navigation.navigate('AboutUS') }} style={{ flexDirection: 'row', justifyContent: 'flex-start', borderBottomWidth: 1, height: mobileH * 8 / 100, alignItems: 'center', marginTop: 15, width: mobileW * 90 / 100, alignSelf: 'center' }}>
                    <Image resizeMode="contain" style={{ width: 35, height: 35 }} source={localimag.information}></Image>
                    <Text style={{ marginLeft: 20, fontSize: mobileW * 4.2 / 100, fontFamily: Font.medium }}>About Us</Text>
                </TouchableOpacity>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', borderBottomWidth: 1, height: mobileH * 8 / 100, alignItems: 'center', marginTop: 15, width: mobileW * 90 / 100, alignSelf: 'center' }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Image resizeMode="contain" style={{ width: 35, height: 35 }} source={localimag.expertbell}></Image>
                        <Text style={{ marginLeft: 16, fontSize: mobileW * 4.2 / 100, fontFamily: Font.medium }}>Push Notifications</Text>
                    </View>
                    <Switch trackColor={{ false: '#E6EDEB', true: '#00aff0' }}
                        thumbColor={Colors.theme_color} ios_backgroundColor="#E6EDEB" onValueChange={(txt) => { this.setState({ notification: txt }); }} value={this.state.notification} />
                </View>
                <TouchableOpacity activeOpacity={1} onPress={() => { this.Logout(); }} style={{ flexDirection: 'row', justifyContent: 'flex-start', borderBottomWidth: 1, height: mobileH * 8 / 100, alignItems: 'center', marginTop: 15, width: mobileW * 90 / 100, alignSelf: 'center' }}>
                    <Image resizeMode="contain" style={{ width: 38, height: 40 }} source={localimag.logout}></Image>
                    <Text style={{ marginLeft: 15, fontSize: mobileW * 4.2 / 100, fontFamily: Font.medium, color: 'red' }}>Logout</Text>
                </TouchableOpacity>
            </View>
        )
    }
}
const styles = StyleSheet.create({
    OrderHistoryTitle: {
        fontFamily: Font.bold,
        fontSize: windowWidth * 5.2 / 100,
    },
    //Setting
    setingsHeader: {
        flexDirection: 'row',
        backgroundColor: Colors.purewhite,
        justifyContent: 'flex-start',
        paddingLeft: 20,
        paddingRight: 20,
        paddingTop: 15,
        paddingBottom: 15,
        alignItems: 'center',
        elevation: 4,
        shadowColor: '#000000', 
        shadowOffset: { width: 2, height: 2, }, 
        shadowOpacity: 0.30
    },
    settings_Box: {
        justifyContent: 'space-between',
        paddingBottom: 2,
        paddingTop: 2,
        paddingRight: 15,
        paddingLeft: 15,
    },
    settingAcount: {
        color: Colors.theme_color,
        fontSize: 21,
        fontFamily: Font.bold,
        marginTop: 10,
        marginBottom: 10,
        marginLeft: windowWidth * 3 / 100
    },
    settingsAcount: {
        borderBottomWidth: 2,
        borderBottomColor: '#E8E8E8',
        width: windowWidth * 100 / 100
    },
    settingsLeft: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center'
    }

});
