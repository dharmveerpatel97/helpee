import React, { Component } from 'react'
import { Text, View, TouchableOpacity, SafeAreaView, Dimensions, StatusBar, Image, ScrollView, BackHandler, StyleSheet } from 'react-native'
import { config, Otpprovider, Mapprovider, apifuntion, Colors, Font, validation, mobileH, mobileW, SocialLogin, Cameragallery, mediaprovider, localStorage, Lang_chg, consolepro, msgProvider, msgTitle, msgText, Currentltlg } from './Providers/utilslib/Utils'
import { localimag } from './Providers/Localimageprovider/Localimage'

export default class SignupModal extends Component {
    constructor(props) {
        super(props)
        this.state = {
           
        }
    }
    backpress = () => {
        this.props.navigation.goBack();
    }
    backpress = () => {
        this.props.navigation.goBack();
    }
    componentDidMount = () => {
        //this.get_term_condition();
    }

    //--------------------************-------------------//
    render() {
        return (
            <View style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
                <SafeAreaView style={{ flex: 0, backgroundColor: Colors.theme_color }} />
                <StatusBar backgroundColor={Colors.theme_color} barStyle='default' hidden={false} translucent={false}
                    networkActivityIndicatorVisible={true} />
                <View style={{flex:1, justifyContent: 'center', alignItems: 'center',}}>
                    <View style={{ width: mobileW * 84 / 100, height: mobileH * 25 / 100 , backgroundColor: Colors.theme_color, borderRadius:20}}>
                        <View style={{ paddingTop: mobileW * 10 / 100, alignItems: 'center' }}>
                            <Text style={{ fontFamily: 'Roboto-Medium', fontSize: mobileW * 5.5 / 100, }}>Please Sign In</Text>
                            <TouchableOpacity onPress={()=>{this.props.navigation.navigate('Login')}} style={{position: 'absolute', right:10}}>
                                <Image source={localimag.cancel} style={{width:mobileW*8/100,height:mobileW*8/100,}}/>
                            </TouchableOpacity>
                        </View>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: mobileW * 10 / 100, paddingHorizontal: mobileW * 3 / 100, }}>
                        <TouchableOpacity activeOpacity={1} onPress={() => { this.props.navigation.navigate('Signup')}} 
                                style={{ backgroundColor: '#3289C6', width: mobileW * 38 / 100, height: mobileW * 10 / 100, justifyContent: 'center', alignItems: 'center', borderRadius: 5 }}>
                                <Text style={{ fontSize: 14, color: Colors.purewhite }}>User Signup</Text>
                            </TouchableOpacity>
                            <TouchableOpacity activeOpacity={1} onPress={() => { this.props.navigation.navigate('SignupExpert')}}
                                style={{ backgroundColor: '#3289C6', width: mobileW * 38 / 100, height: mobileW * 10 / 100, justifyContent: 'center', alignItems: 'center', borderRadius: 5 }}>
                                <Text style={{ fontSize: 14, color: Colors.purewhite }}>Expert Signup</Text>
                            </TouchableOpacity>
                        </View>      
                    </View>
                </View>
            </View>
        )
    }
}
const styles = StyleSheet.create({
    
});


