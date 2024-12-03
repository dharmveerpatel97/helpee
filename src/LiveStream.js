import React, { Component } from 'react'
import { Text, View, TouchableOpacity, SafeAreaView, Dimensions, ImageBackground, StatusBar, Image, ScrollView, BackHandler, StyleSheet } from 'react-native'
import { config, Otpprovider, Mapprovider, apifuntion, Colors, Font, validation, mobileH, mobileW, SocialLogin, Cameragallery, mediaprovider, localStorage, Lang_chg, consolepro, msgProvider, msgTitle, msgText, Currentltlg } from './Providers/utilslib/Utils'
import { localimag } from './Providers/Localimageprovider/Localimage'
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
import Footer from './Providers/Footer';
export default class LiveStream extends Component {
    constructor(props) {
        super(props)
        this.state = {
            navigate: '',
            footer_image: null,
        }
        this.setUserType();
    }
    setUserType = async () => {
        let result = await localStorage.getItemObject('user_arr')
        if (result != null) {
            this.setState({
                footer_image: result.image
            })
        }
    }
    componentDidMount() {
        this.getNavigation();
    }

    getNavigation = async () => {
        let navigate = await localStorage.getItemObject('navigate');
        consolepro.consolelog('navigate', navigate)
        if (navigate != null && navigate != 'NA') {
            this.setState({ navigate: navigate });
        }
    }

    navigation = () => {
        if (this.state.navigate != null && this.state.navigate != 'NA') {
            if (this.state.navigate == false) {
                this.props.navigation.navigate('ExpertLiveClassDetails')
            } else {
                this.props.navigation.navigate('JoinClassDetails')
            }
        }
    }
    //--------------------************----------------------//
    render() {
        return (
            <View style={{ flex: 1, }}>
                <SafeAreaView style={{ flex: 0, backgroundColor: Colors.theme_color }} />
                <StatusBar backgroundColor={Colors.theme_color} barStyle='default' hidden={false} translucent={false}
                    networkActivityIndicatorVisible={true} />
                <View>
                    <ImageBackground source={localimag.person6}
                        imageStyle={{ resizeMode: 'cover' }}
                        style={{ height: mobileH * 100 / 100 }}>
                        <TouchableOpacity style={{ position: 'absolute', top: mobileW * 1 / 100, backgroundColor: Colors.purewhite, width: mobileW * 15 / 100, height: mobileW * 15 / 100, borderRadius: 40, alignItems: 'center', justifyContent: 'center', left: 80 }}>
                            <Image resizeMode="contain" style={{ width: mobileW * 15 / 100, height: mobileH * 15 / 100 }} source={localimag.videocamera}></Image>
                        </TouchableOpacity>
                        <TouchableOpacity style={{ position: 'absolute', top: mobileW * 1 / 100, backgroundColor: Colors.purewhite, width: mobileW * 15 / 100, height: mobileW * 15 / 100, borderRadius: 40, alignItems: 'center', justifyContent: 'center', left: 10 }}>
                            <Image resizeMode="contain" style={{ width: mobileW * 15 / 100, height: mobileH * 15 / 100 }} source={localimag.mike}></Image>
                        </TouchableOpacity>
                        <TouchableOpacity activeOpacity={1} onPress={() => { this.navigation() }}
                            style={{ position: 'absolute', bottom: mobileW * 10 / 100, backgroundColor: 'red', width: mobileW * 70 / 100, height: mobileW * 16 / 100, borderRadius: 15, alignSelf: 'center', alignItems: 'center', justifyContent: 'center' }}>
                            <Text style={{ color: Colors.purewhite, fontFamily: Font.medium, fontSize: mobileW * 5 / 100 }}>Stop Video</Text>
                        </TouchableOpacity>
                    </ImageBackground>
                </View>
                <Footer
                    activepage='Classes'
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
        )
    }
}
const styles = StyleSheet.create({

});


