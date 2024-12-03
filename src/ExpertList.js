import React, { Component } from 'react'
import { Text, View, TouchableOpacity, SafeAreaView, Dimensions, StatusBar, ImageBackground, TextInput, Image, ScrollView, FlatList, BackHandler, StyleSheet, Keyboard } from 'react-native'
import { config, Otpprovider, Mapprovider, apifuntion, Colors, Font, validation, mobileH, mobileW, SocialLogin, Cameragallery, mediaprovider, localStorage, Lang_chg, consolepro, msgProvider, msgTitle, msgText, Currentltlg } from './Providers/utilslib/Utils'
import { localimag } from './Providers/Localimageprovider/Localimage'
import StarRating from 'react-native-star-rating';
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
import Footer from './Providers/Footer';
export default class ExpertList extends Component {
    constructor(props) {
        super(props)
        this.state = {
            content_2: '',
            starCount: 4,
            expert_arr: 'NA',
            expert_arr1: 'NA',
            onCross: false,
            showSearch: false,
            txtsrch: '',
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

    backpress = () => {
        this.props.navigation.goBack();
    }
    cross_click = async () => {
        //await this.SearchFilterFunction('');
        this.setState({ showSearch: false })
    }
    componentDidMount = () => {
        this.getExpertList();
    }

    //----------------------------------------------------------//

    SearchFilterFunction = (text) => {
        consolepro.consolelog('SearchFilterFunction')
        if (this.state.onCross == false) {
            this.setState({ txtsrch: text })
            //passing the inserted text in textinput
            consolepro.consolelog('test1', this.state.expert_arr)
            let data1 = this.state.expert_arr1
            if (data1 != 'NA') {
                consolepro.consolelog('test2')
                const newData = data1.filter(function (item) {
                    consolepro.consolelog('myitem', item)
                    //applying filter for the inserted text in search bar
                    const itemData = item.name ? item.name.toUpperCase() : ''.toUpperCase();
                    const textData = text.toUpperCase();
                    return itemData.indexOf(textData) > -1;
                });
                consolepro.consolelog('new data', newData)
                if (newData.length > 0) {
                    this.setState({ expert_arr: newData })
                } else if (newData.length <= 0) {
                    this.setState({ expert_arr: 'NA' })
                }
            }
        } else {
            this.search.clear();
            this.setState({ expert_arr: this.state.expert_arr1, onCross: false });
        }
    }
    cross_click = async () => {
        await this.SearchFilterFunction('');
        this.setState({ showSearch: false })
    }

    //-----------------------************-----------------------//

    getExpertList = async () => {
        consolepro.consolelog('getExpertList');
        let user_details = await localStorage.getItemObject('user_arr');
        consolepro.consolelog('user_details_ba', user_details);
        if (user_details != null) {
            this.setState({ user_id: user_details.user_id });
        } else {
            this.setState({ user_id: 0 });
        }
        let url = config.baseURL + "getWholeExpertList.php?user_id=" + this.state.user_id;
        consolepro.consolelog(url)
        apifuntion.getApi(url).then((obj) => {
            consolepro.consolelog('obj', obj)
            if (obj.success == "true") {
                this.setState({ expert_arr: obj.expert_arr, expert_arr1: obj.expert_arr })
                localStorage.setItemObject('expert_arr', obj.expert_arr);
                consolepro.consolelog('expert_arr', this.state.expert_arr)
            } else {
                if (obj.active_status == 'deactivate') {
                    config.checkUserDeactivate(this.props.navigation);
                    return false;
                }
                msgProvider.alert(msgTitle.information[config.language], obj.msg[config.language], false);
                return false;
            }
        }).catch((error) => {
            consolepro.consolelog("-------- error ------- " + error);
        });
    }

    //------------------------------------------------------------------//

    render() {
        return (
            <View style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
                <SafeAreaView style={{ flex: 0, backgroundColor: Colors.theme_color }} />
                <StatusBar backgroundColor={Colors.theme_color} barStyle='default' hidden={false} translucent={false}
                    networkActivityIndicatorVisible={true} />
                {this.state.showSearch == false && <View style={styles.setingsHeader}>
                    <TouchableOpacity activeOpacity={0.9} onPress={() => { this.backpress() }}>
                        <Image resizeMode="contain" style={{ width: 30, height: 30 }} source={localimag.back}></Image>
                    </TouchableOpacity>
                    <Text style={styles.OrderHistoryTitle}>Experts List</Text>
                    <TouchableOpacity activeOpacity={0.9} onPress={() => { this.setState({ showSearch: true }) }}>
                        <Image resizeMode="contain" style={{ width: 30, height: 30 }} source={localimag.search}></Image>
                    </TouchableOpacity>
                </View>}
                {this.state.showSearch == true && <View style={{ flexDirection: 'row', backgroundColor: Colors.theme_color, alignItems: 'center', justifyContent: 'space-between', height: windowWidth * 15.2 / 100 }}>
                    <View style={{ width: '86%', backgroundColor: '#F2F2F2', borderColor: 'gray', borderRadius: 40, alignItems: 'center', justifyContent: 'center', marginTop: 10, alignSelf: 'flex-start', marginRight: 10, marginLeft: 25 }}>
                        <TextInput style={{ color: 'black', width: '100%', paddingLeft: 15, textAlign: 'left', paddingRight: 35, height: 38, marginTop: 4, marginLeft: 4 }}
                            placeholder={'Search'}
                            value={"" + this.state.txtsrch + ""}
                            onChangeText={text => { this.setState({ txtsrch: text }) }}
                            value={"" + this.state.txtsrch + ""}
                            maxLength={20}
                            onChangeText={(text) => { this.SearchFilterFunction(text) }}
                        ></TextInput>
                        <TouchableOpacity onPress={() => { this.cross_click() }} style={{ width: 20, height: 20, justifyContent: 'center', alignSelf: 'center', position: 'absolute', right: 10 }}>
                            <Image resizeMode="contain" style={{ width: 30, height: 30, alignSelf: 'center', }} source={localimag.cross}></Image>
                        </TouchableOpacity>
                    </View>
                </View>}
                <View style={{ width: mobileW * 100 / 100, paddingBottom: 60 }}>
                    {this.state.expert_arr == 'NA' && <View style={{ alignItems: 'center', justifyContent: 'center', height: '100%' }}><Image resizeMode="contain" style={{ width: '50%', height: '50%', }} source={localimag.nodataFound}></Image></View>}
                    {this.state.expert_arr != 'NA' &&
                        <FlatList
                            data={this.state.expert_arr}
                            contentContainerStyle={{ paddingBottom: 80 }}
                            showsVerticalScrollIndicator={false}
                            renderItem={({ item, index }) => {
                                return (
                                    <TouchableOpacity onPress={() => {
                                        this.props.navigation.navigate('ExpertDetails', { other_user_id: item.user_id });
                                        // localStorage.setItemObject('user_id', item.user_id)
                                    }} style={{ flexDirection: 'row', elevation: 8, backgroundColor: Colors.purewhite, width: windowWidth * 100 / 100, height: windowHeight * 20 / 100, alignItems: 'center', justifyContent: 'flex-start', alignSelf: 'center', marginTop: 8, shadowColor: '#000000', shadowOffset: { width: 2, height: 2, }, shadowOpacity: 0.20 }}>
                                        <View style={{ width: mobileW * 30 / 100, marginLeft: 15, alignItems: 'center', justifyContent: 'center' }}>
                                            <Image resizeMode="cover" style={{ width: mobileW * 28 / 100, height: mobileW * 28 / 100, borderRadius: 100 }} source={item.image == null ? localimag.default : { uri: config.img_url3 + item.image }}></Image>
                                        </View>
                                        <View style={{ width: mobileW * 40 / 100, marginLeft: 5, }}>
                                            <Text numberOfLines={1} style={{ fontSize: mobileW * 4 / 100, fontFamily: Font.bold }}>{item.name}</Text>
                                            <Text numberOfLines={1} style={{ fontSize: mobileW * 3.1 / 100, fontFamily: Font.medium, color: Colors.grey }}>{item.speciality_name}</Text>
                                            <Text numberOfLines={1} style={{ fontSize: mobileW * 3.1 / 100, fontFamily: Font.medium, color: Colors.grey }}>{item.description}</Text>
                                            <Text numberOfLines={1} style={{ fontSize: mobileW * 3.1 / 100, fontFamily: Font.medium, color: Colors.grey }}>{item.satisfied_customer} satisfied Customer</Text>
                                        </View>
                                        <View style={{ width: mobileW * 25 / 100, marginRight: 14, height: mobileW * 18 / 100, alignItems: 'flex-end' }}>
                                            <View style={{ flexDirection: 'row', alignItems: 'center', width: mobileW * 25 / 100, }}>
                                                <StarRating
                                                    containerStyle={{ width: windowWidth * 16 / 100, height: windowHeight * 3 / 100, alignSelf: 'center', justifyContent: 'center', alignItems: 'center' }}
                                                    fullStar={localimag.star}
                                                    emptyStar={localimag.stargrey}
                                                    halfStarColor={'#FFC815'}
                                                    disabled={true}
                                                    maxStars={5}
                                                    starSize={mobileW * 3.2 / 100}
                                                    rating={item.rating == null ? '0' : item.rating}
                                                />
                                                <Text style={{ color: Colors.theme_color, fontSize: mobileW * 3.2 / 100 }}>({item.rating == null ? '0' : parseFloat(item.rating).toFixed(1)})</Text>
                                            </View>
                                            <TouchableOpacity activeOpacity={1} onPress={() => {
                                                this.props.navigation.navigate('ExpertDetails',
                                                    { other_user_id: item.user_id }
                                                );
                                            }}
                                                style={{ marginTop: mobileW * 5.5 / 100, alignItems: 'center', justifyContent: 'center', backgroundColor: Colors.theme_color, padding: 4, borderRadius: 8, width: mobileW * 15 / 100, marginRight: 12 }}>
                                                <Text style={{ color: Colors.purewhite, fontSize: mobileW * 3 / 100 }}>Ask Now</Text>
                                            </TouchableOpacity>
                                        </View>
                                    </TouchableOpacity>
                                )
                            }}
                            keyExtractor={(item, index) => index.toString()}>
                        </FlatList>}
                </View>
                <Footer
                    activepage='Home'
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


