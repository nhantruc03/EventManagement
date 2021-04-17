import React, { Component } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  Modal,
} from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import Eventscreen from "../screens/Event";
import EventDetail2 from "../screens/EventDetails2";
import scriptdetail from "../screens/scriptdetail";
// import Modal from "@ant-design/react-native";

import { Button } from "react-native";
import scriptview from "../screens/scriptview";

const Stack = createStackNavigator();
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
class StackNav extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Stack.Navigator>
        <Stack.Screen
          name="Events"
          component={Eventscreen}
          options={{
            headerShown: false,
            headerStyle: {
              backgroundColor: "#2A9D8F",
            },
          }}
        />
        <Stack.Screen
          name="EventDetail2"
          component={EventDetail2}
          options={{
            headerStyle: {
              backgroundColor: "#2A9D8F",
            },
            headerTitleStyle: {},
            headerBackTitleVisible: false,
            headerTintColor: "#fff",
          }}
        />
        <Stack.Screen
          name="scriptdetail"
          component={scriptdetail}
          options={{
            headerStyle: {
              backgroundColor: "#2A9D8F",
            },
            headerTitleStyle: {},
            headerBackTitleVisible: false,
            headerTintColor: "#fff",
          }}
        />
        <Stack.Screen
          name="scriptview"
          component={scriptview}
          options={{
            headerStyle: {
              backgroundColor: "#2A9D8F",
            },
            headerTitleStyle: {},
            headerBackTitleVisible: false,
            headerTintColor: "#fff",
          }}
        />
      </Stack.Navigator>
    );
  }
}

export default StackNav;
