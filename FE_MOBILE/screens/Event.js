import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
} from "react-native";
import { SearchBar } from "react-native-elements";
import axios from "axios";
import getToken from "../Auth";
import EventCard from "../components/EventCard";
import moment from "moment";
import Url from "../env";
import { Tabs } from "@ant-design/react-native";

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#F6F7F8",
    flex: 1,
  },
  toplabel: {
    fontFamily: "bold",
    fontSize: 32,
    paddingTop: 16,
    fontWeight: "500",
    color: "#2A9D8F",
    backgroundColor: "#F6F7F8",
    paddingLeft: 16,
  },
  Tabcontainer: {
    backgroundColor: "#F6F7F8",
  },
  carditems: {
    paddingHorizontal: 16,
  },
  cardImage: {
    width: 300,
    height: 200,
  },
  titleText: {
    marginVertical: 16,
    fontFamily: "bold",
    fontSize: 18,
  },
  datetime: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  Timeicon: {
    position: "relative",
  },
  Timecontent: {
    marginLeft: 8,
    fontFamily: "semibold",
    fontSize: 14,
    color: "#98A1A5",
  },
  location: {
    marginTop: 8,
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  locateicon: {
    position: "relative",
  },
  Locatecontent: {
    fontFamily: "semibold",
    fontSize: 14,
    marginLeft: 8,
    color: "#98A1A5",
  },
});

export default class Event extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isMounted: false,
      data: [],
      status: "",
    };
  }

  async componentDidMount() {
    const events = await axios
      .post(
        `${Url()}/api/events/getAll`,
        { isClone: false },
        {
          headers: {
            Authorization: await getToken(),
          },
        }
      )
      .then((res) => res.data.data);
    if (events !== undefined) {
      let status = "";
      let today = new Date().setHours(0, 0, 0, 0);
      if (new Date(events.startDate).setHours(0, 0, 0, 0) > today) {
        status = "Sắp diễn ra";
      } else if (new Date(events.startDate).setHours(0, 0, 0, 0) < today) {
        status = "Đã diễn ra";
      } else {
        status = "Đang diễn ra";
      }
      // console.log("events", events);
      // console.log(events[0].name);
      // console.log(moment(events[0].startTime).format("HH:MM"));
      // console.log("posterurl", `${Url()}/api/images/${events[0].posterUrl}`);
      this.setState({
        data: events,
      });
    }
  }

  render() {
    const tabs = [
      { title: "Tất cả" },
      { title: "Đang diễn ra" },
      { title: "Sắp tới" },
      { title: "Đã xong" },
    ];
    // console.log("data", this.state.data);
    return (
      <View style={styles.container}>
        <Text style={styles.toplabel}>Sự kiện</Text>
        {/* <Text style={styles.toplabel}>{this.state.data.length}</Text> */}
        <SearchBar
          placeholder="Tìm kiếm..."
          containerStyle={{
            color: "#FFFFF",
            marginBottom: 8,
            borderRadius: 12,
            marginHorizontal: 16,
            height: 64,
            alignContent: "center",
            paddingHorizontal: 8,
          }}
          inputContainerStyle={{
            alignItems: "center",
            justifyContent: "center",
          }}
          inputStyle={{
            alignContent: "center",
            alignSelf: "center",
          }}
          platform="android"
        ></SearchBar>
        <Tabs
          style={styles.Tabcontainer}
          tabs={tabs}
          tabBarActiveTextColor="#2A9D8F"
          tabBarInactiveTextColor="#AAB0B6"
          tabBarTextStyle={{
            fontFamily: "semibold",
            marginVertical: 8,
          }}
          tabBarUnderlineStyle={{ backgroundColor: "#2A9D8F" }}
        >
          <FlatList
            data={this.state.data}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => 
                  this.props.navigation.navigate("EventDetail2", {
                    id: item._id,
                    name: item.name,
                    description: item.description,
                    time: item.startTime,
                    date: item.startDate,
                    location: item.address,
                    tag: item.tagId,
                    poster: `${Url()}/api/images/${item.posterUrl}`,
                  })
                }
              >
                <EventCard>
                  <Image
                    style={styles.cardImage}
                    source={{
                      uri: `${Url()}/api/images/${item.posterUrl}`,
                    }}
                  ></Image>
                  {/* <Image
                    source={require("../assets/images/TestImg.png")}
                  ></Image> */}
                  <Text style={styles.titleText}>{item.name}</Text>
                  <View style={styles.datetime}>
                    <Image
                      style={styles.Timeicon}
                      source={require("../assets/images/TimeIcon.png")}
                    ></Image>
                    <Text style={styles.Timecontent}>
                      {moment(item.startDate).format("DD/MM/YYYY")} -{" "}
                      {moment(item.startTime).format("HH:MM")}
                    </Text>
                  </View>
                  <View style={styles.location}>
                    <Image
                      style={styles.locateticon}
                      source={require("../assets/images/Time.png")}
                    ></Image>
                    <Text style={styles.Locatecontent}>{item.address}</Text>
                  </View>
                </EventCard>
              </TouchableOpacity>
            )}
            keyExtractor={(item) => item._id}
          />
        </Tabs>
      </View>
    );
  }
}
