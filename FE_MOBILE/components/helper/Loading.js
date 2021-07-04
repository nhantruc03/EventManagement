import React, { Component } from "react";
import { ActivityIndicator } from "react-native";
import { View, Text, StyleSheet } from "react-native";

class indicator extends Component {

  render() {
    return (
      <View
        style={{
          justifyContent: "center",
          position: "absolute",
          left: 0,
          top: 0,
          right: 0,
          bottom: 0,
          alignItems: "center",
        }}
      >
        <ActivityIndicator
          size="large"
          animating
          color="#2A9D8F"
        ></ActivityIndicator>
      </View>
    );
  }
}

export default indicator;
