import React, { Component } from "react";
import { Image } from "react-native";
import { View, Text, StyleSheet } from "react-native";
import Separator from "../helper/separator";
import Url from "../../env";
import moment from "moment";
import { ScrollView } from "react-native-gesture-handler";
import ResourceUrl from "../../resourceurl"

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F6F7F8" },
  formContainer: { padding: 16, zIndex: 3 },
  mainLabel: {
    fontFamily: "bold",
    fontSize: 24,
    color: "#2A9D8F",
  },
  avaImage: {
    width: 40,
    height: 40,
    borderRadius: 40,
    marginRight: 8,
  },
  coverImg: {
    width: 400,
    height: 200,

  },
  description: {
    fontFamily: "regular",
    fontSize: 14,
    marginTop: 8,
  },
  DatetimeContainer: {
    zIndex: 2,
    flexDirection: "row",
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
  formLabel: {
    color: "#5C5C5C",
    fontFamily: "semibold",
    fontSize: 16,
  },
  tagContainer: { flex: 1, flexDirection: "row", marginTop: 8 },
  section3: {
    marginTop: 4,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
});

class TaskDetailTab extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: null,
    };
  }
  componentDidMount() {
    this.setState({
      data: this.props.data,
    });
  }

  render() {
    if (this.props.data) {
      return (
        <ScrollView>
          <Image
            style={styles.coverImg}
            source={{
              uri: `${ResourceUrl()}${this.props.data.coverUrl}`,
            }}
          ></Image>
          <View style={styles.formContainer}>
            <Text style={styles.mainLabel}>{this.props.data.name}</Text>
            <View style={styles.tagContainer}>
              {this.props.data.tagsId.map((value, key) => (
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
            <Text style={styles.description}>
              {this.props.data.description}
            </Text>
            <Separator />
            <Text style={styles.formLabel}>Hạn chót</Text>
            <View style={styles.DatetimeContainer}>
              <View style={styles.TimeContainer}>
                <Image
                  style={styles.Timeicon}
                  source={require("../../assets/images/timesolid.png")}
                ></Image>
                <Text style={styles.TimeContent}>
                  {moment(this.props.data.endTime).utcOffset(0).format("HH:mm")}
                </Text>
              </View>
              <View style={styles.DateContatiner}>
                <Image
                  style={styles.Dateicon}
                  source={require("../../assets/images/datesolid.png")}
                ></Image>
                <Text style={styles.DateContent}>
                  {moment(this.props.data.endDate).utcOffset(0).format("DD/MM/YYYY")}
                </Text>
              </View>
            </View>
            <Separator />
            <View
              style={{ flexDirection: "row", justifyContent: "space-between" }}
            >
              <Text style={styles.formLabel}>Người phân công</Text>
              <Text style={styles.formLabel}>Ban</Text>
            </View>
            <View style={styles.section3}>
              <View style={styles.managerContainer}>
                {this.props.data.managerId ? <View
                  style={{

                    flexDirection: "row",
                    alignItems: "center",
                  }}
                >
                  <Image
                    style={styles.avaImage}
                    source={{
                      uri: `${ResourceUrl()}${this.props.data.managerId.photoUrl}`,
                    }}
                  ></Image>
                  <Text style={styles.Text}>{this.props.data.managerId.name}</Text>
                </View> : null}
              </View>
              <View>
                <Text style={styles.Text}>{this.props.data.facultyId.name}</Text>
              </View>
            </View>
            <Separator />
            <View style={styles.AssignedUserContainer}>
              <Text style={styles.formLabel}>Phân công cho</Text>
              {this.props.data.availUser.map((value, key) => (
                <View
                  style={{


                    borderRadius: 16,
                  }}
                  key={key}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                    }}
                  >
                    <Image
                      style={styles.avaImage}
                      source={{
                        uri: `${ResourceUrl()}${value.photoUrl}`,
                      }}
                    ></Image>
                    <Text>{value.name}</Text>
                  </View>
                </View>
              ))}
            </View>
          </View>
        </ScrollView>
      );
    } else {
      return null;
    }
  }
}

export default TaskDetailTab;
