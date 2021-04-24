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
const H = Dimensions.get("window").height;
const styles = StyleSheet.create({
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
    height: 150,
    justifyContent: "flex-start",
  },
  ScriptNameContainer: {
    width: '50%',
    paddingHorizontal: 5
  },
  Label: {
    marginTop: 5
  }
});

class SubTaskCreateModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: {}
    };
  }
  componentDidMount() {
    if (!this.props.onAdd) {
      console.log('didmount', this.props.data)
      this.setState({
        data: this.props.data
      })
    } else {
      this.setState({
        data: {}
      })
    }
  }

  onFinish = async () => {
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
          console.log('updated', res.data.data)
          this.props.onClose();
          this.props.updateToList(res.data.data);
        })
        .catch((err) => {
          console.log(err);
          alert("Cập nhật subtask thất bại");
        });
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
    });
  };
  onChangeDescrip = (description) => {
    this.setState({
      data: {
        ...this.state.data,
        description: description,
      },
    });
  };
  // startTime | endTime | startDate | endDate
  render() {
    console.log('render', this.state.data)
    if (this.state.data) {
      return (
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <ScrollView
            keyboardDismissMode="interactive"
            style={{ maxHeight: H * 0.33, paddingHorizontal: 10, marginVertical: 10 }}
            bounces={false}
          >
            <Text> Tên </Text>
            <TextInput
              onChangeText={this.onChangeName}
              style={styles.input}
              value={this.state.data.name}
            ></TextInput>
            <Text> Mô tả </Text>
            <TextInput
              style={styles.textArea}
              value={this.state.data.description}
              multiline={true}
              onChangeText={this.onChangeDescrip}
              numberOfLines={1}
            ></TextInput>
            <View style={{ flex: 1, flexDirection: "row" }}>
              <Customdatetime
                containerStyle={styles.ScriptNameContainer}
                labelStyle={styles.Label}
                label="Ngày bắt đầu:"
                BoxInput={styles.BoxInput}
                Save={(e) => this.onChangeTime("startDate", e)}
                data={this.state.data.startDate}
                mode="date"
              />
              <Customdatetime
                containerStyle={styles.ScriptNameContainer}
                labelStyle={styles.Label}
                label="Ngày kết thúc:"
                BoxInput={styles.BoxInput}
                Save={(e) => this.onChangeTime("endDate", e)}
                data={this.state.data.endDate}
                mode="date"
              />
            </View>
            <View style={{ flex: 1, flexDirection: "row" }}>
              <Customdatetime
                containerStyle={styles.ScriptNameContainer}
                labelStyle={styles.Label}
                label="Giờ bắt đầu:"
                BoxInput={styles.BoxInput}
                Save={(e) => this.onChangeTime("startTime", e)}
                data={this.state.data.startTime}
                mode="time"
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
          <Button
            type="primary"
            onPress={this.onFinish}
            style={styles.PrimaryBtn}
          >
            Lưu
          </Button>
        </KeyboardAvoidingView >
      );
    } else {
      return null
    }

  }
}

export default SubTaskCreateModal;
