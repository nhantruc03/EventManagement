import React, { Component } from "react";
import { View, Text, StyleSheet } from "react-native";
import { TextInput, ScrollView } from "react-native-gesture-handler";
import { Button } from "@ant-design/react-native";
import axios from "axios";
import Url from "../../env";
import getToken from "../../Auth";
import Customdatetime from "../helper/datetimepicker";
import { KeyboardAvoidingView } from "react-native";
import { Platform } from "react-native";
import { Dimensions } from "react-native";
import { SafeAreaView } from "react-native";
import { Redirect } from "react-router";
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
  textArea: {
    marginTop: 10,
    borderWidth: 1,
    borderColor: "#DFDFDF",
    backgroundColor: "white",
    borderRadius: 8,
    paddingHorizontal: 8,
    height: 48,
    justifyContent: "flex-start",
    marginBottom: 12,
  },
  ScriptNameContainer: {
    width: "50%",
    paddingHorizontal: 5,
  },
  Label: {
    marginTop: 5,
    color: "#2A9D8F",
    fontFamily: "bold",
    fontSize: 14,
  },
  LoadingBtn: {
    borderRadius: 8,
    padding: 12,
    margin: 16,
    justifyContent: "center",
    alignContent: "center",
  },
  PrimaryBtn: {
    fontFamily: "bold",
    borderColor: "#2A9D8F",
    backgroundColor: "#2A9D8F",
    borderRadius: 8,
    padding: 12,
    marginTop: 16,
    marginHorizontal: 16,
    justifyContent: "center",
    alignContent: "center",
  },
  error: {
    color: "red",
    fontFamily: "semibold",
    fontSize: 12,
    top: -10
  },
});

class SubTaskCreateModal extends ValidationComponent {
  constructor(props) {
    super(props);
    this.state = {
      data: {
        endDate: new Date(),
        endTime: new Date(),
      },
      loadingbtn: false,
      loggout: false,
      subtaskname: "",
      subtaskdescription: ""
    };
  }
  componentDidMount() {
    if (!this.props.onAdd) {
      this.setState({
        data: this.props.data,
        subtaskname: this.props.data.name,
        subtaskdescription: this.props.data.description
      });
    } else {
      this.setState({
        data: {},
      });
    }
  }
  onLoading() {
    this.setState({
      loadingbtn: true,
    });
  }

  onFinish = async () => {
    let temp_validate = this.validate({
      subtaskname: { required: true },
      subtaskdescription: { required: true }
    });
    if (temp_validate) {
      this.onLoading();
      let data = {
        ...this.state.data,
        actionId: this.props.actionId,
      };

      if (this.props.onAdd) {
        await axios
          .post(`${Url()}/api/sub-actions`, data, {
            headers: {
              Authorization: await getToken(),
            },
          })
          .then((res) => {
            alert("Tạo subtask thành công");
            this.props.onClose();
            this.props.addToList(res.data.data);

          })
          .catch((err) => {
            console.log(err);
            this.setState({
              loadingbtn: false
            })
            alert("Tạo subtask thất bại");
          });
      } else {
        await axios
          .put(`${Url()}/api/sub-actions/${this.props.data._id}`, data, {
            headers: {
              Authorization: await getToken(),
            },
          })
          .then((res) => {
            alert("Cập nhật subtask thành công");
            this.props.onClose();
            this.props.updateToList(res.data.data);
          })
          .catch((err) => {
            console.log(err);
            this.setState({
              loadingbtn: false
            })
            alert("Cập nhật subtask thất bại");

          });
      }
    }
  };
  onChangeTime = (name, time) => {
    let temp = this.state.data;
    temp[name] = time;
    this.setState({
      data: temp,
    });
  };

  onChangeName = (name) => {
    this.setState({
      data: {
        ...this.state.data,
        name: name,
      },
      subtaskname: name,
    });
  };
  onChangeDescrip = (description) => {
    this.setState({
      data: {
        ...this.state.data,
        description: description,
      },
      subtaskdescription: description,
    });
  };
  // startTime | endTime | startDate | endDate
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
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
          >
            <ScrollView
              keyboardDismissMode="interactive"
              style={{ height: H * 0.4 }}
              bounces={false}
            >
              <Text style={styles.Label}> Tên </Text>
              <TextInput
                onChangeText={this.onChangeName}
                style={styles.input}
                value={this.state.data.name}
              ></TextInput>
              {this.isFieldInError('subtaskname') && this.getErrorsInField('subtaskname').map((errorMessage, key) =>
                <Text style={styles.error} key={key}>
                  {errorMessage}
                </Text>
              )}
              <Text style={styles.Label}> Mô tả </Text>
              <TextInput
                style={styles.textArea}
                value={this.state.data.description}
                multiline={true}
                onChangeText={this.onChangeDescrip}
                numberOfLines={1}
              ></TextInput>
              {this.isFieldInError('subtaskdescription') && this.getErrorsInField('subtaskdescription').map((errorMessage, key) =>
                <Text style={styles.error} key={key}>
                  {errorMessage}
                </Text>
              )}
              <View style={{ flexDirection: "row", marginTop: 8 }}>
                <Customdatetime
                  containerStyle={styles.ScriptNameContainer}
                  labelStyle={styles.Label}
                  label="Ngày kết thúc:"
                  BoxInput={styles.BoxInput}
                  Save={(e) => this.onChangeTime("endDate", e)}
                  data={this.state.data.endDate}
                  mode="date"
                />
                <Customdatetime
                  containerStyle={styles.ScriptNameContainer}
                  labelStyle={styles.Label}
                  label="Giờ kết thúc:"
                  BoxInput={styles.BoxInput}
                  Save={(e) => this.onChangeTime("endTime", e)}
                  data={this.state.data.endTime}
                  mode="time"
                />
              </View>
            </ScrollView>
            {!this.state.loadingbtn ? (
              <Button
                type="primary"
                onPress={this.onFinish}
                style={styles.PrimaryBtn}
              >
                Lưu
              </Button>
            ) : (
              <Button style={styles.LoadingBtn} loading>
              </Button>
            )}
          </KeyboardAvoidingView>
        );
      } else {
        return null;
      }
    }
  }
}

export default SubTaskCreateModal;
