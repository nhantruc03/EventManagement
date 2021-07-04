import { StyleSheet, Image, View, Text } from "react-native";
import ImageSplash from "../assets/images/Splash.png";
import AsyncStorage from "@react-native-community/async-storage";
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
import React, { Component } from "react";

export default class SplashScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      Loading: false,
      isLoggined: "",
    };
  }
  componentDidMount() {
    setTimeout(async () => {
      let login = await AsyncStorage.getItem("login");
      if (login) {
        this.props.navigation.replace("BottomNav");
      } else {
        this.props.navigation.replace("Login");
      }
    }, 1000);
  }

  render() {
    return (
      <View>
        <Text> SplashScreen </Text>
      </View>
    );
  }
}
