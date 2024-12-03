import React, { Component } from 'react'
import { Text, View, TouchableOpacity, SafeAreaView, Dimensions, TextInput, StatusBar, ImageBackground, Image, ScrollView, FlatList, BackHandler, StyleSheet } from 'react-native'
import { config, Otpprovider, Mapprovider, apifuntion, Colors, Font, validation, mobileH, mobileW, SocialLogin, Cameragallery, mediaprovider, localStorage, Lang_chg, consolepro, msgProvider, msgTitle, msgText, Currentltlg } from './Providers/utilslib/Utils'
import { localimag } from './Providers/Localimageprovider/Localimage'
import StarRating from 'react-native-star-rating';
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
const demoArray1 = [
    { title: localimag.person4, name: "Micheal", message: "Lawyer", number: '22,765', degree: 'Post Master Degree', star: '5' },
    { title: localimag.person5, name: "Rossel", message: "Doctor", number: '92,645', degree: 'Post Doctral Degree', star: '4.5' },
    { title: localimag.person1, name: "Dr Mark Wyan", message: "Neurolist", number: '72,679', degree: 'Neurologist Degree', star: '5' },
    { title: localimag.person3, name: "Dr Walker", message: "Dermatologist", number: '69,671', degree: 'Dermatologist Degree', star: '3' },
    { title: localimag.person6, name: "Dr Peirre", message: "Doctor", number: '60,782', degree: 'MBBS Degree', star: '5' },
];
export default class MeetExpert extends Component {
    constructor(props) {
        super(props)
        this.state = {
            content_2: '',
            starCount: 4,
            showSearch: false,
            txtsrch: ''
        }
    }
    backpress = () => {
        this.props.navigation.goBack();
    }
    cross_click = async () => {
        //await this.SearchFilterFunction('');
        this.setState({ showSearch: false })
    }
    // componentDidMount = () => {
    //     this.get_term_condition();
    // }
    // //-----------------***********--------------------//
    render() {
        return (
            <View style={{ flex: 1,backgroundColor: '#FFFFFF' }}>
                <SafeAreaView style={{ flex: 0, backgroundColor: Colors.theme_color }} />
                <StatusBar backgroundColor={Colors.theme_color} barStyle='default' hidden={false} translucent={false}
                    networkActivityIndicatorVisible={true} />
                {this.state.showSearch == false && <View style={styles.setingsHeader}>
                    <TouchableOpacity activeOpacity={0.9} onPress={() => { this.backpress() }}>
                        <Image resizeMode="contain" style={{ width: 30, height: 30 }} source={localimag.back}></Image>
                    </TouchableOpacity>
                    <Text style={styles.OrderHistoryTitle}>Meet Our Experts</Text>
                    <TouchableOpacity activeOpacity={0.9} onPress={() => { this.setState({ showSearch: true }) }}>
                        <Image resizeMode="contain" style={{ width: 30, height: 30 }} source={localimag.search}></Image>
                    </TouchableOpacity>
                </View>}
                {this.state.showSearch == true && <View style={{ flexDirection: 'row', backgroundColor: Colors.theme_color, alignItems: 'center', justifyContent: 'space-between', height: windowHeight * 9 / 100, }}>
                    <TouchableOpacity onPress={() => { this.props.navigation.goBack() }} style={{ width: windowWidth * 10 / 100, padding: 6, alignItems: 'center', justifyContent: 'center', marginLeft: 10 }}>
                        <Image source={localimag.back}
                            style={{ height: windowWidth * 8 / 100, resizeMode: 'contain', }}>
                        </Image>
                    </TouchableOpacity>
                    <View style={{width: '76%', backgroundColor: '#F2F2F2', borderColor: 'gray', borderRadius: 40, alignItems: 'center',
                        justifyContent: 'center', marginTop: 10, alignSelf: 'flex-start', marginRight: 10 }}>
                        <TextInput 
                            style={{ color: 'black', width: '100%', paddingLeft: 5, textAlign: 'left', paddingRight: 35, height: 35, marginTop: 4, marginLeft: 4 }}
                            placeholder={'Search'}
                            value={"" + this.state.txtsrch + ""}
                            maxLength={20}
                            onChangeText={(text) => { this.setState({ txtsrch: text }) }}>
                        </TextInput>
                        <TouchableOpacity onPress={() => { this.cross_click() }} style={{ width: 20, height: 20, justifyContent: 'center', alignSelf: 'center', position: 'absolute', right: 10 }}>
                            <Image resizeMode="contain" style={{ width: 30, height: 30, alignSelf: 'center', }} source={localimag.cross}></Image>
                        </TouchableOpacity>
                    </View>
                </View>}
                <View style={{ width: mobileW * 100 / 100, paddingBottom: 60 }}>
                    <FlatList
                        data={demoArray1}
                        showsVerticalScrollIndicator={false}
                        renderItem={({ item, index }) => {
                            return (
                                <View style={{ flexDirection: 'row', elevation: 10, backgroundColor: '#FFFFFF', width: windowWidth * 100 / 100, height: windowHeight * 20 / 100, alignItems: 'center', justifyContent: 'flex-start', alignSelf: 'center', marginTop: 10 ,shadowColor:'#000000',shadowOffset: {width: 2,height: 2,},shadowOpacity: 0.20}}>
                                    <View style={{ width: mobileW * 30 / 100, marginLeft: 15, alignItems: 'center', justifyContent: 'center' }}>
                                        <Image resizeMode="cover" style={{ width: mobileW * 28 / 100, height: mobileW * 28 / 100, borderRadius: 100 }} source={item.title}></Image>
                                    </View>
                                    <View style={{ width: mobileW * 40 / 100, marginLeft: 5, }}>
                                        <Text numberOfLines={1} style={{ fontSize: mobileW * 4 / 100, fontFamily: Font.bold }}>{item.name}</Text>
                                        <Text numberOfLines={1} style={{ fontSize: mobileW * 2.9 / 100, fontFamily: Font.regular, }}>{item.message}</Text>
                                        <Text numberOfLines={1} style={{ fontSize: mobileW * 2.9 / 100, fontFamily: Font.regular, }}>{item.degree}</Text>
                                        <Text numberOfLines={1} style={{ fontSize: mobileW * 2.9 / 100, fontFamily: Font.regular, }}>{item.number} satisfied Customer</Text>
                                        <TouchableOpacity activeOpacity={1} onPress={() => { this.props.navigation.navigate('Chat') }} style={{ alignItems: 'center', justifyContent: 'center', backgroundColor: Colors.theme_color, padding: 5, borderRadius: 5, width: mobileW * 35 / 100 }}>
                                            <Text style={{ color: Colors.purewhite, fontSize: mobileW * 3 / 100 }}>Ask a Question</Text>
                                        </TouchableOpacity>
                                    </View>
                                    <View style={{ width: mobileW * 24 / 100, marginRight: 0, justifyContent: 'flex-start', height: mobileH * 12 / 100 }}>
                                        <View style={{ flexDirection: 'row', alignItems: 'center', }}>
                                            <StarRating
                                                containerStyle={{ width: windowWidth * 16 / 100, height: windowHeight * 3 / 100, alignSelf: 'center', alignItems: 'center' }}
                                                fullStar={localimag.star}
                                                emptyStar={localimag.stargrey}
                                                halfStarColor={'#FFC815'}
                                                disabled={true}
                                                maxStars={5}
                                                starSize={mobileW * 3.2 / 100}
                                                rating={item.star} />
                                            <Text style={{ color: Colors.theme_color, }}>({item.star})</Text>
                                        </View>
                                    </View>
                                </View>)
                            }}
                        keyExtractor={(item, index) => index.toString()}>
                    </FlatList>
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


