import { Button, Modal, Provider } from "@ant-design/react-native";
import axios from "axios";
import React, { Component } from "react";
import { ActivityIndicator } from "react-native";
import { Image } from "react-native";
import { View, Text, StyleSheet } from "react-native";
import { FlatList, TouchableOpacity } from "react-native-gesture-handler";
import Checked from "../../assets/images/Checked.png";
import UnChecked from "../../assets/images/Unchecked.png";
import getToken from "../../Auth";
import Url from "../../env";
import SubTaskCreateModal from "./SubTaskCreateModal";

import Separator from "../helper/separator";
import Loader from "react-native-modal-loader";
import { Redirect } from "react-router";

const styles = StyleSheet.create({
  formContainer: { paddingHorizontal: 16, zIndex: 3 },
  formLabel: {
    color: "#264653",
    fontFamily: "semibold",
    fontSize: 20,
  },
  btnLabel: {
    color: "white",
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
    justifyContent: "space-between",
  },
  itemTextName: {
    color: "#5C5C5C",
    fontFamily: "semibold",
    fontSize: 20,
  },
  itemTextDescription: {
    color: "#BDBDBD",
    fontFamily: "semibold",
    fontSize: 16,
  },
  AddBtn: {
    marginTop: 12,
    height: 34,
    fontFamily: "bold",
    backgroundColor: "#2A9D8F",
    borderColor: "#2A9D8F",

  },
  viewDetailText: {
    color: "#2A9D8F",
    fontFamily: "semibold",
    textDecorationLine: 'underline'
  }
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
      loggout: false,
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
            <TouchableOpacity style={{ marginRight: 8, }} onPress={() => this.changeStatus(item)}>
              {item.status ? (
                <Image source={Checked}></Image>
              ) : (
                <Image source={UnChecked}></Image>
              )}
            </TouchableOpacity>
            <View>
              <Text
                style={styles.itemTextName}
              >
                {item.name}
              </Text>
              <Text style={styles.itemTextDescription}>{item.description}</Text>
            </View>


          </View>
          <View>
            <TouchableOpacity onPress={() => {
              this.setState({
                addSubTask: false,
                onEditSubtask: item,
                visible: true
              })
            }}><Text style={styles.viewDetailText}>Xem chi tiết</Text></TouchableOpacity>
          </View>
        </View>
        <Separator />
      </View >

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
    if (this.state.loggout) {
      return (
        <Redirect
          to={{
            pathname: "/login",
          }}
        />
      )
    } else {
      if (this.state.data) {
        return (
          <Provider>
            <View style={styles.formContainer}>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  marginBottom: 10,
                  alignItems: "center"
                }}
              >
                <Text style={styles.formLabel}>Danh sách công việc</Text>
                <Button
                  type="primary"
                  size="small"
                  style={styles.AddBtn}
                  activeStyle={{ color: "white" }}
                  onPress={() => this.setState({ visible: true, addSubTask: true, onEditSubtask: {} })}
                >
                  <Text style={styles.BtnText}>Tạo mới+</Text>
                </Button>

              </View>
              <FlatList
                data={this.state.data}
                keyExtractor={(item) => item._id}
                renderItem={({ item }) => this.renderItem(item)}
              />
              <Loader loading={this.state.loading} color="#2A9D8F" />
              <Modal
                title="Tạo mới"
                animationType="slide-up"
                transparent
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
          </Provider >
        );
      } else return null;
    }
  }
}

export default SubTasksTab;
