import React, { Component } from 'react'
import { Text, View, TouchableOpacity, SafeAreaView, FlatList, Dimensions, StatusBar, Image, ScrollView, BackHandler, StyleSheet } from 'react-native'
import { config, Otpprovider, Mapprovider, apifuntion, Colors, Font, validation, mobileH, mobileW, SocialLogin, Cameragallery, mediaprovider, localStorage, Lang_chg, consolepro, msgProvider, msgTitle, msgText, Currentltlg } from './Providers/utilslib/Utils'
import { localimag } from './Providers/Localimageprovider/Localimage'
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
const demoArray1 = [
    { title: '#565434678655467746', amount: '$50', time: 'Today 8:20 PM' },
    { title: '#565434678655467746', amount: '$60', time: 'Today 8:20 PM' },
    { title: '#565434678655467746', amount: '$60', time: 'Today 8:20 PM' },
    { title: '#565434678655467746', amount: '$40', time: 'Today 8:20 PM' },
    { title: '#565434678655467746', amount: '$40', time: 'Today 8:20 PM' },
    { title: '#565434678655467746', amount: '$40', time: 'Today 8:20 PM' },
    { title: '#565434678655467746', amount: '$40', time: 'Today 8:20 PM' },
    { title: '#565434678655467746', amount: '$40', time: 'Today 8:20 PM' },
    { title: '#565434678655467746', amount: '$40', time: 'Today 8:20 PM' },
    { title: '#565434678655467746', amount: '$90', time: 'Today 8:20 PM' },
];
export default class Wallet extends Component {
    constructor(props) {
        super(props)
        this.state = {
        }
    }
    backpress = () => {
        this.props.navigation.goBack();
    }
    // componentDidMount = () => {
    //     this.get_term_condition();
    // }

    //--------------------------------------------------------//

    render() {
        return (
            <View style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
                <SafeAreaView style={{ flex: 0, backgroundColor: Colors.theme_color }} />
                <StatusBar backgroundColor={Colors.theme_color} barStyle='default' hidden={false} translucent={false}
                    networkActivityIndicatorVisible={true} />
                <View style={styles.setingsHeader}>
                    <TouchableOpacity activeOpacity={0.9} onPress={() => { this.backpress() }}>
                        <Image resizeMode="contain" style={{ width: 25, height: 30 }} source={localimag.back}></Image>
                    </TouchableOpacity>
                    <Text style={styles.OrderHistoryTitle}>Wallet</Text>
                    <Text style={{ width: 25 }}></Text>
                </View>
                <View style={{ alignItems: 'center', justifyContent: 'flex-start', paddingTop: 15, paddingBottom: 10, }}>
                    <Text style={{ fontFamily: Font.bold, fontSize: mobileW * 5.5 / 100 }}>$600</Text>
                    <Text style={{ fontFamily: Font.bold, fontSize: mobileW * 4.2 / 100, color: Colors.textColor }}>Wallet Amount Balance</Text>
                </View>
                <View style={{ width: mobileW * 100 / 100, paddingBottom: 140 }}>
                    <FlatList
                        data={demoArray1}
                        showsVerticalScrollIndicator={false}
                        renderItem={({ item, index }) => {
                            return (
                                <View style={{ marginTop: 20, flexDirection: 'row', width: windowWidth * 100 / 100, height: windowHeight * 7 / 100, alignItems: 'center', justifyContent: 'center', alignSelf: 'center', borderBottomWidth: 0.6, }}>
                                    <View style={{ width: mobileW * 84 / 100, alignSelf: 'center' }}>
                                        <Text style={{ fontSize: mobileW * 4 / 100, fontFamily: Font.bold }}>{item.title}</Text>
                                        <Text style={{ fontSize: mobileW * 3 / 100, fontFamily: Font.regular }}>{item.time}</Text>
                                    </View>
                                    <Text style={{ fontSize: mobileW * 4 / 100, fontFamily: Font.bold, marginRight: 4 }}>{item.amount}</Text>
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
        paddingTop: 10,
        paddingBottom: 20,
        alignItems: 'center'
    },
    OrderHistoryTitle: {
        color: Colors.white_color,
        fontFamily: Font.medium,
        fontSize: windowWidth * 5.2 / 100,
        letterSpacing: 0.5,
    },
});


