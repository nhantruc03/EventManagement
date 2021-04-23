import React, { Component } from "react";
import { View, Text, StyleSheet } from "react-native";
import Url from "../../env";
import getToken from "../../Auth";
import axios from "axios";
import {
  Steps,
  Modal,
  Provider,
  Button,
  PickerView,
} from "@ant-design/react-native";
import moment from "moment";
import { ActivityIndicator } from "react-native";
import HTML from "react-native-render-html";
import {
  ScrollView,
  TextInput,
  TouchableOpacity,
} from "react-native-gesture-handler";
import { Image, FlatList } from "react-native";
import StepIndicator from "react-native-step-indicator";
const Step = Steps.Step;

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
  container: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "#ffffff",
  },
  stepIndicator: {
    // marginVertical: 50,
    paddingHorizontal: 20,
    maxHeight: 500,
  },
  rowItem: {
    flex: 3,
    paddingVertical: 20,
  },
  title: {
    flex: 1,
    fontSize: 20,
    color: "#333333",
    paddingVertical: 16,
    fontWeight: "600",
  },
  body: {
    flex: 1,
    fontSize: 15,
    color: "#606060",
    lineHeight: 24,
    marginRight: 8,
  },
  timeText: {
    fontFamily: "bold",
    fontSize: 16,
    color: "#264653",
    position: "relative",
  },
  nameText: {
    fontFamily: "semibold",
    fontSize: 14,
    color: "#3A3A3A",
    maxWidth: 64,
  },
});

const labels = [
  "Cart",
  "Delivery Address",
  "Order Summary",
  "Payment Method",
  "Track",
];
const customStyles = {
  stepIndicatorSize: 25,
  currentStepIndicatorSize: 30,
  separatorStrokeWidth: 2,
  currentStepStrokeWidth: 5,
  stepStrokeCurrentColor: "#fe7013",
  separatorFinishedColor: "#2A9D8F",
  separatorUnFinishedColor: "#aaaaaa",
  stepIndicatorFinishedColor: "#2A9D8F",
  stepIndicatorUnFinishedColor: "#aaaaaa",
  stepIndicatorCurrentColor: "#ffffff",
  stepIndicatorLabelFontSize: 15,
  currentStepIndicatorLabelFontSize: 15,
  stepIndicatorLabelCurrentColor: "#000000",
  stepIndicatorLabelFinishedColor: "#ffffff",
  stepIndicatorLabelUnFinishedColor: "rgba(255,255,255,0.5)",
  labelColor: "#666666",
  labelSize: 15,
  currentStepLabelColor: "#fe7013",
  maxHeight: 3750,
};

class scriptview extends Component {
  constructor(props) {
    super(props);
    this.onClose = () => {
      this.setState({
        visible: false,
      });
    };
    this.state = {
      data: null,
      onGoing: false,
      intervalId: null,
      currentScript: 0,
      currentTime: new Date(),
      modalVisible: false,
      visible: false,
      isLoading: true,
    };
  }
  async componentDidMount() {
    this.props.navigation.setOptions({
      headerRight: () => (
        <View style={styles.IconRight}>
          <TouchableOpacity onPress={() => this.setState({ visible: true })}>
            <Image source={require("../../assets/images/edit.png")} />
          </TouchableOpacity>
        </View>
      ),
    });
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

    // console.log("scripp details", scripts_details.length);

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
          isLoading: false,
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
      // this.setState({ currentScript: current -1 });
      this.setState({ currentScript: current });
    }
    //test
    // this.setState({ currentScript: this.state.currentScript + 1 });
  };
  renderView2 = () => {
    return this.state.data.map((e, key) => {
      // console.log("1 object", this.state.currentScript + 1 === key);
      return (
        <Step
          key={key}
          title={
            <View style={styles.formContainer}>
              <Text style={styles.timeText}>
                {moment(e.time).utcOffset(0).format("HH:mm")}
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

  onPageChange(position) {
    this.setState({ currentScript: position });
  }

  renderPage = (rowData) => {
    const item = rowData.item;
    return (
      <View style={styles.rowItem}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.timeText}>{item.name}</Text>
        <HTML source={{ html: item.description }} style={styles.body} />
      </View>
    );
  };

  onViewableItemsChanged = (viewableItems) => {
    const visibleItemsCount = viewableItems.viewableItems.length;
    if (visibleItemsCount !== 0) {
      this.setState({
        currentScript: viewableItems.viewableItems[visibleItemsCount - 2].index,
      });
    }
  };

  render() {
    if (this.state.data && !this.state.isLoading) {
      // console.log(this.state.data.length)
      return (
        <View style={styles.container}>
          <View style={styles.stepIndicator}>
            <StepIndicator
              customStyles={customStyles}
              stepCount={this.state.data.length}
              direction="vertical"
              currentPosition={this.state.currentScript}
              labels={this.state.data.map((item) => (
                <View>
                  <Text style={styles.timeText}>
                    {moment(item.time).utcOffset(0).format("HH:mm")}
                  </Text>
                  <Text style={styles.nameText}>{item.name}</Text>
                </View>
              ))}
            />
          </View>
          <FlatList
            style={{ marginHorizontal: 8, flexGrow: 1 }}
            data={this.state.data}
            renderItem={this.renderPage}
            keyExtractor={(item) => item._id}
          />
        </View>
      );
    } else {
      return (
        <View style={styles.Loading}>
          <ActivityIndicator size="large" animating></ActivityIndicator>
        </View>
      );
    }
  }
}

export default scriptview;
