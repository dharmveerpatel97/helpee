import React, { Component } from 'react'
import { Text, View, TouchableOpacity, SafeAreaView, Dimensions, TextInput, StatusBar, ImageBackground, Image, ScrollView, FlatList, BackHandler, StyleSheet } from 'react-native'
import { config, Otpprovider, Mapprovider, apifuntion, Colors, Font, validation, mobileH, mobileW, SocialLogin, Cameragallery, mediaprovider, localStorage, Lang_chg, consolepro, msgProvider, msgTitle, msgText, Currentltlg } from './Providers/utilslib/Utils'
import { localimag } from './Providers/Localimageprovider/Localimage'
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
const demoArray1 = [
    { title: localimag.person2, name: "Andrew", message: "Columbia University", number: '22,765', degree: 'I have to ask about this law of motion', star: '5' },
    { title: localimag.person5, name: "Rossel", message: "Oxford University", number: '92,645', degree: 'I have to ask about gravitation force', star: '4.5' },
    { title: localimag.person1, name: "Peter", message: "Stanford University", number: '72,679', degree: 'I have to ask about Big Bang theory', star: '5' },
    { title: localimag.person3, name: "Watson", message: "Haward University", number: '69,671', degree: 'I have to ask about adjective', star: '3' },
    { title: localimag.person6, name: "Kiara", message: "St Paul University", number: '60,782', degree: 'I have to ask about Proverbs', star: '5' },
    { title: localimag.person6, name: "Kiara", message: "Markus University", number: '60,782', degree: 'I have to ask about Proverbs use', star: '5' },
];
export default class ExpertHomeAll extends Component {
    constructor(props) {
        super(props)
        this.state = {
            content_2: '',
            starCount: 4,
            showSearch: false,
            txtsrch: '',
        }
    }
    backpress = () => {
        this.props.navigation.goBack();
    }
    cross_click = async () => {
        //  await this.SearchFilterFunction('');
        this.setState({ showSearch: false })
    }
    componentDidMount = async () => {
        await localStorage.setItemObject('status', false);
    }
    //--------------------------------------------------//
    render() {
        return (
            <View style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
                <SafeAreaView style={{ flex: 0, backgroundColor: Colors.theme_color }} />
                <StatusBar backgroundColor={Colors.theme_color} barStyle='default' hidden={false} translucent={false}
                    networkActivityIndicatorVisible={true} />
                {this.state.showSearch == false && <View style={styles.setingsHeader}>
                    <TouchableOpacity activeOpacity={0.9} onPress={() => { this.props.navigation.goBack() }}>
                        <Image resizeMode="contain" style={{ width: 35, height: 35 }} source={localimag.back}></Image>
                    </TouchableOpacity>
                    <Text style={styles.OrderHistoryTitle}></Text>
                    <TouchableOpacity activeOpacity={0.9} onPress={() => { this.setState({ showSearch: true }) }}>
                        <Image resizeMode="contain" style={{ width: 30, height: 30 }} source={localimag.search}></Image>
                    </TouchableOpacity>
                </View>}
                {this.state.showSearch == true && <View style={{ flexDirection: 'row', backgroundColor: Colors.theme_color, alignItems: 'center', justifyContent: 'space-between', height: windowHeight * 8 / 100, }}>
                    <TouchableOpacity onPress={() => { this.props.navigation.goBack() }} style={{ width: windowWidth * 10 / 100, padding: 6, alignItems: 'center', justifyContent: 'center', marginLeft: 10 }}>
                        <Image source={localimag.back}
                            style={{ height: windowWidth * 8 / 100, resizeMode: 'contain', }}>
                        </Image>
                    </TouchableOpacity>
                    <View style={{
                        width: '76%', backgroundColor: '#F2F2F2', borderColor: 'gray', borderRadius: 40, alignItems: 'center',
                        justifyContent: 'center', marginTop: 10, alignSelf: 'flex-start', marginRight: 10
                    }}>
                        <TextInput style={{ color: 'black', width: '100%', paddingLeft: 5, textAlign: 'left', paddingRight: 35, height: 35, marginTop: 4, marginLeft: 4 }}
                            placeholder={'Search'}
                            value={"" + this.state.txtsrch + ""}
                            maxLength={20}
                            onChangeText={(text) => { this.setState({ txtsrch: text }) }}
                        ></TextInput>
                        <TouchableOpacity onPress={() => { this.cross_click() }} style={{ width: 20, height: 20, justifyContent: 'center', alignSelf: 'center', position: 'absolute', right: 10 }}>
                            <Image resizeMode="contain" style={{ width: 30, height: 30, alignSelf: 'center', }} source={localimag.cross}></Image>
                        </TouchableOpacity>
                    </View>
                </View>}
                <View style={{ width: mobileW * 100 / 100, paddingBottom: mobileH * 9 / 100, marginTop: 10 }}>
                    <FlatList
                        data={demoArray1}
                        showsVerticalScrollIndicator={false}
                        renderItem={({ item, index }) => {
                            return (
                                <View style={{ flexDirection: 'row', elevation: 15, backgroundColor: '#FFFFFF', width: windowWidth * 90 / 100, height: windowHeight * 16 / 100, alignItems: 'center', justifyContent: 'flex-start', alignSelf: 'center', borderRadius: 15, marginBottom: 10, marginTop: 5, shadowColor: '#000000', shadowOffset: { width: 2, height: 2, }, shadowOpacity: 0.20 }}>
                                    <View style={{ width: mobileW * 30 / 100, marginLeft: 5, alignItems: 'center', justifyContent: 'center' }}>
                                        <Image resizeMode="cover" style={{ width: mobileW * 25 / 100, height: mobileW * 25 / 100, borderRadius: 100 }} source={item.title}></Image>
                                    </View>
                                    <View style={{ width: mobileW * 50 / 100, marginLeft: 5, height: mobileH * 11 / 100, marginTop: 15 }}>
                                        <Text numberOfLines={1} style={{ fontSize: mobileW * 4.2 / 100, fontFamily: Font.bold }}>{item.name}</Text>
                                        <Text numberOfLines={1} style={{ fontSize: mobileW * 3 / 100, fontFamily: Font.bold, }}>{item.message}</Text>
                                        <Text numberOfLines={1} style={{ fontSize: mobileW * 2.9 / 100, fontFamily: Font.regular, color: Colors.textColor }}>{item.degree}</Text>
                                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: mobileW * 48 / 100, marginTop: 5, }}>
                                            <TouchableOpacity activeOpacity={1} style={{ alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: Colors.theme_color, borderRadius: 5, width: mobileW * 22 / 100, padding: 1 }}>
                                                <Text style={{ fontFamily: Font.bold, fontSize: mobileW * 3 / 100 }}>Reject</Text>
                                            </TouchableOpacity>
                                            <TouchableOpacity activeOpacity={1} onPress={() => { this.props.navigation.navigate('Chat') }} style={{ alignItems: 'center', justifyContent: 'center', backgroundColor: Colors.theme_color, borderRadius: 5, width: mobileW * 22 / 100, padding: 1 }}>
                                                <Text style={{ color: Colors.purewhite, fontSize: mobileW * 3 / 100, fontFamily: Font.bold }}>Accept</Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                </View>
                            )
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
        fontSize: windowWidth * 4.2 / 100,
        letterSpacing: 0.5
    },
});


