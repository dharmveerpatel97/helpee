import React, { Component } from 'react'
import { Text, View, TouchableOpacity,FlatList, StatusBar, Image, TextInput, Modal,Alert ,Dimensions,Keyboard} from 'react-native'
import { config, Otpprovider, Mapprovider, apifuntion, Colors, Font, validation, mobileH, mobileW, SocialLogin, Cameragallery, mediaprovider, localStorage, Lang_chg, consolepro, msgProvider, msgTitle, msgText, Currentltlg } from './Providers/utilslib/Utils'
import {Nodata_foundimage} from './Provider/Nodata_foundimage';
import { WebView } from 'react-native-webview';
import {notification} from './Provider/NotificationProvider';


const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export default class Paymentjoinclass extends Component {
    state = {
        user_id: 0,
        payment_status:1,
        amount:this.props.route.params.amount,
        class_id:this.props.route.params.class_id,
        booking_number:'',
        transaction_id:'',
        total_amount:'',
        all_amount_total:'',
        status:'',
        activity_arr:'NA',
        num_player_new:'',
        pay_condition:false,
        sendprice:''
       
    }

    componentDidMount() {
        const { navigation } = this.props;
        this.focusListener = navigation.addListener('focus', () => {
            this.getData()
            
        });
    }

    getData=async()=>{
        let user_details   = await localStorage.getItemObject('user_arr');
        let user_id        = user_details.user_id
      
        // all_amount_total+parseFloat(all_amount)
       
     
       
    }
  
   
    _onNavigationStateChange(webViewState) {
        webViewState.canGoBack = false
        if (webViewState.loading == false) {
            // console.log('webViewState', webViewState);
            // console.log(webViewState.url)
            var t = webViewState.url.split('/').pop().split('?')[0]
            if (typeof (t) != null) {
                var p = webViewState.url.split('?').pop().split('&')
                // console.log('file name', t);
                if (t == 'payment_success.php') {

                    var payment_id=0;
                    //  console.log('p.length', p.length);
                    //  console.log('p.length', p);;

                    for (var i = 0; i < p.length; i++) {
                        var val = p[i].split('=');
                        console.log('val', val);
                        if (val[0] == "payment_id") {
                            payment_id = val[1]
                            console.log('val[1]',val[1])
                        }
                    }
                       console.log('payment_id',payment_id)
                       if(this.state.pay_condition==false){
                           this.setState({pay_condition:true})
                        setTimeout(()=>{
                            msgProvider.toast('Payment transfer successfully', 'center');
                            this.data_add_click(payment_id);
                         },500)
                       }
                      
                  
    
                    
                }  else if (t == 'payment_cancel.php') {
                   
                        this.props.navigation.goBack()
                
                    msgProvider.toast('Payment unsuccessful', 'center');
                    return false
                }
                // else if (t == 'payment_failed.php') {
                //     msgProvider.alert(msgTitle.information[config.language], "Payment unsuccessful", false);
                //     this.props.navigation.goBack();
                // }
            }
        }
    }

  

    data_add_click=async(payment_id)=>{
        let user_details = await localStorage.getItemObject('user_arr');
        let category_id=user_details.category_id
        let booking_arr =  this.state.booking_arr
        let selected_player =this.state.booking_arr.selected_player
        let transaction_id = payment_id
        console.log('she',booking_arr)
     
        Keyboard.dismiss()
        let url = config.baseURL + "joinClassPayment.php";
        console.log('url', url)
         var data = new FormData();
         console.log('data',data)
         data.append('user_id',user_details.user_id)
         
        
         data.append('amount',this.state.amount)
         data.append('class_id ',this.state.class_id)
         data.append('txn_id',transaction_id)
        
       
    
        

         
      
      apifuntion.postApi(url,data).then((obj) => {
          console.log('obj',obj)
      if (obj.success == 'true') {

         
       
    //   msgProvider.toast(obj.msg[config.language], 'center')
      this.setState({modalVisible1:false})

  //  this.props.navigation.navigate('Payment_confirmation',{'activity_arr':this.state.activity_arr}) 
      
      } else {
      // if (obj.active_status == msgTitle.deactivate[config.language] || obj.msg[config.language] == msgTitle.usererr[config.language]) {
      // usernotfound.loginFirst(this.props, obj.msg[config.language])
      // } else {
      msgProvider.alert(msgTitle.information[config.language], obj.msg[config.language], false);
      // }
      return false;
      }
      }).catch((error)=>{
      console.log("-------- error ------- " + error);
      })
      }
      
      add_click=()=>{
        this.setState({modalVisible1:false,})
        setTimeout(() => {
       this.data_add_click()
      },1200);
      }
       
     



    render() {

        return (
            <View style={{ flex: 1, backgroundColor: Colors.Themecolor }}>
                {/* <Loader loading={this.state.loading} /> */}

                <StatusBar
                    hidden={false}
                    backgroundColor={Colors.statuscolor}
                    translucent={false}
                    networkActivityIndicatorVisible={true}
                    barStyle="light-content"
                />
               
                <View style={{flex:1}}>
                
                    <WebView
                         source={{ uri:config.baseURL+'stripe_payment/payment_url.php?user_id='+this.state.user_id+'&order_id=1&descriptor_suffix=iCART&transfer_user_id=0&transfer_amount=0&amount='+this.state.sendprice}}
                         onNavigationStateChange={this._onNavigationStateChange.bind(this)}
                         javaScriptEnabled={true}
                         domStorageEnabled={true}
                         startInLoadingState={false}
                    />
                </View>
                    
            </View>
        )
    }
}

