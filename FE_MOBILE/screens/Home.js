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
