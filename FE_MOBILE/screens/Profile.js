import { faLongArrowAltUp } from "@fortawesome/free-solid-svg-icons";
import AsyncStorage from "@react-native-community/async-storage";
import React, { Component } from "react";
import { Button, View, Text } from "react-native";
import Svg, {
  Circle,
  Ellipse,
  G,

  TSpan,
  TextPath,
  Path,
  Polygon,
  Polyline,
  Line,
  Rect,
  Use,
  Image,
  Symbol,
  Defs,
  LinearGradient,
  RadialGradient,
  Stop,
  ClipPath,
  Pattern,
  Mask,
} from 'react-native-svg';

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
        <Svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <Path d="M24 0H0V24H24V0Z" />
          <Path d="M4.5 21V9L2 11L12 3L22 11L19.5 9V21H4.5Z" stroke="black" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" />
          <Path d="M9.5 14.5V21H14.5V14.5H9.5Z" stroke="black" stroke-width="3" stroke-linejoin="round" />
          <Path d="M4.5 21H19.5" stroke="black" stroke-width="3" stroke-linecap="round" />
        </Svg>
        <Button title="Add some friends" onPress={this.Logout} />
      </View>
    );
  }
}

export default Profilescreen;
