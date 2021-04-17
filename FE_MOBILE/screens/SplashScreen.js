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
      isLoggined: false,
    };
  }
  componentDidMount() {
    setTimeout(() => {
      AsyncStorage.getItem("login").then((value) =>
        navigation.replace(value === null ? "Login" : "BottomNav")
      );
      this.setState({ Loading: true });
      if (this.state.Loading) this.props.navigation.replace("Login");
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
