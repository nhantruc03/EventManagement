import React, { Component } from "react";
import { View, Text, StyleSheet } from "react-native";
import Url from "../env";
import getToken from "../Auth";
import axios from "axios";
import { Steps } from "@ant-design/react-native";
import Check from "../assets/images/Checked.png";
import moment from "moment";
import { ActivityIndicator } from "react-native";
import { WebView } from "react-native-webview";
import HTML from "react-native-render-html";
const Step = Steps.Step;

const styles = StyleSheet.create({
  Container: {
    marginTop: 16,
  },
  timeText: { fontFamily: "bold", fontSize: 16, color: "#264653" },
  nameText: { fontFamily: "semibold", fontSize: 14, color: "#3A3A3A" },
  contentContainer: { paddingRight: 16, marginRight: 16 },
  content: { fontFamily: "regular" },
});
class scriptdetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: null,
      onGoing: false,
      intervalId: null,
      currentScript: -1,
      currentTime: new Date(),
    };
  }
  async componentDidMount() {
    this._isMounted = true;

    const scripts_details = await axios
      .post(
        `${Url()}/api/script-details/getAll`,
        { scriptId: this.props.route.params.id },
        {
          headers: {
            Authorization: await getToken(),
          },
        }
      )
      .then((res) => res.data.data);

    console.log("scripp details", scripts_details);

    if (scripts_details !== null) {
      if (this._isMounted) {
        let temp_onGoing = false;
        let now = new Date();
        let event_date = new Date(this.props.route.params.startDate);
        let event_time = new Date(this.props.route.params.startTime);

        if (
          now.getFullYear() === event_date.getFullYear() &&
          now.getMonth() === event_date.getMonth() &&
          now.getDate() === event_date.getDate() &&
          now.getHours() >= event_time.getHours()
        ) {
          temp_onGoing = true;
        }
        let temp = scripts_details.sort((a, b) => {
          if (!a.noinfo && !b.noinfo) {
            let temp_a = new Date(a.time).setFullYear(1, 1, 1);
            let temp_b = new Date(b.time).setFullYear(1, 1, 1);
            return temp_a > temp_b ? 1 : -1;
          } else {
            return null;
          }
        });

        if (temp_onGoing) {
          let intervalId = setInterval(this.timer, 1000);
          this.setState({
            intervalId: intervalId,
          });
        }
        this.setState({
          data: temp,
          onGoing: temp_onGoing,
        });
      }
    }
  }
  timer = () => {
    let temp = new Date();
    let current = null;
    this.state.data.forEach((e, i) => {
      if (temp.getTime() > new Date(e.time)) {
        current = i;
      }
    });
    if (current !== null) {
      this.setState({ currentScript: current - 1 });
    }
  };
  renderView2 = () => {
    return this.state.data.map((e, key) => {
      console.log("1 object", this.state.currentScript + 1 === key);
      return (
        <Step
          key={key}
          styles={{ color: "white" }}
          title={
            <View style={styles.formContainer}>
              <Text style={styles.timeText}>
                {moment(new Date(e.time)).format("HH:mm")}
              </Text>
              <Text style={styles.nameText}>{e.name}</Text>
            </View>
          }
          icon={
            this.state.currentScript + 1 === key ? (
              <ActivityIndicator size="small" color="#0000ff" />
            ) : null
          }
          description={
            <View style={styles.contentContainer}>
              <HTML source={{ html: e.description }} style={styles.content} />
            </View>
          }
        />
      );
    });
  };

  render() {
    if (this.state.data) {
      return (
        <View style={styles.Container}>
          <Steps current={this.state.currentScript}>{this.renderView2()}</Steps>
          {/* <ActivityIndicator size="small" color="#0000ff" /> */}
          {/* <HTML html={"<h1>Hello world</h1>"} /> */}
        </View>
      );
    } else {
      return null;
    }
  }
}

export default scriptdetail;
