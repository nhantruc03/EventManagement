import React, { Component } from "react";
import { View, Text, StyleSheet, Dimensions, Animated } from "react-native";
import * as GestureHandler from 'react-native-gesture-handler'
import { FlatList, TouchableOpacity } from "react-native-gesture-handler";
import moment from "moment";
import { Modal, Provider } from "@ant-design/react-native";
import ScriptCreateModal from "../ScriptCreateModal";
import checkPermisson from "../helper/checkPermissions";
import * as constants from "../constant/action";
import Ionicons from 'react-native-vector-icons/Ionicons';
import WSK from "../../websocket";
import Url from "../../env";
import getToken from "../../Auth";
import axios from "axios";
import * as PushNoti from '../helper/pushNotification'

const { Swipeable } = GestureHandler;

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
  rightContainer: {
    justifyContent: "center",
    alignItems: "center",
    paddingRight: 16,

  },
  rightAction: {
    backgroundColor: "#FF2121",
    borderRadius: 8,
  },
  actionText: {
    color: "white",
    fontFamily: "bold",
    padding: 32,
    paddingVertical: 40,
    fontSize: 16
  },
  iconDelete: {
    paddingHorizontal: 24,
    paddingVertical: 40,
  },
});

//cline Websocket
const client = new WebSocket(`${WSK()}`);

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

  updateScript = (e) => {
    let temp = this.state.data
    temp.forEach(x => {
      if (x._id === e._id) {
        x.name = e.name;
        x.forId = e.forId;
      }
    })
    this.setState({
      data: temp
    })
  }

  RightActions = (e) => {
    return (
      <View style={styles.rightContainer}>
        <TouchableOpacity onPress={() => this.onDelete(e)}>
          <View style={styles.rightAction}>
            <Animated.View style={styles.iconDelete}>
              <Ionicons name='trash-outline' size={32} color='white' />
            </Animated.View>

          </View>
        </TouchableOpacity>
      </View>
    )
  }

  onDelete = async (e) => {
    console.log(e)
    await (
      axios.delete(`${Url()}/api/scripts/` + e._id, {
        headers: {
          'Authorization': await getToken(),
        }
      })
        .then((res) => {
          client.send(JSON.stringify({
            type: "sendNotification",
            notification: res.data.notification
          }))
          PushNoti.sendPushNoti(res.data.notification)
          this.setState({
            data: this.state.data.filter(o => o._id !== e._id)
          })
          alert("Xoá kịch bản thành công");
        })
        .catch((err) => {
          console.log(err);
          alert("Xoá kịch bản thất bại");
        })
    )
  }



  renderItem = (e) => {
    return (
      < Swipeable
        renderRightActions={() => this.RightActions(e.item)}
      >
        <TouchableOpacity
          onPress={() =>
            this.props.navigation.navigate("scriptdetail", {
              id: e.item._id,
              event: this.props.event,
              currentPermissions: this.props.currentPermissions,
              updateScript: (e) => this.updateScript(e)
            })
          }
        >
          <View style={styles.itemContainer}>
            <View style={styles.itemForm}>
              <Text style={styles.itemFormName}>{e.item.name}</Text>
              <Text style={styles.itemFormFor}>{e.item.forId.name}</Text>
              <Text style={styles.itemFormCreate}>
                Tạo lúc: {moment(e.item.createdAt).format("HH:mm")} |{" "}
                {moment(e.item.createdAt).format("DD/MM/YYY")} bởi{" "}
                <Text style={styles.itemFormCreateName}>
                  {e.item.writerId ? e.item.writerId.name : null}
                </Text>
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      </Swipeable >
    )
  }

  render() {
    if (this.state.data) {
      return (
        <Provider>
          <View>
            <FlatList
              height={H * 0.7}
              style={styles.ListContainer}
              data={this.state.data}
              renderItem={this.renderItem}
              keyExtractor={(item) => item._id}
            ></FlatList>
            {checkPermisson(this.props.currentPermissions, constants.QL_KICHBAN_PERMISSION) ?
              <TouchableOpacity
                style={styles.btnUpdate}
                underlayColor="#fff"
                onPress={() => this.setState({ visible: true })}
              >
                <Text style={styles.textUpdate}>Tạo mới</Text>
              </TouchableOpacity> : null}
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
