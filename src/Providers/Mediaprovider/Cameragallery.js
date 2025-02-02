import React, { Component } from "react"
import {
    View, Dimensions,
    Modal,
    StyleSheet,
    TouchableOpacity,
    ActivityIndicator,
    Image,
    Text,
} from "react-native"
import { Colors,Font,config,Lang_chg } from '../utilslib/Utils';
const screenHeight = Math.round(Dimensions.get('window').height);
const screenWidth = Math.round(Dimensions.get('window').width);


export default class Cameragallery extends Component {
    render() {
        return (
            <Modal
             animationType="slide"
             transparent={true}
             visible={this.props.mediamodal}
             onRequestClose={() => {
                  this.setState({modalVisible:false})
             }}>

            <View style={{ flex: 1, backgroundColor: '#00000030', alignItems: 'center' }}>
                <View style={{ position: 'absolute', bottom:20, width:screenWidth, }}>
                    <View style={{ alignSelf: 'center',width:'100%',}}>
                     <TouchableOpacity style={{width:'94%',alignSelf:'center',justifyContent: 'center', alignItems: 'center',backgroundColor: '#FFFFFF', borderRadius: 15}} activeOpacity={0.9} onPress={()=>{this.props.Camerapopen()}}>
                       <View style={{  width:'94%',backgroundColor:Colors.mediabackground,borderRadius:15,paddingVertical:screenWidth*3.5/100  }}>
                            <Text style={{ fontFamily:'Roboto-Bold',textAlign:'center', fontSize: screenWidth*4/100, color:Colors.mediatextcolor}}>{Lang_chg.MediaCamera[config.language]}</Text>
                        </View>
                        </TouchableOpacity>
                       <TouchableOpacity style={{width:'94%',alignSelf:'center',marginTop:10,justifyContent: 'center', alignItems: 'center',backgroundColor: '#FFFFFF', borderRadius: 15}} onPress={()=>{this.props.Galleryopen()}}>
                        <View style={{ width:'94%',backgroundColor:Colors.mediabackground,borderRadius:15,paddingVertical:screenWidth*3.5/100 }}>
                            <Text style={{fontFamily:'Roboto-Bold',textAlign:'center', fontSize: screenWidth*4/100, color:Colors.mediatextcolor }}>{Lang_chg.Mediagallery[config.language]}</Text>
                        </View>
                        </TouchableOpacity>
                    </View>
                    <View style={{ marginTop: 15, alignSelf: 'center', borderRadius: 15,  width: '94%', justifyContent: 'center', alignItems: 'center',marginBottom:10,backgroundColor: '#FFFFFF', borderRadius: 15 }}>
                        <TouchableOpacity onPress={() => {this.props.Canclemedia() }} style={{ alignSelf: 'center',  width: '100%',  alignItems: 'center', justifyContent: 'center',paddingVertical:screenWidth*3.5/100}}>
                            <Text style={{fontFamily:'Roboto-Bold', fontSize: screenWidth*4/100, color:'red'}}>{Lang_chg.cancelmedia[config.language]}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>

        )
    }
}
const styles = StyleSheet.create({
    container: {
        position: "absolute",
        justifyContent: "center",
        backgroundColor: '#00000040',
        top: 0, left: 0, bottom: 0, right: 0
    },

    activityIndicatorWrapper: {
        height: 80,
        width: 80,
        borderRadius: 10,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'black',
        borderRadius: 6,
        justifyContent: "space-around",
        alignItems: "center",
        alignSelf: "center",
    }
})
