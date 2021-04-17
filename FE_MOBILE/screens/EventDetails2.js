import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  Button,
  Image,
  ScrollView,
} from "react-native";
import { Tabs } from "@ant-design/react-native";
import OrgTab from "../components/OrgTab";
import { trackPromise } from "react-promise-tracker";
import axios from "axios";
import Url from "../env";
import getToken from "../Auth";
import GuestTab from "../components/GuestTab";
import LoadingIndicator from "../components/helper/Loading";
import { normalizeUnits } from "moment";
import Eventdetails from "../screens/EventDetails";
import ScriptTab from "../components/ScriptTab";
import { createStackNavigator } from "@react-navigation/stack";
import { TabView, SceneMap } from "react-native-tab-view";
import { TabBar } from "react-native-tab-view";
import { Dimensions } from "react-native";
const Stack = createStackNavigator();
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  Tabcontainer: {
    flex: 2,
  },
});

const initialLayout = { width: Dimensions.get("window").width };

export default class EventDetail2 extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isMounted: false,
      data: null,
      status: "",
      listOrganizer: null,
      listGuest: null,
      listguesttype: null,
      listscripts: null,
      loading: true,
      index: 0,
      routes: [
        { key: '1', title: 'Thông tin chung' },
        { key: '2', title: 'Ban tổ chức' },
        { key: '3', title: 'Kịch bản' },
        { key: '4', title: 'Hội thoại' },
        { key: '5', title: 'Khách mời' },
      ]
    };
    this._isMounted = false;
    this.renderScene = SceneMap({
      1: this.Route1,
      2: this.Route2,
      3: this.Route3,
      4: this.Route4,
      5: this.Route5,
    })
  }
  Route1 = () => (
    <Eventdetails data={this.props.route.params} />)
  Route2 = () => (
    this.state.listOrganizer ? (
      <OrgTab data={this.state.listOrganizer} />
    ) : null)
  Route3 = () => (
    this.state.listscripts ? (
      <ScriptTab
        navigation={this.props.navigation}
        data={this.state.listscripts}
      />
    ) : null)
  Route4 = () => (
    this.state.listGuest ? (
      <GuestTab data={this.state.listGuest} />
    ) : null)
  Route5 = () => (
    <View style={[{ backgroundColor: '#ff4482' }]} />)

  renderContent = (tab, index) => {
    const content = this.renderView(index);
    return <View>{content}</View>;
  };


  // renderView = (i) => {
  //   if (i === 0) {
  //     return <Eventdetails data={this.props.route.params} />;
  //   } else if (i === 1) {
  //     return this.state.listOrganizer ? (
  //       <OrgTab data={this.state.listOrganizer} />
  //     ) : null;
  //   } else if (i === 2) {
  //     return this.state.listscripts ? (
  //       <ScriptTab
  //         navigation={this.props.navigation}
  //         data={this.state.listscripts}
  //       />
  //     ) : null;
  //   } else if (i === 4) {
  //     return this.state.listGuest ? (
  //       <GuestTab data={this.state.listGuest} />
  //     ) : null;
  //   }
  // };



  async componentDidMount() {
    this._isMounted = true;
    // console.log(this.props.route.params.id);
    const [guestTypes, listEventAssign, scripts] = await Promise.all([
      axios
        .post(
          `${Url()}/api/guest-types/getAll`,
          { eventId: this.props.route.params.id },
          {
            headers: {
              Authorization: await getToken(),
            },
          }
        )
        .then((res) => {
          return res.data.data;
        }),
      axios
        .post(
          `${Url()}/api/event-assign/getAll`,
          { eventId: this.props.route.params.id },
          {
            headers: {
              Authorization: await getToken(),
            },
          }
        )
        .then((res) => {
          return res.data.data;
        }),
      axios
        .post(
          `${Url()}/api/scripts/getAll`,
          { eventId: this.props.route.params.id },
          {
            headers: {
              Authorization: await getToken(),
            },
          }
        )
        .then((res) => {
          return res.data.data;
        }),
    ]);

    let guests = [];
    if (guestTypes !== null) {
      let listguesttype = [];
      guestTypes.forEach((e) => {
        listguesttype.push(e._id);
      });

      const temp = await axios
        .post(
          `${Url()}/api/guests/getAll`,
          { listguesttype: listguesttype },
          {
            headers: {
              Authorization: await getToken(),
            },
          }
        )
        .then((res) => {
          return res.data.data;
        });
      guests = temp;
    }

    if (this._isMounted) {
      this.setState({
        listOrganizer: listEventAssign,
        listguesttype: guestTypes,
        listGuest: guests,
        loading: false,
        event: this.props.route.params,
        listscripts: scripts,
      });
    }
  }
  componentWillUnmount() {
    this._isMounted = false;
  }

  renderTabBar = (props) => (
    <TabBar
      {...props}
      tabStyle={{ width: 'auto' }}
      indicatorStyle={{ backgroundColor: "#2A9D8F" }}
      activeColor="#2A9D8F"
      inactiveColor="#AAB0B6"
      style={{
        backgroundColor: "white",
        paddingVertical: 5,
      }}
      scrollEnabled={true}
    />
  );

  setIndex = (index) => {
    this.setState({
      index,
    });
  };

  render() {
    const tabs = [
      { title: "Thông tin chung" },
      { title: "Ban tổ chức" },
      { title: "Kịch bản" },
      { title: "Hội thoại" },
      { title: "Khách mời" },
    ];
    if (this.props.route.params) {
      return (
        <TabView
          renderTabBar={this.renderTabBar}
          navigationState={{
            index: this.state.index,
            routes: this.state.routes,
          }}
          renderScene={this.renderScene}
          onIndexChange={this.setIndex}
          initialLayout={initialLayout}
          style={styles.container}
        />
      );
    } else {
      return null;
    }
  }
}
