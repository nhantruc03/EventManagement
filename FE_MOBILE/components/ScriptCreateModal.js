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
  ScrollView,
} from "react-native";
import Url from "../env";
import getToken from "../Auth";
import axios from "axios";
import AsyncStorage from "@react-native-community/async-storage";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";
import { Redirect } from "react-router";
import ApiFailHandler from './helper/ApiFailHandler'
import ValidationComponent from 'react-native-form-validator';

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
    marginHorizontal: 16,
    justifyContent: "center",
    alignContent: "center",
  },
  LoadingBtn: {
    borderRadius: 8,
    padding: 12,
    margin: 16,
    justifyContent: "center",
    alignContent: "center",
  },
  Box: {
    height: 40,
    marginTop: 8,
    borderWidth: 1,
    borderColor: "#DFDFDF",
    backgroundColor: "white",
    borderRadius: 8,
    justifyContent: "center",
    paddingHorizontal: 12,
    marginBottom: 12,

  },
  error: {
    color: "red",
    fontFamily: "semibold",
    fontSize: 12,
    top: -10
  }
});

class ScriptCreateModal extends ValidationComponent {
  constructor(props) {
    super(props);
    this.state = {
      scriptname: "",
      data: {},
      event: null,
      listUser_default: [],
      listUser: [],
      loadingbtn: false,
      loggout: false,
      forId: [],
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
      scriptname: name,
    });
  };

  onChangeForId = (forId) => {
    this.setState({
      data: {
        ...this.state.data,
        forId: forId,
      },
      forId: forId,
    });
  };

  onLoading() {
    this.setState({
      loadingbtn: true,
    });
  }

  onFinish = async () => {
    console.log(this.state.data.forId)
    let temp_validate = this.validate({
      scriptname: { required: true },
      forId: { arrayObjectHasValue: 1 },
    });
    if (temp_validate) {
      this.onLoading();
      let login = await AsyncStorage.getItem("login");
      var obj = JSON.parse(login);
      try {
        let data = {
          ...this.state.data,
          forId: this.state.data.forId[0],
          writerId: obj.id,
          eventId: this.state.event._id,
        };

        await axios
          .post(`${Url()}/api/scripts`, data, {
            headers: {
              Authorization: await getToken(),
            },
          })
          .then((res) => {
            console.log("result", res.data.data);
            this.props.updateListScript(res.data.data);
            this.props.onClose();
            //this.onLoading();
            alert("Tạo kịch bản thành công");
          })
          .catch((err) => {
            let errResult = ApiFailHandler(err.response?.data?.error)
            this.setState({
              loggout: errResult.isExpired
            })
            alert(`${errResult.message}`)

          });
      } catch (err) {
        alert("Phải điển đủ thông tin");
      }
    }
  };

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
      if (this.state.event) {
        // console.log(this.richText);
        return (
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
          >
            <TouchableWithoutFeedback
              onPress={Keyboard.dismiss}
              accessible={false}
            >
              <ScrollView
                keyboardDismissMode="interative"
                style={{ height: H * 0.43 }}
              >
                <View
                  style={{ flex: 1, paddingVertical: 20, paddingHorizontal: 16 }}
                >
                  <View style={styles.ScriptNameLabelContainer}>
                    <Text style={styles.Label}>Tên kịch bản</Text>
                    <TextInput
                      onChangeText={this.onChangeName}
                      style={styles.input}
                      value={this.state.data.name}
                    ></TextInput>
                    {this.isFieldInError('scriptname') && this.getErrorsInField('scriptname').map((errorMessage, key) =>
                      <Text style={styles.error} key={key}>
                        {errorMessage}
                      </Text>
                    )}
                    <Text style={styles.Label}>Dành cho</Text>
                    <View style={styles.Box}>
                      <Picker
                        onChange={this.onChangeForId}
                        value={this.state.data.forId}
                        data={this.state.listUser}
                        cascade={false}
                        okText="Đồng ý"
                        dismissText="Thoát"
                      >
                        <Text >
                          {!this.state.data.forId
                            ? "Chọn"
                            : this.state.listUser_default.filter(
                              (e) => e._id === this.state.data.forId[0]
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
                </View>
                {!this.state.loadingbtn ? (
                  <Button
                    type="primary"
                    onPress={this.onFinish}
                    style={styles.PrimaryBtn}
                  >
                    Lưu
                  </Button>
                ) : (
                  <Button style={styles.LoadingBtn} loading />

                )}
              </ScrollView>
            </TouchableWithoutFeedback>
          </KeyboardAvoidingView>
        );
      } else {
        return null;
      }
    }
  }
}

export default ScriptCreateModal;
