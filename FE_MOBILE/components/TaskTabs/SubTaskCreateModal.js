import React, { Component } from "react";
import { View, Text, StyleSheet } from "react-native";
import { TextInput } from "react-native-gesture-handler";
import { Button } from "@ant-design/react-native";
import axios from "axios";
import Url from "../../env";
import getToken from "../../Auth";
import Customdatetime from "../helper/datetimepicker";
import moment from "moment";

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
    margin: 12,
    borderWidth: 1,
    borderColor: "#DFDFDF",
    backgroundColor: "white",
    borderRadius: 8,
    paddingHorizontal: 8,
    height: 150,
    justifyContent: "flex-start",
  },
});

class SubTaskCreateModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: {},
    };
  }
  onFinish = async () => {
    let data = {
      ...this.state.data,
      actionId: this.props.actionId,
    };

    //console.log("send data", data);

    // funcA(String Onclose)
    await axios
      .post(`${Url()}/api/sub-actions`, data, {
        headers: {
          Authorization: await getToken(),
        },
      })
      .then((res) => {
        alert("Tạo subtask thành công");
        this.props.onClose();
        this.props.updateListSubTask(res.data.data);
      })
      .catch((err) => {
        console.log(err);
        alert("Tạo subtask thất bại");
      });
  };
  onChangeTime = (name, time) => {
    // console.log("receive", time);
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
    console.log("form data", this.state.data);
    return (
      <View>
        <Text> Tên </Text>
        <TextInput
          onChangeText={this.onChangeName}
          style={styles.input}
          value={this.state.data.name}
        ></TextInput>
        <Text> Mô tả </Text>
        {/* functionA(string a){ a.sdfsdf} */}
        <TextInput
          style={styles.textArea}
          value={this.state.data.description}
          multiline={true}
          onChangeText={this.onChangeDescrip}
          numberOfLines={10}
        ></TextInput>

        <Customdatetime
          containerStyle={styles.ScriptNameContainer}
          labelStyle={styles.Label}
          label="NBD"
          BoxInput={styles.BoxInput}
          Save={(e) => this.onChangeTime("startDate", e)}
          data={this.state.data.startDate}
          mode="date"
        />
        <Customdatetime
          containerStyle={styles.ScriptNameContainer}
          labelStyle={styles.Label}
          label="BKT"
          BoxInput={styles.BoxInput}
          Save={(e) => this.onChangeTime("endDate", e)}
          data={this.state.data.endDate}
          mode="date"
        />
        <Customdatetime
          containerStyle={styles.ScriptNameContainer}
          labelStyle={styles.Label}
          label="GBD"
          BoxInput={styles.BoxInput}
          Save={(e) => this.onChangeTime("startTime", e)}
          data={this.state.data.startTime}
          mode="time"
        />
        <Customdatetime
          containerStyle={styles.ScriptNameContainer}
          labelStyle={styles.Label}
          label="GKT"
          BoxInput={styles.BoxInput}
          Save={(e) => this.onChangeTime("endTime", e)}
          data={this.state.data.endTime}
          mode="time"
        />
        <Button
          type="primary"
          onPress={this.onFinish}
          style={styles.PrimaryBtn}
        >
          Lưu
        </Button>
      </View>
    );
  }
}

export default SubTaskCreateModal;
