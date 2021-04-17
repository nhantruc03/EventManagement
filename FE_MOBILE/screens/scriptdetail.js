import React, { Component } from "react";
import { View, Text, StyleSheet } from "react-native";
import Url from "../env";
import getToken from "../Auth";
import axios from "axios";
import {
  Steps,
  Modal,
  Provider,
  Button,
  PickerView,
  Picker,
} from "@ant-design/react-native";
import Check from "../assets/images/Checked.png";
import moment from "moment";
import { ActivityIndicator } from "react-native";
import HTML from "react-native-render-html";
import {
  FlatList,
  TextInput,
  TouchableOpacity,
} from "react-native-gesture-handler";
import { Image } from "react-native";
import ScriptEditModal from "../components/ScriptEditModal";

const Step = Steps.Step;

const styles = StyleSheet.create({
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
    backgroundColor: "#D4D4D4",
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
    padding: 16,
    margin: 16,
  },
  textUpdate: { color: "white", textAlign: "center" },
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
});
class scriptdetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      writerName: "",
      writerId: "",
      listUser_default: [],
      listUser: [],
      listscriptdetails: [],
      disable: true,
      forId: null,
      isLoading: true,
      startDate: "",
      startTime: "",
      _id: "",
      visible: false,
      editDetailData: null,
    };
  }

  onClose = () => {
    this.setState({
      visible: false,
    });
  };
  // this.setState({ visible: true })
  async componentDidMount() {
    this.props.navigation.setOptions({
      headerRight: () => (
        <View style={styles.IconRight}>
          <TouchableOpacity
            onPress={() =>
              this.props.navigation.navigate("scriptview", {
                id: this.state._id,
                startDate: this.state.startDate,
                startTime: this.state.startTime,
              })
            }
          >
            <Image source={require("../assets/images/preview.png")} />
          </TouchableOpacity>
        </View>
      ),
    });
    this._isMounted = true;
    const [script] = await Promise.all([
      axios
        .get(`${Url()}/api/scripts/` + this.props.route.params.id, {
          headers: {
            Authorization: await getToken(),
          },
        })
        .then((res) => res.data.data),
    ]);
    const [event, scriptdetails] = await Promise.all([
      axios
        .get(`${Url()}/api/events/` + script.eventId._id, {
          headers: {
            Authorization: await getToken(),
          },
        })
        .then((res) => res.data.data),
      axios
        .post(
          `${Url()}/api/script-details/getAll`,
          { scriptId: this.props.route.params.id },
          {
            headers: {
              Authorization: await getToken(),
            },
          }
        )
        .then((res) => res.data.data),
    ]);

    if (event !== null && script !== null && scriptdetails !== null) {
      if (this._isMounted) {
        let temp_listUser = [];
        event.availUser.forEach((e) => {
          let temp = {
            value: e._id,
            label: e.name,
          };
          temp_listUser.push(temp);
        });

        let temp_listscriptdetails = scriptdetails.sort((a, b) => {
          let temp_a = new Date(a.time).setFullYear(1, 1, 1);
          let temp_b = new Date(b.time).setFullYear(1, 1, 1);
          return temp_a > temp_b ? 1 : -1;
        });

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
        });
      }
    }
  }

  onChangeForId = (forId) => {
    console.log("writerId", forId);
    this.setState({
      forId: forId,
    });
  };

  onChangeName = (name) => {
    console.log("name", name);
    this.setState({
      name,
    });
  };

  updateScript = async () => {
    let data = {
      name: this.state.name,
      forId: this.state.forId[0],
    };

    await axios
      .put(`${Url()}/api/scripts/` + this.props.route.params.id, data, {
        headers: {
          Authorization: await getToken(),
        },
      })
      .then((res) => {
        // Message('Tạo thành công', true, this.props);
        // message.success("Cập nhật thành công");
        console.log("update success");
      })
      .catch((err) => {
        // Message('Tạo thất bại', false);
        // message.error("Cập nhật thất bại");
        console.log("update fails");
      });
  };

  render() {
    if (!this.state.isLoading) {
      return (
        <Provider>
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
              </View>
            </View>
            <View style={styles.ScriptNameLabelContainer}>
              <Text style={styles.Label}>Dành cho</Text>
              <View style={styles.Box}>
                {/* <PickerView
                onChange={this.onChange}
                value={this.state.forId}
                data={this.state.listUser}
                cascade={false}
                /> */}
                <Picker
                  onChange={this.onChangeForId}
                  value={this.state.forId}
                  data={this.state.listUser}
                  cascade={false}
                  okText="Đồng ý"
                  dismissText="Thoát"
                >
                  <Text>
                    {!this.state.forId
                      ? "Chọn"
                      : this.state.listUser_default.filter(
                          (e) => e._id === this.state.forId[0]
                        )[0].name}
                  </Text>
                </Picker>
              </View>
            </View>
            <TouchableOpacity
              style={styles.btnUpdate}
              underlayColor="#fff"
              onPress={() => this.updateScript()}
            >
              <Text style={styles.textUpdate}>Cập nhật</Text>
            </TouchableOpacity>
            <View>
              <Text style={styles.Label}>Timeline</Text>
              <FlatList
                data={this.state.listscriptdetails}
                keyExtractor={(item) => item._id}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.itemContainer}
                    onPress={() =>
                      this.setState({ visible: true, editDetailData: item })
                    }
                  >
                    <View style={styles.itemForm}>
                      <Image
                        source={require("../assets/images/timesolid.png")}
                      />
                      <Text style={styles.textTime}>
                        {moment(item.time).utcOffset(0).format("HH:mm")}
                      </Text>
                    </View>
                  </TouchableOpacity>
                )}
              ></FlatList>
            </View>
          </View>
          <Modal
            closable
            maskClosable
            popup
            visible={this.state.visible}
            animationType="slide-up"
            onClose={this.onClose}
          >
            <ScriptEditModal
              onClose={this.onClose}
              data={this.state.editDetailData}
            />
          </Modal>
        </Provider>
      );
    } else {
      return null;
    }
  }
}

export default scriptdetail;
