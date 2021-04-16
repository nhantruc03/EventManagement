import React, { Component } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  ScrollView,
} from "react-native";
import moment from "moment";
import { SafeAreaView } from "react-native";

const W = Dimensions.get("window").width;
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
  tagContainer: { flex: 2, flexDirection: "row", backgroundColor: "#FFEDE0" },
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
    // this.setstate;
    console.log(this.props.data);
    this.setState({
      data: this.props.data,
    });
  }

  render() {
    if (this.state.data) {
      return (
        <ScrollView style={styles.formContainer}>
          <Image
            style={styles.posterImg}
            srouce={{ uri: `${this.state.data.poster}` }}
          ></Image>
          <Text style={styles.mainLabel}>{this.state.data.name}</Text>
          <Text style={styles.description}>{this.state.data.description}</Text>
          <View>
            {this.state.data.tag.map((value, key) => (
              <View style={styles.tagContainer} key={key}>
                <Text style={styles.tagContent}>{value.name}</Text>
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

          {/* <View style={styles.ViewdetailContainer}>
              <TouchableOpacity
                style={styles.BtnSubmit}
                title="Xem chi tiết"
                onPress={() =>
                  this.state.navigation.navigate("EventDetail2", {
                    ID: this.state.data.id,
                  })
                }
              >
                <Text style={styles.textSubmit}>Xem chi tiết </Text>
              </TouchableOpacity>
            </View> */}
        </ScrollView>
      );
    } else {
      return null;
    }
  }
}