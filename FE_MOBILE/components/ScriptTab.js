import React, { Component } from "react";
import { View, Text, StyleSheet } from "react-native";
import axios from "axios";
import { FlatList, TouchableOpacity } from "react-native-gesture-handler";
import moment from "moment";

const styles = StyleSheet.create({
  Container: {
    backgroundColor: "#F6F7F8",
  },
  AvaImg: {
    width: 48,
    height: 48,
    borderRadius: 40,
  },
  ListContainer: {
    backgroundColor: "#F6F7F8",
  },
  itemContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 8,
    paddingVertical: 8,
  },
  itemFormCreate: {
    fontFamily: "semibold",
    fontSize: 12,
    color: "#666666",
  },
  itemForm: {
    backgroundColor: "white",
    padding: 24,
    borderRadius: 12,
  },
  itemFormName: {
    fontFamily: "semibold",
    fontSize: 24,
    color: "#264653",
  },
  itemFormFor: {
    fontFamily: "semibold",
    fontSize: 16,
    color: "#666666",
  },
  itemFormCreateName: {
    fontFamily: "semibold",
    fontSize: 12,
    color: "#2A9D8F",
  },
});

export default class ScriptTab extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: null,
    };
  }

  componentDidMount() {
    this.setState({
      data: this.props.data,
    });
  }

  render() {
    console.log("data", this.state.data);
    if (this.state.data) {
      return (
        <FlatList
          style={styles.ListContainer}
          data={this.state.data}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() =>
                this.props.navigation.navigate("scriptdetail", {
                  id: item._id,
                  startDate: item.eventId.startDate,
                  startTime: item.eventId.startTime,
                })
              }
            >
              <View style={styles.itemContainer}>
                <View style={styles.itemForm}>
                  <Text style={styles.itemFormName}>{item.name}</Text>
                  <Text style={styles.itemFormFor}>{item.forId.name}</Text>
                  <Text style={styles.itemFormCreate}>
                    Tạo lúc: {moment(item.createdAt).format("HH:mm")} |{" "}
                    {moment(item.createdAt).format("DD/MM/YYY")} bởi{" "}
                    <Text style={styles.itemFormCreateName}>
                      {item.writerId ? item.writerId.name : null}
                    </Text>
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          )}
          keyExtractor={(item) => item._id}
        ></FlatList>
      );
    } else {
      return null;
    }
  }
}
