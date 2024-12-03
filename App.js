import React, { Component } from 'react'
import { Text, View, Image, StyleSheet, StatusBar, SafeAreaView, BackHandler, Alert, Keyboard, ImageBackground } from 'react-native'
import { NavigationContainer } from '@react-navigation/native';
import { AppProvider, AppConsumer } from './src/Providers/context/AppProvider';
import Stacknav from './src/Providers/Routenavigation';
import {Lang_chg} from './src/Providers/Language_provider';
global.loadingprops='NA';
class App extends Component {
  constructor(props) {
    super(props)
    StatusBar.setHidden(true);
  }
 
  render() {
    return (
    
    <NavigationContainer> 
      <AppProvider {...this.props}>
         <AppConsumer>{funcs => {
           global.props = { ...funcs }
           loadingprops = { ...funcs }
           return <Stacknav {...funcs} />
         }}
       </AppConsumer>
     </AppProvider>
  </NavigationContainer>
        
    );
  }
};
const styles = StyleSheet.create({
});
export default App;


