// App.js
import { useFonts } from "expo-font";
import React from "react";
import "react-native-gesture-handler";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { StyleSheet, Text, View } from "react-native";
import { LogBox } from "react-native";
import { NativeRouter, Route, Link } from "react-router-native";
// Import Screens
import BottomNav from "./routes/BottomNav";
import SplashScreen from "./screens/SplashScreen";
import LoginScreen from "./screens/Login";
import AppMain from "./routes/AppMain";
import { Redirect } from "react-router";
import auth from "./router/auth";


import { SecureRouteAdmin } from './router/secureRoute'
import { AppRoute } from './router/AppRoute'

const Stack = createStackNavigator();



export default App = () => {
  LogBox.ignoreAllLogs();
  const [loaded] = useFonts({
    antoutline: require("./assets/fonts/antoutline.ttf"),
    regular: require("./assets/fonts/Nunito-Regular.ttf"),
    bold: require("./assets/fonts/Nunito-Bold.ttf"),
    semibold: require("./assets/fonts/Nunito-SemiBold.ttf"),
    light: require("./assets/fonts/Nunito-Light.ttf"),
  });
  if (!loaded) {
    return null;
  }
  return (

    <NativeRouter>
      <SecureRouteAdmin exact path="/" component={AppMain} />
      <AppRoute exact path="/login" component={LoginScreen} />
    </NativeRouter>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F6F7F8",
    alignItems: "center",
    justifyContent: "center",
  },
});
