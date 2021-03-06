import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
} from "react-native";
import axios from "axios";
import getToken from "../../Auth";
import EventCard from "../../components/EventCard";
import moment from "moment";
import Url from "../../env";
import { ActivityIndicator, Tabs } from "@ant-design/react-native";
import Search from "../../components/helper/search";
import { StatusBar } from "react-native";
import AsyncStorage from "@react-native-community/async-storage";
import { RefreshControl } from "react-native";
import { Redirect } from "react-router";
import ApiFailHandler from '../../components/helper/ApiFailHandler'
import ResourceUrl from "../../resourceurl"
const styles = StyleSheet.create({
  container: {
    backgroundColor: "#F6F7F8",
    flex: 1,
  },
  containerIOS: { flex: 1, marginTop: 16 },
  containerAndroid: { marginTop: StatusBar.currentHeight, flex: 1 },
  toplabel: {
    fontFamily: "bold",
    fontSize: 32,
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
      data: [],
      SearchData: [],
      data_ongoing: [],
      data_past: [],
      data_future: [],
      status: "",
      loading: true,
      refreshing: false,
      loggout: false,
    };
    this._isMounted = false;
  }

  async componentDidMount() {
    this._isMounted = true;
    var login = await AsyncStorage.getItem("login");
    var obj = JSON.parse(login);
    let temp = moment(new Date()).utcOffset(0).format('YYYY-MM-DD')
    const [future_event, ongoing_event, past_event] = await Promise.all([
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
        .then((res) => res.data.data)
        .catch(err => {
          let errResult = ApiFailHandler(err.response?.data?.error)
          this.setState({
            loggout: errResult.isExpired
          })
        }),
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
        .then((res) => res.data.data)
        .catch(err => {
          let errResult = ApiFailHandler(err.response?.data?.error)
          this.setState({
            loggout: errResult.isExpired
          })
        }),
      axios
        .post(
          `${Url()}/api/events/getAll?lt=${temp}`,
          { isClone: false },
          {
            headers: {
              Authorization: await getToken(),
            },
          }
        )
        .then((res) => res.data.data)
        .catch(err => {
          let errResult = ApiFailHandler(err.response?.data?.error)
          this.setState({
            loggout: errResult.isExpired
          })
        }),
    ]);

    if (
      future_event !== null &&
      ongoing_event !== null &&
      past_event !== null
    ) {
      if (this._isMounted) {
        this.setState({
          loading: false,
          data: [...future_event, ...ongoing_event, ...past_event],
          SearchData: [...future_event, ...ongoing_event, ...past_event],
          data_ongoing: ongoing_event,
          data_past: past_event,
          data_future: future_event,
        });
      }
    }

  }


  componentWillUnmount() {
    this._isMounted = false;
  }
  onRefresh = async () => {
    this.setState({
      refreshing: true,
    });
    var login = await AsyncStorage.getItem("login");
    var obj = JSON.parse(login);
    let temp = moment(new Date()).utcOffset(0).format('YYYY-MM-DD')
    const [future_event, ongoing_event, past_event] = await Promise.all([
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
        .then((res) => res.data.data)
        .catch(err => {
          let errResult = ApiFailHandler(err.response?.data?.error)
          this.setState({
            loggout: errResult.isExpired
          })
        }),
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
        .then((res) => res.data.data)
        .catch(err => {
          let errResult = ApiFailHandler(err.response?.data?.error)
          this.setState({
            loggout: errResult.isExpired
          })
        }),
      axios
        .post(
          `${Url()}/api/events/getAll?lt=${temp}`,
          { isClone: false },
          {
            headers: {
              Authorization: await getToken(),
            },
          }
        )
        .then((res) => res.data.data)
        .catch(err => {
          let errResult = ApiFailHandler(err.response?.data?.error)
          this.setState({
            loggout: errResult.isExpired
          })
        }),
    ]);
    this.setState({
      refreshing: false,
      SearchData: [...future_event, ...ongoing_event, ...past_event],
    });
  }

  renderItem = (item) => {
    return (
      <TouchableOpacity
        onPress={() =>
          this.props.navigation.navigate("EventDetail2", {
            data: item,
          })
        }
      >
        <EventCard>
          <Image
            style={styles.cardImage}
            source={{
              uri: `${ResourceUrl()}${item.posterUrl}`,
            }}
          ></Image>
          <Text style={styles.titleText}>{item.name}</Text>
          <View style={styles.datetime}>
            <Image
              style={styles.Timeicon}
              source={require("../../assets/images/TimeIcon.png")}
            ></Image>
            <Text style={styles.Timecontent}>
              {moment(item.startDate).utcOffset(0).format("DD/MM/YYYY")} -{" "}
              {moment(item.startTime).utcOffset(0).format("HH:mm")}
            </Text>
          </View>
          <View style={styles.location}>
            <Image
              style={styles.locateticon}
              source={require("../../assets/images/Time.png")}
            ></Image>
            <Text style={styles.Locatecontent}>{item.address}</Text>
          </View>
        </EventCard>
      </TouchableOpacity>
    );
  };

  getSearchData = (data) => {
    let list_future = [];
    let list_past = [];
    let list_ongoing = [];
    let today = new Date().setHours(0, 0, 0, 0);
    data.forEach((element) => {
      if (new Date(element.startDate).setHours(0, 0, 0, 0) > today) {
        list_future = [...list_future, element];
      } else if (new Date(element.startDate).setHours(0, 0, 0, 0) < today) {
        list_past = [...list_past, element];
      } else {
        list_ongoing = [...list_ongoing, element];
      }
    });
    this.setState({
      SearchData: [...list_ongoing, ...list_future, ...list_past],
      data_ongoing: list_ongoing,
      data_past: list_past,
      data_future: list_future,
    });
  };

  render() {
    const tabs = [
      { title: "Tất cả" },
      { title: "Đang diễn ra" },
      { title: "Sắp tới" },
      { title: "Đã xong" },
    ];
    if (this.state.loggout) {
      return (
        <Redirect
          to={{
            pathname: "/login",
          }}
        />
      )
    } else {
      return (
        <View
          style={
            Platform.OS == "ios" ? styles.containerIOS : styles.containerAndroid
          }
        >
          <Text style={styles.toplabel}>Sự kiện</Text>
          {/* <Text style={styles.toplabel}>{this.state.data.length}</Text> */}
          <Search
            target={["name", "description"]}
            multi={true}
            data={this.state.data}
            getSearchData={(e) => this.getSearchData(e)}
          />
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
            {this.state.loading ? (
              <View
                style={{
                  justifyContent: "center",
                  position: "absolute",
                  left: 0,
                  top: 0,
                  right: 0,
                  bottom: 0,
                  alignItems: "center",
                }}
              >
                <ActivityIndicator
                  size="large"
                  animating
                  color="#2A9D8F"
                ></ActivityIndicator>
              </View>
            ) : (
              <FlatList
                refreshControl={
                  <RefreshControl
                    refreshing={this.state.refreshing}
                    onRefresh={this.onRefresh}
                  />
                }
                data={this.state.SearchData}
                renderItem={({ item }) => this.renderItem(item)}
                keyExtractor={(item) => item._id}
              />
            )}

            <FlatList
              refreshControl={
                <RefreshControl
                  refreshing={this.state.refreshing}
                  onRefresh={this.onRefresh}
                />
              }
              data={this.state.data_ongoing}
              renderItem={({ item }) => this.renderItem(item)}
              keyExtractor={(item) => item._id}
            />
            <FlatList
              refreshControl={
                <RefreshControl
                  refreshing={this.state.refreshing}
                  onRefresh={this.onRefresh}
                />
              }
              data={this.state.data_future}
              renderItem={({ item }) => this.renderItem(item)}
              keyExtractor={(item) => item._id}
            />
            <FlatList
              refreshControl={
                <RefreshControl
                  refreshing={this.state.refreshing}
                  onRefresh={this.onRefresh}
                />
              }
              data={this.state.data_past}
              renderItem={({ item }) => this.renderItem(item)}
              keyExtractor={(item) => item._id}
            />
          </Tabs>
        </View>
      );
    }
  }
}
