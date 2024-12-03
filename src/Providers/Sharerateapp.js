import React from 'react';
import Share from 'react-native-share'
import {Linking} from 'react-native';
import {Lang_chg} from './Language_provider';
import { config } from './configProvider';
class ShareappPro {
	//----------------- message buttons
      sharefunction(appname,link)
         {
        let shareOptions={
        title: appname,
        //subject:Lang_chg.headdingshare[config.language],
        message:Lang_chg.sharelinktitle[config.language]+"\n"+link,
        //url: link,
        failOnCancel: false,
     };
   Share.open(shareOptions)
         }

         
         Rateusfunction=(link)=>{
            Linking.openURL(link).catch(err =>
                alert('Please check for the Google Play Store')
           );
          }
	
}


  

export const Shareratepro = new ShareappPro();