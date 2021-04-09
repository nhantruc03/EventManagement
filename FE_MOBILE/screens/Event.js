import React, { Component } from "react";
import {
  Button,
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
import TabView from "../components/Tabs";
import EventCard from "../components/EventCard";
import { trackPromise } from "react-promise-tracker";
import moment from "moment";
import Url from "../env";
import Test from "../assets/images/TestImg.png";
import { Tabs } from "@ant-design/react-native";

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#F6F7F8",
    flex: 1,
  },
  toplabel: {
    fontFamily: "Nunito-Bold",
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
  cardImage: {},
  titleText: {
    marginVertical: 16,
    fontFamily: "Nunito-Bold",
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
    fontFamily: "Nunito-SemiBold",
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
    fontFamily: "Nunito-SemiBold",
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
    };
  }

  async componentDidMount() {
    const events = await trackPromise(
      axios
        .post(
          `${Url()}/api/events/getAll`,
          { isClone: false },
          {
            headers: {
              Authorization: await getToken(),
            },
          }
        )
        .then((res) => res.data.data)
    );

    if (events !== undefined) {
      console.log("events", events);
      // console.log(events[0].name);
      console.log(moment(events[0].startTime).format("HH:MM"));
      console.log("posterurl", `${Url()}/api/images/${events[0].posterUrl}`);
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
        {/* <TabView />
        <FlatList
          data={this.state.data}
          renderItem={({ item }) => (
            <TouchableOpacity
            // onPress={() => navigation.navigate("ReviewDetails", item)}
            >
              <EventCard>
                <Image style={styles.cardImage} source={Test}></Image>
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
        /> */}
        <Tabs
          style={styles.Tabcontainer}
          tabs={tabs}
          tabBarActiveTextColor="#2A9D8F"
          tabBarInactiveTextColor="#AAB0B6"
          tabBarTextStyle={{
            fontFamily: "Nunito-SemiBold",
            marginVertical: 8,
          }}
          tabBarUnderlineStyle={{ backgroundColor: "#2A9D8F" }}
        >
          <FlatList
            data={this.state.data}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() =>
                  this.props.navigation.navigate("EventDetails", {
                    name: item.name,
                    description: item.description,
                    time: item.startTime,
                    date: item.startDate,
                    location: item.address,
                    poster: `${Url()}/api/images/${item.posterUrl}`,
                  })
                }
              >
                <EventCard>
                  <Image
                    style={styles.cardImage}
                    source={{ uri: `${Url()}/api/images/${item.posterUrl}` }}
                  ></Image>
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
