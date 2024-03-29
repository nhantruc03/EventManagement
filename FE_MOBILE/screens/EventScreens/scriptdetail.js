import React, { Component } from "react";
import { View, Text, StyleSheet, Animated, Dimensions } from "react-native";
import WSK from "../../websocket";
import Url from "../../env";
import getToken from "../../Auth";
import axios from "axios";
import {
  Modal,
  Provider,
  Button,
  Picker,
} from "@ant-design/react-native";
import moment from "moment";
import {
  FlatList,
  TextInput,
  TouchableOpacity,
} from "react-native-gesture-handler";
import { Image } from "react-native";
import ScriptDetailModal from "../../components/ScriptDetailModal";
import AsyncStorage from "@react-native-community/async-storage";
import OptionsMenu from "react-native-options-menu";
import Icon from "../../assets/images/more.png";
import Indicator from "../../components/helper/Loading";
import * as PushNoti from '../../components/helper/pushNotification'
import checkPermisson from "../../components/helper/checkPermissions";
import * as constants from "../../components/constant/action";
import * as GestureHandler from 'react-native-gesture-handler';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Loader from "react-native-modal-loader";
import { Alert } from "react-native";
import { RefreshControl } from "react-native";
import { Redirect } from "react-router";
import ApiFailHandler from '../../components/helper/ApiFailHandler'
import ValidationComponent from 'react-native-form-validator';

const W = Dimensions.get("window").width;
const H = Dimensions.get("window").height;

const { Swipeable } = GestureHandler;

const styles = StyleSheet.create({
  Loading: {
    justifyContent: "center",
    position: "absolute",
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
    alignItems: "center",
    justifyContent: "center",
  },
  Container: {
    marginTop: 16,
  },
  timeText: { fontFamily: "bold", fontSize: 16, color: "#264653" },
  nameText: { fontFamily: "semibold", fontSize: 14, color: "#3A3A3A" },
  contentContainer: { paddingRight: 16, marginRight: 16 },
  content: { fontFamily: "regular" },
  IconRight: { right: 16 },
  PrimaryBtn: {
    backgroundColor: "#2A9D8F",
    borderRadius: 12,
    borderColor: "#2A9D8F",
    fontFamily: "semibold",
  },
  LoadingBtn: {
    borderRadius: 8,
    padding: 12,
    margin: 16,
    justifyContent: "center",
    alignContent: "center",
  },
  inputdisable: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    borderColor: "#DFDFDF",
    backgroundColor: "#D4D4D4",
    borderRadius: 8,
    justifyContent: "center",
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    borderColor: "#DFDFDF",
    backgroundColor: "white",
    borderRadius: 8,
    paddingHorizontal: 8,
  },
  Box: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    borderColor: "#DFDFDF",
    backgroundColor: "white",
    borderRadius: 8,
    justifyContent: "center",
  },
  Label: {
    marginLeft: 12,
    color: "#2A9D8F",
    fontFamily: "bold",
    fontSize: 14,
  },
  btnUpdate: {
    color: "#fff",
    height: 48,
    backgroundColor: "#2A9D8F",
    borderRadius: 8,
    justifyContent: "center",
    margin: 16,
  },
  btnAdd: {
    color: "#fff",
    height: 48,
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#2A9D8F",
    borderRadius: 8,
    marginHorizontal: 16,
    justifyContent: "center",
  },
  textUpdate: {
    fontFamily: "bold",
    fontSize: 16,
    color: "white",
    textAlign: "center",
  },
  textAdd: { fontFamily: "bold", color: "#2A9D8F", textAlign: "center" },
  itemContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 16,
    paddingVertical: 8,
  },
  itemForm: {
    backgroundColor: "white",
    padding: 12,
    borderRadius: 12,
    width: 340,
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  textTime: { paddingHorizontal: 8, fontFamily: "semibold", fontSize: 20 },
  rightContainer: {
    justifyContent: "center",
    alignItems: "center",
    paddingRight: 16,

  },
  rightAction: {
    backgroundColor: "#FF2121",
    borderRadius: 8,
  },

  iconDelete: {
    padding: 12
  },
  error: {
    color: "red",
    fontFamily: "semibold",
    fontSize: 12,
    top: -10,
    marginLeft: 12
  }
});




const client = new WebSocket(`${WSK()}`);
class scriptdetail extends ValidationComponent {
  constructor(props) {
    super(props);
    this.state = {
      scriptname: "",
      name: "",
      writerName: "",
      writerId: "",
      listUser_default: [],
      listUser: [],
      listscriptdetails: [],
      disable: true,
      forId: [],
      isLoading: true,
      startDate: "",
      startTime: "",
      _id: "",
      visible: false,
      editDetailData: null,
      addScriptDetails: false,
      loadingbtn: false,
      history: [],
      deleteLoading: false,
      refreshing: false,
      loggout: false,
    };
    this._isMounted = false;
  }

  onClose = () => {
    this.setState({
      visible: false,
    });
  };
  // this.setState({ visible: true })
  ViewDetail = () => {
    this.props.navigation.navigate("scriptview", {
      id: this.state._id,
      startDate: this.state.startDate,
      startTime: this.state.startTime,
      history: this.state.history,
      updateFullListHistory: (e) => this.updateFullListHistory(e)
    })
  }
  ViewHistory = () => {
    this.props.navigation.navigate("history", {
      data: this.state.history,
      updateFullListHistory: (e) => this.updateFullListHistory(e)
    })
  }

  updateFullListHistory = (e) => {
    this.setState({
      history: e
    })
  }

  test = () => {
    console.log('test')
  }

  async componentDidMount() {
    this._isMounted = true;
    this.props.navigation.setOptions({
      headerRight: () => (
        <View style={styles.IconRight}>
          <OptionsMenu
            button={Icon}
            destructiveIndex={1}
            options={["Theo dõi kịch bản", "Lịch sử thay đổi", "Huỷ bỏ"]}
            actions={[this.ViewDetail, this.ViewHistory, this.test]}
          />
        </View>
      ),
    });

    client.onopen = () => {
      console.log("Connect to ws");
    };
    const [script, history] = await Promise.all([
      axios
        .get(`${Url()}/api/scripts/` + this.props.route.params.id, {
          headers: {
            Authorization: await getToken(),
          },
        })
        .then((res) => res.data.data)
        .catch(err => {
          let errResult = ApiFailHandler(err.response?.data?.error)
          this.setState({
            loggout: errResult.isExpired
          })
        }),
      axios
        .post(
          `${Url()}/api/script-histories/getAll`,
          { scriptId: this.props.route.params.id },
          {
            headers: {
              Authorization: await getToken(),
            },
          }
        )
        .then((res) => res.data.data)
        .catch(err => {
          let errResult = ApiFailHandler(err.response?.data?.error)
          this.setState({
            loggout: errResult.isExpired
          })
        }),
    ]);
    const scriptdetails = await axios
      .post(
        `${Url()}/api/script-details/getAll`,
        { scriptId: this.props.route.params.id },
        {
          headers: {
            Authorization: await getToken(),
          },
        }
      )
      .then((res) => res.data.data)
      .catch(err => {
        let errResult = ApiFailHandler(err.response?.data?.error)
        this.setState({
          loggout: errResult.isExpired
        })
      });

    if (script !== null && scriptdetails !== null) {
      if (this._isMounted) {
        let event = this.props.route.params.event;
        let temp_listUser = [];
        event.availUser.forEach((e) => {
          let temp = {
            value: e._id,
            label: e.name,
          };
          temp_listUser.push(temp);
        });

        let temp_listscriptdetails = scriptdetails.sort((a, b) => {
          let temp_a = moment(`0001-01-01 ${moment(a.time).utcOffset(0).format("HH:mm")}`)
          let temp_b = moment(`0001-01-01 ${moment(b.time).utcOffset(0).format("HH:mm")}`)
          return temp_b.isBefore(temp_a) ? 1 : -1;
        });

        if (this._isMounted) {
          this.setState({
            isLoading: false,
            listUser_default: event.availUser,
            listUser: [temp_listUser],
            _id: script._id,
            name: script.name,
            writerName: script.writerId.name,
            writerId: script.writerId._id,
            forId: [script.forId._id],
            listscriptdetails: temp_listscriptdetails,
            startDate: event.startDate,
            startTime: event.startTime,
            history: history,
            scriptname: script.name,
          });
        }
      }
    }
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  onChangeForId = (forId) => {
    this.setState({
      forId: forId,
    });
  };

  onChangeName = (name) => {
    this.setState({
      name,
      scriptname: name,
    });

  };

  onLoading() {
    this.setState({
      loadingbtn: true,
    });
  }

  updateScript = async () => {
    let temp_validate = this.validate({
      scriptname: { required: true },
      forId: { arrayObjectHasValue: 1 },
    });
    if (temp_validate) {
      this.onLoading();
      let login = await AsyncStorage.getItem("login");
      var obj = JSON.parse(login);
      let data = {
        name: this.state.name,
        forId: this.state.forId[0],
        updateUserId: obj.id,
      };
      console.log('Received values of form: ', data);
      await axios
        .put(`${Url()}/api/scripts/` + this.props.route.params.id, data, {
          headers: {
            Authorization: await getToken(),
          },
        })
        .then((res) => {
          // Message('Tạo thành công', true, this.props);
          // message.success("Cập nhật thành công");
          this.setState({ loadingbtn: false });
          alert("Cập nhật kịch bản thành công");
          client.send(JSON.stringify({
            type: "sendNotification",
            notification: res.data.notification,
          })
          );
          PushNoti.sendPushNoti(res.data.notification)
          this.setState({
            history: [...this.state.history, res.data.history],
          });
          console.log("update success");
          this.props.route.params.updateScript(res.data.data);
        })
        .catch((err) => {
          let errResult = ApiFailHandler(err.response?.data?.error)
          this.setState({
            loggout: errResult.isExpired
          })
          alert(`${errResult.message}`);
        });
    }
  };

  updateListScriptDetails = (temp, b) => {

    let temp_list = this.state.listscriptdetails;
    temp_list.forEach((e) => {
      if (e._id === temp._id) {
        e.name = temp.name;
        e.time = temp.time;
        e.description = temp.description;
      }
    });
    this.setState({
      listscriptdetails: temp_list.sort((a, b) => {
        let temp_a = moment(`0001-01-01 ${moment(a.time).utcOffset(0).format("HH:mm")}`)
        let temp_b = moment(`0001-01-01 ${moment(b.time).utcOffset(0).format("HH:mm")}`)
        return temp_b.isBefore(temp_a) ? 1 : -1;
      }),
      history: [...this.state.history, b]
    });
  };

  addListScriptDetails = (temp, b) => {
    let temp_list = this.state.listscriptdetails;
    temp_list.push(temp);
    console.log(b)
    this.setState({
      listscriptdetails: temp_list.sort((a, b) => {
        let temp_a = moment(`0001-01-01 ${moment(a.time).utcOffset(0).format("HH:mm")}`)
        let temp_b = moment(`0001-01-01 ${moment(b.time).utcOffset(0).format("HH:mm")}`)
        return temp_b.isBefore(temp_a) ? 1 : -1;
      }),
      history: [...this.state.history, b]
    });
  };

  renderUpdateBtn = () => {
    if (!this.state.loadingbtn) {
      if (checkPermisson(this.props.route.params.currentPermissions, constants.QL_KICHBAN_PERMISSION)) {
        return (
          <TouchableOpacity
            style={styles.btnUpdate}
            underlayColor="#fff"
            onPress={() => this.updateScript()}
          >
            <Text style={styles.textUpdate}>Cập nhật</Text>
          </TouchableOpacity>
        )
      } else return null
    }
    else return (
      <Button loading style={styles.LoadingBtn}>loading</Button>
    )
  }

  RightActions = (e) => {
    return (
      <View style={styles.rightContainer}>
        <TouchableOpacity onPress={() => this.DeleteAlert(e)}>
          <View style={styles.rightAction}>
            <Animated.View style={styles.iconDelete}>
              <Ionicons name='trash-outline' size={24} color='white' />
            </Animated.View>
          </View>
        </TouchableOpacity>
      </View>
    )
  }
  DeleteAlert = (e) => {
    Alert.alert(
      //title
      'Xoá chi tiết kịch bản',
      //body
      'Bạn có chắc muốn xoá chi tiết kịch bản này? ',
      [
        {
          text: 'Cancel', onPress: () => console.log('Cancel')
        },
        {
          text: 'Xoá', onPress: () => this.onDeleteDetail(e), style: 'destructive'
        },
      ],
      { cancelable: false },
    );
  }

  onDeleteLoading() {
    this.setState({
      deleteLoading: true,
    });
  }

  onDeleteDetail = async (value) => {
    this.onDeleteLoading()
    let login = await AsyncStorage.getItem("login");
    var obj = JSON.parse(login);
    await (
      axios.delete(`${Url()}/api/script-details/` + value._id + `?updateUserId=${obj.id}`, {
        headers: {
          'Authorization': await getToken(),
        }
      })
        .then((res) => {
          let temp = this.state.listscriptdetails.filter(e => e._id !== value._id);
          this.setState({
            listscriptdetails: temp,
            history: [...this.state.history, res.data.history],
            deleteLoading: false
          })
          client.send(JSON.stringify({
            type: "sendNotification",
            notification: res.data.notification
          }))
          PushNoti.sendPushNoti(res.data.notification)
          alert("Xoá chi tiết kịch bản thành công")
        })
        .catch(err => {
          alert("Xoá chi tiết kịch bản thất bại")
        })
    )
  }
  onRefresh = async () => {
    this.setState({
      refreshing: true,
    });
    await axios
      .post(
        `${Url()}/api/script-details/getAll`,
        { scriptId: this.props.route.params.id },
        {
          headers: {
            Authorization: await getToken(),
          },
        }
      )
      .then((res) => {
        this.setState({
          refreshing: false,
          listscriptdetails: res.data.data
        });
      });
  }


  renderItem = (e) => {
    if (checkPermisson(this.props.route.params.currentPermissions, constants.QL_KICHBAN_PERMISSION)) {
      return (
        <Swipeable renderRightActions={() => this.RightActions(e.item)}>
          <TouchableOpacity
            style={styles.itemContainer}
            onPress={() =>
              this.setState({
                visible: true,
                editDetailData: e.item,
                addScriptDetails: false,
              })
            }
          >
            <View style={styles.itemForm}>
              <Image
                source={require("../../assets/images/timesolid.png")}
              />
              <Text style={styles.textTime}>
                {moment(e.item.time).utcOffset(0).format("HH:mm")}
              </Text>
            </View>
          </TouchableOpacity>
        </Swipeable>
      )
    } else return null
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
      if (!this.state.isLoading) {
        return (
          <Provider>
            <Loader loading={this.state.deleteLoading} color="white" size="large" />
            <View style={styles.Container}>
              <View styles={styles.ScriptNameContainer}>
                <Text style={styles.Label}>Tên kịch bản</Text>
                <View style={styles.BoxInput}>
                  <TextInput
                    onChangeText={this.onChangeName}
                    style={
                      this.state.disable === true
                        ? styles.input
                        : styles.inputdisable
                    }
                    value={this.state.name}
                    editable={this.state.disable}
                  ></TextInput>
                  {this.isFieldInError('scriptname') && this.getErrorsInField('scriptname').map((errorMessage, key) =>
                    <Text style={styles.error} key={key}>
                      {errorMessage}
                    </Text>
                  )}
                </View>
              </View>
              <View style={styles.ScriptNameLabelContainer}>
                <Text style={styles.Label}>Dành cho</Text>
                <View style={styles.Box}>
                  <Picker
                    onChange={this.onChangeForId}
                    value={this.state.forId}
                    data={this.state.listUser}
                    cascade={false}
                    okText="Đồng ý"
                    dismissText="Thoát"
                  >
                    <Text style={{ padding: 8, }}>
                      {!this.state.forId
                        ? "Chọn"
                        : this.state.listUser_default.filter(
                          (e) => e._id === this.state.forId[0]
                        )[0].name}
                    </Text>
                  </Picker>
                </View>
                {this.isFieldInError('forId') && this.getErrorsInField('forId').map((errorMessage, key) =>
                  <Text style={styles.error} key={key}>
                    {errorMessage}
                  </Text>
                )}
              </View>
              {this.renderUpdateBtn()}
              <View>
                <View>
                  <Text style={styles.Label}>Timeline</Text>
                </View>
              </View>
              <View>
                <FlatList
                  refreshControl={
                    <RefreshControl
                      refreshing={this.state.refreshing}
                      onRefresh={this.onRefresh}
                    />
                  }
                  data={this.state.listscriptdetails}
                  keyExtractor={(item) => item._id}
                  renderItem={this.renderItem}
                  style={{ height: H * 0.35 }}
                ></FlatList>
              </View>
              {checkPermisson(this.props.route.params.currentPermissions, constants.QL_KICHBAN_PERMISSION) ?
                <TouchableOpacity
                  style={styles.btnAdd}
                  underlayColor="#fff"
                  onPress={() =>
                    this.setState({
                      visible: true,
                      editDetailData: {
                        name: "",
                        time: new Date(),
                        description: "",
                      },
                      addScriptDetails: true,
                    })
                  }
                >
                  <Text style={styles.textAdd}>+ Thêm</Text>
                </TouchableOpacity>
                : null}
            </View>
            <Modal
              closable
              maskClosable
              title="Chi tiết"
              visible={this.state.visible}
              transparent
              onClose={this.onClose}
            >
              <ScriptDetailModal
                onClose={this.onClose}
                add={this.state.addScriptDetails}
                data={this.state.editDetailData}
                scriptId={this.state._id}
                history={this.state.history}
                updateListScriptDetails={(e, b) => this.updateListScriptDetails(e, b)}
                addListScriptDetails={(e, b) => this.addListScriptDetails(e, b)}
              />
            </Modal>
          </Provider>
        );
      } else {
        return (
          <Indicator />
        );
      }
    }
  }
}

export default scriptdetail;
