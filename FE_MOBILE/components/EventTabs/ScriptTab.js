import React, { Component } from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import axios from "axios";
import { FlatList, TouchableOpacity } from "react-native-gesture-handler";
import moment from "moment";
import { Modal, Provider } from "@ant-design/react-native";
import ScriptCreateModal from "../ScriptCreateModal";

const H = Dimensions.get("window").height;

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
  btnUpdate: {
    color: "#fff",
    height: 48,
    backgroundColor: "#2A9D8F",
    borderRadius: 8,
    padding: 12,
    margin: 16,
  },
  textUpdate: {
    color: "white",
    textAlign: "center",
    fontFamily: "bold",
    fontSize: 16,
  },
});

export default class ScriptTab extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: null,
      visible: false,
      loading: true,
    };
  }

  onClose = () => {
    this.setState({
      visible: false,
    });
  };
  componentDidMount() {
    this.setState({
      data: this.props.data,
      loading: this.props.loading,
    });
  }
  updateListScript = (e) => {
    this.setState({
      data: [...this.state.data, e],
    });
    this.props.updateListScript(e);
  };

  render() {
    const footerButtons = [
      { text: "Cancel", onPress: () => console.log("cancel") },
      { text: "Ok", onPress: () => console.log("ok") },
    ];
    // console.log("data", this.state.data);
    if (this.state.data) {
      return (
        <Provider>
          <View>
            <FlatList
              height={H * 0.7}
              style={styles.ListContainer}
              data={this.state.data}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() =>
                    this.props.navigation.navigate("scriptdetail", {
                      id: item._id,
                      event: this.props.event,
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
            <TouchableOpacity
              style={styles.btnUpdate}
              underlayColor="#fff"
              onPress={() => this.setState({ visible: true })}
            >
              <Text style={styles.textUpdate}>Tạo mới</Text>
            </TouchableOpacity>

            <Modal
              title="Tạo mới"
              transparent
              onClose={this.onClose}
              maskClosable
              visible={this.state.visible}
              closable
            >
              <ScriptCreateModal
                onClose={this.onClose}
                scriptId={this.state._id}
                event={this.props.event}
                updateListScript={(e) => this.updateListScript(e)}
              />
            </Modal>
          </View>
        </Provider>
      );
    } else {
      return null;
    }
  }
}
