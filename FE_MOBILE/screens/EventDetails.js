import React, { Component } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  Dimensions,
  ScrollView,
} from "react-native";
import moment from "moment";

const H = Dimensions.get("window").height;

const Separator = () => <View style={styles.separator} />;

const styles = StyleSheet.create({
  container: { flex: 1 },
  formContainer: { padding: 16, zIndex: 3 },
  mainLabel: {
    fontFamily: "bold",
    fontSize: 24,
    color: "#2A9D8F",
  },
  posterImg: {
    width: 300,
    height: 200,
  },
  tagContainer: { flex: 1, flexDirection: "row" },
  tagContent: {
    marginVertical: 4,
    fontFamily: "regular",
    fontSize: 16,
  },
  description: {
    fontFamily: "regular",
    fontSize: 14,
    marginVertical: 8,
  },
  separator: {
    marginVertical: 8,
    borderBottomColor: "#737373",
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  BtnSubmit: {
    backgroundColor: "#2A9D8F",
    height: (H * 48) / 667,
    borderRadius: 8,
    padding: (H * 10) / 667,
  },
  textSubmit: {
    fontFamily: "bold",
    fontSize: 18,
    alignItems: "center",
    textAlign: "center",
    color: "#FFFFFF",
  },
  ViewdetailContainer: {
    position: "relative",
    marginTop: (H * 16) / 667,
    marginBottom: (H * 32) / 667,
  },
  secondSection: {
    marginVertical: 8,
  },
  DatetimeContainer: {
    zIndex: 2,
    flexDirection: "row",
  },
  locationContainer: {
    zIndex: 2,
  },
  TimeContainer: {
    zIndex: 3,
    flexDirection: "row",
    alignItems: "center",
  },
  Timeicon: {
    position: "relative",
  },
  TimeContent: {
    marginLeft: 8,
    fontFamily: "semibold",
    color: "#2A9D8F",
    fontSize: 20,
  },
  DateContatiner: {
    zIndex: 3,
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 48,
  },
  Dateicon: {
    position: "relative",
  },
  DateContent: {
    fontFamily: "semibold",
    color: "#2A9D8F",
    fontSize: 20,
    marginLeft: 8,
  },
  locationContainer: {
    zIndex: 2,
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },
  locationContent: {
    fontFamily: "semibold",
    color: "#2A9D8F",
    fontSize: 20,
    marginLeft: 8,
  },
});

export default class EventDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isMounted: false,
      data: null,
      status: "",
    };
  }

  componentDidMount() {
    this.setState({
      data: this.props.data,
    });
  }

  render() {
    console.log(this.state.data);
    if (this.state.data) {
      return (
        <ScrollView style={styles.formContainer}>
          <Image
            style={styles.posterImg}
            source={{ uri: this.state.data.poster }}
          ></Image>
          <Text style={styles.mainLabel}>{this.state.data.name}</Text>
          <Text style={styles.description}>{this.state.data.description}</Text>
          <View style={styles.tagContainer}>
            {this.state.data.tag.map((value, key) => (
              <View
                style={{
                  backgroundColor: value.background,
                  marginRight: 10,
                  paddingHorizontal: 10,
                  borderRadius: 16,
                }}
                key={key}
              >
                <Text
                  style={{
                    color: value.color,
                    marginVertical: 4,
                    fontFamily: "regular",
                    fontSize: 16,
                  }}
                >
                  {value.name}
                </Text>
              </View>
            ))}
          </View>
          <Separator />
          <View style={styles.secondSection}>
            <View style={styles.DatetimeContainer}>
              <View style={styles.TimeContainer}>
                <Image
                  style={styles.Timeicon}
                  source={require("../assets/images/timesolid.png")}
                ></Image>
                <Text style={styles.TimeContent}>
                  {moment(this.state.data.time).format("HH:MM")}
                </Text>
              </View>
              <View style={styles.DateContatiner}>
                <Image
                  style={styles.Dateicon}
                  source={require("../assets/images/datesolid.png")}
                ></Image>
                <Text style={styles.DateContent}>
                  {moment(this.state.data.date).format("DD/MM/YYYY")}
                </Text>
              </View>
            </View>
            <View style={styles.locationContainer}>
              <Image
                style={styles.locationicon}
                source={require("../assets/images/locationsolid.png")}
              ></Image>
              <Text style={styles.locationContent}>
                {this.state.data.location}
              </Text>
            </View>
          </View>
        </ScrollView>
      );
    } else {
      return null;
    }
  }
}
