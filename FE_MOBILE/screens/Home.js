import AsyncStorage from "@react-native-community/async-storage";
import axios from "axios";

import moment from "moment";
import React, { Component } from "react";
import { Image } from "react-native";
import {
  ActivityIndicator,
  StyleSheet,
  Dimensions,
  Platform,
  StatusBar,
} from "react-native";
import { View, Text } from "react-native";
import { FlatList, TouchableOpacity } from "react-native-gesture-handler";
import Swiper from "react-native-swiper";
import getToken from "../Auth";
import HomeActionItem from "../components/Home/HomeActionItem";
import Url from "../env";
import Indicator from "../components/helper/Loading";
const W = Dimensions.get("window").width;
const H = Dimensions.get("window").height;
const styles = StyleSheet.create({
  containerIOS: { marginTop: 24 },
  containerAndroid: { marginTop: StatusBar.currentheight },
  avaImg: {
    width: 40,
    height: 40,
    borderRadius: 40,
  },
  posterImg: {
    width: 250,
    height: 150,
    alignSelf: "center",
  },
  infoSection: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  avacontainer: {
    marginRight: 8,
  },
  nameText: {
    fontFamily: "bold",
    color: "#2E3135",
    fontSize: 20,
  },
  labelText: {
    fontFamily: "bold",
    color: "#2A9D8F",
    fontSize: 20,
  },
  eventSection: {
    paddingHorizontal: 16,

    height: 350,
  },
  taskSection: {
    paddingHorizontal: 16,
  },
  headContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  linkText: {
    fontFamily: "semibold",
    color: "#868686",
    textDecorationLine: "underline",
  },
  cardContainer: {
    borderRadius: 6,
    elevation: 3,
    backgroundColor: "#fff",
    shadowOffset: { width: 1, height: 1 },
    shadowColor: "#333",
    shadowOpacity: 0.3,
    shadowRadius: 2,
    marginVertical: 6,
    backgroundColor: "white",
  },
  cardContent: {
    marginHorizontal: 18,
    marginVertical: 20,
  },
  titleText: {
    marginVertical: 16,
    fontFamily: "bold",
    fontSize: 18,
  },
  datetime: {
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

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      listEvents: [],
      listTasks: [],
      currentUser: null,
      isLoading: true,
      data_ongoing: [],
      data_future: [],
      currentPage: 0,
      refreshing: false,
      totalActionDoneLoading: 0,
      ActionDoneLoading: false,
    };
    this._isMounted = false;
  }

  loadData = async () => {
    this.setState({
      refreshing: true,
      totalActionDoneLoading: 0,
    });
    const [listactions] = await Promise.all([
      axios
        .post(
          `${Url()}/api/actions/getAll`,
          { availUser: obj.id },
          {
            headers: {
              Authorization: await getToken(),
            },
          }
        )
        .then((res) => res.data.data),
    ]);
    if (this._isMounted) {
      this.setState({
        listTasks: listactions,
        refreshing: false,
      });
    }
  };

  async componentDidMount() {
    this._isMounted = true;
    this.setState({
      isLoading: true,
    });
    var login = await AsyncStorage.getItem("login");
    var obj = JSON.parse(login);
    let temp = moment(new Date()).format("YYYY-MM-DD");
    const [future_event, ongoing_event, listactions] = await Promise.all([
      axios
        .post(
          `${Url()}/api/events/getAll?gt=${temp}`,
          { isClone: false },
          {
            headers: {
              Authorization: await getToken(),
            },
          }
        )
        .then((res) => res.data.data),
      axios
        .post(
          `${Url()}/api/events/getAll?eq=${temp}`,
          { isClone: false },
          {
            headers: {
              Authorization: await getToken(),
            },
          }
        )
        .then((res) => res.data.data),
      axios
        .post(
          `${Url()}/api/actions/getAll`,
          { availUser: obj.id },
          {
            headers: {
              Authorization: await getToken(),
            },
          }
        )
        .then((res) => res.data.data),
    ]);
    if (this._isMounted) {
      let temp = [...future_event, ...ongoing_event];
      temp = temp.sort((a, b) => {
        return (
          new Date(a.startDate).setHours(0, 0, 0, 0) -
          new Date(b.startDate).setHours(0, 0, 0, 0)
        );
      });
      this.setState({
        listEvents: temp,
        data_ongoing: ongoing_event,
        data_future: future_event,
        listTasks: listactions,
        currentUser: obj,
        isLoading: false,
      });
    }
  }
  renderEvents = () => {
    return this.state.listEvents.map((e, key) => {
      let status = "Đang diễn ra";
      if (this.state.data_future.includes(e)) {
        status = "Sắp diễn ra";
      }
      return (
        <TouchableOpacity
          key={key}
          onPress={() => {
            this.props.navigation.navigate("EventDetail2", {
              id: e._id,
              name: e.name,
              description: e.description,
              time: e.startTime,
              date: e.startDate,
              location: e.address,
              tag: e.tagId,
              poster: `${Url()}/api/images/${e.posterUrl}`,
            });
          }}
        >
          <View key={key} style={styles.cardContainer}>
            <View style={styles.cardContent}>
              <Image
                style={styles.posterImg}
                source={{ uri: `${Url()}/api/images/${e.posterUrl}` }}
              />
              <Text style={styles.titleText} numberOfLines={1}>
                {e.name}
              </Text>
              <View style={styles.datetime}>
                <Image
                  style={styles.Timeicon}
                  source={require("../assets/images/TimeIcon.png")}
                ></Image>
                <Text style={styles.Timecontent}>
                  {moment(e.startDate).format("DD/MM/YYYY")} -{" "}
                  {moment(e.startTime).format("HH:MM")}
                </Text>
              </View>
              <View style={styles.location}>
                <Image
                  style={styles.locateticon}
                  source={require("../assets/images/Time.png")}
                ></Image>
                <Text style={styles.Locatecontent}>{e.address}</Text>
              </View>
            </View>
          </View>
        </TouchableOpacity>
      );
    });
  };

  DoneLoading = () => {
    let temp = this.state.totalActionDoneLoading;
    temp += 1;
    if (temp === this.state.listTasks.length) {
      this.setState({
        refreshing: false,
        ActionDoneLoading: true,
      });
    }
    this.setState({
      totalActionDoneLoading: temp,
    });
  };

  renderActions = (e) => {
    return (
      <TouchableOpacity
        onPress={() => {
          this.props.navigation.navigate("TaskDetail", {
            data: {
              _id: e.item._id,
              name: e.item.name,
              description: e.item.description,
              time: e.item.endTime,
              date: e.item.endDate,
              managerId: e.item.managerId,
              tags: e.item.tagsId,
              availUser: e.item.availUser,
              priority: e.item.priorityId,
              faculty: e.item.facultyId,
              coverUrl: `${Url()}/api/images/${e.item.coverUrl}`,
            },
          });
        }}
      >
        <HomeActionItem
          visible={this.state.ActionDoneLoading}
          DoneLoading={this.DoneLoading}
          data={e.item}
        />
      </TouchableOpacity>
    );
  };

  render() {
    if (!this.state.isLoading) {
      return (
        <View
          style={
            Platform.OS == "ios" ? styles.containerIOS : styles.containerAndroid
          }
        >
          <View style={styles.infoSection}>
            <View style={styles.avacontainer}>
              <Image
                style={styles.avaImg}
                source={{
                  uri: `${Url()}/api/images/${this.state.currentUser.photoUrl}`,
                }}
              />
            </View>
            <View>
              <Text style={styles.introText}>Xin chào!</Text>
              <Text style={styles.nameText}>{this.state.currentUser.name}</Text>
            </View>
          </View>
          <View style={styles.eventSection}>
            <View style={styles.headContainer}>
              <Text style={styles.labelText}>Sự kiện</Text>
              <TouchableOpacity
                onPress={() => this.props.navigation.navigate("Event")}
              >
                <Text style={styles.linkText}>Xem tất cả</Text>
              </TouchableOpacity>
            </View>
            <Swiper loop={false} autoplay={false} showsPagination={false}>
              {this.renderEvents()}
            </Swiper>
          </View>
          <View style={styles.taskSection}>
            <View style={styles.headContainer}>
              <Text style={styles.labelText}>Công việc</Text>
              <TouchableOpacity
                onPress={() => this.props.navigation.navigate("Task")}
              >
                <Text style={styles.linkText}>Xem tất cả</Text>
              </TouchableOpacity>
            </View>
            <View>
              <FlatList
                style={{ height: 300 }}
                refreshing={this.state.refreshing}
                onRefresh={this.loadData}
                data={this.state.listTasks}
                renderItem={this.renderActions}
                keyExtractor={(item) => item._id}
                nestedScrollEnabled={true}
              />
            </View>
          </View>
        </View>
      );
    } else {
      return <Indicator />;
    }
  }
}

export default Home;
