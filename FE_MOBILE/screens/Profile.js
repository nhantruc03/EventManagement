import { faLongArrowAltUp } from "@fortawesome/free-solid-svg-icons";
import AsyncStorage from "@react-native-community/async-storage";
import React, { Component } from "react";
import { Button, View, Text } from "react-native";

class Profilescreen extends Component {
  async Logout() {
    let login = await AsyncStorage.getItem("login");
    await AsyncStorage.removeItem(login);
    this.props.navigation.navigate("Login");
  }
  render() {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <Text>You have (undefined) friends.</Text>

        <Button title="Add some friends" onPress={this.Logout} />
      </View>
    );
  }
}

export default Profilescreen;
