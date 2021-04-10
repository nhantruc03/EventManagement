// Homescreen.js
import React, { Component } from "react";
import { Button, View, Text, StyleSheet } from "react-native";
import TabView from "../components/Tabs";
const styles = StyleSheet.create({
  mainlabel: {
    fontSize: 24,
    fontFamily: "bold",
  },
});

const Homescreen = ({ navigation }) => {
  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#F6F7F8",
      }}
    >
      <Text style={styles.mainlabel}>Home Screen</Text>

      {/* <ReactNative.Text style={{ fontSize: 24 }}>System Font</ReactNative.Text>
      <ReactNative.Text style={{ fontSize: 24, fontFamily: "Nunito-Bold" }}>
        Nunito Bold
      </ReactNative.Text>

      <ReactNative.Text style={{ fontSize: 24, fontFamily: "regular" }}>
        Nunito Regular
      </ReactNative.Text>
      <ReactNative.Text style={{ fontSize: 24, fontFamily: "Nunito-SemiBold" }}>
        Nunito SemiBold
      </ReactNative.Text> */}

      <Button
        title="Go to Event"
        onPress={() => {
          navigation.navigate("Event");
        }}
      />
    </View>
  );
};

export default Homescreen;
