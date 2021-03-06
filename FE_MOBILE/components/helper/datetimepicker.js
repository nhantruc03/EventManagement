import React, { Component } from "react";
import { View, Text, Platform } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import moment from "moment";
import { Button } from "@ant-design/react-native";
class datetimepicker extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showDateTimePicker: false,
    };
  }

  onChange = (event, data) => {
    if (data != undefined) {
      this.setState({
        showDateTimePicker: Platform.OS === "ios",
      });
      this.props.Save(data);
    } else {
      this.setState({
        showDateTimePicker: Platform.OS === "ios",
      });
    }
  };

  render() {
    return (
      <View style={this.props.containerStyle}>
        <Text style={this.props.labelStyle}>{this.props.label}</Text>
        {Platform.OS === "android" ? (
          <View style={{ textAlign: "left", marginTop: 5 }}>
            <Button
              onPress={() => {
                this.setState({
                  showDateTimePicker: !this.state.showDateTimePicker,
                });
              }}
            >
              <Text style={{ textAlign: "left" }}>

                {this.props.mode === "time" ? moment(this.props.data).utcOffset(0).format("HH:mm") : moment(this.props.data).utcOffset(0).format("DD/MM/YYYY")}
              </Text>
            </Button>
          </View>
        ) : null}
        {this.state.showDateTimePicker || Platform.OS === "ios" ? (
          <View style={this.props.BoxInput}>
            <DateTimePicker
              value={this.props.data ? new Date(this.props.data) : new Date()}
              mode={this.props.mode}
              is24Hour={true}
              display="default"
              onChange={this.onChange}
              timeZoneOffsetInMinutes={0}
            />
          </View>
        ) : null}
      </View>
    );
  }
}

export default datetimepicker;
