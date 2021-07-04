import React, { Component } from "react";
import { View, Text, StyleSheet } from "react-native";
import { FlatList, TouchableOpacity } from "react-native-gesture-handler";
import axios from "axios";
import Url from "../env";
import getToken from "../Auth";
import { Platform } from "react-native";
import { StatusBar } from "react-native";
import { Image } from "react-native";
import { Redirect } from "react-router";

const styles = StyleSheet.create({
  containerIOS: { flex: 1, marginTop: 16 },
  containerAndroid: { marginTop: StatusBar.currentHeight, flex: 1 },
  toplabel: {
    fontFamily: "bold",
    fontSize: 32,
    fontWeight: "500",
    color: "#2A9D8F",
    backgroundColor: "#F6F7F8",
    paddingLeft: 16,
  },
  itemSelectedContainer: {
    backgroundColor: "white",
    padding: 16,
    paddingVertical: 12,
    marginVertical: 4,
  },
  itemUnSelectedContainer: {
    backgroundColor: "#DBDBDB",
    padding: 16,
    paddingVertical: 12,
    marginVertical: 4,
  },
  Icon: {
    width: 32,
    height: 32,
    marginRight: 8,
  },
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingRight: 16
  },
  Name: {
    fontFamily: "semibold",
    fontSize: 16,
    color: "#2A9D8F",
  },
  Descrip: {
    fontFamily: "semibold",
    fontSize: 14,
    color: "#2E2E2E",

  }
});

export default class Notification extends Component {
  constructor(props) {
    super(props);
    this.state = {

    };

  }

  updateNoti = async (id) => {
    let data = {
      status: true,
      _id: id,
    };
    axios.put(`${Url()}/api/notifications`, data, {
      headers: {
        Authorization: await getToken(),
      },
    });
    this.props.updateNoti(data);
  };

  renderNotificationContent = (e) => {
    const item = e.item;
    if (item.eventId) {
      return (
        <View style={!item.status ? styles.itemSelectedContainer : styles.itemUnSelectedContainer}>
          <TouchableOpacity
            onPress={() => {
              this.updateNoti(item._id);
              this.props.navigation.navigate("EventDetail2", {
                data: { _id: item.eventId },
                loadBySelf: true,
              });
            }}
          >
            <View style={styles.container}><Image style={styles.Icon} source={require("../assets/images/event.png")} />
              <View style={{ paddingRight: 8 }}>
                <Text style={styles.Name}>{item.name}</Text>
                <Text style={styles.Descrip}>{item.description}</Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>
      );
    } else if (item.actionId) {
      return (
        <View style={!item.status ? styles.itemSelectedContainer : styles.itemUnSelectedContainer}>
          <TouchableOpacity
            onPress={() => {
              this.updateNoti(item._id);
              this.props.navigation.navigate("TaskDetail", {
                actionId: item.actionId,
                loadBySelf: true,
                currentPermissions: this.props.currentPermissions
              });
            }}
          >
            <View style={styles.container}><Image style={styles.Icon} source={require("../assets/images/clipboard.png")} />
              <View style={{ paddingRight: 8 }}>
                <Text style={styles.Name}>{item.name}</Text>
                <Text style={styles.Descrip}>{item.description}</Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>
      );
    }
    else if (item.scriptId) {
      return (
        <View style={!item.status ? styles.itemSelectedContainer : styles.itemUnSelectedContainer}>
          <TouchableOpacity
            onPress={() => {
              this.updateNoti(item._id);
              this.props.navigation.navigate("scriptview", {
                id: item.scriptId,
                loadBySelf: true,
              });
            }}
          >
            <View style={styles.container}><Image style={styles.Icon} source={require("../assets/images/screenplay.png")} />
              <View style={{ paddingRight: 8 }}>
                <Text style={styles.Name}>{item.name}</Text>
                <Text style={styles.Descrip}>{item.description}</Text>

              </View>
            </View>
          </TouchableOpacity>
        </View>
      );
    }
  };

  render() {
    return (
      <View
        style={
          Platform.OS == "ios" ? styles.containerIOS : styles.containerAndroid
        }
      >
        <Text style={styles.toplabel}>Thông báo</Text>
        <FlatList
          style={{ paddingHorizontal: 8, }}
          data={this.props.data}
          renderItem={this.renderNotificationContent}
          keyExtractor={(item) => item._id}
        />
      </View>
    );
  }
}
