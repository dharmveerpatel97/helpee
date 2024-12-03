import React, { Component } from 'react'
import { createStackNavigator } from '@react-navigation/stack';
import FAQ from '../FAQ';
// import Chat from '../Chat';
// import ExpertLiveClass from '../ExpertLiveClass';
// import JoinClassDetails from '../JoinClassDetails';
import Home from '../Home';
import Login from '../Login';
import Signup from '../Signup';
import Splash from '../Splash';
import Wallet from '../Wallet';
import Classes from '../Classes';
import Profile from '../Profile';
import Payment from '../Payment';
import Message from '../Message';
import Contact from '../Contact';
import Setting from '../Setting';
import AboutUS from '../AboutUS';
import Category from '../Category';
import UploadDoc from '../UploadDoc';
import UploadPic from '../UploadPic';
import ExpertList from '../ExpertList';
import AnswerPage from '../AnswerPage';
import MeetExpert from '../MeetExpert';
import ExpertHome from '../ExpertHome';
import ReasonPage from '../ReasonPage';
import MyQuestion from '../MyQuestion';
import LiveStream from '../LiveStream';
import AskQuestion from '../AskQuestion';
import UploadFiles from '../UploadFiles';
import EditProfile from '../EditProfile';
import SignupModal from '../SignupModal';
import Notification from '../Notification';
import RatingReview from '../RatingReview';
import SignupExpert from '../SignupExpert';
import ChooseExpert from '../ChooseExpert';
import AssignClasses from '../AssignClasses';
import ExpertHomeAll from '../ExpertHomeAll';
import ExpertSetting from '../ExpertSetting';
import ManageQueries from '../ManageQueries';
import ExpertPayment from '../ExpertPayment';
import UploadDocNext from '../UploadDocNext';
import PrivacyPolicy from '../PrivacyPolicy';
import ExpertDetails from '../ExpertDetails';
import ExpertProfile from '../ExpertProfile';
import ChangePassword from '../ChangePassword';
import FraternityList from '../FraternityList';
import ForgetPassword from '../ForgetPassword';

import TermsConditions from '../TermsConditions';
import SetWorkingHours from '../SetWorkingHours';
import FavouriteExpert from '../FavouriteExpert';
import EditAvailability from '../EditAvailability';
import SubscriptionPlan from '../SubscriptionPlan';
import LiveClassDetails from '../LiveClassDetails';

import ExpertSendSuccess from '../ExpertSendSuccess';
import ExpertEditProfile from '../ExpertEditProfile';
import RatingReviewPopup from '../RatingReviewPopup';
import SecondChooseExpert from '../SecondChooseExpert';
import PaymentSuccessfull from '../PaymentSuccessfull';
import PaymentSuccessfull1 from '../PaymentSuccessfull1';
import SubscriptionHistory from '../SubscriptionHistory';
import AccountApprovedPage from '../AccountApprovedPage';
import LiveClassSuccessfull from '../LiveClassSuccessfull';
import VideoSubscriptionPlan from '../VideoSubscriptionPlan';
import ExpertLiveClassDetails from '../ExpertLiveClassDetails';
import QuestionSendSuccessfull from '../QuestionSendSuccessfull';
import VideoPaymentSuccessPage from '../VideoPaymentSuccessPage';
import Question_details_pending from '../Question_details_pending';
import NewTest from '../NewTest';
import SubscriptionPlan1 from '../SubscriptionPlan1';
import RatingReviewUser from '../RatingReviewUser';
import Question_details_pending_user from '../Question_details_pending_user';
import Paymentjoinclass from '../Paymentjoinclass';

const Stack = createStackNavigator();
const Stacknav = (navigation) => {
  return (
    <Stack.Navigator initialRouteName="Splash">
      {/* <Stack.Screen name="Chat" component={Chat} options={{ headerShown: false }} /> */}
      <Stack.Screen name="Question_details_pending" component={Question_details_pending} options={{ headerShown: false }} />
      <Stack.Screen name="FAQ" component={FAQ} options={{ headerShown: false }} />
      <Stack.Screen name="Home" component={Home} options={{ headerShown: false, gestureEnabled: false }} />
      <Stack.Screen name="Contact" component={Contact} options={{ headerShown: false }} />
      <Stack.Screen name="SubscriptionPlan" component={SubscriptionPlan} options={{ headerShown: false, gestureEnabled: false }} />
      <Stack.Screen name="Splash" component={Splash} options={{ headerShown: false, gestureEnabled: false }} />
      <Stack.Screen name="Signup" component={Signup} options={{ headerShown: false, gestureEnabled: false }} />
      <Stack.Screen name="Payment" component={Payment} options={{ headerShown: false, gestureEnabled: false }} />
      <Stack.Screen name="Message" component={Message} options={{ headerShown: false }} />
      <Stack.Screen name="Notification" component={Notification} options={{ headerShown: false, gestureEnabled: false }} />
      <Stack.Screen name="Profile" component={Profile} options={{ headerShown: false, gestureEnabled: false }} />
      <Stack.Screen name="Setting" component={Setting} options={{ headerShown: false }} />
      <Stack.Screen name="Login" component={Login} options={{ headerShown: false, gestureEnabled: false }} />
      <Stack.Screen name="ForgetPassword" component={ForgetPassword} options={{ headerShown: false }} />
      <Stack.Screen name="PrivacyPolicy" component={PrivacyPolicy} options={{ headerShown: false }} />
      <Stack.Screen name="TermsConditions" component={TermsConditions} options={{ headerShown: false }} />
      <Stack.Screen name="PaymentSuccessfull" component={PaymentSuccessfull} options={{ headerShown: false, gestureEnabled: false }} />
      <Stack.Screen name="PaymentSuccessfull1" component={PaymentSuccessfull1} options={{ headerShown: false, gestureEnabled: false }} />
      <Stack.Screen name="AboutUS" component={AboutUS} options={{ headerShown: false }} />
      <Stack.Screen name="EditProfile" component={EditProfile} options={{ headerShown: false }} />
      <Stack.Screen name="ChangePassword" component={ChangePassword} options={{ headerShown: false }} />
      <Stack.Screen name="Wallet" component={Wallet} options={{ headerShown: false }} />
      <Stack.Screen name="SubscriptionHistory" component={SubscriptionHistory} options={{ headerShown: false }} />
      <Stack.Screen name="ReasonPage" component={ReasonPage} options={{ headerShown: false }} />
      <Stack.Screen name="Classes" component={Classes} options={{ headerShown: false, gestureEnabled: false }} />
      <Stack.Screen name="FraternityList" component={FraternityList} options={{ headerShown: false }} />
      <Stack.Screen name="Category" component={Category} options={{ headerShown: false }} />
      <Stack.Screen name="MeetExpert" component={MeetExpert} options={{ headerShown: false }} />
      <Stack.Screen name="ChooseExpert" component={ChooseExpert} options={{ headerShown: false, gestureEnabled: false }} />
      <Stack.Screen name="SecondChooseExpert" component={SecondChooseExpert} options={{ headerShown: false }} />
      <Stack.Screen name="ExpertDetails" component={ExpertDetails} options={{ headerShown: false }} />
      <Stack.Screen name="RatingReview" component={RatingReview} options={{ headerShown: false, gestureEnabled: false }} />
      <Stack.Screen name="RatingReviewPopup" component={RatingReviewPopup} options={{ headerShown: false }} />
      <Stack.Screen name="SignupExpert" component={SignupExpert} options={{ headerShown: false }} />
      <Stack.Screen name="UploadFiles" component={UploadFiles} options={{ headerShown: false, gestureEnabled: false }} />
      <Stack.Screen name="UploadDoc" component={UploadDoc} options={{ headerShown: false, gestureEnabled: false }} />
      <Stack.Screen name="UploadPic" component={UploadPic} options={{ headerShown: false, gestureEnabled: false }} />
      <Stack.Screen name="UploadDocNext" component={UploadDocNext} options={{ headerShown: false, gestureEnabled: false }} />
      <Stack.Screen name="SetWorkingHours" component={SetWorkingHours} options={{ headerShown: false, gestureEnabled: false }} />
      <Stack.Screen name="ExpertPayment" component={ExpertPayment} options={{ headerShown: false }} />
      <Stack.Screen name="ExpertHome" component={ExpertHome} options={{ headerShown: false, gestureEnabled: false }} />
      <Stack.Screen name="ExpertProfile" component={ExpertProfile} options={{ headerShown: false, gestureEnabled: false }} />
      <Stack.Screen name="ExpertEditProfile" component={ExpertEditProfile} options={{ headerShown: false }} />
      <Stack.Screen name="ManageQueries" component={ManageQueries} options={{ headerShown: false }} />
      <Stack.Screen name="ExpertSetting" component={ExpertSetting} options={{ headerShown: false }} />
      <Stack.Screen name="ExpertHomeAll" component={ExpertHomeAll} options={{ headerShown: false }} />
      <Stack.Screen name="AnswerPage" component={AnswerPage} options={{ headerShown: false }} />
      <Stack.Screen name="AccountApprovedPage" component={AccountApprovedPage} options={{ headerShown: false, gestureEnabled: false }} />
      <Stack.Screen name="ExpertSendSuccess" component={ExpertSendSuccess} options={{ headerShown: false, gestureEnabled: false }} />
      <Stack.Screen name="ExpertList" component={ExpertList} options={{ headerShown: false }} />
      <Stack.Screen name="MyQuestion" component={MyQuestion} options={{ headerShown: false, gestureEnabled: false }} />
      <Stack.Screen name="AskQuestion" component={AskQuestion} options={{ headerShown: false }} />
      <Stack.Screen name="QuestionSendSuccessfull" component={QuestionSendSuccessfull} options={{ headerShown: false }} />
      <Stack.Screen name="LiveClassDetails" component={LiveClassDetails} options={{ headerShown: false }} />
      <Stack.Screen name="LiveClassSuccessfull" component={LiveClassSuccessfull} options={{ headerShown: false }} />
      {/* <Stack.Screen name="JoinClassDetails" component={JoinClassDetails} options={{ headerShown: false }} /> */}
        {/* <Stack.Screen name="ExpertLiveClass" component={ExpertLiveClass} options={{ headerShown: false }} /> */}
      <Stack.Screen name="LiveStream" component={LiveStream} options={{ headerShown: false }} />
      <Stack.Screen name="FavouriteExpert" component={FavouriteExpert} options={{ headerShown: false }} />
      <Stack.Screen name="EditAvailability" component={EditAvailability} options={{ headerShown: false }} />
      <Stack.Screen name="AssignClasses" component={AssignClasses} options={{ headerShown: false, gestureEnabled: false }} />
   
      <Stack.Screen name="ExpertLiveClassDetails" component={ExpertLiveClassDetails} options={{ headerShown: false }} />
      <Stack.Screen name="VideoPaymentSuccessPage" component={VideoPaymentSuccessPage} options={{ headerShown: false }} />
      <Stack.Screen name="VideoSubscriptionPlan" component={VideoSubscriptionPlan} options={{ headerShown: false }} />
      <Stack.Screen name="SignupModal" component={SignupModal} options={{ headerShown: false }} />
      <Stack.Screen name="NewTest" component={NewTest} options={{ headerShown: false }} />
      <Stack.Screen name="SubscriptionPlan1" component={SubscriptionPlan1} options={{ headerShown: false }} />
      <Stack.Screen name="RatingReviewUser" component={RatingReviewUser} options={{ headerShown: false }} />
      <Stack.Screen name="Question_details_pending_user" component={Question_details_pending_user} options={{ headerShown: false }} />
      <Stack.Screen name="Paymentjoinclass" component={Paymentjoinclass} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
}
export default Stacknav