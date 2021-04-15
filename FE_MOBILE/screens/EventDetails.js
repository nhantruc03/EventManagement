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

const W = Dimensions.get("window").width;
const H = Dimensions.get("window").height;

const Separator = () => <View style={styles.separator} />;

const styles = StyleSheet.create({
  container: { flex: 1 },
  formContainer: { padding: 16, zIndex: 2 },
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
  render() {
    const {
      id,
      name,
      description,
      time,
      date,
      location,
      poster,
      tag,
    } = this.props.route.params;
    // console.log(id);
    return (
      <View style={styles.container}>
        <ScrollView style={styles.formContainer}>
          <Image style={styles.posterImg} srouce={{ uri: `${poster}` }}></Image>
          <Text style={styles.mainLabel}>{name}</Text>
          <Text style={styles.description}>{description}</Text>
          <View>
            {tag.map((value, key) => (
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
                  {moment(time).format("HH:MM")}
                </Text>
              </View>
              <View style={styles.DateContatiner}>
                <Image
                  style={styles.Dateicon}
                  source={require("../assets/images/datesolid.png")}
                ></Image>
                <Text style={styles.DateContent}>
                  {moment(date).format("DD/MM/YYYY")}
                </Text>
              </View>
            </View>
            <View style={styles.locationContainer}>
              <Image
                style={styles.locationicon}
                source={require("../assets/images/locationsolid.png")}
              ></Image>
              <Text style={styles.locationContent}>{location}</Text>
            </View>
          </View>

          <View style={styles.ViewdetailContainer}>
            <TouchableOpacity
              style={styles.BtnSubmit}
              title="Xem chi tiết"
              onPress={() =>
                this.props.navigation.navigate("EventDetail2", { ID: id })
              }
            >
              <Text style={styles.textSubmit}>Xem chi tiết </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    );
  }
}
