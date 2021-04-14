import React, { Component } from "react";
import { Button, View, Text, StyleSheet } from "react-native";
import { Tabs } from "@ant-design/react-native";
import TabView from "../components/Tabs";

const styles = StyleSheet.create({
  Tabcontainer: {},
});
const Taskscreen = ({ navigation }) => {
  const tabs = [
    { title: "Tất cả" },
    { title: "Đang diễn ra" },
    { title: "Sắp tới" },
    { title: "Đã xong" },
  ];
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Text>Event Screen</Text>

      <Tabs
        style={styles.Tabcontainer}
        tabs={tabs}
        tabBarActiveTextColor="#2A9D8F"
        tabBarInactiveTextColor="#AAB0B6"
        tabBarTextStyle={{
          fontFamily: "semibold",
          marginVertical: 8,
        }}
        tabBarUnderlineStyle={{ backgroundColor: "#2A9D8F" }}
      ></Tabs>
    </View>
  );
};
export default Taskscreen;
