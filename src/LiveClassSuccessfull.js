import React, { Component } from 'react'
import { Text, View, TouchableOpacity, SafeAreaView, Dimensions, StatusBar, Image, ScrollView, BackHandler, StyleSheet } from 'react-native'
import { config, Otpprovider, Mapprovider, apifuntion, Colors, Font, validation, mobileH, mobileW, SocialLogin, Cameragallery, mediaprovider, localStorage, Lang_chg, consolepro, msgProvider, msgTitle, msgText, Currentltlg } from './Providers/utilslib/Utils'
import { localimag } from './Providers/Localimageprovider/Localimage'
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
export default class LiveClassSuccessfull extends Component {
    constructor(props) {
        super(props)
        this.state = {
            content_2: '',
        }
    }
    backpress = () => {
        this.props.navigation.goBack();
    }
    //--------------------************------------------------------------//
    render() {
        return (
            <View style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
                <SafeAreaView style={{ flex: 0, backgroundColor: Colors.theme_color }} />
                <StatusBar backgroundColor={Colors.theme_color} barStyle='default' hidden={false} translucent={false}
                    networkActivityIndicatorVisible={true} />
                <View style={{flex:1, alignSelf: 'center', alignItems: 'center', justifyContent: 'center'}}>
                    <View style={{height:mobileH*38/100, width:mobileW*84/100, elevation:4, backgroundColor: Colors.theme_color, alignItems: 'center',borderRadius:18, shadowColor:'#000000',shadowOffset: {width: 2,height: 2,},shadowOpacity: 0.30}}>
                        <Image resizeMode="contain" style={{ width: 140, height: 140,marginTop:10 }} source={localimag.successwhite}></Image>
                        <Text style={{fontFamily: Font.medium, fontSize:mobileW*4.5/100, textAlign:'center', color:Colors.purewhite, letterSpacing:1.5,fontFamily: 'Roboto-Bold', marginBottom:10}}>Congratulation</Text>
                        <View style={{width:mobileW*80/100, alignSelf: 'center'}}>
                            <Text style={{fontFamily: Font.medium, fontSize:mobileW*3.8/100, textAlign:'center', color:Colors.purewhite, letterSpacing:1, fontFamily: 'Roboto-Bold'}}>Your question has been sent to Michael please wait to the response</Text>
                        </View>
                        <TouchableOpacity activeOpacity={1} onPress={()=>{this.props.navigation.navigate('JoinClassDetails')}}
                            style={{ width: mobileW * 25 / 100, height: mobileH * 4.5 / 100, backgroundColor: Colors.purewhite, borderRadius: 12, alignItems: 'center', justifyContent: 'center', alignSelf: 'center', marginTop:5 }}>
                                <Text style={{fontFamily: 'Roboto-Bold', fontSize: mobileW*4.5/100, color :Colors.theme_color}}>Ok</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        )
    }
}
const styles = StyleSheet.create({
   
});


