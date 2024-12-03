import React, { Component } from 'react'
import { Text, View, TouchableOpacity, SafeAreaView, Dimensions, Switch, StatusBar, Image, ScrollView, FlatList, BackHandler, StyleSheet } from 'react-native'
import { config, Otpprovider, Mapprovider, apifuntion, Colors, Font, validation, mobileH, mobileW, SocialLogin, Cameragallery, mediaprovider, localStorage, Lang_chg, consolepro, msgProvider, msgTitle, msgText, Currentltlg } from './Providers/utilslib/Utils'
import { localimag } from './Providers/Localimageprovider/Localimage'
import DatePicker from 'react-native-datepicker';
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
import Footer from './Providers/Footer';
import Footerr from './Providers/Footerr';
import HideWithKeyboard from 'react-native-hide-with-keyboard';
export default class SetWorkingHours extends Component {
    constructor(props) {
        super(props)
        this.state = {
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
            status1: '',
            status2: '',
            status3: '',
            status4: '',
            status5: '',
            status6: '',
            status7: '',
            notification: false,
            notification1: false,
            notification2: false,
            notification3: false,
            notification4: false,
            notification5: false,
            notification6: false,
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
                    start_time: [
                        '09:00',
                        'AM'
                    ],
                    end_time: [
                        '07:00',
                        'PM',
                    ]
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
                    start_time: [
                        '09:00',
                        'AM'
                    ],
                    end_time: [
                        '07:00',
                        'PM',
                    ]
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
            ],
            footer_image: null
        }
    }

    //--------------------------------------------------//

    componentDidMount = () => {
        this.getAvailability();
        // this.setNotificationValue();
    }

    backpress = () => {
        this.props.navigation.goBack();
    }

    //--------------------------------------------------//

    pushData(days) {
        let availability_arr = this.state.availability_arr;
        var index = availability_arr.findIndex(x => x.days == days);
        console.log("index", index);
        if (index >= 0) {
            availability_arr[index].status = 1;
        }
        this.setState({ availability_arr: availability_arr })
    }

    //------------------------------------------------//

    setNotificationValue = () => {
        if (this.state.status1 == 1) {
            this.setState({ notification1: true });
        } else {
            this.setState({ notification1: false });
        }
        if (this.state.status2 == 1) {
            this.setState({ notification2: true });
        } else {
            this.setState({ notification2: false });
        }
        if (this.state.status3 == 1) {
            this.setState({ notification3: true });
        } else {
            this.setState({ notification3: false });
        }
        if (this.state.status4 == 1) {
            this.setState({ notification4: true });
        } else {
            this.setState({ notification4: false });
        }
        if (this.state.status5 == 1) {
            this.setState({ notification5: true });
        } else {
            this.setState({ notification5: false });
        }
        if (this.state.status6 == 1) {
            this.setState({ notification6: true });
        } else {
            this.setState({ notification6: false });
        }
        if (this.state.status7 == 1) {
            this.setState({ notification: true });
        } else {
            this.setState({ notification: false });
        }
    }

    //----------------------------------------------------------//

    getAvailability = async () => {
        consolepro.consolelog('getAvailability');
        let user_details = await localStorage.getItemObject('user_arr');
        let footer_image = user_details.image;
        this.setState({ footer_image: footer_image })
        consolepro.consolelog('user_details', user_details);
        let url = config.baseURL + "getAvailability.php?user_id=" + user_details.user_id;
        consolepro.consolelog(url)
        apifuntion.getApi(url).then((obj) => {
            consolepro.consolelog('obj', obj)
            if (obj.success == "true") {
                let availability_arr = obj.availability_arr;
                let len = availability_arr.length;
                for (let i = 0; i < len; i++) {
                    if (availability_arr[i].days == 'Monday') {
                        if (obj.availability_arr[i].start_time != '00:00:00') {
                            this.setState({
                                status1: availability_arr[i].status,
                                time1: obj.availability_arr[i].start_time,
                                time2: obj.availability_arr[i].end_time,
                            })
                        } else {
                            this.setState({
                                status1: availability_arr[i].status,
                            })
                        }

                    } else if (availability_arr[i].days == 'Tuesday') {
                        if (obj.availability_arr[i].start_time != '00:00:00') {

                            this.setState({
                                status2: availability_arr[i].status,
                                time3: obj.availability_arr[i].start_time,
                                time4: obj.availability_arr[i].end_time
                            })
                        } else {
                            this.setState({
                                status2: availability_arr[i].status,
                            })
                        }
                    } else if (availability_arr[i].days == 'Wednesday') {
                        if (obj.availability_arr[i].start_time != '00:00:00') {
                            this.setState({
                                status3: availability_arr[i].status,
                                time5: obj.availability_arr[i].start_time,
                                time6: obj.availability_arr[i].end_time
                            })
                        } else {
                            this.setState({
                                status3: availability_arr[i].status
                            })
                        }

                    } else if (availability_arr[i].days == 'Thursday') {
                        if (obj.availability_arr[i].start_time != '00:00:00') {
                            this.setState({
                                status4: availability_arr[i].status,
                                time7: obj.availability_arr[i].start_time,
                                time8: obj.availability_arr[i].end_time
                            })
                        } else {
                            this.setState({
                                status4: availability_arr[i].status
                            })
                        }
                    } else if (availability_arr[i].days == 'Friday') {
                        if (obj.availability_arr[i].start_time != '00:00:00') {
                            this.setState({
                                status5: availability_arr[i].status,
                                time9: obj.availability_arr[i].start_time,
                                time10: obj.availability_arr[i].end_time
                            })
                        } else {
                            this.setState({
                                status5: availability_arr[i].status
                            })
                        }

                    } else if (availability_arr[i].days == 'Saturday') {
                        if (obj.availability_arr[i].start_time != '00:00:00') {
                            this.setState({
                                status6: availability_arr[i].status,
                                time11: obj.availability_arr[i].start_time,
                                time12: obj.availability_arr[i].end_time
                            })
                        } else {
                            this.setState({
                                status6: availability_arr[i].status,
                            })
                        }

                    } else if (availability_arr[i].days == 'Sunday') {
                        if (obj.availability_arr[i].start_time != '00:00:00') {
                            this.setState({
                                status7: availability_arr[i].status,
                                timestart: obj.availability_arr[i].start_time,
                                timeend: obj.availability_arr[i].end_time
                            })
                        } else {
                            this.setState({
                                status7: availability_arr[i].status,
                            })
                        }

                    }
                }
                consolepro.consolelog('availability_arr', obj.availability_arr);
                this.setNotificationValue();
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

    //------------------------------------------------------//

    editAvailability = async () => {
        consolepro.consolelog('editAvailability');
        let user_details = await localStorage.getItemObject('user_arr');
        consolepro.consolelog('user_details', user_details);
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
            consolepro.consolelog('value', value2[1]);

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
            // if (value1[0] == "" || value1[0] == 'NA' || value1[0] == '00:00:00') {
            //     msgProvider.toast(msgText.startTimeError[config.language], 'top')
            //     return false;
            // }
            // if (value2[0] == "" || value2[0] == 'NA' || value2[0] == '00:00:00') {
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

            // if (value1[0] == "" || value1[0] == 'NA' || value1[0] == '00:00:00') {
            //     msgProvider.toast(msgText.startTimeError[config.language], 'top')
            //     return false;
            // }
            // if (value2[0] == "" || value2[0] == 'NA' || value2[0] == '00:00:00') {
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
            consolepro.consolelog('value2 himanshu', value2);

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

            // if (value1[0] == "" || value1[0] == 'NA' || value1[0] == '00:00:00') {
            //     msgProvider.toast(msgText.startTimeError[config.language], 'top')
            //     return false;
            // }
            // if (value2[0] == "" || value2[0] == 'NA' || value2[0] == '00:00:00') {
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

            // if (value1[0] == "" || value1[0] == 'NA' || value1[0] == '00:00:00') {
            //     msgProvider.toast(msgText.startTimeError[config.language], 'top')
            //     return false;
            // }
            // if (value2[0] == "" || value2[0] == 'NA' || value2[0] == '00:00:00') {
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

            // if (value1[0] == "" || value1[0] == 'NA' || value1[0] == '00:00:00') {
            //     msgProvider.toast(msgText.startTimeError[config.language], 'top')
            //     return false;
            // }
            // if (value2[0] == "" || value2[0] == 'NA' || value2[0] == '00:00:00') {
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

            // if (value1[0] == "" || value1[0] == 'NA' || value1[0] == '00:00:00') {
            //     msgProvider.toast(msgText.startTimeError[config.language], 'top')
            //     return false;
            // }
            // if (value2[0] == "" || value2[0] == 'NA' || value2[0] == '00:00:00') {
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
            
            // if (value1[0] == "" || value1[0] == 'NA' || value1[0] == '00:00:00') {
            //     msgProvider.toast(msgText.startTimeError[config.language], 'top')
            //     return false;
            // }
            // if (value2[0] == "" || value2[0] == 'NA' || value2[0] == '00:00:00') {
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

        let url = config.baseURL + "editAvailability.php";
        consolepro.consolelog('url', url)
        let data = new FormData();
        data.append('user_id', user_details.user_id)
        data.append('availability_arr', availability_arr_new)
        consolepro.consolelog('data1', data)
        apifuntion.postApi(url, data).then((obj) => {
            consolepro.consolelog('obj', obj);
            if (obj.success == 'true') {
                consolepro.consolelog('true', obj)
                this.props.navigation.navigate('Setting');
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

    //----------------------------------------------//
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
                    <Text style={styles.OrderHistoryTitle}>Edit Availability</Text>
                    <View style={{ width: mobileW * 10 / 100 }}></View>
                </View>
                <View style={{ height: mobileW * 75 / 100, marginTop: mobileH * 6 / 100, marginLeft: 8 }}>
                    <View style={{ flexDirection: 'row', marginTop: 10 }}>
                        <View style={{ flexDirection: "row", alignItems: 'center', width: "36%", justifyContent: "space-between" }}>
                            <Text style={{ fontSize: mobileW * 4.2 / 100, fontFamily: Font.bold, }}>Sunday</Text>
                            <Switch trackColor={{ false: '#E6EDEB', true: '#00aff0' }}
                                thumbColor={Colors.theme_color} ios_backgroundColor='#E6EDEB' onValueChange={(txt) => { this.setState({ notification: txt }); this.pushData('Sunday'); }} value={this.state.notification} />
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
                        <View style={{ flexDirection: "row", alignItems: 'center', width: "36%", justifyContent: "space-between" }}>
                            <Text style={{ fontSize: mobileW * 4.2 / 100, fontFamily: Font.bold, marginRight: mobileW * 8 / 100 }}>Monday</Text>
                            <Switch trackColor={{ false: '#E6EDEB', true: '#00aff0' }}
                                thumbColor={Colors.theme_color} ios_backgroundColor="#E6EDEB" onValueChange={(txt) => { this.setState({ notification1: txt }); this.pushData('Monday'); }} value={this.state.notification1} />
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
                        <View style={{ flexDirection: "row", alignItems: 'center', width: "36%", justifyContent: "space-between" }}>

                            <Text style={{ fontSize: mobileW * 4 / 100, fontFamily: Font.bold, marginRight: mobileW * 8 / 100 }}>Tuesday</Text>
                            <Switch trackColor={{ false: '#E6EDEB', true: '#00aff0' }}
                                thumbColor={Colors.theme_color} ios_backgroundColor="#E6EDEB" onValueChange={(txt) => { this.setState({ notification2: txt }); this.pushData('Tuesday') }} value={this.state.notification2} />
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
                        <View style={{ flexDirection: "row", alignItems: 'center', width: "36%", justifyContent: "space-between" }}>

                            <Text style={{ fontSize: mobileW * 4 / 100, fontFamily: Font.bold, marginRight: mobileW * 0.5 / 100 }}>Wednesday</Text>
                            <Switch trackColor={{ false: '#E6EDEB', true: '#00aff0' }}
                                thumbColor={Colors.theme_color} ios_backgroundColor="#E6EDEB" onValueChange={(txt) => { this.setState({ notification3: txt }); this.pushData("Wednesday") }} value={this.state.notification3} />
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
                        <View style={{ flexDirection: "row", alignItems: 'center', width: "36%", justifyContent: "space-between" }}>

                            <Text style={{ fontSize: mobileW * 4 / 100, fontFamily: Font.bold, marginRight: mobileW * 6.2 / 100 }}>Thursday</Text>
                            <Switch trackColor={{ false: '#E6EDEB', true: '#00aff0' }}
                                thumbColor={Colors.theme_color} ios_backgroundColor="#E6EDEB" onValueChange={(txt) => { this.setState({ notification4: txt }); this.pushData("Thursday") }} value={this.state.notification4} />
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
                        <View style={{ flexDirection: "row", alignItems: 'center', width: "36%", justifyContent: "space-between" }}>

                            <Text style={{ fontSize: mobileW * 4 / 100, fontFamily: Font.bold, marginRight: mobileW * 11.9 / 100 }}>Friday</Text>
                            <Switch trackColor={{ false: '#E6EDEB', true: '#00aff0' }}
                                thumbColor={Colors.theme_color} ios_backgroundColor="#E6EDEB" onValueChange={(txt) => { this.setState({ notification5: txt }); this.pushData("Friday") }} value={this.state.notification5} />
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
                        <View style={{ flexDirection: "row", alignItems: 'center', width: "36%", justifyContent: "space-between" }}>
                            <Text style={{ fontSize: mobileW * 4 / 100, fontFamily: Font.bold, marginRight: mobileW * 6.6 / 100 }}>Saturday</Text>
                            <Switch trackColor={{ false: '#E6EDEB', true: '#00aff0' }}
                                thumbColor={Colors.theme_color} ios_backgroundColor="#E6EDEB" onValueChange={(txt) => { this.setState({ notification6: txt }); this.pushData("Saturday") }} value={this.state.notification6} />
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
                <View style={{ width: mobileW * 80 / 100, justifyContent: 'center', alignSelf: 'center', alignItems: 'center',marginTop:mobileW*10/100 }}>
                    <TouchableOpacity activeOpacity={1} onPress={() => { this.editAvailability() }} style={{ backgroundColor: Colors.theme_color, width: mobileW * 70 / 100, height: mobileH * 5 / 100, alignItems: 'center', justifyContent: 'center', borderRadius: 5 }}>
                        <Text style={{ color: Colors.purewhite, fontSize: mobileW * 3.9 / 100, fontFamily: Font.medium }}>Save</Text>
                    </TouchableOpacity>
                </View>
                <Footerr
                    activepage='ExpertProfile'
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


