import React, { Component } from 'react'
import { Text, View, TouchableOpacity, SafeAreaView, Keyboard, FlatList, TextInput, Alert, Modal, Dimensions, StatusBar, Image, ScrollView, BackHandler, StyleSheet } from 'react-native'
import { config, Otpprovider, Mapprovider, apifuntion, Colors, Font, validation, mobileH, mobileW, SocialLogin, Cameragallery, mediaprovider, localStorage, Lang_chg, consolepro, msgProvider, msgTitle, msgText, Currentltlg } from './Providers/utilslib/Utils'
import { localimag } from './Providers/Localimageprovider/Localimage'
import StarRating from 'react-native-star-rating';
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
export default class RatingReviewPopup extends Component {
    constructor(props) {
        super(props)
        this.state = {
            modalVisible2: false,
            starCount: 1,
            review: '',
            maxCount: 250,
            minCount: 0,
            data: this.props.route.params.data,
        }
    }
    backpress = () => {
        this.props.navigation.goBack();
    }
    // componentDidMount = () => {
    //     this.get_term_condition();
    // }

    async getRatingStatus() {
        var userdata = await localStorage.getItemObject('user_arr');
        var data = this.state.data
        var user_id = userdata.user_id;
        var user_type = userdata.user_type;
        var question_id = data.question_id;
        var other_user_id = data.other_user_id;
        var starCount = this.state.starCount;
        var review = this.state.review;

        if (review.length <= 0) {
            msgProvider.toast("Please enter review", 'top')
            return false;
        }


        consolepro.consolelog('getQuestion');
        let user_details = await localStorage.getItemObject('user_arr');
        consolepro.consolelog('user_details_ba', user_details);
        let url = config.baseURL + "rating_submit.php?question_id=" + question_id + '&user_id=' + user_id + "&review=" + review + "&rating_count=" + starCount + "&other_user_id=" + other_user_id;
        consolepro.consolelog(url)
        apifuntion.getApi(url).then((obj) => {
            consolepro.consolelog('obj', obj)
            if (obj.success == "true") {
                this.setState({ minCount: 0 })
                setTimeout(() => {
                    this.props.navigation.navigate('Home')
                }, 600);
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

    async setCountAndText(txt) {
        var minCount_len = txt.length;
        this.setState({ review: txt, minCount: minCount_len })
    }

    //-------------------------------------------------------//
    render() {
        return (
            <View style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
                <SafeAreaView style={{ flex: 0, backgroundColor: Colors.theme_color }} />
                <StatusBar backgroundColor={Colors.theme_color} barStyle='default' hidden={false} translucent={false}
                    networkActivityIndicatorVisible={true} />
                <View style={styles.setingsHeader}>
                    <TouchableOpacity activeOpacity={0.9} onPress={() => { this.props.navigation.goBack() }}>
                        <Image resizeMode="contain" style={{ width: 35, height: 40 }} source={localimag.back}></Image>
                    </TouchableOpacity>
                    <Text style={styles.OrderHistoryTitle}>Rating And Review</Text>
                    <Text style={{ width: 20 }}> </Text>
                </View>
                <View style={{ marginTop: 50, justifyContent: 'center' }}>
                    <StarRating
                        containerStyle={{ width: windowWidth * 50 / 100, height: windowHeight * 10 / 100, alignSelf: 'center', }}
                        fullStar={localimag.starr}
                        emptyStar={localimag.stargrey}
                        halfStarColor={'#FFC815'}
                        // disabled={true}
                        maxStars={5}
                        starSize={mobileW * 9 / 100}
                        rating={this.state.starCount}
                        selectedStar={(rating) => this.setState({ starCount: rating })}
                    />
                </View>
                <View style={{ borderWidth: 2, borderColor: Colors.line_color, width: mobileW * 82 / 100, height: mobileH * 16 / 100, borderRadius: 12, alignSelf: 'center', }}>
                    <TextInput
                        onChangeText={text => { this.setCountAndText(text) }}
                        value={this.state.review}
                        maxLength={250}
                        multiline={true}
                        returnType="done"
                        returnKeyType="done"
                        style={{ fontFamily: 'Roboto-Regular', marginLeft: 5, width: mobileW * 80 / 100, fontSize: mobileW * 3.8 / 100, height: mobileH * 12 / 100, fontWeight: 'bold', textAlignVertical: 'top', paddingRight: 5 }}
                        placeholder=""
                        keyboardType={'default'}
                        placeholderTextColor={Colors.font_color}
                        onSubmitEditing={() => { Keyboard.dismiss() }}
                    />
                    <Text style={{ color: Colors.theme_color, fontSize: mobileW * 2.8 / 100, textAlign: 'right', marginRight: 5 }}>{this.state.minCount}/{this.state.maxCount}</Text>
                </View>
                <TouchableOpacity activeOpacity={1} style={{ marginTop: 30, width: mobileW * 80 / 100, height: mobileH * 7 / 100, backgroundColor: Colors.theme_color, borderRadius: 35, alignItems: 'center', justifyContent: 'center', alignSelf: 'center', }}
                    onPress={() => { this.getRatingStatus() }}>
                    <Text style={{ fontSize: mobileW * 4.2 / 100, fontFamily: Font.bold, color: Colors.purewhite }}>Submit</Text>
                </TouchableOpacity>
            </View>
        )
    }
}
const styles = StyleSheet.create({
    setingsHeader: {
        flexDirection: 'row',
        backgroundColor: Colors.purewhite,
        justifyContent: 'space-between',
        paddingLeft: 20,
        paddingRight: 20,
        paddingTop: 5,
        paddingBottom: 25,
        alignItems: 'center',
        elevation: 20,
        shadowColor: '#000000',
        shadowOffset: { width: 2, height: 2, },
        shadowOpacity: 0.20
    },
    OrderHistoryTitle: {
        color: Colors.font_color,
        fontFamily: Font.bold,
        fontSize: windowWidth * 5.2 / 100,
        letterSpacing: 0.5,
    },
});


