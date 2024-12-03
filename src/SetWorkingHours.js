import React, { Component } from 'react'
import { Text, View, TouchableOpacity, SafeAreaView, Dimensions, Switch, Alert, StatusBar, Image, ScrollView, FlatList, BackHandler, StyleSheet } from 'react-native'
import { config, Otpprovider, Mapprovider, apifuntion, Colors, Font, validation, mobileH, mobileW, SocialLogin, Cameragallery, mediaprovider, localStorage, Lang_chg, consolepro, msgProvider, msgTitle, msgText, Currentltlg } from './Providers/utilslib/Utils'
import { localimag } from './Providers/Localimageprovider/Localimage'
import DatePicker from 'react-native-datepicker';
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
import Footer from './Providers/Footer';
import Footerr from './Providers/Footerr';
import HideWithKeyboard from 'react-native-hide-with-keyboard';
export default class SetWorkingHours extends Component {
    _didFocusSubscription;
    _willBlurSubscription;
    constructor(props) {
        super(props)
        this.state = {
            content_2: '',
            notification: false,
            notification1: false,
            notification2: false,
            notification3: false,
            notification4: false,
            notification5: false,
            notification6: false,
            time1: '09:00 AM',
            time2: '07:00 PM',
            time3: '09:00 AM',
            time4: '07:00 PM',
            time5: '09:00 AM',
            time6: '07:00 PM',
            time7: '09:00 AM',
            time8: '07:00 PM',
            time9: '09:00 AM',
            time10: '07:00 PM',
            time11: '09:00 AM',
            time12: '07:00 PM',
            timeend: '07:00 PM',
            timestart: '09:00 AM',
            availability_arr: [
                {
                    days: 'Sunday',
                    status: '0',
                    start_time: '',
                    end_time: ''
                },
                {
                    days: 'Monday',
                    status: '0',
                    start_time: '',
                    end_time: ''
                },
                {
                    days: 'Tuesday',
                    status: '0',
                    start_time: '',
                    end_time: ''
                },
                {
                    days: 'Wednesday',
                    status: '0',
                    start_time: '',
                    end_time: ''
                },
                {
                    days: 'Thursday',
                    status: '0',
                    start_time: '',
                    end_time: ''
                },
                {
                    days: 'Friday',
                    status: '0',
                    start_time: '',
                    end_time: ''
                },
                {
                    days: 'Saturday',
                    status: '0',
                    start_time: '',
                    end_time: ''
                },
            ]
        }
        this._didFocusSubscription = props.navigation.addListener('focus', payload =>
            BackHandler.addEventListener('hardwareBackPress', this.handleBackPress)
        );
    }
    backpress = () => {
        this.props.navigation.goBack();
    }

    componentDidMount = () => {
        this._willBlurSubscription = this.props.navigation.addListener('blur', payload =>
            BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress)
        );
    }

    handleBackPress = () => {
        Alert.alert(
            'Exit App ',
            'Do you want to exit the App', [{
                text: 'No',
                onPress: () => consolepro.consolelog('Cancel button Pressed'),
                style: 'cancel'
            }, {
                text: 'Yes',
                onPress: () => {
                    {
                        this.props.navigation.navigate('Login');
                        //BackHandler.exitApp();
                    }
                }
            }], {
            cancelable: false
        }
        ); // works best when the goBack is async
        return true;
    };

    pushData(days) {
        let availability_arr = this.state.availability_arr;
        var index = availability_arr.findIndex(x => x.days == days);
        console.log("index", index);
        if (index >= 0) {
            availability_arr[index].status = 1;
        }
        this.setState({ availability_arr: availability_arr })
    }

    setAvailability = async () => {
        consolepro.consolelog('setAvailability');
        let user_id = await localStorage.getItemString('user_id');

        let availability_arr = [];
        if (this.state.notification == false && this.state.notification1 == false && this.state.notification2 == false && this.state.notification3 == false && this.state.notification4 == false && this.state.notification5 == false && this.state.notification6 == false) {
            msgProvider.toast(msgText.emptyAvailability[config.language], 'top')
            return false;
        }
        if (this.state.notification != false) {
            consolepro.consolelog('this.state.timestart', this.state.timestart)
            consolepro.consolelog('this.state.timeend', this.state.timeend)
            if (this.state.timestart == '' && this.state.timeend == '') {
                msgProvider.toast(msgText.endTimeError[config.language], 'top')
                return false;
            }
            let value1 = this.state.timestart.split(" ");
            consolepro.consolelog('value1', value1);
            let value2 = this.state.timeend.split(" ");
            consolepro.consolelog('value2', value2);

            if(value1[1] == 'AM')
            {
                value1[0] = value1[0]
            }else{
                value1[0] = parseFloat(value1[0])+12

            }

            if(value2[1] == 'AM')
            {
                value2[0] = value2[0]+':00'
            }else{
                value2[0] = parseFloat(value2[0])+12+':00'

            }

            // if (value1[0] == "" || value1[0] == 'NA') {
            //     msgProvider.toast(msgText.startTimeError[config.language], 'top')
            //     return false;
            // }
            // if (value2[0] == "" || value2[0] == 'NA') {
            //     msgProvider.toast(msgText.endTimeErrorr[config.language], 'top')
            //     return false;
            // }
            // if (value1[0] > value2[0]) {
            //     msgProvider.toast(msgText.endTimeError[config.language], 'top')
            //     return false;
            // }
            let local_data = {
                days: 'Sunday',
                status: 1,
                start_time: value1[0],
                end_time: value2[0],
            }
            availability_arr.push(local_data);
            consolepro.consolelog('availability_arr1', availability_arr)
        } else {
            let local_data = {
                days: 'Sunday',
                status: 0,
                start_time: 'NA',
                end_time: 'NA',
            }
            availability_arr.push(local_data);
            consolepro.consolelog('availability_arr2', availability_arr)
        }
        if (this.state.notification1 != false) {
            let value1 = this.state.time1.split(" ");
            consolepro.consolelog('value1', value1);
            let value2 = this.state.time2.split(" ");
            consolepro.consolelog('value2', value2);

            if(value1[1] == 'AM')
            {
                value1[0] = value1[0]
            }else{
                value1[0] = parseFloat(value1[0])+12

            }

            if(value2[1] == 'AM')
            {
                value2[0] = value2[0]+':00'
            }else{
                value2[0] = parseFloat(value2[0])+12+':00'

            }

            // if (value1[0] == "" || value1[0] == 'NA') {
            //     msgProvider.toast(msgText.startTimeError[config.language], 'top')
            //     return false;
            // }
            // if (value2[0] == "" || value2[0] == 'NA') {
            //     msgProvider.toast(msgText.endTimeErrorr[config.language], 'top')
            //     return false;
            // }
            // if (value1[0] > value2[0]) {
            //     msgProvider.toast(msgText.endTimeError[config.language], 'top')
            //     return false;
            // }
            let local_data = {
                days: 'Monday',
                status: 1,
                start_time: value1[0],
                end_time: value2[0],
            }
            availability_arr.push(local_data);
            consolepro.consolelog('availability_arr1', availability_arr)
        } else {
            let local_data = {
                days: 'Monday',
                status: 0,
                start_time: 'NA',
                end_time: 'NA',
            }
            availability_arr.push(local_data);
            consolepro.consolelog('availability_arr2', availability_arr)
        }
        if (this.state.notification2 != false) {
            let value1 = this.state.time3.split(" ");
            consolepro.consolelog('value1', value1);
            let value2 = this.state.time4.split(" ");
            consolepro.consolelog('value2', value2);

            if(value1[1] == 'AM')
            {
                value1[0] = value1[0]
            }else{
                value1[0] = parseFloat(value1[0])+12

            }

            if(value2[1] == 'AM')
            {
                value2[0] = value2[0]+':00'
            }else{
                value2[0] = parseFloat(value2[0])+12+':00'

            }

            // if (value1[0] == "" || value1[0] == 'NA') {
            //     msgProvider.toast(msgText.startTimeError[config.language], 'top')
            //     return false;
            // }
            // if (value2[0] == "" || value2[0] == 'NA') {
            //     msgProvider.toast(msgText.endTimeErrorr[config.language], 'top')
            //     return false;
            // }
            // if (value1[0] > value2[0]) {
            //     msgProvider.toast(msgText.endTimeError[config.language], 'top')
            //     return false;
            // }
            let local_data = {
                days: 'Tuesday',
                status: 1,
                start_time: value1[0],
                end_time: value2[0],
            }
            availability_arr.push(local_data);
            consolepro.consolelog('availability_arr1', availability_arr)
        } else {
            let local_data = {
                days: 'Tuesday',
                status: 0,
                start_time: 'NA',
                end_time: 'NA',
            }
            availability_arr.push(local_data);
            consolepro.consolelog('availability_arr2', availability_arr)
        }
        if (this.state.notification3 != false) {
            let value1 = this.state.time5.split(" ");
            consolepro.consolelog('value1', value1);
            let value2 = this.state.time6.split(" ");
            consolepro.consolelog('value2', value2);

            if(value1[1] == 'AM')
            {
                value1[0] = value1[0]
            }else{
                value1[0] = parseFloat(value1[0])+12

            }

            if(value2[1] == 'AM')
            {
                value2[0] = value2[0]+':00'
            }else{
                value2[0] = parseFloat(value2[0])+12+':00'

            }

            // if (value1[0] == "" || value1[0] == 'NA') {
            //     msgProvider.toast(msgText.startTimeError[config.language], 'top')
            //     return false;
            // }
            // if (value2[0] == "" || value2[0] == 'NA') {
            //     msgProvider.toast(msgText.endTimeErrorr[config.language], 'top')
            //     return false;
            // }
            // if (value1[0] > value2[0]) {
            //     msgProvider.toast(msgText.endTimeError[config.language], 'top')
            //     return false;
            // }
            let local_data = {
                days: 'Wednesday',
                status: 1,
                start_time: value1[0],
                end_time: value2[0],
            }
            availability_arr.push(local_data);
            consolepro.consolelog('availability_arr1', availability_arr)
        } else {
            let local_data = {
                days: 'Wednesday',
                status: 0,
                start_time: 'NA',
                end_time: 'NA',
            }
            availability_arr.push(local_data);
            consolepro.consolelog('availability_arr2', availability_arr)
        }
        if (this.state.notification4 != false) {
            let value1 = this.state.time7.split(" ");
            consolepro.consolelog('value1', value1);
            let value2 = this.state.time8.split(" ");
            consolepro.consolelog('value2', value2);


            if(value1[1] == 'AM')
            {
                value1[0] = value1[0]
            }else{
                value1[0] = parseFloat(value1[0])+12

            }

            if(value2[1] == 'AM')
            {
                value2[0] = value2[0]+':00'
            }else{
                value2[0] = parseFloat(value2[0])+12+':00'

            }

            // if (value1[0] == "" || value1[0] == 'NA') {
            //     msgProvider.toast(msgText.startTimeError[config.language], 'top')
            //     return false;
            // }
            // if (value2[0] == "" || value2[0] == 'NA') {
            //     msgProvider.toast(msgText.endTimeErrorr[config.language], 'top')
            //     return false;
            // }
            // if (value1[0] > value2[0]) {
            //     msgProvider.toast(msgText.endTimeError[config.language], 'top')
            //     return false;
            // }
            let local_data = {
                days: 'Thursday',
                status: 1,
                start_time: value1[0],
                end_time: value2[0],
            }
            availability_arr.push(local_data);
            consolepro.consolelog('availability_arr1', availability_arr)
        } else {
            let local_data = {
                days: 'Thursday',
                status: 0,
                start_time: 'NA',
                end_time: 'NA',
            }
            availability_arr.push(local_data);
            consolepro.consolelog('availability_arr2', availability_arr)
        }
        if (this.state.notification5 != false) {
            let value1 = this.state.time9.split(" ");
            consolepro.consolelog('value1', value1);
            let value2 = this.state.time10.split(" ");
            consolepro.consolelog('value2', value2);

            if(value1[1] == 'AM')
            {
                value1[0] = value1[0]
            }else{
                value1[0] = parseFloat(value1[0])+12

            }

            if(value2[1] == 'AM')
            {
                value2[0] = value2[0]+':00'
            }else{
                value2[0] = parseFloat(value2[0])+12+':00'

            }

            // if (value1[0] == "" || value1[0] == 'NA') {
            //     msgProvider.toast(msgText.startTimeError[config.language], 'top')
            //     return false;
            // }
            // if (value2[0] == "" || value2[0] == 'NA') {
            //     msgProvider.toast(msgText.endTimeErrorr[config.language], 'top')
            //     return false;
            // }
            // if (value1[0] > value2[0]) {
            //     msgProvider.toast(msgText.endTimeError[config.language], 'top')
            //     return false;
            // }
            let local_data = {
                days: 'Friday',
                status: 1,
                start_time: value1[0],
                end_time: value2[0],
            }
            availability_arr.push(local_data);
            consolepro.consolelog('availability_arr1', availability_arr)
        } else {
            let local_data = {
                days: 'Friday',
                status: 0,
                start_time: 'NA',
                end_time: 'NA',
            }
            availability_arr.push(local_data);
            consolepro.consolelog('availability_arr2', availability_arr)
        }
        if (this.state.notification6 != false) {
            let value1 = this.state.time11.split(" ");
            consolepro.consolelog('value1', value1);
            let value2 = this.state.time12.split(" ");
            consolepro.consolelog('value2', value2);

            if(value1[1] == 'AM')
            {
                value1[0] = value1[0]
            }else{
                value1[0] = parseFloat(value1[0])+12

            }

            if(value2[1] == 'AM')
            {
                value2[0] = value2[0]+':00'
            }else{
                value2[0] = parseFloat(value2[0])+12+':00'

            }
            
            // if (value1[0] == "" || value1[0] == 'NA') {
            //     msgProvider.toast(msgText.startTimeError[config.language], 'top')
            //     return false;
            // }
            // if (value2[0] == "" || value2[0] == 'NA') {
            //     msgProvider.toast(msgText.endTimeErrorr[config.language], 'top')
            //     return false;
            // }
            // if (value1[0] > value2[0]) {
            //     msgProvider.toast(msgText.endTimeError[config.language], 'top')
            //     return false;
            // }
            let local_data = {
                days: 'Saturday',
                status: 1,
                start_time: value1[0],
                end_time: value2[0],
            }
            availability_arr.push(local_data);
            consolepro.consolelog('availability_arr1', availability_arr)
        } else {
            let local_data = {
                days: 'Saturday',
                status: 0,
                start_time: 'NA',
                end_time: 'NA',
            }
            availability_arr.push(local_data);
            consolepro.consolelog('availability_arr2', availability_arr)
        }
        let availability_arr_new = JSON.stringify(availability_arr);
        consolepro.consolelog('availability_arr_new', availability_arr_new)

        let url = config.baseURL + "setAvailability.php";
        consolepro.consolelog('url', url)
        let data = new FormData();
        data.append('user_id', user_id)
        data.append('availability_arr', availability_arr_new)
        consolepro.consolelog('data1', data)
        apifuntion.postApi(url, data).then((obj) => {
            consolepro.consolelog('obj', obj);
            if (obj.success == 'true') {
                consolepro.consolelog('truewwwww', obj)
                this.props.navigation.navigate('AccountApprovedPage');
            } else {
                consolepro.consolelog('falseee')
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

    //----------------------************------------------------//
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
                    <Text style={styles.OrderHistoryTitle}>Set Working Hours</Text>
                    <View style={{ width: mobileW * 10 / 100 }}></View>
                </View>
                <View style={{ height: mobileW * 75 / 100, marginTop: mobileH * 6 / 100, marginLeft: 8 }}>
                    <View style={{ flexDirection: 'row', marginTop: 10, }}>
                        <View style={{ flexDirection: "row", alignItems: 'center', width: "38%", justifyContent: "space-between" }}>
                            <Text style={{ fontSize: mobileW * 4.2 / 100, fontFamily: Font.bold }}>Sunday</Text>
                            <Switch trackColor={{ false: '#E6EDEB', true: '#00aff0' }}
                                thumbColor={Colors.theme_color} ios_backgroundColor='#E6EDEB' onValueChange={(txt) => { this.setState({ notification: txt }); this.pushData('Sunday'); consolepro.consolelog('sunday') }} value={this.state.notification} />
                        </View>
                        {this.state.notification == true && <View style={{ flexDirection: 'row', marginLeft: 6 }}>
                            <View style={{ flexDirection: 'row', borderWidth: 1, borderColor: '#E4E4E4', width: mobileW * 26 / 100, height: mobileH * 3 / 100, alignItems: 'center', justifyContent: 'center', marginLeft: 8 }}>
                                <View style={{ width: mobileW * 2 / 100 }}></View>
                                <DatePicker
                                    style={{ width: 70, }}
                                    date={this.state.timestart}
                                    mode="time"
                                    // format="YYYY-MM-DD"
                                    // minDate="2016-05-01"
                                    // maxDate="2016-06-01"
                                    //showTime = {{ user12hours: true }} 
                                    format="hh:mm A"
                                    confirmBtnText="Confirm"
                                    cancelBtnText="Cancel"
                                    customStyles={{
                                        dateIcon: {
                                            position: 'absolute',
                                            left: 0,
                                            top: 4,
                                            marginLeft: 0,
                                            width: 0,
                                            height: 0,
                                        },
                                        dateInput: {
                                            marginLeft: 0,
                                            borderWidth: 0,
                                        },
                                        dateText: {
                                            fontSize: 12,
                                        }
                                    }}
                                    onDateChange={(timestart) => { this.setState({ timestart: timestart }) }}
                                />
                                <Image resizeMode="contain" style={{ width: 25, height: 10 }} source={localimag.all}></Image>
                            </View>
                            <Text style={{ marginLeft: 4, marginRight: 4, color: '#E4E4E4', fontFamily: Font.medium, fontSize: mobileW * 3 / 100, marginTop: 3 }}>To</Text>
                            <View style={{ flexDirection: 'row', borderWidth: 1, borderColor: '#E4E4E4', width: mobileW * 26 / 100, height: mobileH * 3 / 100, alignItems: 'center', justifyContent: 'center' }}>
                                <View style={{ width: mobileW * 2 / 100 }}></View>
                                <DatePicker
                                    style={{ width: 70, }}
                                    date={this.state.timeend}
                                    mode="time"
                                    // format="YYYY-MM-DD"
                                    // minDate="2016-05-01"
                                    // maxDate="2016-06-01"
                                    format="hh:mm A"
                                    confirmBtnText="Confirm"
                                    cancelBtnText="Cancel"
                                    customStyles={{
                                        dateIcon: {
                                            position: 'absolute',
                                            left: 0,
                                            top: 4,
                                            marginLeft: 0,
                                            width: 0, height: 0
                                        },
                                        dateInput: {
                                            marginLeft: 0,
                                            borderWidth: 0,
                                        },
                                        dateText: {
                                            fontSize: 12,
                                        }
                                    }}
                                    onDateChange={(timeend) => { this.setState({ timeend: timeend }) }}
                                />
                                <Image resizeMode="contain" style={{ width: 25, height: 10 }} source={localimag.all}></Image>
                            </View>
                        </View>}
                    </View>
                    <View style={{ flexDirection: 'row', marginTop: 10 }}>
                        <View style={{ flexDirection: "row", alignItems: 'center', width: "38%", justifyContent: "space-between" }}>
                            <Text style={{ fontSize: mobileW * 4.2 / 100, fontFamily: Font.bold }}>Monday</Text>
                            <Switch trackColor={{ false: '#E6EDEB', true: '#00aff0' }}
                                thumbColor={Colors.theme_color} ios_backgroundColor='#E6EDEB' onValueChange={(txt) => { this.setState({ notification1: txt }); this.pushData('Monday'); consolepro.consolelog('monday') }} value={this.state.notification1} />
                        </View>


                        {this.state.notification1 == true && <View style={{ flexDirection: 'row', marginLeft: 6 }}>
                            <View style={{ flexDirection: 'row', borderWidth: 1, borderColor: '#E4E4E4', width: mobileW * 26 / 100, height: mobileH * 3 / 100, alignItems: 'center', justifyContent: 'center', marginLeft: 8 }}>
                                <View style={{ width: mobileW * 2 / 100 }}></View>
                                <DatePicker
                                    style={{ width: 70, }}
                                    date={this.state.time1}
                                    mode="time"
                                    // format="YYYY-MM-DD"
                                    // minDate="2016-05-01"
                                    // maxDate="2016-06-01"
                                    //showTime = {{ user12hours: true }} 
                                    format="hh:mm A"
                                    confirmBtnText="Confirm"
                                    cancelBtnText="Cancel"
                                    customStyles={{
                                        dateIcon: {
                                            position: 'absolute',
                                            left: 0,
                                            top: 4,
                                            marginLeft: 0,
                                            width: 0,
                                            height: 0,
                                        },
                                        dateInput: {
                                            marginLeft: 0,
                                            borderWidth: 0,
                                        },
                                        dateText: {
                                            fontSize: 12,
                                        }
                                    }}
                                    onDateChange={(time1) => { this.setState({ time1: time1 }) }}
                                />
                                <Image resizeMode="contain" style={{ width: 25, height: 10 }} source={localimag.all}></Image>
                            </View>
                            <Text style={{ marginLeft: 4, marginRight: 4, color: '#E4E4E4', fontFamily: Font.medium, fontSize: mobileW * 3 / 100, marginTop: 3 }}>To</Text>
                            <View style={{ flexDirection: 'row', borderWidth: 1, borderColor: '#E4E4E4', width: mobileW * 26 / 100, height: mobileH * 3 / 100, alignItems: 'center', justifyContent: 'center' }}>
                                <View style={{ width: mobileW * 2 / 100 }}></View>
                                <DatePicker
                                    style={{ width: 70, }}
                                    date={this.state.time2}
                                    mode="time"
                                    // format="YYYY-MM-DD"
                                    // minDate="2016-05-01"
                                    // maxDate="2016-06-01"
                                    format="hh:mm A"
                                    confirmBtnText="Confirm"
                                    cancelBtnText="Cancel"
                                    customStyles={{
                                        dateIcon: {
                                            position: 'absolute',
                                            left: 0,
                                            top: 4,
                                            marginLeft: 0,
                                            width: 0, height: 0
                                        },
                                        dateInput: {
                                            marginLeft: 0,
                                            borderWidth: 0,
                                        },
                                        dateText: {
                                            fontSize: 12,
                                        }
                                    }}
                                    onDateChange={(time2) => { this.setState({ time2: time2 }) }}
                                />
                                <Image resizeMode="contain" style={{ width: 25, height: 10 }} source={localimag.all}></Image>
                            </View>
                        </View>}
                    </View>
                    <View style={{ flexDirection: 'row', marginTop: 10 }}>
                        <View style={{ flexDirection: "row", alignItems: 'center', width: "38%", justifyContent: "space-between" }}>
                            <Text style={{ fontSize: mobileW * 4 / 100, fontFamily: Font.bold }}>Tuesday</Text>
                            <Switch trackColor={{ false: '#E6EDEB', true: '#00aff0' }}
                                thumbColor={Colors.theme_color} ios_backgroundColor="#E6EDEB" onValueChange={(txt) => { this.setState({ notification2: txt }); this.pushData('Tuesday'); consolepro.consolelog('Tuesday') }} value={this.state.notification2} />
                        </View>
                        {this.state.notification2 == true && <View style={{ flexDirection: 'row', marginLeft: 6 }}>
                            <View style={{ flexDirection: 'row', borderWidth: 1, borderColor: '#E4E4E4', width: mobileW * 26 / 100, height: mobileH * 3 / 100, alignItems: 'center', justifyContent: 'center', marginLeft: 8 }}>
                                <View style={{ width: mobileW * 2 / 100 }}></View>
                                <DatePicker
                                    style={{ width: 70, }}
                                    date={this.state.time3}
                                    mode="time"
                                    // format="YYYY-MM-DD"
                                    // minDate="2016-05-01"
                                    // maxDate="2016-06-01"
                                    format="hh:mm A"
                                    confirmBtnText="Confirm"
                                    cancelBtnText="Cancel"
                                    customStyles={{
                                        dateIcon: {
                                            position: 'absolute',
                                            left: 0,
                                            top: 4,
                                            marginLeft: 0,
                                            width: 0, height: 0
                                        },
                                        dateInput: {
                                            marginLeft: 0,
                                            borderWidth: 0,
                                        },
                                        dateText: {
                                            fontSize: 12,
                                        }
                                    }}
                                    onDateChange={(time3) => { this.setState({ time3: time3 }) }}
                                />
                                <Image resizeMode="contain" style={{ width: 25, height: 10 }} source={localimag.all}></Image>
                            </View>
                            <Text style={{ marginLeft: 4, marginRight: 4, color: '#E4E4E4', fontFamily: Font.medium, fontSize: mobileW * 3 / 100, marginTop: 3 }}>To</Text>
                            <View style={{ flexDirection: 'row', borderWidth: 1, borderColor: '#E4E4E4', width: mobileW * 26 / 100, height: mobileH * 3 / 100, alignItems: 'center', justifyContent: 'center' }}>
                                <View style={{ width: mobileW * 2 / 100 }}></View>
                                <DatePicker
                                    style={{ width: 70, }}
                                    date={this.state.time4}
                                    mode="time"
                                    // format="YYYY-MM-DD"
                                    // minDate="2016-05-01"
                                    // maxDate="2016-06-01"
                                    format="hh:mm A"
                                    confirmBtnText="Confirm"
                                    cancelBtnText="Cancel"
                                    customStyles={{
                                        dateIcon: {
                                            position: 'absolute',
                                            left: 0,
                                            top: 4,
                                            marginLeft: 0,
                                            width: 0, height: 0
                                        },
                                        dateInput: {
                                            marginLeft: 0,
                                            borderWidth: 0,
                                        },
                                        dateText: {
                                            fontSize: 12,
                                        }
                                    }}
                                    onDateChange={(time4) => { this.setState({ time4: time4 }) }}
                                />
                                <Image resizeMode="contain" style={{ width: 25, height: 10 }} source={localimag.all}></Image>
                            </View>
                        </View>}
                    </View>
                    <View style={{ flexDirection: 'row', marginTop: 10 }}>
                        <View style={{ flexDirection: "row", alignItems: 'center', width: "38%", justifyContent: "space-between" }}>
                            <Text style={{ fontSize: mobileW * 4 / 100, fontFamily: Font.bold, }}>Wednessday</Text>
                            <Switch trackColor={{ false: '#E6EDEB', true: '#00aff0' }}
                                thumbColor={Colors.theme_color} ios_backgroundColor="#E6EDEB" onValueChange={(txt) => { this.setState({ notification3: txt }); this.pushData("Wednesday"); consolepro.consolelog('wednessday') }} value={this.state.notification3} />
                        </View>
                        {this.state.notification3 == true && <View style={{ flexDirection: 'row', marginLeft: 6 }}>
                            <View style={{ flexDirection: 'row', borderWidth: 1, borderColor: '#E4E4E4', width: mobileW * 26 / 100, height: mobileH * 3 / 100, alignItems: 'center', justifyContent: 'center', marginLeft: 8 }}>
                                <View style={{ width: mobileW * 2 / 100 }}></View>
                                <DatePicker
                                    style={{ width: 70, }}
                                    date={this.state.time5}
                                    mode="time"
                                    // format="YYYY-MM-DD"
                                    // minDate="2016-05-01"
                                    // maxDate="2016-06-01"
                                    format="hh:mm A"
                                    confirmBtnText="Confirm"
                                    cancelBtnText="Cancel"
                                    customStyles={{
                                        dateIcon: {
                                            position: 'absolute',
                                            left: 0,
                                            top: 4,
                                            marginLeft: 0,
                                            width: 0, height: 0
                                        },
                                        dateInput: {
                                            marginLeft: 0,
                                            borderWidth: 0,
                                        },
                                        dateText: {
                                            fontSize: 12,
                                        }
                                    }}
                                    onDateChange={(time5) => { this.setState({ time5: time5 }) }}
                                />
                                <Image resizeMode="contain" style={{ width: 25, height: 10 }} source={localimag.all}></Image>
                            </View>
                            <Text style={{ marginLeft: 4, marginRight: 4, color: '#E4E4E4', fontFamily: Font.medium, fontSize: mobileW * 3 / 100, marginTop: 3 }}>To</Text>
                            <View style={{ flexDirection: 'row', borderWidth: 1, borderColor: '#E4E4E4', width: mobileW * 26 / 100, height: mobileH * 3 / 100, alignItems: 'center', justifyContent: 'center' }}>
                                <View style={{ width: mobileW * 2 / 100 }}></View>
                                <DatePicker
                                    style={{ width: 70, }}
                                    date={this.state.time6}
                                    mode="time"
                                    // format="YYYY-MM-DD"
                                    // minDate="2016-05-01"
                                    // maxDate="2016-06-01"
                                    format="hh:mm A"
                                    confirmBtnText="Confirm"
                                    cancelBtnText="Cancel"
                                    customStyles={{
                                        dateIcon: {
                                            position: 'absolute',
                                            left: 0,
                                            top: 4,
                                            marginLeft: 0,
                                            width: 0, height: 0
                                        },
                                        dateInput: {
                                            marginLeft: 0,
                                            borderWidth: 0,
                                        },
                                        dateText: {
                                            fontSize: 12,
                                        }
                                    }}
                                    onDateChange={(time6) => { this.setState({ time6: time6 }) }}
                                />
                                <Image resizeMode="contain" style={{ width: 25, height: 10 }} source={localimag.all}></Image>
                            </View>
                        </View>}
                    </View>
                    <View style={{ flexDirection: 'row', marginTop: 10 }}>
                        <View style={{ flexDirection: "row", alignItems: 'center', width: "38%", justifyContent: "space-between" }}>
                            <Text style={{ fontSize: mobileW * 4 / 100, fontFamily: Font.bold }}>Thursday</Text>
                            <Switch trackColor={{ false: '#E6EDEB', true: '#00aff0' }}
                                thumbColor={Colors.theme_color} ios_backgroundColor="#E6EDEB" onValueChange={(txt) => { this.setState({ notification4: txt }); this.pushData("Thursday"); consolepro.consolelog('Thursday') }} value={this.state.notification4} />
                        </View>
                        {this.state.notification4 == true && <View style={{ flexDirection: 'row', marginLeft: 6 }}>
                            <View style={{ flexDirection: 'row', borderWidth: 1, borderColor: '#E4E4E4', width: mobileW * 26 / 100, height: mobileH * 3 / 100, alignItems: 'center', justifyContent: 'center', marginLeft: 8 }}>
                                <View style={{ width: mobileW * 2 / 100 }}></View>
                                <DatePicker
                                    style={{ width: 70, }}
                                    date={this.state.time7}
                                    mode="time"
                                    // format="YYYY-MM-DD"
                                    // minDate="2016-05-01"
                                    // maxDate="2016-06-01"
                                    format="hh:mm A"
                                    confirmBtnText="Confirm"
                                    cancelBtnText="Cancel"
                                    customStyles={{
                                        dateIcon: {
                                            position: 'absolute',
                                            left: 0,
                                            top: 4,
                                            marginLeft: 0,
                                            width: 0, height: 0
                                        },
                                        dateInput: {
                                            marginLeft: 0,
                                            borderWidth: 0,
                                        },
                                        dateText: {
                                            fontSize: 12,
                                        }
                                    }}
                                    onDateChange={(time7) => { this.setState({ time7: time7 }) }}
                                />
                                <Image resizeMode="contain" style={{ width: 25, height: 10 }} source={localimag.all}></Image>
                            </View>
                            <Text style={{ marginLeft: 4, marginRight: 4, color: '#E4E4E4', fontFamily: Font.medium, fontSize: mobileW * 3 / 100, marginTop: 3 }}>To</Text>
                            <View style={{ flexDirection: 'row', borderWidth: 1, borderColor: '#E4E4E4', width: mobileW * 26 / 100, height: mobileH * 3 / 100, alignItems: 'center', justifyContent: 'center' }}>
                                <View style={{ width: mobileW * 2 / 100 }}></View>
                                <DatePicker
                                    style={{ width: 70, }}
                                    date={this.state.time8}
                                    mode="time"
                                    // format="YYYY-MM-DD"
                                    // minDate="2016-05-01"
                                    // maxDate="2016-06-01"
                                    format="hh:mm A"
                                    confirmBtnText="Confirm"
                                    cancelBtnText="Cancel"
                                    customStyles={{
                                        dateIcon: {
                                            position: 'absolute',
                                            left: 0,
                                            top: 4,
                                            marginLeft: 0,
                                            width: 0, height: 0
                                        },
                                        dateInput: {
                                            marginLeft: 0,
                                            borderWidth: 0,
                                        },
                                        dateText: {
                                            fontSize: 12,
                                        }
                                    }}
                                    onDateChange={(time8) => { this.setState({ time8: time8 }) }}
                                />
                                <Image resizeMode="contain" style={{ width: 25, height: 10 }} source={localimag.all}></Image>
                            </View>
                        </View>}
                    </View>
                    <View style={{ flexDirection: 'row', marginTop: 10 }}>
                        <View style={{ flexDirection: "row", alignItems: 'center', width: "38%", justifyContent: "space-between" }}>
                            <Text style={{ fontSize: mobileW * 4 / 100, fontFamily: Font.bold }}>Friday</Text>
                            <Switch trackColor={{ false: '#E6EDEB', true: '#00aff0' }}
                                thumbColor={Colors.theme_color} ios_backgroundColor="#E6EDEB" onValueChange={(txt) => { this.setState({ notification5: txt }); this.pushData("Friday"); consolepro.consolelog('Friday') }} value={this.state.notification5} />
                        </View>
                        {this.state.notification5 == true && <View style={{ flexDirection: 'row', marginLeft: 6 }}>
                            <View style={{ flexDirection: 'row', borderWidth: 1, borderColor: '#E4E4E4', width: mobileW * 26 / 100, height: mobileH * 3 / 100, alignItems: 'center', justifyContent: 'center', marginLeft: 8 }}>
                                <View style={{ width: mobileW * 2 / 100 }}></View>
                                <DatePicker
                                    style={{ width: 70, }}
                                    date={this.state.time9}
                                    mode="time"
                                    // format="YYYY-MM-DD"
                                    // minDate="2016-05-01"
                                    // maxDate="2016-06-01"
                                    format="hh:mm A"
                                    confirmBtnText="Confirm"
                                    cancelBtnText="Cancel"
                                    customStyles={{
                                        dateIcon: {
                                            position: 'absolute',
                                            left: 0,
                                            top: 4,
                                            marginLeft: 0,
                                            width: 0, height: 0
                                        },
                                        dateInput: {
                                            marginLeft: 0,
                                            borderWidth: 0,
                                        },
                                        dateText: {
                                            fontSize: 12,
                                        }
                                    }}
                                    onDateChange={(time9) => { this.setState({ time9: time9 }) }}
                                />
                                <Image resizeMode="contain" style={{ width: 25, height: 10 }} source={localimag.all}></Image>
                            </View>
                            <Text style={{ marginLeft: 4, marginRight: 4, color: '#E4E4E4', fontFamily: Font.medium, fontSize: mobileW * 3 / 100, marginTop: 3 }}>To</Text>
                            <View style={{ flexDirection: 'row', borderWidth: 1, borderColor: '#E4E4E4', width: mobileW * 26 / 100, height: mobileH * 3 / 100, alignItems: 'center', justifyContent: 'center' }}>
                                <View style={{ width: mobileW * 2 / 100 }}></View>
                                <DatePicker
                                    style={{ width: 70, }}
                                    date={this.state.time10}
                                    mode="time"
                                    // format="YYYY-MM-DD"
                                    // minDate="2016-05-01"
                                    // maxDate="2016-06-01"
                                    format="hh:mm A"
                                    confirmBtnText="Confirm"
                                    cancelBtnText="Cancel"
                                    customStyles={{
                                        dateIcon: {
                                            position: 'absolute',
                                            left: 0,
                                            top: 4,
                                            marginLeft: 0,
                                            width: 0, height: 0
                                        },
                                        dateInput: {
                                            marginLeft: 0,
                                            borderWidth: 0,
                                        },
                                        dateText: {
                                            fontSize: 12,
                                        }
                                    }}
                                    onDateChange={(time10) => { this.setState({ time10: time10 }) }}
                                />
                                <Image resizeMode="contain" style={{ width: 25, height: 10 }} source={localimag.all}></Image>
                            </View>
                        </View>}
                    </View>
                    <View style={{ flexDirection: 'row', marginTop: 10 }}>
                        <View style={{ flexDirection: "row", alignItems: 'center', width: "38%", justifyContent: "space-between" }}>
                            <Text style={{ fontSize: mobileW * 4 / 100, fontFamily: Font.bold }}>Saturday</Text>
                            <Switch trackColor={{ false: '#E6EDEB', true: '#00aff0' }}
                                thumbColor={Colors.theme_color} ios_backgroundColor="#E6EDEB" onValueChange={(txt) => { this.setState({ notification6: txt }); this.pushData("Saturday"); consolepro.consolelog('saturday') }} value={this.state.notification6} />
                        </View>
                        {this.state.notification6 == true && <View style={{ flexDirection: 'row', marginLeft: 6 }}>
                            <View style={{ flexDirection: 'row', borderWidth: 1, borderColor: '#E4E4E4', width: mobileW * 26 / 100, height: mobileH * 3 / 100, alignItems: 'center', justifyContent: 'center', marginLeft: 8 }}>
                                <View style={{ width: mobileW * 2 / 100 }}></View>
                                <DatePicker
                                    style={{ width: 70, }}
                                    date={this.state.time11}
                                    mode="time"
                                    // format="YYYY-MM-DD"
                                    // minDate="2016-05-01"
                                    // maxDate="2016-06-01"
                                    format="hh:mm A"
                                    confirmBtnText="Confirm"
                                    cancelBtnText="Cancel"
                                    customStyles={{
                                        dateIcon: {
                                            position: 'absolute',
                                            left: 0,
                                            top: 4,
                                            marginLeft: 0,
                                            width: 0, height: 0
                                        },
                                        dateInput: {
                                            marginLeft: 0,
                                            borderWidth: 0,
                                        },
                                        dateText: {
                                            fontSize: 12,
                                        }
                                    }}
                                    onDateChange={(time11) => { this.setState({ time11: time11 }) }}
                                />
                                <Image resizeMode="contain" style={{ width: 25, height: 10 }} source={localimag.all}></Image>
                            </View>
                            <Text style={{ marginLeft: 4, marginRight: 4, color: '#E4E4E4', fontFamily: Font.medium, fontSize: mobileW * 3 / 100, marginTop: 3 }}>To</Text>
                            <View style={{ flexDirection: 'row', borderWidth: 1, borderColor: '#E4E4E4', width: mobileW * 26 / 100, height: mobileH * 3 / 100, alignItems: 'center', justifyContent: 'center' }}>
                                <View style={{ width: mobileW * 2 / 100 }}></View>
                                <DatePicker
                                    style={{ width: 70, }}
                                    date={this.state.time12}
                                    mode="time"
                                    // format="YYYY-MM-DD"
                                    // minDate="2016-05-01"
                                    // maxDate="2016-06-01"
                                    format="hh:mm A"
                                    confirmBtnText="Confirm"
                                    cancelBtnText="Cancel"
                                    customStyles={{
                                        dateIcon: {
                                            position: 'absolute',
                                            left: 0,
                                            top: 4,
                                            marginLeft: 0,
                                            width: 0, height: 0
                                        },
                                        dateInput: {
                                            marginLeft: 0,
                                            borderWidth: 0,
                                        },
                                        dateText: {
                                            fontSize: 12,
                                        }
                                    }}
                                    onDateChange={(time12) => { this.setState({ time12: time12 }) }}
                                />
                                <Image resizeMode="contain" style={{ width: 25, height: 10 }} source={localimag.all}></Image>
                            </View>
                        </View>}
                    </View>
                </View>
                <View style={{ width: mobileW * 80 / 100, justifyContent: 'center', alignSelf: 'center', alignItems: 'center',marginTop:mobileW*5/100 }}>
                    <TouchableOpacity activeOpacity={1} onPress={() => { this.setAvailability() }} style={{ backgroundColor: Colors.theme_color, width: mobileW * 70 / 100, height: mobileH * 5 / 100, alignItems: 'center', justifyContent: 'center', borderRadius: 5 }}>
                        <Text style={{ color: Colors.purewhite, fontSize: mobileW * 3.9 / 100, fontFamily: Font.medium }}>Save</Text>
                    </TouchableOpacity>
                </View>

                <Footer
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
        fontFamily: Font.medium,
        fontSize: windowWidth * 4.8 / 100,
        letterSpacing: 0.5,
        marginLeft: mobileW * 10 / 100
    },
});


