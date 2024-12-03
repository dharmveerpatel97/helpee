import { Alert, ToastAndroid, Platform } from "react-native";
import Toast from 'react-native-simple-toast';
//--------------------------- Message Provider Start -----------------------
class messageFunctionsProviders {
	toast(message, position) {
		if (position == 'center') {
			Toast.showWithGravity(message, Toast.SHORT, Toast.CENTER);
		}
		else if (position == 'top') {
			Toast.showWithGravity(message, Toast.SHORT, Toast.TOP);
		}
		else if (position == 'bottom') {
			Toast.showWithGravity(message, Toast.SHORT, Toast.BOTTOM);

		}
		else if (position == 'long') {
			Toast.showWithGravity(message, Toast.LONG, Toast.CENTER);
		}

	}

	alert(title, message, callback) {
		if (callback === false) {
			Alert.alert(
				title,
				message,
				[
					{
						text: msgTitle.ok[0],
					},
				],
				{ cancelable: false },
			);
		} else {
			Alert.alert(
				title,
				message,
				[
					{
						text: msgTitle.ok[0],
						onPress: () => callback,
					},
				],
				{ cancelable: false },
			);
		}

	}

	confirm(title, message, callbackOk, callbackCancel) {
		if (callbackCancel === false) {
			Alert.alert(
				title,
				message,
				[
					{
						text: msgTitle.cancel[0],
					},
					{
						text: msgTitle.ok[0],
						onPress: () => this.btnPageLoginCall(),
					},
				],
				{ cancelable: false },
			);
		} else {
			Alert.alert(
				title,
				message,
				[
					{
						text: msgTitle.cancel[0],
						onPress: () => callbackCancel,
					},
					{
						text: msgTitle.ok[0],
						onPress: () => callbackOk,
					},
				],
				{ cancelable: false },
			);
		}

	}

	later(title, message, callbackOk, callbackCancel, callbackLater) {
		Alert.alert(
			title,
			message,
			[
				{
					text: 'Ask me later',
					onPress: () => msgTitle.later[0],
				},
				{
					text: 'Cancel',
					onPress: () => msgTitle.cancel[0],
				},
				{
					text: 'OK',
					onPress: () => msgTitle.ok[0],
				},
			],
			{ cancelable: false },
		);
	}


}

//--------------------------- Title Provider Start -----------------------

class messageTitleProvider {
	//----------------- message buttons
	ok = ['Ok', 'Okay', 'Está bem'];
	cancel = ['Cancel', 'Cancelar', 'Cancelar'];
	later = ['Later', 'Más tarde', 'Mais tarde'];

	//--------------- message title 
	information = ['Information Message', 'Mensaje informativo', 'Mensagem Informativa'];
	alert = ['Alert', 'Alerta', 'Alerta'];
	confirm = ['Information Message', 'Mensaje informativo', 'Mensagem Informativa'];
	validation = ['Information Message', 'Mensaje informativo', 'Mensagem Informativa'];
	success = ['Information Message', 'Mensaje informativo', 'Mensagem Informativa'];
	error = ['Information Message', 'Mensaje informativo', 'Mensagem Informativa'];
	response = ['Response', 'Respuesta', 'Resposta'];
	server = ['Connection Error', 'Error de conexión', 'Erro de conexão'];
	internet = ['Connection Error', 'Error de conexión', 'Erro de conexão']
	deactivate_msg = ['Account deactived']
	deactivate = [0,]
	usernotexit = ["User id does not exist"]
	account_deactivate_title = ['your account deactivated please try again']
}

//--------------------------- Message Provider Start -----------------------

class messageTextProvider {
	//--------------------- Validation messages ---------------//

	//------------------ Login messages -----------------------//

	emptyEmail = ['Please enter email address', 'التحقق من صحة'];
	validEmail = ['Please enter valid email id']
	emptyPassword = ['Please enter password', 'التحقق من صحة'];
	lengthPassword = ['Password length should be of minimum 6 character'];
	emptynewPassword = ['Please enter new password', 'التحقق من صحة'];
	emptyconfirmPassword = ['Please enter the password again', 'التحقق من صحة'];
	emptyconfirm = ['please enter right password'];

	//-------------------- Registration or SignUp messages ---------------//

	emptyCity = ['Please select city', ''];
	emptyName = ['Please enter your name', 'التحقق من صحة'];
	emptyPhoto = ['Please upload photo', 'التحقق من صحة'];
	emptyFirstName = ['Please enter first name', 'التحقق من صحة'];
	emptyLastName = ['Please enter last name', 'التحقق من صحة'];
	emptyBusinessName = ['Please enter business name', ''];
	emptyAddress = ['Please select address', ''];
	emptyOldPassword = ['Please enter old Password'];
	emptyNewPassword = ['Please enter new Password'];
	emptysocial_id = ['Please enter social_id'];
	emptylogintype = ['Please enter logintype'];
	correctPassword = ['Please enter correct password'];
	emptyPhone = ['Please enter mobile number', 'التحقق من صحة'];
	phoneLength = ['Please enter atleast 8 digit', ''];
	minimumPhoneLength = ['Please enter minimum 6 number', ''];
	maximumPhoneLength = ['Please enter maximum 16 number', ''];
	invalidPhone = ['Please enter valid mobile number', 'التحقق من صحة'];
	userAlreadyFound = ['User already found', 'التحقق من صحة'];
	userNotFound = ['User not  found', 'التحقق من صحة'];
	incorrectOTP = ['Incorrect OTP', 'التحقق من صحة'];
	messageError = ['No message entered', 'التحقق من صحة'];
	success_Contact = ['Contact established successfully', 'التحقق من صحة'];
	message_OTP = ['Please enter OTP', 'التحقق من صحة'];
	full_OTP = ['Please enter complete OTP', 'التحقق من صحة'];
	emptyBusinessDetails = ['Please enter business details', ''];
	passwordNotMatch = ['Password not matched, Please enter correct password'];

	//-------------------- Registration messages ---------------//

	loginFirst = ['Please login first', 'التحقق من صحة'];
	emptyContactResion = ['Please select contact reason', 'التحقق من صحة'];
	emptyContactMessage = ['Please enter message', 'التحقق من صحة'];
	networkconnection = ['Unable to connect. Please check that you are connected to the Internet and try again.'];
	servermessage = ['An Unexpected error occured , Please try again .If the problem continues , Please do contact us'];

	//---------------------Post Message --------------------------//

	emptyDiscription = ['Please enter message', 'التحقق من صحة'];
	emptyLocation = ['Please select Address', 'التحقق من صحة'];
	emptyImage = ['Please select image', 'التحقق من صحة'];
	emptyCheck = ['Please click on check box to accept our Terms & Conditions and Privacy Policy', 'التحقق من صحة'];
	emptyCategory = ['Please select atleast one category', 'التحقق من صحة'];
	emptyAuthor = ['Please select atleast one author', 'التحقق من صحة'];
	emptySpeciality = ['Please select speciality', ''];
	emptyAbout = ['Please enter about you'];
	emptyQuestion = ['Please enter your question'];
	lenghtQuestion = ['Question length should be of at least 20 word'];
	emptyPayPalId = ['Please enter paypal id'];
	emptyEducation = ['Please enter Education', ''];
	emptyAvailability = ['Please select at least one day'];
	endTimeError = ['End time should be greater than start time'];
	startTimeError = ['Please select start time'];
	endTimeErrorr = ['Pleaase select end time'];
	emptyDoc = ['Please select at least one document'];
	emptyDocument = ['Please select document'];
	lengthDiscription = ['Please enter atleast 5 character'];
	emptyPostArray = ['Post not found'];
	emptyQuote = ['Please enter your quotation'];
	lengthQuote = ['Quotation length should not be less than 10 words'];
	emptySubscription = ['Please select one of the given plan'];

	//---------------------Consumer Message --------------------------//

	emptyAccountNumber = ['Please enter account number', ''];
	emptyAccountName = ['Please select account name', ''];
	emptyMeterNumber = ['Please select meter number', ''];
	emptyUnit = ['Please enter unit', ''];
	emptyAmount = ['Please enter amount', ''];
	minimumAmount = ['Please enter alteast SLL 13000', ''];
	sellerNotFound = ['Seller not found', ''];

	//---------------------Bank Message -----------------------------//

	emptyBankName = ['Please enter bank holder name'];
	emptyIFSC = ['Please enter IFSC Code'];
	notWithdrawalAmount = ['You cannot withdraw this amount'];
	validIFSC = ['Invalid IFSC code'];
	validAccountNumber = ['Invalid account number']

}

export const msgText = new messageTextProvider();
export const msgTitle = new messageTitleProvider();
export const msgProvider = new messageFunctionsProviders();
//--------------------------- Message Provider End -----------------------