import React, { Component } from 'react'
import { Text, View, TouchableOpacity, SafeAreaView, Dimensions,FlatList, StatusBar, Image, ScrollView, BackHandler, StyleSheet } from 'react-native'
import { config, Otpprovider, Mapprovider, apifuntion, Colors, Font, validation, mobileH, mobileW, SocialLogin, Cameragallery, mediaprovider, localStorage, Lang_chg, consolepro, msgProvider, msgTitle, msgText, Currentltlg } from './Providers/utilslib/Utils'
import { localimag } from './Providers/Localimageprovider/Localimage'
import StarRating from 'react-native-star-rating';
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
const demoArray = [
    { date: '18-08-2021', time: '8:00Am-9:00Am', status: 'Not Started', color:1 },
    { date: '18-08-2021', time: '8:00Am-9:00Am', status: 'Live Now' ,color:2},
    { date: '18-08-2021', time: '8:00Am-9:00Am', status: 'Completed',color:3 },
];
export default class LiveClassDetails extends Component {
    constructor(props) {
        super(props)
        this.state = {
            starCount: 4,
        }
    }
    backpress = () => {
        this.props.navigation.goBack();
    }
    //--------------------************--------------------//
    render() {
        return (
            <View style={{ flex: 1, }}>
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
                <ScrollView>
                <View style={{paddingBottom:mobileW*10/100,}}>
                <View style={{ width: mobileW * 90 / 100, alignSelf: 'center', }}>
                    <View style={{ justifyContent: 'center', alignItems: 'flex-start', paddingVertical:15 }}>
                        <Text style={{ fontSize: mobileW * 4 / 100, fontFamily: Font.bold }}>Teacher</Text>
                        <Text style={{ fontSize: mobileW * 5.5 / 100, fontFamily: Font.medium }}>What is Preposition ? Basic uses of Preposition</Text>
                        <Text style={{ fontSize: mobileW * 4.5 / 100, fontFamily: Font.medium }}>A preposition is a word used to link nouns, pronouns, or phrases to other words within a sentence.</Text>
                    </View>
                    <Text style={{ fontSize: mobileW * 4 / 100, fontFamily: Font.bold, marginBottom:20 }}>Expert</Text>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <View style={{ width: mobileW * 20 / 100, height: mobileW * 20 / 100, alignItems: 'center', justifyContent: 'center' }}>
                            <Image source={localimag.person2} style={{ width: mobileW * 22 / 100, height: mobileW * 22 / 100, borderRadius: 100 }} />
                        </View>
                        <View style={{marginLeft:10, width:mobileW*72/100,}}>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between',width:mobileW*70/100 }}>
                                <Text style={{fontFamily: 'Roboto-Bold', fontSize: mobileW*4/100}}>Andrew Miller</Text>
                                <View style={{ flexDirection: 'row', alignItems: 'center', width:mobileW*23/100,}}>
                                    <StarRating
                                        containerStyle={{ width: windowWidth * 16 / 100, height: windowHeight * 3 / 100, alignSelf: 'center', justifyContent: 'center', alignItems: 'center' }}
                                        fullStar={localimag.star}
                                        emptyStar={localimag.stargrey}
                                        halfStarColor={'#FFC815'}
                                        disabled={true}
                                        maxStars={5}
                                        starSize={mobileW * 3.2 / 100}
                                        rating={5}
                                    />
                                    <Text style={{ color: Colors.theme_color, fontSize:mobileW*3/100 }}>(4.5)</Text>
                                </View>
                            </View>
                            <Text numberOfLines={3} style={{fontSize:mobileW*3.3/100, fontFamily: 'Roboto-Medium'}}>I am reaching out to inquire about the availability of an elements teaching position at Smithville School District</Text>
                        </View>
                    </View>
                    </View>
                    <View style={{marginTop:mobileW*6/100}}>
                        <Text style={{fontSize:mobileW*4/100, fontFamily:'Roboto-Bold', paddingLeft:20}}>Sections</Text>
                        <FlatList
                            data={demoArray}
                            showsVerticalScrollIndicator={false}
                            renderItem={({ item, index }) => {
                                return (
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', borderBottomWidth:1, paddingVertical:25, paddingHorizontal:20 }}>
                                        <Text style={{fontFamily: 'Roboto-Medium', fontSize:mobileW*3.5/100}}>{item.date}</Text>
                                        <Text style={{fontFamily: 'Roboto-Medium', fontSize:mobileW*3.5/100}}>{item.time}</Text>
                                       {item.color ==1 && <Text style={{fontFamily: 'Roboto-Medium', color: Colors.darkred, fontSize:mobileW*3.5/100}}>{item.status}</Text>}
                                       {item.color ==2 && <Text style={{fontFamily: 'Roboto-Medium', color: Colors.green, fontSize:mobileW*3.5/100}}>{item.status}</Text>}
                                       {item.color ==3 && <Text style={{fontFamily: 'Roboto-Medium', color: Colors.blue, fontSize:mobileW*3.5/100}}>{item.status}</Text>}
                                    </View>)
                                }}
                            keyExtractor={(item, index) => index.toString()}>
                        </FlatList>
                        </View>
                    <View style={{ width: mobileW * 84 / 100, height: mobileH * 18 / 100,  alignItems: 'center', justifyContent: 'center', alignSelf: 'center' }}>
                        <TouchableOpacity activeOpacity={1} onPress={() => { this.props.navigation.navigate('LiveClassSuccessfull') }}
                            style={{ width: mobileW * 84 / 100, height: mobileH * 7 / 100, backgroundColor: Colors.theme_color, borderRadius: 25, alignItems: 'center', justifyContent: 'center', alignSelf: 'center' }}>
                            <Text style={{ fontSize: mobileW * 4.2/ 100, fontFamily: Font.bold, color: Colors.purewhite }}>Join Class($100)</Text>
                        </TouchableOpacity>
                    </View>
                    </View>
                    </ScrollView>
            </View>
        )
    }
}
const styles = StyleSheet.create({
    setingsHeader: {
        flexDirection: 'row',
        backgroundColor: Colors.theme_color,
        justifyContent: 'space-between',
        paddingHorizontal: 20,
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


