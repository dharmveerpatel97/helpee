import { Alert, ToastAndroid, I18nManager, Platform } from "react-native";
import { localStorage } from './localStorageProvider';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { config } from "./configProvider";

global.language_key = 1;
class Language_provider {

  language_get = async () => {
    var item = await AsyncStorage.getItem('language');
    console.log('check launguage option', item)
    if (item != null) {
      console.log('kya bat h vikas bhai', config.language)
      config.language = item;
    }
    console.log('language_key123', config.language)
  }

  language_set = (value) => {
    config.language = value;
    localStorage.setItemObject('language', value)
  }
  // Media option ///////////////////
  MediaCamera = ['Choose Camera...', ''];
  Mediagallery = ['Choose Gallery...', ''];
  cancelmedia = ['Cancel', ''];
  // Map Provider /////////////////////

  titlesearchlocation = ['Search Location', ''];







  //notification delete
  msgConfirmTextNotifyDeleteMsg = ['Are you sure want to delete this notification?', 'Are you sure want to delete this notification?'];
  msgConfirmTextNotifyAllDeleteMsg = ['Do you want to delete all notification?', 'Do you want to delete all notification?'];


  //chat //
  chattextinputmessage = ['Message', "Message"]
  chataction = ['Action', "Action"]
  chatreport = ['Report User', "Report User"]
  chatclear = ['Clear Chat', "Clear Chat", "Clear Chat"]
  chatcancel = ['Cancel', "Cancel"]
  reportmessagepopup = ['Are your sure you want to ? report', "Are your sure you want to ? report"]
  chatclearpopup = ['Are your sure you to ? clear chat', "Are your sure you to ? clear chat"]
  inbox_not_found = ['Inbox is empty', 'Inbox is empty']
  privacypolicy = ["Options", "Options"]
  takephot = ["Take picture", "Take picture", "Take picture"]
  chooselib = ["Choose from library", "Choose from library"]
  rate_now = ["Rate Now", "Rate Now"]
  text_chat = ["Chat", "Chat", "Chat"]
  text_search1 = ["Search", "Search"]






  // last name====================
  //Otp provider +++++++++++++++++

  Enter_otp = ['Enter Otp'];
  phoneotp = ['Otp Number']
  edit = ['Edit'];
  verificationotp = ['Verification'];
  verificationcodeheding = ['Please type the verification code sent to']
  Otp_validation = ['Please enter otp'];
  resend = ['RESEND']
  verify = ['VERIFY']

  emptyName = ['Please enter  name', 'Please enter  name']
  NameMinLength = [' name must be of minimum 3 characters', ' name must be of minimum 3 characters']
  NameMaxLength = [' name cannot be more than 50 characters.', ' name cannot be more than 50 characters.']
  validName = ['Enter valid  name', 'Enter valid  name']
  //email============================
  emptyEmail = ["Please enter email", "Please enter email"]
  emailMaxLength = ['Email cannot be more than 50 characters', 'Email cannot be more than 50 characters']
  validEmail = ["Please enter valid email", "Please enter valid email"]
  //city============
  emptyCity = ['Please select city', "Please select city"]
  //DOB============
  emptydob = ['Please select date of birth', "Please select date of birth"]
  //DOB============
  emptygender = ['Please select gender', "Please select gender"]

  //password=========================
  emptyPassword = ['Please enter password', 'Please enter password']
  PasswordMinLength = ['Password must be of minimum 6 characters', 'Password must be of minimum 6 characters']
  PasswordMaxLength = ['Password cannot be more than 16 characters', "Password cannot be more than 16 characters"]
  //cpassword=====================
  // For Confirm Password
  emptyConfirmPWD = ['Please confirm your password', "Please confirm your password"]
  ConfirmPWDMatch = ['Password does not match', "Password does not match"]
  ConfirmPWDMinLength = ['Confirm password must be of minimum 6 characters', "Confirm password must be of minimum 6 characters"]
  ConfirmPWDMaxLength = ['Confirm password cannot be more than 16 characters', "Confirm password cannot be more than 16 characters"]

  //phone no===============
  emptyMobile = ["Please enter mobile number", "Please enter mobile number"]
  MobileMinLength = ['Mobile number must be of minimum 10 digits', "Mobile number must be of minimum 10 digits"]
  MobileMaxLength = ['Mobile number cannot be more than 12 digits', 'Mobile number cannot be more than 12 digits']
  validMobile = ["Please enter valid mobile number ", "Please enter valid mobile number"]
  //boat add=============
  //boat name=====
  emptyBoatName = ['Please enter boat name', 'Please enter boat name']
  BoatNameMinLength = ['Boat name must be of minimum 3 characters', 'Boat name must be of minimum 3 characters']
  BoatNameMaxLength = ['Boat name cannot be more than 50 characters.', 'Boat name cannot be more than 50 characters.']
  //boat number ================
  emptyBoatNumber = ['Please enter boat number', 'Please enter boat number']
  BoatNumberMinLength = ['Boat Number must be of minimum 3 characters', 'Boat Number must be of minimum 3 characters']
  BoatNumberMaxLength = ['Boat Number cannot be more than 50 characters.', 'Boat Number cannot be more than 50 characters.']
  //boat registration_no ================
  emptyBoatRegistration_no = ['Please enter registration number', 'Please enter registration number']
  BoatRegistration_noMinLength = ['Registration number must be of minimum 3 characters', 'Registration number must be of minimum 3 characters']
  Boatregistration_noMaxLength = ['Registration number cannot be more than 50 characters.', 'Registration number cannot be more than 50 characters.']
  //boat year===============
  emptyBoatYear = ['Please enter boat year', 'Please enter boat year']
  //boat length===============
  emptyBoatLength = ['Please enter boat length', 'Please enter boat length']
  //boat capacity===============
  emptyBoatCapacity = ['Please enter boat capacity', 'Please enter boat capacity']
  //boat cabins===============
  emptyBoatCabins = ['Please enter no of cabins', 'Please enter no of cabins']
  //boat toilets===============
  emptyBoatToilets = ['Please enter no of toilets', 'Please enter no of toilets']
  //city============
  emptyCity = ['Please select city', "Please select city"]
  //DOB============
  emptydob = ['Please select date of birth', "Please select date of birth"]
  //gender==========
  emptygender = ['Please select gender', "Please select gender"]
  //about==========
  emptyabout = ['Please enter about text', "Please enter about text"]
  maxlenabout = ['About cannot be more than 250 characters.', "About cannot be more than 250 characters."]
  minlenabout = ['About must be of minimum 3 characters.', "About must be of minimum 3 characters."]
  //address==========
  emptyaddress = ['Please enter address text', "Please enter address text"]
  maxlenaddress = ['Address cannot be more than 250 characters.', "Address cannot be more than 250 characters."]
  minlenaddress = ['Address must be of minimum 3 characters.', "Address must be of minimum 3 characters."]
  // For old Password
  emptyoldPassword = ['Please enter old password', 'Please enter new password', 'Please enter new password']
  PasswordoldMinLength = ['Old password must be of minimum 6 characters', 'New password must be of minimum 6 characters']
  PasswordoldMaxLength = ['Old password cannot be more than 16 characters', 'New password cannot be more than 16 characters']
  // For New Password
  emptyNewPassword = ['Please enter new password', 'Please enter new password']
  PasswordNewMinLength = ['New password must be of minimum 6 characters', 'New password must be of minimum 6 characters']
  PasswordNewMaxLength = ['New password cannot be more than 16 characters', 'New password cannot be more than 16 characters']
  // For Confirm Password
  emptyConfirmPWD = ['Please confirm your password', 'Please confirm your password']
  ConfirmPWDMatch = ['Password does not match', 'Password does not match']
  ConfirmPWDMinLength = ['Confirm password must be of minimum 6 characters', 'Confirm password must be of minimum 6 characters']
  ConfirmPWDMaxLength = ['Confirm password cannot be more than 16 characters', 'Confirm password cannot be more than 16 characters']
  //Message====
  emptyMessage = ['Please enter message text', "Please enter message text"]
  maxlenMessage = ['Message cannot be more than 250 characters.', "Message cannot be more than 250 characters."]
  minlenMessage = ['Message must be of minimum 3 characters.', "Message must be of minimum 3 characters."]
  //---------------------------share app page---------------------------//
  headdingshare = ['I’ve shared a link with you to a great new App', 'I’ve shared a link with you to a great new App']
  sharelinktitle = ['GeniusGenie App Link', 'GeniusGenie App Link'];
  //==========================Confirmation Messages=============================//
  cancel = ['Cancel', 'Cancel']
  Yes = ['Yes', 'Yes']
  No = ['No', 'No']
  ok = ['Ok', 'Ok']
  save = ['Save', 'Save']
  Done = ['Done', 'Done']
  Confirm = ["Confirm", 'Confirm']
  Save = ['Save', 'Save']
  Skip = ['Skip', 'Skip']
  Clear = ['Clear', 'Clear']
  titleexitapp = ['Exip App', 'Exip App']
  exitappmessage = ['Do you want to exit app', 'Do you want to exit app', 'Você quer sair do aplicativo']
  msgConfirmTextLogoutMsg = ['Are you sure you want to Logout?', 'Are you sure you want to Logout?']
  msgLoginError = ['Please login first?', 'Please login first?']
  //===========static text change
  loginName = ['Enter Name', 'Enter Name']
  loginEmail = ['Email', 'Email']
  loginpassword = ['Passwod', 'Password']
  logincpass = ['Confirm Password', 'Confirm Password']
  loginterm1 = ['By signing up, you agree to our', 'By signing up, you agree to our']
  loginterm2 = [' terms of service', ' terms of service']
  loginterm3 = [' and', ' and']
  loginterm4 = [' privacy policy', ' privacy policy']
  Signup_txt = ['Signup', 'Signup']
  Login_txt = ['Login', 'Login']
  do_you1 = ['Do you have an account?', 'Do you have an account?']
  html_Privacy_Policy = [' Privacy Policy ', ' Privacy Policy ']
  text_About_Us = [' About Us', ' About Us ']
  text_Terms_And_Conditions = [' Terms And Conditions ', ' Terms And Conditions ']
  contact_to_ad_text = ["Contact To Admin", 'Contact To Admin']

  //=========signup=======
  text_sign_in = ['Sign in', 'Sign in']
  text_sign_in1 = ['Sign in your social media account', 'Sign in your social media account']
  text_remember_me = ['Remember me', 'Remember me']
  text_Guest = ['Continue As A Guest', 'Continue As A Guest']
  dont_have_acc = ['Don’t have an account?', 'Don’t have an account?']
  txt_signup = ['Sign up', 'Sign up']
  //============Otp===========
  otp_verification = ['Verification', 'Verification']
  otp_verification1 = ['Otp verification code sent on', 'Otp verification code sent on']
  txt_edit = ['Edit', 'Edit']
  txt_otp = ['Otp', 'Otp']
  txt_RESEND = ['RESEND', 'RESEND']
  txt_VERIFY = ['VERIFY', 'VERIFY']
  //==========forgot================
  txt_Forgot_Pass1 = ['Forgot Password', 'Forgot Password']
  txt_Forgot_Pass2 = ['Please enter your email for reset account', 'Please enter your email for reset account']
  txt_Forgot_Pass3 = ['Submit', 'Submit']
  //edit profile=================
  Choose_City = ['Choose City', 'Choose City']
  Choose_Gender = ['Select Gender', 'Select Gender']
  female_txt = ['Female', 'Female']
  male_txt = ['Male', 'Male']
  Edit_Profile_txt = ['Edit Profile', 'Edit Profile']
  dob_txt = ['Date of birth', 'Date of birth']
  Gender_txt = ['Gender', 'Gender']
  about_txt = ['About', 'About']
  Take_a_photo_txt = ['Take a photo', 'Take a photo']
  Choose_from_library_txt = ['Choose from library', 'Choose from library']
  settings_txt = ['Settings', 'Settings']
  my_waallet_txt = ['My Wallet', 'My Wallet']
  Address_txt = ["Address", "Address"]
  Optional_txt = ["Optional", "Optional"]
  logout_txt = ['Logout', 'Logout']
  //change pass================
  change_language_txt = ["Change Password", 'Change Password']
  old_pass_txt = ["Old Password", 'Old Password']
  new_pass_txt = ["New Password", 'New Password']
  c_pass_txt = ["Confirm Password", 'Confirm Password']
  txt_Submit = ["Submit", 'Submit']
  //setting============
  text_account = ["Account", "Account"]
  text_Notification_Setting = ["Notification Setting", "Notification Setting"]
  text_Change_Language = ["Change Language", "Change Language"]
  text_support = ['Support', "support"]
  text_share_app = ['Share App', "Share App"]
  text_rate_app = ['Rate App', "Rate App"]
  //change notification==============
  txt_Notification_Settings = ["Notification Settings", "Notification Settings"]
  txt_Chat_Notifications = ["Chat Notifications", "Chat Notifications"]
  txt_Trip_Notifications = ["Trip Notifications", "Trip Notifications"]
  txt_Promotion_notification = ["Promotional Notifications", "Promotional Notifications"]

  //contact us=============
  txt_message = ["Message", "Message"]
  contact_us_txt = ["Contact Us", "Contact Us"]
  Send_txt = ["Send", "Send"]

  data_not_found = ['Data not found', "Data not found"]

  //home===========
  txt_explore = ['Explore', "Explore"]
  txt_type_of_trips = ['Type Of Trips', "Type Of Trips"]
  txt_view_all = ['View All', "View All"]
  txt_Popular_Boats = ['Popular Boats', "Popular Boats"]
  txt_pff = ['OFF', "OFF"]

  //add boat============
  add_boat_txt = ['Add Boat', "Add Boat"]
  boat_name_txt = ['Boat Name', "Boat Name"]
  boat_no_txt = ['Boat Number', "Boat Number"]
  boat_reg_txt = ['Boat register number', "Boat register number"]
  boat_year_txt = ['Boat year', "Boat year"]
  boat_len_txt = ['Boat length', "Boat length"]
  boat_cap_txt = ['Boat capacity', "Boat capacity"]
  //add advertisement-------------
  select_trip_type = ['Select Trip Type', "Select Trip Type"]
  data_not_found = ['Data Not Found', "Data Not Found"]
  Minimum_Hours_txt = ['Minimum Hours', "Minimum Hours"]
  Ideal_Hours_txt = ['Ideal Hours', "Ideal Hours"]
  Select_Boat_txt = ['Select Boat', "Select Boat"]
  Year_txt = ['Years', "Years"]
  Capacity_txt = ['Capacity', "Capacity"]
  Hours_txt = ['Hours', "Hours"]
  Upload_pictures_txt = ['Upload pictures', "Upload pictures"]
  Please_pictures_txt = ['Please upload (Max 3 pictures)', "Please upload (Max 3 pictures)"]
  Enter_Title_Arabic_txt = ['Enter Title in Arabic', "Enter Title in Arabic"]
  Enter_Title_englis_txt = ['Enter Title in English', "Enter Title in English"]
  contact_number_txt = ['Contact Number', "Contact Number"]
  max_people_txt = ['Max Number of People', "Max Number of People"]
  place_of_boat_txt = ['Place of boat', "Place of boat"]
  select_trip_txt = ['Select trip type', "Select trip type"]
  description_ar_txt = ['Descriptions In Arabic', "Descriptions In Arabic"]
  description_en_txt = ['Descriptions In English', "Descriptions in English"]
  Rental_Price_txt = ["Rental Price", "Rental Price"]
  Extrea_per_txt = ["Extra per hour price", "Extra per hour price"]
  discount_per_txt = ["Discount %", "Discount %"]

  Extra_hours_price_txt = ["Extra Hours Price", "Extra Hours Price"]
  discount_per_txt = ["Discount %", "Discount %"]
  lenghth_txt = ["Length", "Length"]
  toilets_txt = ["Toilets", "Toilets"]
  cabins_txt = ["Cabins", "Cabins"]
  Description_txt = ["Description", "Description"]
  Address_txt = ["Address", "Address"]
  rental_amt_txt = ["Rental Amount", "Rental Amount"]
  book_now_txt = ["Book Now", "Book Now"]

  //booking=========
  noOfGustErr = ['You can not insert more than', "You can not insert more than"]
  noOfGustErr1 = ['guest', 'guest']
  timeErr = ['Please Select Time', 'Please Select Time']
  dateErr = ['Please Select Date', 'Please Select Date']
  VailidNoOfGeuest = ['Number of guest should be only digit', 'Number of guest should be only digit']
  BookongAmtErrMessage = ["In your wallet not have enough balance So you have to pay some amount online", "In your wallet not have enough balance So you have to pay some amount online"]
}
export const Lang_chg = new Language_provider();