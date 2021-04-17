import { Button } from "@ant-design/react-native";
import moment from "moment";
import React, { Component } from "react";
import { View, Text, StyleSheet, TextInput } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";

const styles = StyleSheet.create({
  Label: {
    marginLeft: 12,
    color: "#2A9D8F",
    fontFamily: "bold",
    fontSize: 14,
  },
  input: {
    height: 48,
    marginVertical: 8,
    marginHorizontal: 12,
    borderWidth: 1,
    borderColor: "#DFDFDF",
    backgroundColor: "white",
    borderRadius: 8,
    paddingHorizontal: 8,
  },
});

class ScriptEditModal extends Component {
  constructor(props) {
    super(props);
    this.state = { data: null };
  }
  componentDidMount() {
    this.setState({
      data: this.props.data,
    });
  }
  onChangeTime = (event, time) => {
    console.log("name", time);
    // this.setState({
    //   time,
    // });
  };
  render() {
    if (this.state.data) {
      // console.log(this.state.data.time);
      // console.log(new Date());
      // let temp_date = new Date(
      //   new Date(this.state.data.time).getTime() - 3600000 * 7
      // );
      // console.log(
      //   new Date(new Date(this.state.data.time).getTime() - 3600000 * 7)
      // );
      return (
        <View>
          <View style={{ paddingVertical: 20, paddingHorizontal: 20 }}>
            <View styles={styles.ScriptNameContainer}>
              <Text style={styles.Label}>Thời gian</Text>
              <View style={styles.BoxInput}>
                <DateTimePicker
                  value={this.state.data.time}
                  mode="time"
                  is24Hour={true}
                  display="default"
                  onChange={this.onChangeTime}
                  timeZoneOffsetInMinutes={0}
                />
                {/* <TextInput
                  onChangeText={this.onChangeName}
                  style={styles.input}
                  value={moment(this.state.data.time).format("HH:mm")}
                ></TextInput> */}
              </View>
            </View>
            <View styles={styles.ScriptNameContainer}>
              <Text style={styles.Label}>Tiêu đề</Text>
              <View style={styles.BoxInput}>
                <TextInput
                  onChangeText={this.onChangeName}
                  style={styles.input}
                  value={this.state.data.name}
                ></TextInput>
              </View>
            </View>
          </View>
          <Button type="primary" onPress={this.props.onClose}>
            close modal
          </Button>
        </View>
      );
    } else {
      return null;
    }
  }
}

export default ScriptEditModal;
