import React, { Component } from 'react'
import { Text, View, TouchableOpacity, SafeAreaView, Dimensions, StatusBar, TextInput, ImageBackground, Image, ScrollView, FlatList, BackHandler, StyleSheet, Keyboard } from 'react-native'
import { config, Otpprovider, Mapprovider, apifuntion, Colors, Font, validation, mobileH, mobileW, SocialLogin, Cameragallery, mediaprovider, localStorage, Lang_chg, consolepro, msgProvider, msgTitle, msgText, Currentltlg } from './Providers/utilslib/Utils'
import { localimag } from './Providers/Localimageprovider/Localimage'
import HideWithKeyboard from 'react-native-hide-with-keyboard';
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

import Footer from './Providers/Footer';
export default class Category extends Component {
    constructor(props) {
        super(props)
        this.state = {
            starCount: 4,
            speciality_id: '',
            speciality_name: 'Select Your Speciality',
            speciality_arr: 'NA',
            speciality_arr1: 'NA',
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
    //---------------------------------------------------//

    backpress = () => {
        this.props.navigation.goBack();
    }
    cross_click = async () => {
        // await this.SearchFilterFunction('');
        this.setState({ showSearch: false })
    }

    //--------------------------------------------------//

    componentDidMount() {
        this.props.navigation.addListener('focus', () => {
            this.get_Speciality();
        });
    }

    //-------------------------------------------------//

    setSpeciality_id(speciality_id, speciality_name) {
        consolepro.consolelog('hi', speciality_id)
        this.setState({ speciality_id: speciality_id, speciality_name: speciality_name });
    }

    //-------------------------------------------------//

    SearchFilterFunction = (text) => {
        consolepro.consolelog('SearchFilterFunction')
        if (this.state.onCross == false) {
            this.setState({ txtsrch: text })
            //passing the inserted text in textinput
            consolepro.consolelog('test1', this.state.speciality_arr)
            let data1 = this.state.speciality_arr1
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
                    this.setState({ speciality_arr: newData })
                } else if (newData.length <= 0) {
                    this.setState({ speciality_arr: 'NA' })
                }
            }
        } else {
            this.search.clear();
            this.setState({ speciality_arr: this.state.speciality_arr1, onCross: false });
        }
    }
    cross_click = async () => {
        await this.SearchFilterFunction('');
        this.setState({ showSearch: false })
    }

    //------------------------------------------------//

    get_Speciality = async () => {
        consolepro.consolelog('get_Speciality');
        let user_details = await localStorage.getItemObject('user_arr');
        consolepro.consolelog('user_details_ba', user_details);
        let url = config.baseURL + "getSpecialityList.php?user_id=" + 0;
        consolepro.consolelog(url)
        apifuntion.getApi(url).then((obj) => {
            consolepro.consolelog('obj', obj)
            if (obj.success == "true") {
                this.setState({ speciality_arr: obj.speciality_arr, speciality_arr1: obj.speciality_arr })
                localStorage.setItemObject('speciality_arr', obj.speciality_arr);
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

    navigatePage(pagename) {
        this.props.navigation.navigate(pagename);
    }

    //--------------------------------------------------------//

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
                    <Text style={styles.OrderHistoryTitle}>Categories</Text>
                    <TouchableOpacity activeOpacity={0.9} onPress={() => { this.setState({ showSearch: true }) }}>
                        <Image resizeMode="contain" style={{ width: 30, height: 30 }} source={localimag.search}></Image>
                    </TouchableOpacity>
                </View>}
                {this.state.showSearch == true && 
                <View style={{ flexDirection: 'row', backgroundColor: Colors.theme_color, alignItems: 'center', justifyContent: 'space-between',paddingBottom:9,paddingTop:6 }}>
                    <TouchableOpacity onPress={() => { this.props.navigation.goBack() }} style={{ width: windowWidth * 10 / 100,  alignItems: 'center', justifyContent: 'center', marginLeft: 10 }}>
                        <Image source={localimag.back}
                            style={{ height: windowWidth * 8 / 100, resizeMode: 'contain', }}>
                        </Image>
                    </TouchableOpacity>
                    <View style={{ width: '76%', backgroundColor: '#F2F2F2', borderColor: 'gray', borderRadius: 40, marginRight: 10,flexDirection:'row',justifyContent:'space-between',alignItems:'center'}}>
                        <TextInput
                            // onChangeText={text => { this.setState({ txtsrch: text }) }}
                            value={"" + this.state.txtsrch + ""}
                            maxLength={250}
                            multiline={true}
                            returnType="done"
                            returnKeyType="done"
                            onChangeText={(text) => { this.SearchFilterFunction(text) }}
                            onSubmitEditing={() => { Keyboard.dismiss() }}
                            style={{height:windowWidth * 10 / 100,marginLeft:5,width:windowWidth * 75/ 100,textAlignVertical:'center',marginTop:7}}
                            placeholder="Search"
                            keyboardType={'default'}
                            placeholderTextColor={Colors.text_color}
                        />
                        <TouchableOpacity onPress={() => { this.cross_click() }} style={{ width: 20, height: 20, justifyContent: 'center', alignSelf: 'center', position: 'absolute', right: 10 }}>
                            <Image resizeMode="contain" style={{ width: 30, height: 30, alignSelf: 'center', }} source={localimag.cross}></Image>
                        </TouchableOpacity>
                    </View>
                </View>}
                <View style={{ width: mobileW * 100 / 100, paddingBottom: 70 }}>
                    {this.state.speciality_arr == 'NA' && <View style={{ alignItems: 'center', justifyContent: 'center', height: '100%' }}><Image resizeMode='contain' style={{ width: '50%', height: '50%', }} source={localimag.nodataFound}></Image></View>}
                    {this.state.speciality_arr != 'NA' &&
                        <FlatList
                            data={this.state.speciality_arr}
                            numColumns={3}
                            contentContainerStyle={{ paddingBottom: 80 }}
                            showsHorizontalScrollIndicator={false}
                            showsVerticalScrollIndicator={false}
                            renderItem={({ item, index }) => {
                                return (
                                    <TouchableOpacity activeOpacity={1} onPress={() => {
                                        this.props.navigation.navigate('FraternityList', { speciality_id: item.speciality_id, specialist_name: item.name });
                                        consolepro.consolelog('Rock', item.speciality_id);
                                        localStorage.setItemObject('speciality_id', item.speciality_id)
                                    }} style={{ alignItems: 'center', justifyContent: 'center', }} >
                                        <View style={{ backgroundColor: Colors.theme_color, marginTop: 20, marginLeft: 10, height: mobileW * 30 / 100, width: mobileW * 30 / 100, alignItems: 'center', justifyContent: 'center', borderRadius: 10 }}>
                                            <Image resizeMode="contain" style={{ width: mobileW * 25 / 100, height: mobileW * 25 / 100, }} source={{ uri: config.img_url3 + item.image }}></Image>
                                        </View>
                                        <View style={{ marginTop: 8, marginBottom: 12, width: mobileW * 25 / 100, alignItems: 'center' }}>
                                            <Text numberOfLines={1} style={{ fontSize: mobileW * 4 / 100, fontFamily: Font.bold }}>{item.name}</Text>
                                        </View>
                                    </TouchableOpacity>
                                )
                            }}
                            keyExtractor={(item, index) => index.toString()}>
                        </FlatList>
                    }
                </View>
                <HideWithKeyboard>
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
                </HideWithKeyboard>
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
        height: windowWidth * 15 / 100,
        alignItems: 'center'
    },
    OrderHistoryTitle: {
        color: Colors.white_color,
        fontFamily: Font.regular,
        fontSize: windowWidth * 5.2 / 100,
        letterSpacing: 0.5
    },
});


