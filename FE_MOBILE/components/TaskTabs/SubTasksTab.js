import { Modal, Provider } from "@ant-design/react-native";
import axios from "axios";
import React, { Component } from "react";
import { ActivityIndicator } from "react-native";
import { Image } from "react-native";
import { View, Text, StyleSheet } from "react-native";
import { FlatList, TouchableOpacity } from "react-native-gesture-handler";
import Checked from "../../assets/images/square_checked.png";
import UnChecked from "../../assets/images/square_unchecked.png";
import getToken from "../../Auth";
import Url from "../../env";
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
      addSubTask: false,
      onEditSubtask: null,
      visible: false
    };
  }

  componentDidMount() {
    this.setState({
      data: this.props.data,
      actionId: this.props.actionId,
      visible: false,
      loading: false,
    });
  }

  onClose = () => {
    this.setState({
      visible: false,
    });
  };

  changeStatus = async (e) => {
    this.setState({
      loading: true
    })
    await axios
      .put(
        `${Url()}/api/sub-actions/` + e._id,
        { status: !e.status },
        {
          headers: {
            Authorization: await getToken(),
          },
        }
      )
      .then(() => {
        let temp_data = this.state.data;
        temp_data.forEach((element) => {
          if (element._id === e._id) {
            element.status = !e.status;
          }
        });
        this.setState({
          data: temp_data,
          loading: false
        });

        alert(`Trạng thái của khách mời ${e.name} cập nhật thành công`);
      })
      .catch(() => {
        alert(`Trạng thái của khách mời ${e.name} cập nhật thất bại`);
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
            <TouchableOpacity onPress={() => {
              this.setState({
                addSubTask: false,
                onEditSubtask: item,
                visible: true
              })
            }}>
              <Text
                style={
                  item.status
                    ? styles.itemTextNameDone
                    : styles.itemTextNameUnDone
                }
              >
                {item.name}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };
  addToList = (e) => {
    this.setState({
      data: [...this.state.data, e],
    });
    // this.props.updateListSubTask(e);
  };
  updateToList = (e) => {
    let temp = this.state.data
    temp.forEach(x => {
      if (x._id === e._id) {
        console.log('found')
        x.name = e.name
        x.description = e.description
        x.startDate = e.startDate
        x.endDate = e.endDate
        x.startTime = e.startTime
        x.endTime = e.endTime
      }
    })
    console.log('list after update', temp)
    this.setState({
      data: temp
    })
  }
  render() {
    if (this.state.data) {
      return (
        <Provider>
          <View style={styles.formContainer}>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                marginBottom: 10
              }}
            >
              <Text style={styles.formLabel}>Danh sách công việc</Text>
              <TouchableOpacity
                onPress={() => this.setState({ visible: true, addSubTask: true, onEditSubtask: {} })}
              >
                <Text
                  style={
                    (styles.formLabel, { textDecorationLine: "underline" })
                  }
                >
                  Thêm +
                </Text>
              </TouchableOpacity>
            </View>
            <FlatList
              data={this.state.data}
              keyExtractor={(item) => item._id}
              renderItem={({ item }) => this.renderItem(item)}
            />
            {this.state.loading ?
              <ActivityIndicator
                size="large"
                animating
                color="#2A9D8F"
              ></ActivityIndicator>
              : null}
            <Modal
              title="Tạo mới"
              popup
              animationType="slide-up"
              // transparent
              onClose={this.onClose}
              maskClosable
              visible={this.state.visible}
              closable
            >
              <SubTaskCreateModal
                onAdd={this.state.addSubTask}
                data={this.state.onEditSubtask}
                onClose={this.onClose}
                actionId={this.state.actionId}
                addToList={(e) => this.addToList(e)}
                updateToList={(e) => this.updateToList(e)}
              />
            </Modal>
          </View>
        </Provider>
      );
    } else return null;
  }
}

export default SubTasksTab;
