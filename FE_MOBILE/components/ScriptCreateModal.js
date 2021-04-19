import { Button, Picker } from "@ant-design/react-native";
import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
} from "react-native";

import Url from "../env";
import getToken from "../Auth";
import axios from "axios";
import AsyncStorage from "@react-native-community/async-storage";

const H = Dimensions.get("window").height;
const styles = StyleSheet.create({
  Label: {
    color: "#2A9D8F",
    fontFamily: "bold",
    fontSize: 14,
  },
  input: {
    height: 40,
    marginVertical: 8,
    marginHorizontal: 0,
    borderWidth: 1,
    borderColor: "#DFDFDF",
    backgroundColor: "white",
    borderRadius: 8,
    paddingHorizontal: 4,
  },

  PrimaryBtn: {
    fontFamily: "bold",
    borderColor: "#2A9D8F",
    backgroundColor: "#2A9D8F",
    borderRadius: 8,
    padding: 12,
    margin: 16,
    justifyContent: "center",
    alignContent: "center",
  },
});

class ScriptCreateModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: {},
      event: null,
      listUser_default: [],
      listUser: [],
    };
  }

  componentDidMount() {
    let event = this.props.event;
    let temp_listUser = [];
    event.availUser.forEach((e) => {
      let temp = {
        value: e._id,
        label: e.name,
      };
      temp_listUser.push(temp);
    });
    this.setState({
      event: this.props.event,
      listUser_default: event.availUser,
      listUser: [temp_listUser],
    });
  }

  onChangeName = (name) => {
    this.setState({
      data: {
        ...this.state.data,
        name: name,
      },
    });
  };

  onChangeForId = (forId) => {
    this.setState({
      data: {
        ...this.state.data,
        forId: forId,
      },
    });
  };

  onFinish = async () => {
    let login = await AsyncStorage.getItem("login");
    var obj = JSON.parse(login);

    let data = {
      ...this.state.data,
      forId: this.state.data.forId[0],
      writerId: obj.id,
      eventId: this.state.event._id,
    };
    // console.log("finish data", data);
    await axios
      .post(`${Url()}/api/scripts`, data, {
        headers: {
          Authorization: await getToken(),
        },
      })
      .then((res) => {
        // console.log("result", res.data.data);
        this.props.updateListScript(res.data.data);
        this.props.onClose();
      });
  };

  render() {
    if (this.state.event) {
      // console.log(this.richText);
      return (
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "position" : ""}
          keyboardVerticalOffset={Platform.OS === "ios" ? 600 : 0}
        >
          <View style={{ height: 100, flex: 1 }}>
            <View>
              <Text style={styles.Label}>Tên kịch bản</Text>

              <TextInput
                onChangeText={this.onChangeName}
                style={styles.input}
                value={this.state.data.name}
              ></TextInput>
            </View>
          </View>
        </KeyboardAvoidingView>
        // <View style={{ flex: 1 }}>
        //   <TextInput
        //     onChangeText={this.onChangeName}
        //     style={styles.input}
        //     value={this.state.data.name}
        //   ></TextInput>
        // </View>

        // <View style={{ flex: 1 }}>
        //   <View style={{ flex: 1, paddingVertical: 20, paddingHorizontal: 16 }}>
        //     <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "" : ""}>

        //     </KeyboardAvoidingView>
        //     {/* <View style={styles.ScriptNameLabelContainer}>
        //         <Text style={styles.Label}>Dành cho</Text>
        //         <View style={styles.Box}>
        //           <Picker
        //             onChange={this.onChangeForId}
        //             value={this.state.data.forId}
        //             data={this.state.listUser}
        //             cascade={false}
        //             okText="Đồng ý"
        //             dismissText="Thoát"
        //           >
        //             <Text>
        //               {!this.state.forId
        //                 ? "Chọn"
        //                 : this.state.listUser_default.filter(
        //                     (e) => e._id === this.state.forId[0]
        //                   )[0].name}
        //             </Text>
        //           </Picker>
        //         </View>
        //       </View> */}
        //   </View>
        //   {/* <Button
        //       type="primary"
        //       onPress={this.onFinish}
        //       style={styles.PrimaryBtn}
        //     >
        //       Lưu
        //     </Button> */}
        // </View>
      );
    } else {
      return null;
    }
  }
}

export default ScriptCreateModal;
