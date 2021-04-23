import { Modal, Provider } from "@ant-design/react-native";
import React, { Component } from "react";
import { Image } from "react-native";
import { View, Text, StyleSheet } from "react-native";
import { FlatList, TouchableOpacity } from "react-native-gesture-handler";
import Checked from "../../assets/images/square_checked.png";
import UnChecked from "../../assets/images/square_unchecked.png";
import SubTaskCreateModal from "./SubTaskCreateModal";

const styles = StyleSheet.create({
  formContainer: { paddingHorizontal: 16, zIndex: 3 },
  formLabel: {
    color: "#5C5C5C",
    fontFamily: "semibold",
    fontSize: 16,
  },
  checkboxContainer: {
    flexDirection: "row",
    marginBottom: 8,
    alignItems: "center",
  },
  itemContainer: {
    flex: 2,
    flexDirection: "row",
    alignItems: "center",
  },
  itemTextNameDone: {
    color: "#5C5C5C",
    fontFamily: "semibold",
    fontSize: 16,
    textDecorationLine: "line-through",
  },
  itemTextNameUnDone: {
    color: "#5C5C5C",
    fontFamily: "semibold",
    fontSize: 16,
  },
});

class SubTasksTab extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: null,
    };
  }

  componentDidMount() {
    this.setState({
      data: this.props.data,
      actionId: this.props.actionId,
      visible: false,
    });
  }

  onClose = () => {
    this.setState({
      visible: false,
    });
  };
  renderItem = (item) => {
    return (
      <View>
        <View style={styles.itemContainer}>
          <View style={styles.checkboxContainer}>
            <TouchableOpacity onPress={() => this.changeStatus(item)}>
              {item.status ? (
                <Image source={Checked}></Image>
              ) : (
                <Image source={UnChecked}></Image>
              )}
            </TouchableOpacity>
            <Text
              style={
                item.status
                  ? styles.itemTextNameDone
                  : styles.itemTextNameUnDone
              }
            >
              {item.name}
            </Text>
          </View>
        </View>
      </View>
    );
  };
  updateListSubTask = (e) => {
    this.setState({
      data: [...this.state.data, e],
    });
    this.props.updateListSubTask(e);
  };
  render() {
    if (this.state.data) {
      return (
        <Provider>
          <View style={styles.formContainer}>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <Text style={styles.formLabel}>Todo List</Text>
              <TouchableOpacity
                onPress={() => this.setState({ visible: true })}
              >
                <Text
                  style={
                    (styles.formLabel, { textDecorationLine: "underline" })
                  }
                >
                  Add Items +
                </Text>
              </TouchableOpacity>
            </View>
            <FlatList
              data={this.state.data}
              keyExtractor={(item) => item._id}
              renderItem={({ item }) => this.renderItem(item)}
            />
            <Modal
              title="Tạo mới"
              transparent
              onClose={this.onClose}
              maskClosable
              visible={this.state.visible}
              closable
            >
              <SubTaskCreateModal
                onClose={this.onClose}
                actionId={this.state.actionId}
                updateListScript={(e, b) => this.updateListSubTask(e, b)}
              />
            </Modal>
          </View>
        </Provider>
      );
    } else return null;
  }
}

export default SubTasksTab;
