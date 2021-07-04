// App.js
import "react-native-gesture-handler";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { LogBox } from "react-native";
import { NativeRouter, Route, Link } from "react-router-native";
// Import Screens
import BottomNav from "./routes/BottomNav";
import SplashScreen from "./screens/SplashScreen";
import LoginScreen from "./screens/Login";
import AppMain from "./routes/AppMain";
import { Redirect } from "react-router";
import auth from "./router/auth";
import * as Font from 'expo-font';

import { SecureRouteAdmin } from './router/secureRoute'
import { AppRoute } from './router/AppRoute'

const Stack = createStackNavigator();

import React, { Component } from 'react';
import { StyleSheet } from 'react-native';
import AsyncStorage from "@react-native-community/async-storage";
import ForgotPassword from "./screens/ForgotPassword";

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fontsLoaded: false,
      userLoaded: false,
    };
  }
  async loadFonts() {
    await Font.loadAsync({
      antoutline: require("./assets/fonts/antoutline.ttf"),
      regular: require("./assets/fonts/Nunito-Regular.ttf"),
      bold: require("./assets/fonts/Nunito-Bold.ttf"),
      semibold: require("./assets/fonts/Nunito-SemiBold.ttf"),
      light: require("./assets/fonts/Nunito-Light.ttf"),
      semibolditalic: require("./assets/fonts/Nunito-SemiBoldItalic.ttf"),
    });
    this.setState({ fontsLoaded: true });
  }

  async componentDidMount() {
    LogBox.ignoreAllLogs()
    this.loadFonts();

    var test = await AsyncStorage.getItem('login');
    if (test !== "null") {
      console.log(test)
      var obj = JSON.parse(test);
      await auth.login(obj);
    }
    this.setState({
      userLoaded: true
    })
  }
  render() {
    if (this.state.fontsLoaded && this.state.userLoaded) {
      return (
        <NativeRouter>
          <Redirect to={{
            pathname: "/",
          }} />
          <AppRoute exact path="/login" component={LoginScreen} />
          <AppRoute exact path="/forgotpassword" component={ForgotPassword} />
          <SecureRouteAdmin exact path="/" component={AppMain} />

        </NativeRouter>
      );
    }
    else {
      return null
    }
  }
}



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F6F7F8",
    alignItems: "center",
    justifyContent: "center",
  },
})