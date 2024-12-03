import React, { Component } from 'react';
import { Text, View, Image, TextInput, StyleSheet, ScrollView, Switch, Modal, TouchableOpacity, Dimensions, Alert, FlatList, BackHandler } from 'react-native';
import { Colors, mobileW } from './utilslib/Utils'
import { config } from './configProvider';
import { localimag } from './Localimageprovider/Localimage'
import { firebaseprovider } from './FirebaseProvider';
import firebase from '../Config1';
import Firebase from 'firebase';



import { localStorage } from './localStorageProvider';
import { msgProvider, msgTitle, msgText } from './Messageconsolevalidationprovider/messageProvider';
const screenHeight = Math.round(Dimensions.get('window').height);
const screenWidth = Math.round(Dimensions.get('window').width);
export default class Footer extends Component {
    constructor(props) {
        super(props)
        this.state = {
            color: '',
            modalVisible1: false,
            loading: false,
            isConnected: true,
        }
        BackHandler.removeEventListener('hardwareBackPress',
            () => { return true });
    }
    componentDidMount() {
        firebaseprovider.firebaseUserGetInboxCount()
        // firebaseprovider.messagecountforfooter()
    }

    LoginPopup = () => {
        Alert.alert(
            'Information Message',
            'Please signup first', [{
                text: 'Cancel',
                onPress: () => console.log('Cancel button Pressed'),
                style: 'cancel'
            }, {
                text: 'Ok',
                onPress: () => {
                    {
                        this.props.navigation.navigate('Signup')
                    }
                }
            }], {
            cancelable: false
        }
        ); // works best when the goBack is async
        return true;
    }


    getMyInboxAllData1 = async () => {
        console.log('getMyInboxAllData');
        userdata = await localStorage.getItemObject('user_arr')
        //------------------------------ firbase code get user inbox ---------------
        if (userdata != null) {
            // alert("himanshu");
            var id = 'u_' + userdata.user_id;
            if (inboxoffcheck > 0) {
                console.log('getMyInboxAllDatainboxoffcheck');
                var queryOffinbox = firebase.database().ref('users/' + id + '/myInbox/').child(userChatIdGlobal);
                queryOffinbox.off('child_added');
                queryOffinbox.off('child_changed');
            }

            var queryUpdatemyinbox = firebase.database().ref('users/' + id + '/myInbox/');
            queryUpdatemyinbox.on('child_changed', (data) => {
                console.log('inboxkachildchange', data.toJSON())

                firebaseprovider.firebaseUserGetInboxCount()
                setTimeout(() => { this.setState({ countinbox: count_inbox }) }, 2000);

                //  this.getalldata(currentLatlong)
            })
            var queryUpdatemyinboxadded = firebase.database().ref('users/' + id + '/myInbox/');
            queryUpdatemyinboxadded.on('child_added', (data) => {
                console.log('inboxkaadded', data.toJSON())
                firebaseprovider.firebaseUserGetInboxCount()
                setTimeout(() => { this.setState({ countinbox: count_inbox }) }, 2000);

                // firebaseprovider.firebaseUserGetInboxCount();
            })

        }
    }

    usercheckbtn = async (page) => {

        this.props.functionremove
        firebaseprovider.firebaseUserGetInboxCount()
        const navigation = this.props.navigation;
        let userdata = await localStorage.getItemObject('user_arr')
        console.log('userdata', userdata)

        if (page == 'Home') {
            if (userdata == null) {
                localStorage.setItemString('guest_user', 'yes');
            } else {
                localStorage.setItemString('guest_user', 'no');
            }
            navigation.navigate('Home');
        } else {
            let guest_user = await localStorage.getItemString('guest_user');
            if (guest_user == 'yes') {
                navigation.navigate('Login');
                // this.LoginPopup();
            } else {
                if (userdata != null) {
                    if (userdata.user_type==1) {
                        navigation.navigate(page)
                    } else {
                        if (userdata.user_type==1) {
                            navigation.navigate('Login');
                        }
                     else if (userdata.profile_complete == 0 && userdata.otp_verify == 1 && userdata.user_type==1) {
                            for (let i = 0; i < this.props.footerpage.length; i++) {
                                if (page == this.props.footerpage[i].name) {
                                    navigation.navigate(page)
                                }
                            }
                        } else {
                            // this.LoginPopup();
                            navigation.navigate('Signup');
                        }
                    }
                } else {
                    // this.LoginPopup();
                    navigation.navigate('Signup');
                }
            }
        }
    }

    render() {
        // console.log('foter page count_inbox',count_inbox)
        console.log('this.props.color', this.props.color + '/n')
        const navigation = this.props.navigation;
        // count_inbox=this.props.count_inbox;
        let footerwidth = parseInt(100 / this.props.footerpage.length)
        return (
            <View style={[style1.footercontainer, { backgroundColor: this.props.imagestyle1.backgroundColor }]}>
                {/* <Loader loading={this.state.loading}/> */}
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={this.state.modalVisible1}
                    onRequestClose={() => {
                        this.setState({ modalVisible1: false });
                    }}
                >
                    <TouchableOpacity style={{ flex: 1, backgroundColor: '#00000040', justifyContent: 'center', alignItems: 'center' }} onPress={() => { this.setState({ modalVisible1: false }) }}>
                        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', alignSelf: 'center', width: screenWidth * 100 / 100, alignContent: 'center' }}>
                            <View style={{ backgroundColor: '#FFFFFF', paddingHorizontal: 20, paddingTop: 15, alignContent: 'center', alignItems: 'center', elevation: 5, borderRadius: 5, width: screenWidth * 80 / 100, }}>
                                <View style={{ position: 'absolute', left: -13, top: -13, }}>
                                    <TouchableOpacity style={{ backgroundColor: 'white', borderRadius: 30, alignSelf: 'center', justifyContent: 'center', alignItems: 'center' }} onPress={() => { this.setState({ modalVisible1: false }) }}>
                                        {/* <Icon1 name='circle-with-cross' size={25} color={Colors.buttoncolor}  style={{alignSelf:'center',padding:1.5,paddingBottom:0}}/> */}
                                    </TouchableOpacity>
                                </View>

                                <Text style={{ fontWeight: 'bold', fontSize: 16, color: 'black', alignSelf: 'flex-start' }}>information</Text>
                                <Text style={{ fontFamily: 'Poppins-Light', color: 'grey', fontSize: 15, paddingTop: 13, lineHeight: 22, alignSelf: 'center' }}>Please login first</Text>
                                <View style={{ backgroundColor: Colors.buttoncolor, marginVertical: 20, width: '95%', borderRadius: 40 }}>
                                    <TouchableOpacity activeOpacity={0.9} onPress={() => { this.setState({ modalVisible1: false }); this.props.navigation.navigate('Userlogin') }}>
                                        <Text style={{ textAlign: 'center', paddingVertical: 13, color: '#FFFFFF', fontFamily: 'Poppins-SemiBold', fontSize: 13.5, letterSpacing: 1 }}>Login</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    </TouchableOpacity>
                </Modal>

                <FlatList
                    data={this.props.footerpage}
                    //horizontal={true}
                    scrollEnabled={false}
                    numColumns={this.props.footerpage.length}
                    renderItem={({ item, index }) => {
                        console.log('index', index)
                        return (

                            <View style={{ width: screenWidth * footerwidth / 100, alignSelf: 'center', alignItems: 'center' }}>
                                {item.name == this.props.activepage ? <TouchableOpacity activeOpacity={0.8} style={style1.footericon} onPress={() => { this.usercheckbtn(item.name) }}>
                                    {
                                        (index != 4) ? <View style={{ justifyContent: 'center', alignItems: "center" }}>
                                            <Image source={item.activeimage} resizeMethod='resize' style={[style1.footerimagee, {
                                                width: mobileW * 8 / 100,
                                                height: mobileW * 8 / 100, alignSelf: 'center',
                                                borderRadius: (mobileW * 8 / 100) / 2,
                                                resizeMode: 'cover'
                                            }]} /><View style={{
                                                backgroundColor: Colors.theme_color, width: mobileW * 6 / 100, height: mobileW * 1.5 / 100, borderRadius: 5, marginTop: -7
                                            }}></View>
                                        </View>
                                            :
                                            <View style={{ justifyContent: 'center', alignItems: "center" }}>
                                                <Image source={item.activeimage} resizeMethod='resize' style={[style1.footerimagee, {
                                                    width: mobileW * 6 / 100,
                                                    height: mobileW * 6 / 100, alignSelf: 'center',
                                                    borderRadius: (mobileW * 6 / 100) / 2,
                                                    resizeMode: 'cover'
                                                }]} /><View style={{
                                                    backgroundColor: Colors.theme_color, width: mobileW * 6 / 100, height: mobileW * 1.5 / 100, borderRadius: 5,
                                                }}></View>
                                            </View>
                                    }
                                </TouchableOpacity> :
                                    <TouchableOpacity activeOpacity={0.8} style={[style1.footericon]} onPress={() => { this.usercheckbtn(item.name) }}>
                                        {
                                            (index != 4) ?
                                                <View style={style1.footericonview}>
                                                    <Image source={item.image} resizeMethod='resize' style={[style1.footerimagee, {
                                                        width: mobileW * 9 / 100,
                                                        height: mobileW * 9 / 100, alignSelf: 'center',
                                                        borderRadius: (mobileW * 9 / 100) / 2,
                                                        resizeMode: 'cover', marginBottom: 4
                                                    }]} />
                                                    {item.countshow != false && <View style={{ position: 'absolute', top: 3, right: 4, alignItems: 'center', justifyContent: 'center' }}>
                                                        <View style={{ alignSelf: 'center', width: 6, height: 6, borderRadius: 35, backgroundColor: this.props.imagestyle1.countbackground, justifyContent: 'center', alignContent: 'center', alignItems: 'center' }}>
                                                        </View>
                                                    </View>}
                                                </View>
                                                :
                                                <View style={style1.footericonview}>
                                                    <Image source={item.image} resizeMethod='resize' style={[style1.footerimagee, {
                                                        width: mobileW * 7 / 100,
                                                        height: mobileW * 7 / 100, alignSelf: 'center',
                                                        borderRadius: (mobileW * 7 / 100) / 2,
                                                        resizeMode: 'cover',
                                                    }]} />
                                                    {item.countshow != false && <View style={{ position: 'absolute', top: 3, right: 4, alignItems: 'center', justifyContent: 'center' }}>
                                                        <View style={{ alignSelf: 'center', width: 6, height: 6, borderRadius: 35, backgroundColor: this.props.imagestyle1.countbackground, justifyContent: 'center', alignContent: 'center', alignItems: 'center' }}>
                                                        </View>
                                                    </View>}
                                                </View>
                                        }
                                    </TouchableOpacity>
                                }
                            </View>
                        )
                    }
                    }
                />


            </View >

        )
    }
}
const style1 = StyleSheet.create({

    footercontainer: {
        flexDirection: 'row',
        width: screenWidth * 100 / 100,
        justifyContent: 'center',
        alignSelf: 'center',
        alignItems: 'center',
        alignContent: 'center',
        backgroundColor: '#e6e6e6',
        position: 'absolute',
        elevation: 20,
        bottom: 0,
        height: screenHeight * 7 / 100
    },
    footericon: {
        width: screenWidth * 28 / 100,
        paddingTop: 2,
        paddingBottom: 6,
        width: mobileW * 14 / 100
    },
    footericonview: {
        alignSelf: 'center',
        paddingVertical: 7,

    },
    footertext: {
        color: 'gray',
        fontSize: 13,
        fontFamily: 'Piazzolla-Light'
    },
    footerimage: {
        alignSelf: 'center',
        // borderRadius:35,
        resizeMode: 'cover',
    },
    footerimagee: {
        alignSelf: 'center',
        borderRadius: 35,
        resizeMode: 'cover',
        marginBottom: mobileW * 1.5 / 100
    }

})