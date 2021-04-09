import React, { Component } from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import moment from "moment";

const Separator = () => <View style={styles.separator} />;

const styles = StyleSheet.create({
  mainLabel: {
    fontFamily: "Nunito-Bold",
    fontSize: 32,
    color: "#2A9D8F",
  },
  description: {
    fontFamily: "regular",
    fontSize: 14,
    marginVertical: 8,
  },
  separator: {
    marginVertical: 8,
    borderBottomColor: "#737373",
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  btn: {
    backgroundColor: "#2A9D8F",
    height: 48,
    alignContent: "center",
    textAlign: "center",
  },
});

export default class EventDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    const {
      name,
      description,
      time,
      date,
      location,
      poster,
    } = this.props.route.params;
    console.log(poster);
    return (
      <View>
        <Text style={styles.mainLabel}>{name}</Text>
        <Text style={styles.description}>{description}</Text>
        <Separator />
        <Text>
          {moment(date).format("DD/MM/YYYY")} - {moment(time).format("HH:MM")}
        </Text>
        <Text>{location}</Text>
        <Image srouce={{ uri: `${poster}` }}></Image>
        <View style={styles.btn}>
          <TouchableOpacity
            style={styles.BtnSubmit}
            title="Xem chi tiết"
            color="#FFFFFF"
          >
            <Text style={styles.textSubmit}>Đăng nhập</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}
