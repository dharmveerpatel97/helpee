import { Platform } from "react-native";
import base64 from 'react-native-base64'
import { msgProvider, localStorage } from './utilslib/Utils';
import { LoginManager } from 'react-native-fbsdk'
import { GoogleSignin } from 'react-native-google-signin';
import firebase from '../Config1';
// import {
//     GoogleSignin,
//    } from 'react-native-google-signin';

global.player_id_me1 = '123456';

//--------------------------- Config Provider Start -----------------------
class configProvider {
	baseURL = 'https://geniusgenie.com/webservice/';
	img_url = 'https://geniusgenie.com/webservice/images/200X200/';
	img_url1 = 'https://geniusgenie.com/webservice/images/400X400/';
	img_url2 = 'https://geniusgenie.com/webservice/images/700X700/';
	img_url3 = 'https://geniusgenie.com/webservice/images/';
	video_url = 'https://geniusgenie.com/webservice/videos/';
	login_type = 'app';
	onesignalappid = '59e86181-d57a-475c-8fe1-5061e10bbec0'
	oneSignalAuthorization='Mjk2OWE5ZjUtMzcwNC00MTZkLTlkYWUtOWQ1MWMzZDg1MjM5'
	mapkey = 'AIzaSyA8piMVBD4O7W4z-eo4M046_20rk6iXdDg';
	maplanguage = 'ar';
	language = 0;
	player_id = '123456';
	player_id_me = '123456';
	device_type = Platform.OS;
	loading_type = false;
	latitude = 23.1815;
	longitude = 79.9864;
	app_type = 'Android';
	appname = 'GeniusGenie'
		;
	headersapi = {
		'Authorization': 'Basic ' + base64.encode(base64.encode('mario') + ":" + base64.encode('carbonell')),
		Accept: 'application/json',
		'Content-Type': 'multipart/form-data',
		'Cache-Control': 'no-cache,no-store,must-revalidate',
		'Pragma': 'no-cache',
		'Expires': 0,
	}
	GetPlayeridfunctin = (player_id) => {
		player_id_me1 = player_id
	}

	checkUserDeactivate = async (navigation) => {
		msgProvider.toast('Your account deactivated', 'long')
		setTimeout(() => {
			this.AppLogout(navigation);
		}, 200);
		return false;
	}

	AppLogout = async (navigation) => {
		//----------------------- if get user login type -------------
		var userdata = await localStorage.getItemObject('user_arr');
		var password = await localStorage.getItemString('password');
		var email = await localStorage.getItemString('email');
		var remember_me = await localStorage.getItemString('remember_me');
		console.log(password);
		console.log(email);
		console.log('userdata', userdata);

		if (userdata != null) {
			var id = 'u_' + userdata.user_id;
			var updates = { 'onlineStatus': 'false' }
			var onlineStatusRef = firebase.database().ref('users/' + id).update(updates);
			var queryOffinbox = firebase.database().ref('users/' + id + '/myInbox/');
			queryOffinbox.off();
			FirebaseInboxJson = [];
			count_inbox = 0;
			// alert(userdata.login_type);
			// return false;
			if (userdata.login_type == 0 || userdata.login_type == '' + 0 + '') {
				localStorage.clear();
				if (remember_me == 'yes') {
					localStorage.setItemString('password', password.toString());
					localStorage.setItemString('email', email);
					localStorage.setItemString('remember_me', remember_me);
				} else {
					localStorage.setItemString('password', password.toString());
					localStorage.setItemString('email', email);
				}
				navigation.navigate('Login');
				return false;
			} else if (userdata.login_type == 1) {
				console.log('face boook login');
				LoginManager.logOut();
				localStorage.clear();
				navigation.navigate('Login')
				return false;
			} else if (userdata.login_type == 2) {
				console.log('google login')
				try {
					await GoogleSignin.revokeAccess();
					await GoogleSignin.signOut();
				} catch (error) {
					console.log(error);
				}
				localStorage.clear();
				navigation.navigate('Login')
				return false;
			} else if (userdata.login_type == 5) {
				return false;
				console.log('face boook login')
			}
		} else {
			console.log('user arr not found');
			navigation.navigate('Login')
			return false;
		}
	}



	AppLogoutSplash = async (navigation, login_type) => {
		// alert('app logout')
		if (login_type == 'facebook') {
			console.log('face boook login');
			LoginManager.logOut();
			localStorage.clear();
			navigation.navigate('Login')
			return false;
		} else if (login_type == 'google') {
			console.log('google login')
			try {
				await GoogleSignin.revokeAccess();
				await GoogleSignin.signOut();
			} catch (error) {
				console.log(error);
			}
			localStorage.clear();
			navigation.navigate('Login')
			return false;
		} else if (userdata.login_type == 5) {
			console.log('Apple Login')
			localStorage.clear();
			navigation.navigate('Login')
			return false;
		}
	}
};
//--------------------------- Config Provider End -----------------------

export const config = new configProvider();





