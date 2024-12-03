import React, { Component } from 'react'
import { Text, View, TouchableOpacity, SafeAreaView, Dimensions, StatusBar, Image, ScrollView, BackHandler, StyleSheet } from 'react-native'
import { config, Otpprovider, Mapprovider, apifuntion, Colors, Font, validation, mobileH, mobileW, SocialLogin, Cameragallery, mediaprovider, localStorage, Lang_chg, consolepro, msgProvider, msgTitle, msgText, Currentltlg } from './Providers/utilslib/Utils'
import { localimag } from './Providers/Localimageprovider/Localimage'
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
export default class ExpertSendSuccess extends Component {
    constructor(props) {
        super(props)
        this.state = {
            content_2: '',
            expert_name : '',
        }
    }

    componentDidMount = () => {
        this.props.navigation.addListener('focus', () => {
            this.expertNameSet();
            
        });
    }

    expertNameSet = async() => {
        var expert_name = await localStorage.getItemObject('expert_name');
        this.setState({expert_name:expert_name});
        localStorage.setItemObject('ask_done','yes');
    }

    backpress = () => {
        this.props.navigation.goBack();
    }
   
    //--------------------************------------------------------------//
    render() {
        return (
            <View style={{ flex: 1,backgroundColor: '#FFFFFF' }}>
                <SafeAreaView style={{ flex: 0, backgroundColor: Colors.theme_color }} />
                <StatusBar backgroundColor={Colors.theme_color} barStyle='default' hidden={false} translucent={false}
                    networkActivityIndicatorVisible={true} />
                <View style={{flex:1, alignSelf: 'center', alignItems: 'center', justifyContent: 'center'}}>
                    <View style={{height:mobileH*44/100, width:mobileW*88/100,  backgroundColor: Colors.theme_color, alignItems: 'center',borderRadius:15, shadowColor:'#000000',shadowOffset: {width: 2,height: 2,},shadowOpacity: 0.30}}>
                        <Image resizeMode="contain" style={{ width: 100, height: 100,marginTop:50 }} source={localimag.successwhite}></Image>
                        <Text style={{fontFamily: Font.bold, fontSize:mobileW*4.4/100, textAlign:'center', color:Colors.purewhite}}>Congratulations</Text>
                        <Text style={{fontFamily: Font.bold, fontSize:mobileW*4.2/100, textAlign:'center', color:Colors.purewhite, marginTop:4}}>Your question has been sent to {this.state.expert_name}, please wait for response</Text>
                        <TouchableOpacity activeOpacity={1} onPress={()=>{this.props.navigation.navigate('Home')}}
                            style={{ width: mobileW * 26 / 100, height: mobileH * 5 / 100, backgroundColor: Colors.purewhite, borderRadius: 15, alignItems: 'center', justifyContent: 'center', alignSelf: 'center', marginTop:20 }}>
                            <Text style={{ fontSize: mobileW * 5 / 100, fontFamily: Font.bold, color: Colors.theme_color }}>Ok</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        )
    }
}
const styles = StyleSheet.create({
   
});


