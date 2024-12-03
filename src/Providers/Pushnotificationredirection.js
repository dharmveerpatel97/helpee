import React from 'react';
import OneSignal from 'react-native-onesignal';
import { config } from './configProvider';
import { localStorage } from './localStorageProvider';
import { msgProvider, msgTitle, msgText } from './messageProvider';
import { notification } from './NotificationProvider';
global.propsnavigation
class Pushnotificationredirection {
  //----------------- message buttons
  constructor() {

  }
  
  
  redirectfun(props) {
    propsnavigation = props;
    OneSignal.setNotificationOpenedHandler(notification => {
      console.log('notification',notification)
    // this.onRecived(notification,propsnavigation)
     
      this.onOpened(notification,propsnavigation)
    });
  //   OneSignal.setNotificationWillShowInForegroundHandler(notification => {
   
  //     console.log('notification back',notification)
  //     this.onRecived(notification,propsnavigation)
    
  // });
  }

  onRecived = async (openResult,navigation) => {
    var datajson = openResult.notification.additionalData.action_json.action_json;
    console.log("datajson user",datajson);
 
    var chat_user = datajson.user_id;
   
      if(datajson.action == 'video_call')
    {
  navigation.navigate('Incoming_call', { 'data': { 'other_user_id': chat_user } })
    }
    if(datajson.action=='vedio_request_accept')
        {
          navigation.navigate('Chat',{ 'chatdata': { 'other_user_id': item.user_id, 'other_user_name': item.user_name, 'image': item.user_image, blockstatus: 'no', 'question_id': item.action_id, 'question': item.question, 'document': item.document, 'question_status': item.question_status }})
        }

 
  }

  onOpened = async (openResult,navigation) => {
    
console.log('check',openResult)
    var datajson = openResult.notification.additionalData.action_json.action_json
    ;
    // var datajson = openResult.notification.additionalData.action_json;
    console.log("datajson",datajson);
    var user_id = datajson.user_id;
    var item = datajson;
    var other_user_id = datajson.other_user_id;
    var action_id = datajson.action_id;
    var action = datajson.action;
    var chat_user = datajson.user_id;
    var userdata = await localStorage.getItemObject('user_arr')
    console.log('datajson_user_id',datajson.action)


    if (userdata.user_id == other_user_id) {
      other_user_id = datajson.user_id
    }

    // this.setState({loading:false})
    if (userdata != null) {
      if (userdata.user_id != other_user_id) {

        if (datajson.action == 'rate_now') {
          navigation.navigate('RatingReview', { other_user_id: other_user_id })
        }

        else if (datajson.action == 'ask_ques') {
          navigation.navigate('ExpertHome')
        }
        else if(datajson.action == 'subscription_active')
        {
      navigation.navigate('SubscriptionHistory' , { prvious_page: 'Notification' })
        }
        else if(datajson.action == 'Accept')
        {
      navigation.navigate('MyQuestion' )
        }
        else if(datajson.action == 'video_subscription_active')
        {
      navigation.navigate('SubscriptionHistory', { prvious_page: 'Notification' })
        }
        else if(datajson.action == 'vedio_request')
        {
      navigation.navigate('Chat',{ 'chatdata': { 'other_user_id': datajson.user_id, 'other_user_name': datajson.user_name, 'image': datajson.user_image, blockstatus: 'no', 'question_id': action_id, 'question': datajson.question, 'document': datajson.document, 'question_status': datajson.question_status }})
        }
        else if(datajson.action == 'vedio_request_accept')
        {
      navigation.navigate('Chat',{ 'chatdata': { 'other_user_id': datajson.user_id, 'other_user_name': datajson.user_name, 'image': datajson.user_image, blockstatus: 'no', 'question_id': action_id, 'question': datajson.question, 'document': datajson.document, 'question_status': datajson.question_status }})
        }

        else{
          navigation.navigate('Login')
        }
      }
    }
    else {
      navigation.navigate('Login')
    }
  }
  // onIds(device) {
  //   console.log('Device info: ', device);
  //   player_id_me1 = device.userId
  // }
}

export const pushnotification = new Pushnotificationredirection();