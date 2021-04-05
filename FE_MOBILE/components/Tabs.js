import React, { Component, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from "react-native";

const listTab = [
  {
    status: "Tất cả",
  },
  {
    status: "Đang diễn ra",
  },
  {
    status: "Sắp tới",
  },
  {
    status: "Đã xong",
  },
];

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#F6F7F8",
  },
  listTab: {
    flexDirection: "row",
    marginBottom: 20,
  },
  btnTab: {
    padding: 15,
  },
  btnTabActive: {
    borderBottomColor: "#2A9D8F",
    borderBottomWidth: 5,
  },
  textTab: {
    color: "#AAB0B6",
  },
  textTabActive: {
    color: "#2A9D8F",
  },
});

const TabView = () => {
  const [status, setStatus] = useState("Tất cả");
  const setStatusFilter = (status) => {
    setStatus(status);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.listTab}>
        {listTab.map((e) => (
          <TouchableOpacity
            style={[styles.btnTab, status === e.status && styles.btnTabActive]}
            onPress={() => setStatusFilter(e.status)}
          >
            <Text
              style={
                (styles.textTab, status === e.status && styles.textTabActive)
              }
            >
              {e.status}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </SafeAreaView>
  );
};

export default TabView;
