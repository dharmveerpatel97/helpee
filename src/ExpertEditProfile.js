import React, { Component } from 'react'
import { Text, View, TouchableOpacity, SafeAreaView, TextInput, Alert, Modal, FlatList, Dimensions, StatusBar, Image, ScrollView, BackHandler, StyleSheet, Keyboard } from 'react-native'
import { config, Otpprovider, Mapprovider, apifuntion, Colors, Font, validation, mobileH, mobileW, SocialLogin, Cameragallery, mediaprovider, localStorage, Lang_chg, consolepro, msgProvider, msgTitle, msgText, Currentltlg } from './Providers/utilslib/Utils'
import { localimag } from './Providers/Localimageprovider/Localimage'
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
import { firebaseprovider } from './Providers/FirebaseProvider'
import Footer from './Providers/Footer';
import Footerr from './Providers/Footerr';
import HideWithKeyboard from 'react-native-hide-with-keyboard';
export default class ExpertEditProfile extends Component {
    constructor(props) {
        super(props)
        this.state = {
            fname: '',
            lname: '',
            mobile: '',
            email: '',
            education: 'Education',
            about: 'About',
            imagepath: 'NA',
            mediamodal: false,
            edit: 0,
            speciality_id: '',
            speciality_name: 'Select Your Speciality',
            speciality_arr: 'NA',
            speciality_arr1: 'NA',
            specialitydata: [],
            speciality_id_arr: [],
            speciality_name_arr: [],
            speciality_name_string: 'Select Your Speciality',
            paypal_id: '',
            onCross: false,
            showSearch: false,
            txtsrch: '',
            showImage: false,
            specialist: false,
            footer_image: null,
        }
    }
    backpress = () => {
        this.props.navigation.goBack();
    }

    successMessage = () => {
        Alert.alert(
            "Information Message",
            "Your profile has been updated successfully",
            [
                { text: "OK", onPress: () => { { this.props.navigation.navigate('Setting'); } } }
            ],
            { cancelable: false }
        );
    }
    backpress = () => {
        this.props.navigation.goBack();
    }
    componentDidMount = () => {
        this.props.navigation.addListener('focus', () => {
            this.getProfileData();
        });
    }

    //--------------------------------------------------//

    setSpeciality_id(speciality_id, speciality_name) {
        consolepro.consolelog('hi', speciality_id)
        this.setState({ speciality_id: speciality_id, speciality_name: speciality_name });
    }

    //-------------------------------------------------//

    getProfileData = async () => {
        let user_details = await localStorage.getItemObject('user_arr');
        consolepro.consolelog('user_detailhere', user_details)
        let fname = user_details.f_name;
        let lname = user_details.l_name;
        let mobile = user_details.mobile;
        let email = user_details.email;
        let speciality_id = user_details.speciality_id;
        var speciality_id_arr = speciality_id.split(',');
        this.setState({ specialitydata: speciality_id_arr, footer_image: user_details.image });
        consolepro.consolelog('specialitydata', this.state.specialitydata)
        let education = user_details.education;
        let speciality_name = user_details.speciality_name;
        let image = user_details.image;
        let about = user_details.about;
        let paypal_id = user_details.paypal_id;

        consolepro.consolelog('imagewe', image)
        if (user_details != 'NA' && user_details != null) {
            this.setState({ fname: fname, lname: lname, mobile: mobile, email: email, speciality_name: speciality_name, speciality_id: speciality_id, paypal_id: paypal_id });
        }
        if (image != null && image != "") {
            this.setState({ imagepath: config.img_url3 + image });
            consolepro.consolelog('imagepath1', this.state.imagepath)
        } else {
            consolepro.consolelog('imagepath2', this.state.imagepath)
            this.setState({ imagepath: 'NA' });
        }
        if (education != null) {
            this.setState({ education: education });
        } else {
            this.setState({ education: "NA" });
        }
        if (about != null) {
            this.setState({ about: about });
        } else {
            this.setState({ about: "NA" });
        }
        this.get_Speciality();
    }
    //---------------------------------------------------//
    Camerapopen = async () => {
        mediaprovider.launchCamera(false).then((res) => {
            console.log('camerares', res)
            this.setState({ mediamodal: false, imagepath: res.path, edit: 1 })
        }).catch((error) => {
            this.setState({ mediamodal: false, edit: 0 })
        })
    }
    Galleryopen = () => {
        mediaprovider.launchGellery(false).then((res) => {
            console.log('camerares', res)
            this.setState({ imagepath: res.path, mediamodal: false, edit: 1 })
        }).catch((error) => {
            this.setState({ mediamodal: false, edit: 0 })
        })
    }
    //------------------------------------------------------//

    get_Speciality = async () => {
        consolepro.consolelog('get_Speciality');
        let specialitydata = this.state.specialitydata;
        let user_details = await localStorage.getItemObject('user_arr');
        consolepro.consolelog('user_details_ba', user_details);
        let url = config.baseURL + "getSpecialityList.php?user_id=" + user_details.user_id;
        consolepro.consolelog(url)
        apifuntion.getApi(url,1).then((obj) => {
            consolepro.consolelog('obj', obj)
            if (obj.success == "true") {
                this.setState({ speciality_arr: obj.speciality_arr, speciality_arr1: obj.speciality_arr })
                localStorage.setItemObject('speciality_arr', obj.speciality_arr);
                if (specialitydata != null) {
                    for (var i = 0; i < specialitydata.length; i++) {
                        let findindex = obj.speciality_arr.findIndex(x => x.speciality_id == specialitydata[i])
                        consolepro.consolelog("findindex", findindex);
                        if (findindex >= 0) {
                            this.addItem(obj.speciality_arr[findindex], findindex)
                        }
                    }
                }
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
            this.setState({ refresh: false });
        });
    }

    //------------------************--------------------//

    ExpertEditProfile = async () => {
        consolepro.consolelog('ExpertEditProfile');
        let user_details = await localStorage.getItemObject('user_arr');
        consolepro.consolelog('user_details', user_details);
        let fname = this.state.fname;
        let lname = this.state.lname;
        let mobile = this.state.mobile;
        let email = this.state.email;
        let about = this.state.about;
        let paypal_id = this.state.paypal_id;
        let education = this.state.education;
        let speciality_id = this.state.speciality_id_arr;
        if (fname.length <= 0) {
            msgProvider.toast(msgText.emptyFirstName[config.language], 'top')
            return false;
        }
        if (lname.length <= 0) {
            msgProvider.toast(msgText.emptyLastName[config.language], 'top')
            return false;
        }
        if (mobile.length <= 0) {
            msgProvider.toast(msgText.emptyPhone[config.language], 'top')
            return false;
        }
        if (mobile.length < 6) {
            msgProvider.toast(msgText.minimumPhoneLength[config.language], 'top')
            return false;
        }
        if (mobile.length > 16) {
            msgProvider.toast(msgText.maximumPhoneLength[config.language], 'top')
            return false;
        }
        if (email.length <= 0) {
            msgProvider.toast(msgText.emptyEmail[config.language], 'top')
            return false;
        }
        const regg = /^([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;
        if (regg.test(email) !== true) {
            msgProvider.toast(msgText.validEmail[config.language], 'top')
            return false;
        }
        if (education.length <= 0) {
            msgProvider.toast(msgText.emptyEducation[config.language], 'top')
            return false;
        }
        if (speciality_id == 0) {
            msgProvider.toast(msgText.emptySpeciality[config.language], 'top')
            return false;
        }
        if (about.length <= 0) {
            msgProvider.toast(msgText.emptyAbout[config.language], 'top')
            return false;
        }
        let url = config.baseURL + "expert_edit_profile.php";
        consolepro.consolelog('url', url)
        let data = new FormData();
        data.append('user_id', user_details.user_id)
        data.append('f_name', fname)
        data.append('l_name', lname)
        data.append('mobile', mobile)
        data.append('email', email)
        data.append('description', education)
        data.append('speciality_id', JSON.stringify(speciality_id))
        data.append('about_me', about)
        data.append('paypal_id', paypal_id)
        data.append('edit', this.state.edit)
        if (this.state.edit == 1) {
            data.append('file', {
                uri: this.state.imagepath,
                type: 'image/jpg', // or photo.type
                name: 'image.jpg'
            })
        }
        consolepro.consolelog('data1', data)
        apifuntion.postApi(url, data).then((obj) => {
            if (obj.success == 'true') {
                consolepro.consolelog('truew', obj)
                localStorage.setItemObject('user_arr', obj.user_details);
                this.successMessage();
                setTimeout(() => {
                    firebaseprovider.firebaseUserCreate();
                }, 1500);
            } else {
                consolepro.consolelog('false')
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

    //------------------------------------------------------//

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

    addItem = async (item, index) => {
        console.log('addItem')
        let data = this.state.speciality_arr
        console.log('addItem2', data)
        let data2 = this.state.speciality_id_arr
        let data3 = this.state.speciality_name_arr
        console.log('addItem3', data2)
        data[index].status = !data[index].status
        console.log('addItem4')
        let findindex = data2.indexOf(item.speciality_id);
        if (data[index].status == true) {
            data2.splice(index, 0, item.speciality_id);
            data3.splice(index, 0, item.name)
        } else {
            data2.splice(findindex, 1)
            data3.splice(findindex, 1)
        }
        this.setState({ speciality_arr: data, speciality_id_arr: data2, speciality_name_arr: data3 })
        let speciality_name_string = this.state.speciality_name_arr.join(",")
        this.setState({ speciality_name_string: speciality_name_string })
    }

    //--------------------************----------------------//
    render() {
        return (
            <View style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
                <SafeAreaView style={{ flex: 0, backgroundColor: Colors.theme_color }} />
                <Cameragallery mediamodal={this.state.mediamodal} Camerapopen={() => { this.Camerapopen() }}
                    Galleryopen={() => { this.Galleryopen() }} Canclemedia={() => { this.setState({ mediamodal: false }) }} />
                <StatusBar backgroundColor={Colors.theme_color} barStyle='default' hidden={false} translucent={false}
                    networkActivityIndicatorVisible={true} />
                <Modal
                    animationType="slide"
                    transparent
                    visible={this.state.specialist}
                    onRequestClose={() => {
                        this.setState({ specialist: false })
                    }}>
                    <View style={{ flex: 1, backgroundColor: '#FFFFFF',paddingTop: 40 }}>
                        <View style={{ justifyContent: 'space-between', flexDirection: 'row', width: mobileW * 90 / 100, alignItems: 'center', height: mobileH * 10 / 100, alignSelf: 'center' }}>
                            <TouchableOpacity activeOpacity={1} onPress={() => { this.setState({ specialist: false }) }}>
                                <Image resizeMode="contain" style={{ width: 30, height: 30 }} source={localimag.back}></Image>
                            </TouchableOpacity>
                            <Text style={{ fontSize: mobileW * 5 / 100, fontFamily: Font.medium }}>Choose Your Specialities</Text>
                            <View style={{ justifyContent: 'center', marginTop: 5 }}>
                                <Text onPress={() => { this.setState({ specialist: false }); }} style={{ fontFamily: Font.bold, fontSize: mobileW * 3.8 / 100 }}>Done</Text>
                            </View>
                        </View>
                        <TouchableOpacity activeOpacity={1}
                            style={{ height: mobileH * 7 / 100, width: mobileW * 88 / 100, alignSelf: 'center', borderRadius: 10, borderWidth: 2, borderColor: Colors.theme_color, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', }}>
                            <View style={{ justifyContent: 'center', alignItems: 'center', marginLeft: 8 }}>
                                <Image source={localimag.blue_search} style={{ width: mobileW * 12 / 100, height: mobileW * 5 / 100, resizeMode: 'contain' }}></Image>
                            </View>
                            <TextInput
                            
                                value={"" + this.state.txtsrch + ""}
                                maxLength={250}
                                multiline={true}
                                returnType="done"
                                returnKeyType="done"
                                onChangeText={(text) => { this.SearchFilterFunction(text) }}
                                onSubmitEditing={() => { Keyboard.dismiss() }}
                                style={{ fontFamily: Font.regular, marginLeft: 2, width: mobileW * 75 / 100, fontSize: mobileW * 3.8 / 100, fontWeight: 'bold', height: mobileH * 6 / 100, }}
                                placeholder=""
                                keyboardType={'default'}
                                placeholderTextColor={Colors.text_color}
                            />
                            <TouchableOpacity onPress={() => { this.cross_click() }} style={{ width: 20, height: 20, justifyContent: 'center', alignSelf: 'center', position: 'absolute', right: 10 }}>
                                <Image resizeMode="contain" style={{ width: 25, height: 25, alignSelf: 'center', }} source={localimag.cancel}></Image>
                            </TouchableOpacity>
                        </TouchableOpacity>
                        <View style={{ marginTop: mobileW * 5 / 100 }}>
                            {this.state.speciality_arr == 'NA' && <Image resizeMode="contain" style={{ width: '100%', height: '60%', marginTop: 0 }} source={localimag.nodataFound}></Image>}
                            {this.state.speciality_arr != 'NA' &&
                                <FlatList
                                    data={this.state.speciality_arr}
                                    showsVerticalScrollIndicator={false}
                                    contentContainerStyle={{paddingBottom:mobileW*20/100}}
                                    renderItem={({ item, index }) => {
                                        return (
                                            <TouchableOpacity onPress={() => { this.addItem(item, index); }} style={{ width: mobileW * 100 / 100, height: mobileH * 8 / 100, alignItems: 'center', justifyContent: 'flex-start', alignSelf: 'center', }}>
                                                <View style={{ width: mobileW * 90 / 100, alignItems: 'center', justifyContent: 'flex-start', borderBottomWidth: 1, borderBottomColor: '#EDEDED', flexDirection: 'row' }}>
                                                    <Image source={{ uri: config.img_url3 + item.image }} style={{ width: mobileW * 5 / 100, height: mobileW * 5 / 100, resizeMode: 'contain' }}></Image>
                                                    <View style={{ justifyContent: 'center', width: mobileW * 80 / 100 }}>
                                                        <Text style={{ fontFamily: Font.medium, fontSize: mobileW * 4 / 100, marginLeft: 6 }}> {item.name}</Text>
                                                    </View>
                                                    {item.status == false && <View style={{ borderColor: Colors.theme_color, borderWidth: 1, width: mobileW * 5 / 100, height: mobileW * 5 / 100, marginBottom: 4 }}></View>}
                                                    {item.status == true && <Image style={{ width: mobileW * 6 / 100, height: mobileW * 6 / 100, }} source={localimag.checksignup}></Image>}
                                                </View>
                                            </TouchableOpacity>)
                                    }}
                                    keyExtractor={(item, index) => index.toString()}>
                                </FlatList>}
                        </View>
                    </View>
                </Modal>

                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 90 }}>
                    <View style={{ paddingBottom: 80 }}>
                        <View style={styles.setingsHeader}>
                            <TouchableOpacity activeOpacity={0.9} onPress={() => { this.backpress() }}>
                                <Image resizeMode="contain" style={{ width: 35, height: 35 }} source={localimag.back}></Image>
                            </TouchableOpacity>
                            <Text style={styles.OrderHistoryTitle}>Edit Profile</Text>
                            <View style={{ width: mobileW * 5 / 100 }}></View>
                        </View>
                        <View style={{ position: 'absolute', top: mobileW * 11 / 100, left: mobileW * 35 / 100, alignItems: 'center', }}>
                            <Image resizeMode="cover" style={{ width: mobileW * 30 / 100, height: mobileW * 30 / 100, borderRadius: 100 }} source={this.state.imagepath == 'NA' ? localimag.default : { uri: this.state.imagepath }}></Image>
                        </View>
                        <TouchableOpacity onPress={() => { this.setState({ mediamodal: true }) }}
                            style={{ position: 'absolute', top: mobileW * 30 / 100, left: mobileW * 59 / 100, alignItems: 'center', backgroundColor: Colors.purewhite, alignItems: 'center', justifyContent: 'center', borderRadius: 100, borderWidth: 2, borderColor: Colors.theme_color, height: mobileW * 9.5 / 100, width: mobileW * 9.5 / 100 }}>
                            <Image resizeMode="contain" style={{ width: mobileW * 4.5 / 100, height: mobileW * 4.5 / 100, }} source={localimag.camerablue}></Image>
                        </TouchableOpacity>
                        <View style={{ flexDirection: 'row', marginTop: mobileW * 3 / 100, height: mobileH * 7 / 100, width: mobileW * 84 / 100, alignSelf: 'center', borderRadius: 10, borderWidth: 2, borderColor: Colors.theme_color }}>
                            <TextInput
                                onChangeText={text => { this.setState({ fname: text }) }}
                                value={"" + this.state.fname + ""}
                                maxLength={50}
                                returnType="done"
                                returnKeyType="done"
                                onSubmitEditing={() => { Keyboard.dismiss() }}
                                style={{ fontFamily: Font.bold, marginLeft: 10, width: mobileW * 80 / 100, fontSize: mobileW * 4.2 / 100, height: mobileH * 6 / 100, }}
                                placeholder="First Name"
                                keyboardType={'default'}
                                placeholderTextColor={Colors.textColor}
                            />
                        </View>
                        <View style={{ flexDirection: 'row', marginTop: mobileW * 3 / 100, height: mobileH * 7 / 100, width: mobileW * 84 / 100, alignSelf: 'center', borderRadius: 10, borderWidth: 2, borderColor: Colors.theme_color }}>
                            <TextInput
                                onChangeText={text => { this.setState({ lname: text }) }}
                                value={"" + this.state.lname + ""}
                                maxLength={50}
                                returnType="done"
                                returnKeyType="done"
                                onSubmitEditing={() => { Keyboard.dismiss() }}
                                style={{ fontFamily: Font.bold, marginLeft: 10, width: mobileW * 80 / 100, fontSize: mobileW * 4.2 / 100, height: mobileH * 6 / 100, }}
                                placeholder="Last Name"
                                keyboardType={'default'}
                                placeholderTextColor={Colors.textColor}
                            />
                        </View>
                        <View style={{ flexDirection: 'row', marginTop: mobileW * 3 / 100, height: mobileH * 7 / 100, width: mobileW * 84 / 100, alignSelf: 'center', borderRadius: 10, borderWidth: 2, borderColor: Colors.theme_color }}>
                            <TextInput
                                onChangeText={text => { this.setState({ mobile: text }) }}
                                value={"" + this.state.mobile + ""}
                                maxLength={16}
                                returnType="done"
                                returnKeyType="done"
                                onSubmitEditing={() => { Keyboard.dismiss() }}
                                style={{ fontFamily: Font.bold, marginLeft: 10, width: mobileW * 80 / 100, fontSize: mobileW * 4.2 / 100, height: mobileH * 6 / 100, }}
                                placeholder="Mobile Number"
                                keyboardType={'number-pad'}
                                placeholderTextColor={Colors.textColor}
                            />
                        </View>
                        <View style={{ flexDirection: 'row', marginTop: mobileW * 3 / 100, height: mobileH * 7 / 100, width: mobileW * 84 / 100, alignSelf: 'center', borderRadius: 10, borderWidth: 2, borderColor: Colors.theme_color }}>
                            <TextInput
                                onChangeText={text => { this.setState({ email: text }) }}
                                value={"" + this.state.email + ""}
                                maxLength={50}
                                editable={false}
                                returnType="done"
                                returnKeyType="done"
                                onSubmitEditing={() => { Keyboard.dismiss() }}
                                style={{ fontFamily: Font.bold, marginLeft: 10, width: mobileW * 80 / 100, fontSize: mobileW * 4.2 / 100, height: mobileH * 6 / 100, }}
                                placeholder="Email"
                                keyboardType={'default'}
                                placeholderTextColor={Colors.textColor}
                            />
                        </View>
                        <View style={{ flexDirection: 'row', marginTop: mobileW * 3 / 100, height: mobileH * 7 / 100, width: mobileW * 84 / 100, alignSelf: 'center', borderRadius: 10, borderWidth: 2, borderColor: Colors.theme_color }}>
                            <TextInput
                                onChangeText={text => { this.setState({ education: text }) }}
                                value={"" + this.state.education + ""}
                                maxLength={50}
                                returnType="done"
                                returnKeyType="done"
                                onSubmitEditing={() => { Keyboard.dismiss() }}
                                style={{ fontFamily: Font.bold, marginLeft: 10, width: mobileW * 80 / 100, fontSize: mobileW * 4.2 / 100, height: mobileH * 6 / 100, }}
                                placeholder="Education"
                                keyboardType={'default'}
                                placeholderTextColor={Colors.textColor}
                            />
                        </View>
                        {/* <View style={{ flexDirection: 'row', marginTop: mobileW * 3 / 100, height: mobileH * 7 / 100, width: mobileW * 84 / 100, alignSelf: 'center', borderRadius: 10, borderWidth: 2, borderColor: Colors.theme_color }}>
                            <TextInput
                                onChangeText={text => { this.setState({ specaility: text }) }}
                                value={"" + this.state.specaility + ""}
                                maxLength={50}
                                returnType="done"
                                returnKeyType="done"
                                onSubmitEditing={() => { Keyboard.dismiss() }}
                                style={{ fontFamily: Font.bold, marginLeft: 10, width: mobileW * 80 / 100, fontSize: mobileW * 4.2 / 100, height: mobileH * 6 / 100, }}
                                placeholder="Specialities"
                                keyboardType={'default'}
                                placeholderTextColor={Colors.textColor}
                            />
                        </View> */}
                        <TouchableOpacity activeOpacity={1} onPress={() => { this.setState({ specialist: true }) }} style={{ flexDirection: 'row', borderWidth: 2, borderColor: Colors.line_color, width: mobileW * 84 / 100, height: mobileH * 7 / 100, borderRadius: 12, alignSelf: 'center', justifyContent: 'center', marginTop: 12, alignItems: 'center' }}>
                            <Text numberOfLines={1} style={{ fontFamily: Font.bold, width: mobileW * 68 / 100, fontSize: mobileW * 4.2 / 100, }}>{this.state.speciality_name_string != 'Select Your Speciality' ? this.state.speciality_name_string : this.state.speciality_name}</Text>
                            <View activeOpacity={1} style={{ width: mobileW * 8 / 100 }}>
                                <Image style={{ width: mobileW * 5 / 100, height: mobileH * 6.2 / 100, }} resizeMode={'contain'} source={localimag.dropdown}></Image>
                            </View>
                        </TouchableOpacity>
                        <View style={{ flexDirection: 'row', marginTop: mobileW * 3 / 100, height: mobileH * 20 / 100, width: mobileW * 84 / 100, alignSelf: 'center', borderRadius: 10, borderWidth: 2, borderColor: Colors.theme_color }}>
                            <TextInput
                                onChangeText={text => { this.setState({ about: text }) }}
                                value={"" + this.state.about + ""}
                                maxLength={250}
                                multiline={true}
                                returnType="done"
                                returnKeyType="done"
                                onSubmitEditing={() => { Keyboard.dismiss() }}
                                style={{ fontFamily: Font.bold, marginLeft: 10, width: mobileW * 80 / 100, fontSize: mobileW * 4.2 / 100, height: mobileH * 20 / 100, textAlignVertical: 'top' }}
                                placeholder="About"
                                keyboardType={'default'}
                                placeholderTextColor={Colors.textColor}
                            />
                        </View>
                        <View style={{ flexDirection: 'row', marginTop: mobileW * 3 / 100, height: mobileH * 7 / 100, width: mobileW * 84 / 100, alignSelf: 'center', borderRadius: 10, borderWidth: 2, borderColor: Colors.theme_color }}>
                            <TextInput
                                onChangeText={text => { this.setState({ paypal_id: text }) }}
                                value={"" + this.state.paypal_id + ""}
                                maxLength={50}
                                returnType="done"
                                returnKeyType="done"
                                onSubmitEditing={() => { Keyboard.dismiss() }}
                                style={{ fontFamily: Font.bold, marginLeft: 10, width: mobileW * 80 / 100, fontSize: mobileW * 4.2 / 100, height: mobileH * 6 / 100, }}
                                placeholder="PayPal Id"
                                keyboardType={'default'}
                                placeholderTextColor={Colors.textColor}
                            />
                        </View>
                        <View style={{ marginTop: windowHeight * 5 / 100, width: mobileW * 90 / 100, height: mobileH * 10 / 100, borderRadius: 15, alignItems: 'center', justifyContent: 'center', alignSelf: 'center', }}>
                            <TouchableOpacity activeOpacity={1} style={{ width: mobileW * 90 / 100, height: mobileH * 6 / 100, backgroundColor: Colors.theme_color, elevation: 4, borderRadius: 35, alignItems: 'center', justifyContent: 'center', alignSelf: 'center', shadowColor: '#000000', shadowOffset: { width: 2, height: 2, }, shadowOpacity: 0.30 }}
                                onPress={() => { this.ExpertEditProfile(); }}>
                                <Text style={{ fontSize: mobileW * 4 / 100, fontFamily: Font.bold, color: Colors.purewhite }}>Submit</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>
                <Footerr
                    activepage="ExpertProfile"
                    usertype={1}
                    footerpage={[
                        { name: 'ExpertHome', countshow: false, image: localimag.home, activeimage: localimag.home, round: 'no' },

                        { name: 'AssignClasses', countshow: false, image: localimag.classes, activeimage: localimag.classes, round: 'no' },

                        { name: 'Notification', countshow: false, image: (this.state.count_noti > 0) ? localimag.bell_red : localimag.bell1, activeimage: (this.state.count_noti > 0) ? localimag.bell_red : localimag.bell1 },
                        { name: 'RatingReview', countshow: false, image: localimag.person1, activeimage: localimag.person1, round: 'no' },

                        { name: 'ExpertProfile', countshow: false, image: this.state.footer_image == null ? localimag.default : { uri: config.img_url3 + this.state.footer_image }, activeimage: this.state.footer_image == null ? localimag.default : { uri: config.img_url3 + this.state.footer_image }, round: 'yes' },
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
        paddingTop: 0,
        paddingBottom: 140,
        alignItems: 'center'
    },
    OrderHistoryTitle: {
        color: Colors.white_color,
        fontFamily: Font.bold,
        fontSize: windowWidth * 5.2 / 100,
        letterSpacing: 0.5,
    },
});


